/* ==========================================================================
   render/sections.js — جدول sections: أسماء الأقسام وترتيبها وإخفاؤها + بناء القائمة العلوية
   ========================================================================== */
import { $, el } from '../lib/dom.js';

// ids الأقسام الموجودة في index.html
const SECTION_KEYS = ['about', 'projects', 'experience', 'education', 'certifications', 'contact'];

export function renderSections(rows) {
  if (!rows) return;
  const main = $('main');
  const navList = $('#navList');
  const visibleKeys = new Set(rows.map((row) => row.key));
  navList.textContent = '';

  // الأقسام اللي مش في الجدول (أو is_visible = false) بتفضل مخفية
  SECTION_KEYS.forEach((key) => {
    const section = document.getElementById(key);
    if (section) section.hidden = !visibleKeys.has(key);
  });

  // الصفوف جاية مترتبة بـ sort_order: نحرك الأقسام ونبني روابط القائمة بنفس الترتيب
  rows.forEach(({ key, title }) => {
    const section = document.getElementById(key);
    if (!section) return;
    main.append(section);
    if (key !== 'contact') $('h2', section).textContent = title || ''; // عنوان Contact من site_settings

    const link = el('a', 'nav-link', title || '');
    link.href = `#${key}`;
    const item = el('li', 'nav-item');
    item.append(link);
    navList.append(item);
  });
}
