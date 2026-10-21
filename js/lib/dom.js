/* ==========================================================================
   lib/dom.js — دوال مساعدة للتعامل مع عناصر الصفحة
   ========================================================================== */

export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

// بتعمل عنصر HTML. بنستخدم textContent دايماً (مش innerHTML) عشان أي نص من الداتا بيز
// يتعرض كنص عادي وآمن من هجمات XSS.
export function el(tag, className = '', text = null) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== null) node.textContent = text;
  return node;
}

// بتحط نص في عنصر (أو بتفضّيه لو مفيش قيمة)
export function setText(selector, value) {
  const node = $(selector);
  if (node) node.textContent = value || '';
}

// بتظهر العنصر أو بتخفيه
export function toggle(node, visible) {
  if (node) node.hidden = !visible;
}

// بتغيّر الصورة لرابط من الداتا بيز. لو الرابط فشل بترجع للصورة المحلية اللي في assets.
export function setImage(img, url) {
  if (!img.dataset.fallback) img.dataset.fallback = img.getAttribute('src');
  if (img.getAttribute('src') === url) return;
  img.crossOrigin = 'anonymous'; // لازم عشان صورة الكارت (canvas) تقدر تستخدم الصورة
  img.onerror = () => {
    img.onerror = null;
    img.removeAttribute('crossorigin');
    img.src = img.dataset.fallback;
  };
  img.src = url;
}
