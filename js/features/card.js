/* ==========================================================================
   features/card.js — كارت التعريف: Popup + حفظ ومشاركة كصورة
   الصورة بتترسم (canvas) من نفس بيانات الكارت، فأي تعديل في الداتا بيز يظهر فيها.
   ========================================================================== */
import { $ } from '../lib/dom.js';
import { showToast } from '../lib/toast.js';

const IMAGE_NAME = 'contact-card.png';
const FONT = '"Bricolage Grotesque", system-ui, -apple-system, "Segoe UI", sans-serif';
const WIDTH = 1080;
const HEIGHT = 1380;

const textOf = (selector) => $(selector)?.textContent.trim() ?? '';

// بترسم مستطيل بحواف دايرية
function roundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// نتأكد إن الخط والصورة اتحمّلوا قبل الرسم
async function waitForAssets(img) {
  try {
    await Promise.all([document.fonts.load(`800 60px ${FONT}`), document.fonts.load(`400 40px ${FONT}`)]);
  } catch { /* مفيش مشكلة: هنستخدم خط النظام */ }
  if (!img.complete) await new Promise((resolve) => { img.onload = resolve; });
}

// رسم الكارت كصورة PNG مقاس 1080×1380
async function drawCard() {
  const img = $('.idtop img');
  await waitForAssets(img);

  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#000';                                  // الخلفية السودا
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = '#222222';                               // الكارت #222222
  roundedRect(ctx, 60, 60, WIDTH - 120, HEIGHT - 120, 56);
  ctx.fill();

  ctx.save();                                              // صورة الميموجي داخل دايرة
  ctx.beginPath();
  ctx.arc(WIDTH / 2, 330, 150, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = '#1c1c1c';
  ctx.fillRect(WIDTH / 2 - 150, 180, 300, 300);
  ctx.drawImage(img, WIDTH / 2 - 150, 180, 300, 300);
  ctx.restore();

  ctx.textAlign = 'center';                                // الاسم والوظيفة ومكان الشغل
  ctx.fillStyle = '#fff';
  ctx.font = `800 68px ${FONT}`;
  ctx.fillText(textOf('.idtop h3'), WIDTH / 2, 600);
  ctx.font = `600 44px ${FONT}`;
  ctx.fillText(textOf('.idtop .role'), WIDTH / 2, 670);
  ctx.fillStyle = '#a3a3a3';
  ctx.font = `400 36px ${FONT}`;
  ctx.fillText(textOf('.idtop .where'), WIDTH / 2, 726);
  ctx.fillStyle = '#2e2e2e';                               // خط فاصل
  ctx.fillRect(150, 790, WIDTH - 300, 2);

  const rows = [                                           // الرقم والإيميل والمكان (بنتخطى الفاضي)
    ['📞', textOf('#cardPhoneLi a')],
    ['✉️', textOf('#cardMailLi a')],
    ['📍', textOf('#cardLocLi span')],
  ].filter(([, value]) => value);
  ctx.textAlign = 'left';
  ctx.fillStyle = '#fff';
  ctx.font = `400 42px ${FONT}`;
  rows.forEach(([icon, value], i) => {
    ctx.fillText(icon, 150, 900 + i * 110);
    ctx.fillText(value, 230, 900 + i * 110);
  });

  const greeting = $('#idcard').dataset.greeting;          // site_settings.card_greeting
  if (greeting) {
    ctx.textAlign = 'center';
    ctx.fillStyle = '#a3a3a3';
    ctx.font = `400 34px ${FONT}`;
    ctx.fillText(`👋  ${greeting}`, WIDTH / 2, 1230);
  }
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
}

function download(blob) {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = IMAGE_NAME;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(link.href), 2000);
  showToast('Image saved');
}

export function initCard() {
  const toggleBtn = $('#cardToggle');
  const popup = $('#idwrap');
  const shareBtn = $('#cardShare');
  const saveBtn = $('#cardSave');
  const closeBtn = $('#cardClose');
  if (!toggleBtn || !popup || !shareBtn || !saveBtn) return;

  let blobPromise = null;                       // الصورة بتتعمل مرة عند الفتح وتتستخدم للمشاركة والحفظ
  const getBlob = () => blobPromise || (blobPromise = drawCard());

  // فتح الـ Popup: نقفل تمرير الصفحة، نجهز الصورة، وننقل التركيز لزرار الإغلاق
  function open() {
    popup.classList.add('open');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    blobPromise = null;
    getBlob();
    closeBtn?.focus();
  }

  function close() {
    popup.classList.remove('open');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    toggleBtn.focus();
  }

  toggleBtn.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  popup.addEventListener('click', (event) => { if (event.target === popup) close(); }); // الضغط على الخلفية
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && popup.classList.contains('open')) close(); });

  saveBtn.addEventListener('click', async () => download(await getBlob()));

  // Share: قائمة مشاركة الجهاز (على الآيفون منها Save Image لحفظها في الألبوم)
  shareBtn.addEventListener('click', async () => {
    const blob = await getBlob();
    const file = new File([blob], IMAGE_NAME, { type: 'image/png' });
    if (!navigator.canShare?.({ files: [file] })) { download(blob); return; } // الجهاز مش بيدعم المشاركة: ننزّل
    try {
      await navigator.share({ files: [file], title: textOf('.idtop h3') });
    } catch (error) {
      if (error.name !== 'AbortError') showToast('Could not share');
    }
  });
}
