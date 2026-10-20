/* ==========================================================================
   config.js — إعدادات الموقع في مكان واحد. لازم يتحمّل قبل باقي الملفات.
   ========================================================================== */
window.SITE_CONFIG={
  // رابط مشروعك في Supabase
  SB_URL:'https://fqhlfkyotnsmueppcdbc.supabase.co',
  // المفتاح العام (publishable): مصمم يظهر في الصفحة. الحماية من قواعد RLS (قراءة فقط).
  // ممنوع تحط هنا مفتاح سري (secret / service_role) أو باسورد الداتا بيز.
  SB_KEY:'sb_publishable_pGFMU5X_6N_KsnjZNUa2JQ_D06Org_2',
  // معرّف فورم Formspree (بيتحدث من الداتا بيز لو اتحط في site_settings.form_id)
  FORM_ID:'mnpjrngr',
  // الإيميل الاحتياطي (بيتحدث من الداتا بيز لو اتحط في site_settings.email)
  EMAIL:'fahdalshamie@gmail.com'
};
