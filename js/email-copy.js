/* ==========================================================================
   email-copy.js — نسخ الإيميل على الكمبيوتر
   ========================================================================== */
(function(){
  var t=document.getElementById('toast');
  if(!t) return;
  var EMAIL='';   // بيتقرا من الإيميل المعروض في الكارت (جاي من الداتا بيز)
  // دالة تعرض رسالة صغيرة لمدة 2.6 ثانية
  function show(msg){ t.textContent=msg; t.classList.add('show'); setTimeout(function(){ t.classList.remove('show'); },2600); }
  // الدالة دي بتتربط بأي عنصر عليه data-mail (أيقونة الإيميل + الإيميل في الكارت)
  function onMail(e){
    // على الموبايل (شاشة لمس): نسيب رابط mailto يفتح تطبيق الإيميل عادي
    if(!window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    // على الكمبيوتر: غالباً مفيش برنامج إيميل مضبوط، فننسخ العنوان بدل ما ما يحصلش حاجة
    e.preventDefault();
    var cardMail=document.querySelector('a[data-mail]'); // الإيميل المعروض في الكارت (جاي من الداتا بيز)
    if(cardMail&&cardMail.textContent.trim()) EMAIL=cardMail.textContent.trim();
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(EMAIL).then(function(){ show('Email copied: '+EMAIL); },function(){ show(EMAIL); });
    } else { show(EMAIL); }
  }
  [].forEach.call(document.querySelectorAll('[data-mail]'),function(a){ a.addEventListener('click',onMail); });
})();
