/* ==========================================================================
   features/email-copy.js — نسخ الإيميل على الكمبيوتر
   على الموبايل رابط mailto بيفتح تطبيق الإيميل. على الكمبيوتر غالباً مفيش برنامج
   إيميل مضبوط، فبننسخ العنوان بدل ما ما يحصلش حاجة.
   ========================================================================== */
import { $$ } from '../lib/dom.js';
import { state } from '../state.js';
import { showToast } from '../lib/toast.js';

const isDesktop = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

export function initEmailCopy() {
  $$('[data-mail]').forEach((link) => {
    link.addEventListener('click', async (event) => {
      if (!isDesktop()) return;
      event.preventDefault();
      const email = link.textContent.trim() || state.email;
      try {
        await navigator.clipboard.writeText(email);
        showToast(`Email copied: ${email}`);
      } catch {
        showToast(email); // النسخ ممنوع: نعرض العنوان على الأقل
      }
    });
  });
}
