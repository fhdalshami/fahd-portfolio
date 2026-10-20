/* ==========================================================================
   data.js — تحميل كل محتوى الموقع من Supabase وعرضه
   الـ HTML هيكل فاضي، وكل النصوص والأقسام والقائمة بتتبني من هنا.
   الجداول: site_settings, sections, experiences, projects, education, certifications, skills
   ========================================================================== */
(function(){
  var SB_URL=window.SITE_CONFIG.SB_URL, SB_KEY=window.SITE_CONFIG.SB_KEY;   // من config.js
  var CACHE_KEY='portfolio-data-v2';          // نسخة من آخر بيانات في متصفح الزائر (عشان العرض الفوري)
  var KEYS=['about','projects','experience','education','certifications','contact'];   // ids الأقسام الموجودة في index.html
  var MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  /* ---------- دوال مساعدة ---------- */
  function $(s,r){ return (r||document).querySelector(s); }
  // بتعمل عنصر HTML. بنستخدم textContent دايماً (مش innerHTML) عشان أي نص من الداتا بيز يتعرض كنص عادي وآمن
  function el(tag,cls,text){ var e=document.createElement(tag); if(cls) e.className=cls; if(text!=null) e.textContent=text; return e; }
  function setText(sel,v){ var e=$(sel); if(e) e.textContent=v||''; }
  function safe(f,x){ try{ f(x); }catch(e){ console.warn('render error',e); } }
  // نخفي العنصر لو مفيش قيمة، ونظهره لو في
  function toggle(e,on){ if(e) e.hidden=!on; }
  // تغيير صورة لرابط الداتا بيز. لو الرابط فشل نرجع للصورة المحلية اللي في assets
  function setImg(img,url){
    if(!img.dataset.fb) img.dataset.fb=img.getAttribute('src');
    if(img.getAttribute('src')===url) return;
    img.crossOrigin='anonymous';                       // لازم عشان صورة الكارت (canvas) تقدر تستخدمها
    img.onerror=function(){ img.onerror=null; img.removeAttribute('crossorigin'); img.src=img.dataset.fb; };
    img.src=url;
  }
  // 2026-03-01 -> Mar 2026
  function fmt(d){ var p=d.split('-'); return MONTHS[parseInt(p[1],10)-1]+' '+p[0]; }
  // مدة بين تاريخين (الشهر الحالي محسوب كامل زي LinkedIn). لو النهاية فاضية بنستخدم النهاردة
  function tenureText(s,e){
    var a=s.split('-'), n=new Date();
    var ey=e?parseInt(e.split('-')[0],10):n.getFullYear(), em=e?parseInt(e.split('-')[1],10):n.getMonth()+1;
    var months=(ey-parseInt(a[0],10))*12+(em-parseInt(a[1],10))+1; if(months<1) months=1;
    var y=Math.floor(months/12), m=months%12, out=[];
    if(y) out.push(y+(y===1?' year':' years'));
    if(m) out.push(m+(m===1?' month':' months'));
    return out.join(' ');
  }
  // كارت زجاجي بصف Bootstrap: عنوان | وصف | معلومة جانبية (تاريخ أو رابط)
  function item(h,desc,meta){
    var it=el('div','item'), row=el('div','row g-2 align-items-baseline');
    var c1=el('div','col-md-4'), c2=el('div','col-md'), c3=el('div','col-md-auto');
    c1.appendChild(h); c2.appendChild(el('p','',desc||'')); c3.appendChild(meta);
    row.appendChild(c1); row.appendChild(c2); row.appendChild(c3); it.appendChild(row);
    return it;
  }

  /* ---------- sections: أسماء الأقسام وترتيبها وإخفاؤها + بناء القائمة العلوية ---------- */
  function applySections(rows){
    if(!rows) return;
    var main=$('main'), list=$('#navList'), keep={};
    list.textContent='';
    rows.forEach(function(r){ keep[r.key]=true; });
    // الأقسام اللي مش في الجدول (أو is_visible=false) بتفضل مخفية
    KEYS.forEach(function(k){ var s=document.getElementById(k); if(s) s.hidden=!keep[k]; });
    // الصفوف جاية مترتبة بـ sort_order: نحرك الأقسام ونبني روابط القائمة بنفس الترتيب
    rows.forEach(function(r){
      var s=document.getElementById(r.key); if(!s) return;
      main.appendChild(s);
      if(r.key!=='contact'){ var h=$('h2',s); if(h) h.textContent=r.title||''; }   // عنوان Contact من site_settings
      var li=el('li','nav-item'), a=el('a','nav-link',r.title||''); a.href='#'+r.key; li.appendChild(a); list.appendChild(li);
    });
  }

  /* ---------- site_settings: الإعدادات العامة ---------- */
  function applySettings(s){
    if(!s) return;
    if(s.browser_title) document.title=s.browser_title;
    var fav=$('link[rel="icon"]'); if(fav&&s.favicon_url) fav.setAttribute('href',s.favicon_url);
    document.querySelectorAll('.brand-logo, .banner .logo').forEach(function(i){ if(s.logo_url) setImg(i,s.logo_url); i.alt=s.site_name||''; });
    if(s.memoji_url) document.querySelectorAll('.peek img, .idtop img').forEach(function(i){ setImg(i,s.memoji_url); });
    // البانر
    if(window.setHeroTitle) window.setHeroTitle(s.hero_title);
    setText('#heroLead',s.hero_lead);
    [['#cta1',s.hero_cta1],['#cta2',s.hero_cta2]].forEach(function(p){ var b=$(p[0]); if(b){ b.textContent=p[1]||''; toggle(b,!!p[1]); } });
    // About
    var at=$('#aboutText'); at.textContent='';
    [s.about_p1,s.about_p2].forEach(function(p){ if(p) at.appendChild(el('p','',p)); });
    // Contact والفوتر
    setText('#contactTitle',s.contact_title); setText('#contactText',s.contact_text); setText('#footer',s.footer_text);
    // الأيقونات
    [['#linkLinkedIn',s.linkedin_url],['#linkCV',s.cv_url]].forEach(function(p){ var a=$(p[0]); if(a){ if(p[1]) a.setAttribute('href',p[1]); toggle(a,!!p[1]); } });
    // كارت التعريف
    setText('.idtop h3',s.site_name); setText('.idtop .role',s.job_title); setText('.idtop .where',s.company);
    $('#idcard').dataset.greeting=s.card_greeting||'';
    var ph=$('#cardPhoneLi a'); if(ph){ ph.textContent=s.phone||''; ph.setAttribute('href','tel:'+(s.phone||'').replace(/[^\d+]/g,'')); } toggle($('#cardPhoneLi'),!!s.phone);
    var em=$('#cardMailLi a'); if(em){ em.textContent=s.email||''; em.setAttribute('href','mailto:'+(s.email||'')); } toggle($('#cardMailLi'),!!s.email);
    setText('#cardLocLi span',s.location); toggle($('#cardLocLi'),!!s.location);
    window.SITE_EMAIL=s.email||''; window.SITE_FORM_ID=s.form_id||'';   // بتستخدمهم الفورم ونسخ الإيميل
  }

  /* ---------- experiences: الخبرات مجمّعة حسب الشركة ---------- */
  function renderExperience(rows){
    if(!rows) return;
    var box=$('#experienceList'); box.textContent='';
    var groups=[], idx={};
    rows.forEach(function(r){
      var g=idx[r.company];
      if(!g){ g=idx[r.company]={company:r.company,rows:[],start:r.start_date,end:null,open:false}; groups.push(g); }
      g.rows.push(r);
      if(r.start_date<g.start) g.start=r.start_date;                  // أقدم بداية في الشركة
      if(!r.end_date) g.open=true;                                    // وظيفة بدون نهاية = لسه شغال
      else if(!g.end||r.end_date>g.end) g.end=r.end_date;
    });
    groups.forEach(function(g){
      var wrap=el('div','exp-group'), c=el('div','company');
      var parts=[fmt(g.start)+' – '+(g.open?'Present':fmt(g.end)), tenureText(g.start,g.open?null:g.end)];
      if(g.rows.length>1) parts.push(g.rows.length+' roles in one company');
      c.appendChild(el('h3','',g.company)); c.appendChild(el('p','',parts.join(' · '))); wrap.appendChild(c);
      var st=el('div','stack');
      g.rows.forEach(function(r){
        st.appendChild(item(el('h3','',r.title),r.description,el('span','meta',fmt(r.start_date)+' – '+(r.end_date?fmt(r.end_date):'Present'))));
      });
      wrap.appendChild(st); box.appendChild(wrap);
    });
  }

  /* ---------- projects ---------- */
  function renderProjects(rows){
    if(!rows) return;
    var box=$('#projectsList'); box.textContent='';
    rows.forEach(function(r){
      var h=el('h3','',r.title); if(r.subtitle) h.appendChild(el('small','',r.subtitle));
      var meta=el('span','meta');
      if(r.link_url){ var a=el('a','',r.link_label||'Open'); a.href=r.link_url; a.target='_blank'; a.rel='noopener'; meta.appendChild(a); }
      box.appendChild(item(h,r.description,meta));
    });
  }

  /* ---------- قوائم بسيطة: التعليم والشهادات ---------- */
  function fill(sel,rows,build){
    if(!rows) return;
    var ul=$(sel); ul.textContent='';
    rows.forEach(function(r){ ul.appendChild(build(r)); });
  }
  function eduItem(r){
    var li=el('li','',r.degree);
    var yrs=(r.start_year&&r.end_year)?r.start_year+' – '+r.end_year:(r.end_year||r.start_year||'');
    var sm=[r.institution,yrs].filter(Boolean).join(', ');
    if(sm) li.appendChild(el('small','',sm));
    return li;
  }

  /* ---------- skills: شريط متحرك أفقي ---------- */
  var lastSkills=null;
  function renderSkills(rows){
    if(!rows) return;
    lastSkills=rows;
    var box=$('#skills'), track=$('#skillsTrack'); track.textContent='';
    toggle(box,rows.length>0);
    if(!rows.length) return;
    // نصف واحد من الشريط = المهارات مكررة copies مرة
    function half(copies){
      var h=el('div','marquee-half');
      for(var i=0;i<copies;i++) rows.forEach(function(r){ h.appendChild(el('span','skill',r.name)); });
      return h;
    }
    var probe=half(1); track.appendChild(probe);
    var w=probe.getBoundingClientRect().width||1, cw=box.clientWidth||0;
    // عشان الحركة تفضل متصلة، لازم عرض النصف يكون أكبر من عرض الشاشة
    var copies=Math.max(1,Math.ceil(cw/w));
    track.textContent='';
    var a=half(copies), b=half(copies); b.setAttribute('aria-hidden','true');   // النصف التاني نسخة للحركة بس
    track.appendChild(a); track.appendChild(b);
    var hw=a.getBoundingClientRect().width||600;
    track.style.setProperty('--dur',Math.max(14,hw/50)+'s');                     // سرعة ثابتة تقريباً (50px في الثانية)
  }
  var rt; window.addEventListener('resize',function(){ clearTimeout(rt); rt=setTimeout(function(){ if(lastSkills) renderSkills(lastSkills); },250); });

  /* ---------- تطبيق كل البيانات ---------- */
  function apply(d){
    safe(applySections,d.sections);
    safe(applySettings,d.settings);
    safe(renderExperience,d.experiences);
    safe(renderProjects,d.projects);
    safe(function(r){ fill('#educationList',r,eduItem); },d.education);
    safe(function(r){ fill('#certificationsList',r,function(x){ return el('li','',x.title); }); },d.certifications);
    safe(renderSkills,d.skills);
    document.body.classList.remove('is-loading');     // نظهر الصفحة
    $('#loadError').hidden=true;
  }

  /* ---------- قائمة الموبايل: Bootstrap بيفتحها، وإحنا بنقفلها بعد اختيار قسم ---------- */
  var navEl=$('#nav');
  navEl.addEventListener('click',function(e){
    if(e.target.closest('.nav-link')&&navEl.classList.contains('show')&&window.bootstrap) window.bootstrap.Collapse.getOrCreateInstance(navEl).hide();
  });

  /* ---------- 1) النسخة المحفوظة في المتصفح (لو موجودة) نعرضها فوراً ---------- */
  var cached=null;
  try{ cached=JSON.parse(localStorage.getItem(CACHE_KEY)); }catch(e){}
  if(cached) apply(cached);

  /* ---------- 2) نجيب أحدث بيانات من Supabase ---------- */
  // قراءة جدول. المفتاح بيتبعت في apikey بس. لو جدول فشل بنرجع null وباقي الجداول تكمل
  function get(table,q){
    return fetch(SB_URL+'/rest/v1/'+table+'?select=*'+(q||''),{headers:{apikey:SB_KEY}})
      .then(function(r){ if(!r.ok) throw new Error(table+': '+r.status); return r.json(); })
      .catch(function(e){ console.warn('Supabase',e); return null; });
  }
  Promise.all([
    get('site_settings','&limit=1'), get('sections','&order=sort_order'),
    get('experiences','&order=sort_order'), get('projects','&order=sort_order'),
    get('education','&order=sort_order'), get('certifications','&order=sort_order'),
    get('skills','&order=sort_order')
  ]).then(function(r){
    var d={settings:r[0]&&r[0][0],sections:r[1],experiences:r[2],projects:r[3],education:r[4],certifications:r[5],skills:r[6]};
    // لو جدول فشل ومعانا نسخة قديمة منه نستخدمها
    Object.keys(d).forEach(function(k){ if(!d[k]&&cached&&cached[k]) d[k]=cached[k]; });
    if(Object.keys(d).every(function(k){ return !d[k]; })) return;   // كله فشل: نسيب الصفحة (رسالة الخطأ بتظهر تحت)
    apply(d);
    try{ localStorage.setItem(CACHE_KEY,JSON.stringify(d)); }catch(e){}
  });

  // احتياطي: لو بعد 6 ثواني لسه مفيش بيانات (مفيش نسخة محفوظة ولا اتصال) نظهر رسالة الخطأ
  setTimeout(function(){
    if(document.body.classList.contains('is-loading')){
      document.body.classList.remove('is-loading'); $('#loadError').hidden=false;
    }
  },6000);
})();
