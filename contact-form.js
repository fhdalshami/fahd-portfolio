/* ==========================================================================
   contact-form.js — فورم التواصل (Formspree)
   ========================================================================== */
(function(){
  // FORM_ID: معرّف الفورم من Formspree (الجزء الأخير من رابط https://formspree.io/f/...)
  // TO: الإيميل اللي بيظهر للزائر لو الإرسال فشل
  var FORM_ID=window.SITE_CONFIG.FORM_ID, TO=window.SITE_CONFIG.EMAIL;   // من ملف config.js
  var f=document.getElementById('cf');              // الفورم
  var st=f.querySelector('.status');                // مكان رسالة الحالة تحت الزرار
  f.addEventListener('submit',function(e){
    e.preventDefault();                             // نمنع إرسال الصفحة العادي ونتحكم إحنا
    // لو في حقل إجباري فاضي أو الإيميل غلط: نعرض تنبيه المتصفح ونوقف
    if(!f.checkValidity()){ f.reportValidity(); st.textContent='Please fill in all fields.'; return; }
    var d=new FormData(f);                          // بيانات الفورم (الاسم والإيميل والرسالة)
    if(d.get('_gotcha')) return;                    // الحقل المخفي اتملى يبقى بوت: نتجاهل
    st.textContent='Sending…';
    // نبعت البيانات لـ Formspree
    fetch('https://formspree.io/f/'+(window.SITE_FORM_ID||FORM_ID),{method:'POST',headers:{'Accept':'application/json'},body:d})
      .then(function(r){
        if(r.ok){ f.reset(); st.textContent='Thanks! Your message was sent.'; return; }
        // الرد فيه خطأ: نقرأ سبب الخطأ من Formspree عشان نعرضه
        return r.json().then(function(j){
          throw new Error((j.errors&&j.errors.map(function(x){return x.message}).join(', '))||('Error '+r.status));
        },function(){ throw new Error('Error '+r.status); });
      })
      .catch(function(err){
        // فشل الإرسال: نعرض السبب + إيميلك كبديل
        var why=(err&&err.message&&err.message!=='Failed to fetch')?err.message:'network or browser blocked the request';
        st.textContent='Could not send ('+why+'). Email me at ';
        var a=document.createElement('a'); var em=window.SITE_EMAIL||TO; a.href='mailto:'+em; a.textContent=em; st.appendChild(a);
      });
  });
})();
