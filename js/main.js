/* ==========================================================================
   main.js — نقطة البداية: بيشغّل الخصائص وبيحمّل المحتوى من Supabase
   الترتيب: 1) نعرض النسخة المحفوظة في المتصفح فوراً (لو موجودة)  2) نجيب أحدث بيانات ونحدّث
   ========================================================================== */
import { $ } from './lib/dom.js';
import { fetchAll, readCache, writeCache, mergeWithCache, hasData } from './api.js';
import { renderAll } from './render/index.js';
import { initNav } from './features/nav.js';
import { initContactForm } from './features/contact-form.js';
import { initEmailCopy } from './features/email-copy.js';
import { initCard } from './features/card.js';

const LOAD_TIMEOUT_MS = 6000; // لو لسه مفيش بيانات بعد المدة دي نظهر رسالة الخطأ

function showPage(data) {
  renderAll(data);
  document.body.classList.remove('is-loading');
  $('#loadError').hidden = true;
}

initNav();
initContactForm();
initEmailCopy();
initCard();

const cached = readCache();
if (cached) showPage(cached);

fetchAll().then((fresh) => {
  const data = mergeWithCache(fresh, cached);
  if (!hasData(data)) return; // كله فشل: الصفحة بتفضل زي ما هي
  showPage(data);
  writeCache(data);
});

setTimeout(() => {
  if (document.body.classList.contains('is-loading')) {
    document.body.classList.remove('is-loading');
    $('#loadError').hidden = false;
  }
}, LOAD_TIMEOUT_MS);
