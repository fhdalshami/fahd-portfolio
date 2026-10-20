/* ==========================================================================
   contact-form.js — إرسال فورم التواصل عن طريق Formspree
   معرّف الفورم (form_id) والإيميل بييجوا من الداتا بيز (data.js بيحطهم في window).
   ========================================================================== */
(function(){
  var f=document.getElementById('cf');
  if(!f) return;
  var st=f.querySelector('.status');                // مكان رسالة الحالة تحت الزرار
  f.addEventListener('submit',function(e){
    e.preventDefault();                             // نمنع إرسال الصفحة العادي ونتحكم إحنا
    // لو في حقل إجباري فاضي أو الإيميل غلط: نعرض تنبيه المتصفح ونوقف
    if(!f.checkValidity()){ f.reportValidity(); st.textContent='Please fill in all fields.'; return; }
    var d=new FormData(f);                          // بيانات الفورم
    if(d.get('_gotcha')) return;                    // الحقل المخفي اتملى يبقى بوت: نتجاهل
    var fid=window.SITE_FORM_ID;                    // معرّف الفورم من site_settings.form_id
    if(!fid){ st.textContent='The form is not available right now.'; return; }
    st.textContent='Sending…';
    fetch('https://formspree.io/f/'+fid,{method:'POST',headers:{'Accept':'application/json'},body:d})
      .then(function(r){
        if(r.ok){ f.reset(); st.textContent='Thanks! Your message was sent.'; return; }
        // الرد فيه خطأ: نقرأ سبب الخطأ من Formspree عشان نعرضه
        return r.json().then(function(j){
          throw new Error((j.errors&&j.errors.map(function(x){return x.message}).join(', '))||('Error '+r.status));
        },function(){ throw new Error('Error '+r.status); });
      })
      .catch(function(err){
        // فشل الإرسال: نعرض السبب + الإيميل كبديل (لو موجود)
        var why=(err&&err.message&&err.message!=='Failed to fetch')?err.message:'network or browser blocked the request';
        st.textContent='Could not send ('+why+').';
        if(window.SITE_EMAIL){
          st.appendChild(document.createTextNode(' Email me at '));
          var a=document.createElement('a'); a.href='mailto:'+window.SITE_EMAIL; a.textContent=window.SITE_EMAIL; st.appendChild(a);
        }
      });
  });
})();
