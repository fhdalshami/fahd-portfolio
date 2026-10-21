/* ==========================================================================
   features/contact-form.js — إرسال فورم التواصل عن طريق Formspree
   معرّف الفورم والإيميل بييجوا من الداتا بيز (عن طريق state).
   ========================================================================== */
import { $ } from '../lib/dom.js';
import { state } from '../state.js';

// بيحوّل رد Formspree الفاشل لرسالة مفهومة
async function readError(response) {
  try {
    const body = await response.json();
    return body.errors?.map((e) => e.message).join(', ') || `Error ${response.status}`;
  } catch {
    return `Error ${response.status}`;
  }
}

export function initContactForm() {
  const form = $('#cf');
  if (!form) return;
  const status = $('.status', form);

  form.addEventListener('submit', async (event) => {
    event.preventDefault(); // نتحكم إحنا في الإرسال بدل تحميل الصفحة

    if (!form.checkValidity()) {
      form.reportValidity();
      status.textContent = 'Please fill in all fields.';
      return;
    }

    const data = new FormData(form);
    if (data.get('_gotcha')) return;          // الحقل المخفي اتملى = بوت: نتجاهل
    if (!state.formId) { status.textContent = 'The form is not available right now.'; return; }

    status.textContent = 'Sending…';
    try {
      const response = await fetch(`https://formspree.io/f/${state.formId}`, {
        method: 'POST', headers: { Accept: 'application/json' }, body: data,
      });
      if (!response.ok) throw new Error(await readError(response));
      form.reset();
      status.textContent = 'Thanks! Your message was sent.';
    } catch (error) {
      const reason = error.message && error.message !== 'Failed to fetch' ? error.message : 'network or browser blocked the request';
      status.textContent = `Could not send (${reason}).`;
      if (state.email) { // نعرض الإيميل كبديل
        const link = document.createElement('a');
        link.href = `mailto:${state.email}`;
        link.textContent = state.email;
        status.append(' Email me at ', link);
      }
    }
  });
}
