/* ==========================================================================
   theme.js — الوضع الداكن / الفاتح (Dark / Light)
   الأساسي dark. اختيار الزائر بيتحفظ في المتصفح (localStorage).
   الملف ده بيتحمّل في <head> عشان الثيم يتحدد قبل ما الصفحة تترسم.
   ========================================================================== */
(function(){
  var root=document.documentElement;
  var saved=null;
  try{ saved=localStorage.getItem('theme'); }catch(e){}
  // أي قيمة غير "light" تعني dark (الأساسي)
  function apply(t){
    root.setAttribute('data-bs-theme',t);
    var m=document.querySelector('meta[name="theme-color"]');
    if(m) m.setAttribute('content',t==='light'?'#f3f3f6':'#000000');   // لون شريط المتصفح على الموبايل
  }
  apply(saved==='light'?'light':'dark');
  // زرار التبديل (موجود في الشريط العلوي)
  document.addEventListener('DOMContentLoaded',function(){
    apply(root.getAttribute('data-bs-theme'));
    var b=document.getElementById('themeToggle');
    if(!b) return;
    b.addEventListener('click',function(){
      var next=root.getAttribute('data-bs-theme')==='dark'?'light':'dark';
      apply(next);
      try{ localStorage.setItem('theme',next); }catch(e){}
    });
  });
})();
