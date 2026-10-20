/* ==========================================================================
   tenure.js — حساب مدة العمل (نسخة احتياطية للنص الثابت)
   ========================================================================== */
(function(){
  var el=document.getElementById('tenure'); if(!el) return;
  var now=new Date();
  // بداية العمل: ديسمبر 2019 (الشهر 12). بنعد الشهر الحالي كامل زي ما LinkedIn بيعمل
  var months=(now.getFullYear()-2019)*12+(now.getMonth()+1-12)+1;
  var y=Math.floor(months/12), m=months%12;
  var txt=y+(y===1?' year':' years');
  if(m) txt+=' '+m+(m===1?' month':' months');
  el.textContent=txt;
})();
