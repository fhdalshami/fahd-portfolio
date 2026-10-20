/* ==========================================================================
   typewriter.js — تأثير الكتابة على العنوان الرئيسي (كأن حد بيكتبه)
   data.js بينادي window.setHeroTitle(النص) بعد ما يجيب النص من الداتا بيز.
   ========================================================================== */
(function(){
  var h=document.getElementById('heroTitle');
  if(!h) return;
  var current='', gen=0, ghost, typed;
  // لو المستخدم مفعّل "تقليل الحركة" نعرض النص كامل من غير حركة
  var reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // نبني عنصرين: نسخة خفية بتحجز المكان (aria-hidden) والنص اللي بيتكتب فوقها
  function build(){
    h.textContent='';
    ghost=document.createElement('span'); ghost.className='tw-ghost'; ghost.setAttribute('aria-hidden','true');
    typed=document.createElement('span'); typed.className='tw-typed'; typed.setAttribute('aria-hidden','true');
    h.appendChild(ghost); h.appendChild(typed); h.classList.remove('tw-done');
  }
  window.setHeroTitle=function(text){
    if(!text||text===current) return;
    var first=!current; current=text;
    h.setAttribute('aria-label',text);              // قارئات الشاشة تقرا النص كامل مرة واحدة
    if(reduced){ h.textContent=text; return; }
    build(); ghost.textContent=text;
    var my=++gen;                                    // رقم المحاولة: لو جه نص جديد نوقف الكتابة القديمة
    // لو ده تحديث بعد أول عرض (مثلاً من الشبكة بعد النسخة المحفوظة) نظهر النص كامل فوراً
    if(!first){ typed.textContent=text; h.classList.add('tw-done'); return; }
    var i=0;
    (function step(){
      if(my!==gen) return;
      i++; typed.textContent=text.slice(0,i);                        // نظهر أول i حرف
      if(i<text.length) setTimeout(step,45);                          // 45 ملي ثانية بين كل حرف (غيّر الرقم للسرعة)
      else setTimeout(function(){ if(my===gen) h.classList.add('tw-done'); },1800); // نخفي المؤشر بعد ثانيتين
    })();
  };
})();
