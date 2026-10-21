/* ==========================================================================
   render/projects.js — جدول projects
   ========================================================================== */
import { $, el } from '../lib/dom.js';
import { createItem } from './item.js';

export function renderProjects(rows) {
  if (!rows) return;
  const box = $('#projectsList');
  box.textContent = '';
  rows.forEach((project) => {
    const title = el('h3', '', project.title);
    if (project.subtitle) title.append(el('small', '', project.subtitle));

    const meta = el('span', 'meta');
    if (project.link_url) {
      const link = el('a', '', project.link_label || 'Open');
      link.href = project.link_url;
      link.target = '_blank';
      link.rel = 'noopener';
      meta.append(link);
    }
    box.append(createItem(title, project.description, meta));
  });
}
