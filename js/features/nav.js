/* ==========================================================================
   features/nav.js — قائمة الموبايل: Bootstrap بيفتحها، وإحنا بنقفلها بعد اختيار قسم
   ========================================================================== */
import { $ } from '../lib/dom.js';

export function initNav() {
  const nav = $('#nav');
  if (!nav) return;
  nav.addEventListener('click', (event) => {
    const clickedLink = event.target.closest('.nav-link');
    if (clickedLink && nav.classList.contains('show')) {
      window.bootstrap?.Collapse.getOrCreateInstance(nav).hide();
    }
  });
}
