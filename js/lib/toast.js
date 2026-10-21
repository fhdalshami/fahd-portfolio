/* ==========================================================================
   lib/toast.js — رسالة صغيرة بتظهر تحت الشاشة لمدة ثانيتين ونص
   ========================================================================== */
import { $ } from './dom.js';

let timer;

export function showToast(message) {
  const toast = $('#toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(timer);
  timer = setTimeout(() => toast.classList.remove('show'), 2600);
}
