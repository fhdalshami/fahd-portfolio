/* ==========================================================================
   render/skills.js — جدول skills: شريط متحرك أفقياً (marquee)
   الشريط نصفين متطابقين، والـ CSS بيحركه -50% فيتكرر بسلاسة من غير قفزة.
   ========================================================================== */
import { $, el, toggle } from '../lib/dom.js';

const SPEED_PX_PER_SECOND = 50;
let lastRows = null;

// نصف واحد من الشريط = المهارات مكررة `copies` مرة
function createHalf(rows, copies) {
  const half = el('div', 'marquee-half');
  for (let i = 0; i < copies; i++) rows.forEach(({ name }) => half.append(el('span', 'skill', name)));
  return half;
}

export function renderSkills(rows) {
  if (!rows) return;
  lastRows = rows;
  const box = $('#skills');
  const track = $('#skillsTrack');
  track.textContent = '';
  toggle(box, rows.length > 0);
  if (!rows.length) return;

  // عشان الحركة تفضل متصلة لازم عرض النصف يكون أكبر من عرض الشاشة
  const probe = createHalf(rows, 1);
  track.append(probe);
  const copies = Math.max(1, Math.ceil((box.clientWidth || 0) / (probe.getBoundingClientRect().width || 1)));

  const first = createHalf(rows, copies);
  const second = createHalf(rows, copies);
  second.setAttribute('aria-hidden', 'true'); // النصف التاني نسخة للحركة بس
  track.textContent = '';
  track.append(first, second);
  track.style.setProperty('--dur', `${Math.max(14, (first.getBoundingClientRect().width || 600) / SPEED_PX_PER_SECOND)}s`);
}

// لما حجم الشاشة يتغير نعيد حساب عدد النسخ
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => lastRows && renderSkills(lastRows), 250);
});
