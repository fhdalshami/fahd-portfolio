/* ==========================================================================
   features/typewriter.js — تأثير الكتابة على العنوان الرئيسي (كأن حد بيكتبه)
   ========================================================================== */
import { $, el } from '../lib/dom.js';

const TYPING_DELAY_MS = 45;   // الوقت بين كل حرف (غيّره لتسريع أو إبطاء الكتابة)
const CURSOR_HIDE_MS = 1800;  // بعد ما تخلص الكتابة بنخفي المؤشر

const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
let currentText = '';
let runId = 0;

// بتكتب النص حرف حرف. لو اتنادي بنص جديد بعد أول عرض بتظهره كامل فوراً.
export function setHeroTitle(text) {
  const title = $('#heroTitle');
  if (!title || !text || text === currentText) return;

  const isFirst = !currentText;
  currentText = text;
  title.setAttribute('aria-label', text); // قارئات الشاشة تقرا النص كامل مرة واحدة

  if (reducedMotion) { title.textContent = text; return; }

  // نسخة خفية بتحجز المكان (عشان الصفحة ما تنطش) + النص اللي بيتكتب فوقها
  const ghost = el('span', 'tw-ghost', text);
  const typed = el('span', 'tw-typed');
  ghost.setAttribute('aria-hidden', 'true');
  typed.setAttribute('aria-hidden', 'true');
  title.textContent = '';
  title.classList.remove('tw-done');
  title.append(ghost, typed);

  const thisRun = ++runId; // لو جه نص جديد نوقف الكتابة القديمة
  if (!isFirst) { typed.textContent = text; title.classList.add('tw-done'); return; }

  let length = 0;
  const step = () => {
    if (thisRun !== runId) return;
    typed.textContent = text.slice(0, ++length);
    if (length < text.length) setTimeout(step, TYPING_DELAY_MS);
    else setTimeout(() => { if (thisRun === runId) title.classList.add('tw-done'); }, CURSOR_HIDE_MS);
  };
  step();
}
