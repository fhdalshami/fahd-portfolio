/* ==========================================================================
   render/experience.js — جدول experiences: الخبرات مجمّعة حسب الشركة
   ========================================================================== */
import { $, el } from '../lib/dom.js';
import { formatMonth, formatDuration } from '../lib/format.js';
import { createItem } from './item.js';

// بيجمّع الوظايف حسب الشركة وبيحسب بداية ونهاية كل شركة
function groupByCompany(rows) {
  const groups = new Map();
  rows.forEach((row) => {
    const group = groups.get(row.company) ?? { company: row.company, rows: [], start: row.start_date, end: null, isCurrent: false };
    group.rows.push(row);
    if (row.start_date < group.start) group.start = row.start_date;          // أقدم بداية في الشركة
    if (!row.end_date) group.isCurrent = true;                               // وظيفة بدون نهاية = لسه شغال
    else if (!group.end || row.end_date > group.end) group.end = row.end_date;
    groups.set(row.company, group);
  });
  return [...groups.values()];
}

function renderGroup(group) {
  const endIso = group.isCurrent ? null : group.end;
  const summary = [
    `${formatMonth(group.start)} – ${endIso ? formatMonth(endIso) : 'Present'}`,
    formatDuration(group.start, endIso),
  ];
  if (group.rows.length > 1) summary.push(`${group.rows.length} roles in one company`);

  const header = el('div', 'company');
  header.append(el('h3', '', group.company), el('p', '', summary.join(' · ')));

  const stack = el('div', 'stack');
  group.rows.forEach((row) => {
    const dates = `${formatMonth(row.start_date)} – ${row.end_date ? formatMonth(row.end_date) : 'Present'}`;
    stack.append(createItem(el('h3', '', row.title), row.description, el('span', 'meta', dates)));
  });

  const wrapper = el('div', 'exp-group');
  wrapper.append(header, stack);
  return wrapper;
}

export function renderExperience(rows) {
  if (!rows) return;
  const box = $('#experienceList');
  box.textContent = '';
  box.append(...groupByCompany(rows).map(renderGroup));
}
