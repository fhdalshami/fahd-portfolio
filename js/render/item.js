/* ==========================================================================
   render/item.js — كارت زجاجي بصف Bootstrap: عنوان | وصف | معلومة جانبية (تاريخ أو رابط)
   بيستخدمه الخبرات والمشاريع.
   ========================================================================== */
import { el } from '../lib/dom.js';

export function createItem(titleNode, description, metaNode) {
  const columns = [
    ['col-md-4', titleNode],
    ['col-md', el('p', '', description || '')],
    ['col-md-auto', metaNode],
  ].map(([className, child]) => {
    const column = el('div', className);
    column.append(child);
    return column;
  });
  const row = el('div', 'row g-2 align-items-baseline');
  row.append(...columns);
  const item = el('div', 'item');
  item.append(row);
  return item;
}
