/* ==========================================================================
   menu.js — قائمة الموبايل
   ========================================================================== */
(function(){
  // نجيب زرار القائمة والقائمة نفسها عن طريق الـ id
  var b=document.getElementById('menuBtn'), n=document.getElementById('nav');
  if(!b||!n) return; // لو مش موجودين نوقف عشان ما يحصلش خطأ
  // دالة تقفل القائمة وتحدّث aria-expanded
  function c(){ n.classList.remove('open'); b.setAttribute('aria-expanded','false'); }
  // الضغط على الزرار: نفتح أو نقفل القائمة (toggle) ونحدّث aria-expanded
  b.addEventListener('click',function(){
    var o=n.classList.toggle('open');
    b.setAttribute('aria-expanded',o?'true':'false');
  });
  // الضغط على أي رابط داخل القائمة يقفلها
  n.addEventListener('click',function(e){ if(e.target.tagName==='A') c(); });
  // زرار Esc في الكيبورد يقفلها
  document.addEventListener('keydown',function(e){ if(e.key==='Escape') c(); });
})();
