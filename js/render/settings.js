/* ==========================================================================
   render/settings.js — جدول site_settings: الإعدادات العامة (نصوص، صور، روابط، بيانات الكارت)
   ========================================================================== */
import { $, $$, el, setText, toggle, setImage } from '../lib/dom.js';
import { state } from '../state.js';
import { setHeroTitle } from '../features/typewriter.js';

// بتضبط رابط أيقونة (LinkedIn / CV) وتخفيها لو مفيش رابط
function setLink(selector, url) {
  const link = $(selector);
  if (!link) return;
  if (url) link.setAttribute('href', url);
  toggle(link, Boolean(url));
}

// سطر في الكارت (رقم، إيميل، مكان): بيتخفى لو القيمة فاضية
function setCardRow(selector, value, href) {
  const row = $(selector);
  const target = $('a, span', row);
  target.textContent = value || '';
  if (href !== undefined) target.setAttribute('href', href);
  toggle(row, Boolean(value));
}

function renderMedia(s) {
  const favicon = $('link[rel="icon"]');
  if (favicon && s.favicon_url) favicon.setAttribute('href', s.favicon_url);
  $$('.brand-logo, .banner .logo').forEach((img) => {
    if (s.logo_url) setImage(img, s.logo_url);
    img.alt = s.site_name || '';
  });
  if (s.memoji_url) $$('.peek img, .idtop img').forEach((img) => setImage(img, s.memoji_url));
}

function renderHero(s) {
  setHeroTitle(s.hero_title);
  setText('#heroLead', s.hero_lead);
  [['#cta1', s.hero_cta1], ['#cta2', s.hero_cta2]].forEach(([selector, label]) => {
    const button = $(selector);
    button.textContent = label || '';
    toggle(button, Boolean(label));
  });
}

function renderCard(s) {
  setText('.idtop h3', s.site_name);
  setText('.idtop .role', s.job_title);
  setText('.idtop .where', s.company);
  $('#idcard').dataset.greeting = s.card_greeting || '';
  setCardRow('#cardPhoneLi', s.phone, `tel:${(s.phone || '').replace(/[^\d+]/g, '')}`);
  setCardRow('#cardMailLi', s.email, `mailto:${s.email || ''}`);
  setCardRow('#cardLocLi', s.location);
  toggle($('#cardToggle'), s.show_card !== false); // show_card = false يخفي أيقونة الكارت (لو العمود مش موجود بتفضل ظاهرة)
}

export function renderSettings(s) {
  if (!s) return;
  if (s.browser_title) document.title = s.browser_title;

  renderMedia(s);
  renderHero(s);

  const about = $('#aboutText');
  about.textContent = '';
  [s.about_p1, s.about_p2].filter(Boolean).forEach((text) => about.append(el('p', '', text)));

  setText('#contactTitle', s.contact_title);
  setText('#contactText', s.contact_text);
  setText('#footer', s.footer_text);
  setLink('#linkLinkedIn', s.linkedin_url);
  setLink('#linkCV', s.cv_url);
  renderCard(s);

  state.email = s.email || '';
  state.formId = s.form_id || '';
}
