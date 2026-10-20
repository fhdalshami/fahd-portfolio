/* ==========================================================================
   typewriter.js — تأثير الكتابة على العنوان الرئيسي
   ========================================================================== */
(function(){
  var h=document.getElementById('heroTitle');
  if(!h) return;
  var started=false;
  function start(){
    if(started) return; started=true; // نبدأ مرة واحدة بس
  // لو المستخدم مفعّل "تقليل الحركة" في جهازه: نسيب النص ظاهر كامل من غير حركة
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var full=h.textContent;                 // النص الكامل (بيتاخد من الصفحة، فلو غيّرته في الـ HTML يتغير هنا)
  h.textContent='';
  // النسخة المخفية: بتحجز المساحة. aria-hidden عشان قارئات الشاشة تقرا aria-label بتاع الـ h1 مرة واحدة
  var ghost=document.createElement('span'); ghost.className='tw-ghost'; ghost.setAttribute('aria-hidden','true'); ghost.textContent=full;
  // النص اللي بيتكتب حرف حرف
  var typed=document.createElement('span'); typed.className='tw-typed'; typed.setAttribute('aria-hidden','true');
  h.appendChild(ghost); h.appendChild(typed);
  var i=0;
  function step(){
    i++;
    typed.textContent=full.slice(0,i);   // نظهر أول i حرف
    if(i<full.length){ setTimeout(step,45); }            // 45 ملي ثانية بين كل حرف (غيّر الرقم لتسريع أو إبطاء الكتابة)
    else { setTimeout(function(){ h.classList.add('tw-done'); },1800); } // بعد الانتهاء بثانيتين تقريباً نخفي المؤشر
  }
    setTimeout(step,500);
  }
  window.__startHero=start;   // الجافاسكريبت 7 بينادي عليها بعد ما يحمّل النص من Supabase
  setTimeout(start,1500);     // احتياطي: لو التحميل اتأخر نبدأ بالنص الموجود
})();
