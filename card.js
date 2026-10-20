/* ==========================================================================
   card.js — كارت التعريف: Popup + حفظ ومشاركة كصورة
   ========================================================================== */
(function(){
  var tg=document.getElementById('cardToggle'), wrap=document.getElementById('idwrap');
  var sh=document.getElementById('cardShare'), sv=document.getElementById('cardSave'), toast=document.getElementById('toast');
  if(!tg||!wrap||!sh||!sv) return;
  var cache=null; // الصورة بعد ما تتعمل بتتخزن هنا عشان ما نعيدش رسمها
  // رسالة صغيرة تحت الشاشة
  function say(m){ if(!toast) return; toast.textContent=m; toast.classList.add('show'); setTimeout(function(){ toast.classList.remove('show'); },2600); }
  // دالة ترسم مستطيل بحواف دايرية
  function rr(c,x,y,w,h,r){ c.beginPath(); c.moveTo(x+r,y); c.arcTo(x+w,y,x+w,y+h,r); c.arcTo(x+w,y+h,x,y+h,r); c.arcTo(x,y+h,x,y,r); c.arcTo(x,y,x+w,y,r); c.closePath(); }
  // بتجيب نص عنصر من الصفحة: فالصورة بتتعمل من نفس بيانات الكارت (أي تعديل في الكارت يظهر فيها)
  function txt(sel){ var e=document.querySelector(sel); return e?e.textContent.trim():''; }
  // رسم الكارت كصورة PNG مقاس 1080×1380
  function draw(){
    var F='"Bricolage Grotesque",system-ui,-apple-system,"Segoe UI",sans-serif';
    // نتأكد إن الخط اتحمّل قبل الرسم
    var load=(document.fonts&&document.fonts.load)?Promise.all([document.fonts.load('800 60px "Bricolage Grotesque"'),document.fonts.load('400 40px "Bricolage Grotesque"')]).catch(function(){}):Promise.resolve();
    var img=document.querySelector('.idtop img');
    return load.then(function(){
      return new Promise(function(res){ if(img.complete) res(); else img.onload=res; });
    }).then(function(){
      var W=1080,H=1380,c=document.createElement('canvas'); c.width=W; c.height=H;
      var g=c.getContext('2d');
      g.fillStyle='#000'; g.fillRect(0,0,W,H);                         // الخلفية السودا
      g.fillStyle='#222222'; rr(g,60,60,W-120,H-120,56); g.fill();     // الكارت #222222
      // صورة الميموجي داخل دايرة
      g.save(); g.beginPath(); g.arc(W/2,330,150,0,Math.PI*2); g.closePath(); g.clip();
      g.fillStyle='#1c1c1c'; g.fillRect(W/2-150,180,300,300); g.drawImage(img,W/2-150,180,300,300); g.restore();
      // الاسم والوظيفة ومكان الشغل
      g.textAlign='center'; g.textBaseline='alphabetic'; g.fillStyle='#fff';
      g.font='800 68px '+F; g.fillText(txt('.idtop h3'),W/2,600);
      g.font='600 44px '+F; g.fillText(txt('.idtop .role'),W/2,670);
      g.fillStyle='#a3a3a3'; g.font='400 36px '+F; g.fillText(txt('.idtop .where'),W/2,726);
      g.fillStyle='#2e2e2e'; g.fillRect(150,790,W-300,2);               // خط فاصل
      // الرقم والإيميل والمكان، كل واحد بإيموجي
      var rows=[['📞',txt('.idlinks a[href^="tel"]')],['✉️',txt('.idlinks a[data-mail]')],['📍',txt('.idlinks li:last-child span')]].filter(function(r){ return r[1]; });   // نتخطى أي سطر فاضي
      g.textAlign='left'; g.fillStyle='#fff'; g.font='400 42px '+F;
      rows.forEach(function(r,i){ var y=900+i*110; g.fillText(r[0],150,y); g.fillText(r[1],230,y); });
      g.textAlign='center'; g.fillStyle='#a3a3a3'; g.font='400 34px '+F; var greet=(document.getElementById('idcard').dataset.greeting||''); if(greet) g.fillText('👋  '+greet,W/2,1230);   // الجملة من site_settings.card_greeting
      return new Promise(function(r){ c.toBlob(r,'image/png'); });
    });
  }
  function getBlob(){ return cache||(cache=draw()); }
  var closeBtn=document.getElementById('cardClose');
  // فتح الـ Popup: نقفل تمرير الصفحة اللي ورا، ونجهز الصورة بدري، وننقل التركيز لزرار الإغلاق (للكيبورد وقارئات الشاشة)
  function openCard(){ wrap.classList.add('open'); tg.setAttribute('aria-expanded','true'); document.body.style.overflow='hidden'; getBlob(); if(closeBtn) closeBtn.focus(); }
  // إغلاق الـ Popup: نرجّع التمرير والتركيز لأيقونة الفتح
  function closeCard(){ wrap.classList.remove('open'); tg.setAttribute('aria-expanded','false'); document.body.style.overflow=''; tg.focus(); }
  tg.addEventListener('click',openCard);                                   // الضغط على الأيقونة يفتح
  if(closeBtn) closeBtn.addEventListener('click',closeCard);               // زرار ✕ يقفل
  wrap.addEventListener('click',function(e){ if(e.target===wrap) closeCard(); }); // الضغط على الخلفية المعتمة يقفل
  document.addEventListener('keydown',function(e){ if(e.key==='Escape'&&wrap.classList.contains('open')) closeCard(); }); // زرار Esc يقفل
  // Save image: تنزيل الصورة كملف
  function download(b){
    var a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download='Fahd-Al-Shami-card.png';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function(){ URL.revokeObjectURL(a.href); },2000); say('Image saved');
  }
  sv.addEventListener('click',function(){ getBlob().then(download); });
  // Share: قائمة المشاركة بتاعة الجهاز (على الآيفون منها Save Image بتحفظها في الألبوم). لو الجهاز مش بيدعم المشاركة بنزّل الصورة
  sh.addEventListener('click',function(){
    getBlob().then(function(b){
      var f=new File([b],'Fahd-Al-Shami-card.png',{type:'image/png'});
      if(navigator.canShare&&navigator.canShare({files:[f]})){
        return navigator.share({files:[f],title:'Fahd Al-Shami'}).catch(function(e){ if(e&&e.name!=='AbortError') say('Could not share'); });
      }
      download(b);
    });
  });
})();
