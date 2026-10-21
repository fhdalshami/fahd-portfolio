/* ==========================================================================
   render/lists.js — القوائم البسيطة: التعليم (education) والشهادات (certifications)
   ========================================================================== */
import { $, el } from '../lib/dom.js';

function fillList(selector, rows, buildItem) {
  if (!rows) return;
  const list = $(selector);
  list.textContent = '';
  list.append(...rows.map(buildItem));
}

function educationItem({ degree, institution, start_year: from, end_year: to }) {
  const item = el('li', '', degree);
  const years = from && to ? `${from} – ${to}` : (to || from || '');
  const details = [institution, years].filter(Boolean).join(', ');
  if (details) item.append(el('small', '', details));
  return item;
}

export const renderEducation = (rows) => fillList('#educationList', rows, educationItem);
export const renderCertifications = (rows) => fillList('#certificationsList', rows, ({ title }) => el('li', '', title));
