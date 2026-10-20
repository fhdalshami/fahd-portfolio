/* ==========================================================================
   data.js — تحميل كل محتوى الموقع من Supabase
   ========================================================================== */
(function(){
  /* ---------- إعدادات الاتصال ----------
     SB_URL: رابط مشروعك في Supabase.
     SB_KEY: المفتاح العام (publishable). مصمم يظهر في الصفحة، والحماية من قواعد RLS اللي في الداتا بيز (قراءة فقط).
     ممنوع تحط هنا أي مفتاح سري (secret / service_role) أو باسورد الداتا بيز. */
  var SB_URL=window.SITE_CONFIG.SB_URL;   // من ملف config.js
  var SB_KEY=window.SITE_CONFIG.SB_KEY;   // من ملف config.js
  var CACHE_KEY='portfolio-data-v1';   // اسم التخزين في المتصفح (نسخة من آخر بيانات)
  var MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  /* ---------- دوال مساعدة ---------- */
  function $(s,r){ return (r||document).querySelector(s); }
  // بتعمل عنصر HTML. بنستخدم textContent دايماً (مش innerHTML) عشان أي نص من الداتا بيز يتعرض كنص عادي وآمن
  function el(tag,cls,text){ var e=document.createElement(tag); if(cls) e.className=cls; if(text!=null) e.textContent=text; return e; }
  function setText(sel,v){ var e=$(sel); if(e&&v) e.textContent=v; }
  function safe(f,x){ try{ f(x); }catch(e){ console.warn('render error',e); } }
  // بتغيّر الصورة لرابط الداتا بيز. لو الرابط ما اشتغلش بترجع للصورة الاحتياطية المدمجة في الملف
  function setImg(img,url){
    if(!img.dataset.fb) img.dataset.fb=img.src;
    if(img.src===url) return;
    img.crossOrigin='anonymous';  // لازم عشان صورة الكارت (canvas) تقدر تستخدم الصورة
    img.onerror=function(){ img.onerror=null; img.removeAttribute('crossorigin'); img.src=img.dataset.fb; };
    img.src=url;
  }
  // تاريخ بصيغة 2026-03-01 إلى Mar 2026 (بنقسم النص بإيدينا عشان فروق التوقيت ما تغيّرش الشهر)
  function fmt(d){ var p=d.split('-'); return MONTHS[parseInt(p[1],10)-1]+' '+p[0]; }
  // عدد الأشهر بين تاريخين (الشهر الحالي محسوب كامل، زي LinkedIn). لو النهاية فاضية بنستخدم النهاردة
  function tenureText(s,e){
    var a=s.split('-'), n=new Date();
    var ey=e?parseInt(e.split('-')[0],10):n.getFullYear(), em=e?parseInt(e.split('-')[1],10):n.getMonth()+1;
    var months=(ey-parseInt(a[0],10))*12+(em-parseInt(a[1],10))+1; if(months<1) months=1;
    var y=Math.floor(months/12), m=months%12, out=[];
    if(y) out.push(y+(y===1?' year':' years'));
    if(m) out.push(m+(m===1?' month':' months'));
    return out.join(' ');
  }
  // تغيير العنوان الرئيسي (بيشتغل سواء تأثير الكتابة بدأ أو لسه)
  function setHero(s){
    var h=$('#heroTitle'); if(!h||!s) return;
    h.setAttribute('aria-label',s);
    var g=$('.tw-ghost',h);
    if(g){ g.textContent=s; var ty=$('.tw-typed',h); if(ty&&h.classList.contains('tw-done')) ty.textContent=s; }
    else h.textContent=s;
  }

  /* ---------- جدول site_settings: الإعدادات العامة ---------- */
  function applySettings(s){
    if(!s) return;
    if(s.browser_title) document.title=s.browser_title;
    var md=$('meta[name="description"]'); if(md&&s.meta_description) md.setAttribute('content',s.meta_description);
    var fav=$('link[rel="icon"]'); if(fav&&s.favicon_url) fav.setAttribute('href',s.favicon_url);
    if(s.logo_url) document.querySelectorAll('header img, .banner .logo').forEach(function(i){ setImg(i,s.logo_url); });
    if(s.memoji_url) document.querySelectorAll('.peek img, .idtop img').forEach(function(i){ setImg(i,s.memoji_url); });
    if(s.site_name) document.querySelectorAll('header img, .banner .logo').forEach(function(i){ i.alt=s.site_name; });
    setHero(s.hero_title);
    setText('.lead',s.hero_lead);
    var ps=document.querySelectorAll('#about .about p');
    if(ps[0]&&s.about_p1) ps[0].textContent=s.about_p1;
    if(ps[1]&&s.about_p2) ps[1].textContent=s.about_p2;
    setText('#contact .contact > h2',s.contact_title);
    setText('#contact .contact > p',s.contact_text);
    setText('footer',s.footer_text);
    /* الكارت */
    setText('.idtop h3',s.site_name); setText('.idtop .role',s.job_title);
    setText('.idtop .where',s.company); setText('.idlinks li:last-child span',s.location);
    if(s.phone){ var ph=$('.idlinks a[href^="tel"]'); if(ph){ ph.textContent=s.phone; ph.setAttribute('href','tel:'+s.phone.replace(/[^\d+]/g,'')); } }
    if(s.email){ var em=$('a[data-mail]'); if(em){ em.textContent=s.email; em.setAttribute('href','mailto:'+s.email); } window.SITE_EMAIL=s.email; }
    if(s.linkedin_url){ var li=$('a[aria-label="LinkedIn"]'); if(li) li.setAttribute('href',s.linkedin_url); }
    if(s.cv_url){ var cv=$('a[aria-label="Download CV"]'); if(cv){ cv.setAttribute('href',s.cv_url); cv.setAttribute('target','_blank'); cv.setAttribute('rel','noopener'); } }
    if(s.form_id) window.SITE_FORM_ID=s.form_id;
  }

  /* ---------- جدول sections: أسماء الأقسام وترتيبها وإخفاؤها ---------- */
  function applySections(rows){
    if(!rows||!rows.length) return;
    var main=$('main'), nav=$('#nav'), keep={};
    rows.forEach(function(r){ keep[r.key]=true; });
    // أي قسم مش موجود في الجدول (أو is_visible=false) بنخفيه هو ورابطه في القائمة
    ['about','projects','experience','education','certifications','contact'].forEach(function(k){
      var sec=document.getElementById(k), link=$('nav a[href="#'+k+'"]');
      if(sec) sec.hidden=!keep[k]; if(link) link.hidden=!keep[k];
    });
    // الصفوف جاية مترتبة بـ sort_order: بنحرك الأقسام وروابط القائمة بنفس الترتيب
    rows.forEach(function(r){
      var sec=document.getElementById(r.key), link=$('nav a[href="#'+r.key+'"]');
      if(sec){ main.appendChild(sec); if(r.key!=='contact'){ var h=$('h2',sec); if(h&&r.title) h.textContent=r.title; } }
      if(link){ nav.appendChild(link); if(r.title) link.textContent=r.title; }
    });
  }

  /* ---------- جدول experiences: الخبرات مجمّعة حسب الشركة ---------- */
  function renderExperience(rows){
    if(!rows||!rows.length) return;                 // لو فاضي بنسيب المحتوى الاحتياطي
    var sec=document.getElementById('experience'); if(!sec) return;
    var h2=$('h2',sec); if(!h2) return;
    while(h2.nextSibling) sec.removeChild(h2.nextSibling);   // نمسح القديم ونسيب العنوان
    var groups=[], idx={};
    rows.forEach(function(r){
      var g=idx[r.company];
      if(!g){ g=idx[r.company]={company:r.company,rows:[],start:r.start_date,end:null,open:false}; groups.push(g); }
      g.rows.push(r);
      if(r.start_date<g.start) g.start=r.start_date;                 // أقدم بداية في الشركة
      if(!r.end_date) g.open=true;                                   // لو في وظيفة بدون نهاية يبقى لسه شغال
      else if(!g.end||r.end_date>g.end) g.end=r.end_date;
    });
    groups.forEach(function(g){
      var parts=[fmt(g.start)+' – '+(g.open?'Present':fmt(g.end)), tenureText(g.start,g.open?null:g.end)];
      if(g.rows.length>1) parts.push(g.rows.length+' roles in one company');
      var c=el('div','company'); c.appendChild(el('h3','',g.company)); c.appendChild(el('p','',parts.join(' · ')));
      sec.appendChild(c);
      var list=el('div','proj');
      g.rows.forEach(function(r){
        var row=el('div','row');
        row.appendChild(el('h3','',r.title));
        row.appendChild(el('p','',r.description||''));
        row.appendChild(el('span','',fmt(r.start_date)+' – '+(r.end_date?fmt(r.end_date):'Present')));
        list.appendChild(row);
      });
      sec.appendChild(list);
    });
  }

  /* ---------- جدول projects ---------- */
  function renderProjects(rows){
    if(!rows||!rows.length) return;
    var list=$('#projects .proj'); if(!list) return;
    list.textContent='';
    rows.forEach(function(r){
      var row=el('div','row'), h=el('h3','',r.title);
      if(r.subtitle) h.appendChild(el('small','',r.subtitle));
      row.appendChild(h);
      row.appendChild(el('p','',r.description||''));
      var sp=el('span','');
      if(r.link_url){ var a=el('a','',r.link_label||'Open'); a.href=r.link_url; a.target='_blank'; a.rel='noopener'; sp.appendChild(a); }
      row.appendChild(sp); list.appendChild(row);
    });
  }

  /* ---------- قوائم بسيطة: التعليم والشهادات والمهارات ---------- */
  function fill(sel,rows,build){
    if(!rows||!rows.length) return;
    var ul=$(sel); if(!ul) return;
    ul.textContent='';
    rows.forEach(function(r){ ul.appendChild(build(r)); });
  }
  function eduItem(r){
    var li=el('li','',r.degree);
    var yrs=(r.start_year&&r.end_year)?r.start_year+' – '+r.end_year:(r.end_year||r.start_year||'');
    var sm=[r.institution,yrs].filter(Boolean).join(', ');
    if(sm) li.appendChild(el('small','',sm));
    return li;
  }

  /* ---------- تطبيق كل البيانات ---------- */
  function apply(d){
    safe(applySections,d.sections);
    safe(applySettings,d.settings);
    safe(renderExperience,d.experiences);
    safe(renderProjects,d.projects);
    safe(function(r){ fill('#education ul.plain',r,eduItem); },d.education);
    safe(function(r){ fill('#certifications ul.plain',r,function(x){ return el('li','',x.title); }); },d.certifications);
    safe(function(r){ fill('#about ul.skills',r,function(x){ return el('li','',x.name); }); },d.skills);
  }

  /* ---------- 1) نعرض النسخة المحفوظة في المتصفح فوراً (لو موجودة) ---------- */
  var cached=null;
  try{ cached=JSON.parse(localStorage.getItem(CACHE_KEY)); }catch(e){}
  if(cached){ apply(cached); if(window.__startHero) window.__startHero(); }

  /* ---------- 2) نجيب أحدث بيانات من Supabase ---------- */
  // دالة قراءة جدول. بنبعت المفتاح في apikey بس. لو فشل جدول واحد بنرجع null وباقي الجداول تكمل
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
    // لو جدول فشل ومعانا نسخة قديمة منه، نستخدمها
    Object.keys(d).forEach(function(k){ if(!d[k]&&cached&&cached[k]) d[k]=cached[k]; });
    if(Object.keys(d).every(function(k){ return !d[k]; })) { if(window.__startHero) window.__startHero(); return; } // كله فشل: الصفحة تفضل بالمحتوى الاحتياطي
    apply(d);
    try{ localStorage.setItem(CACHE_KEY,JSON.stringify(d)); }catch(e){}
    if(window.__startHero) window.__startHero();
  });
})();
