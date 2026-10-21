/* ==========================================================================
   lib/format.js — تنسيق التواريخ والمدد
   ========================================================================== */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// '2026-03-01' -> 'Mar 2026' (بنقسم النص بإيدينا عشان فروق التوقيت ما تغيّرش الشهر)
export function formatMonth(isoDate) {
  const [year, month] = isoDate.split('-');
  return `${MONTHS[parseInt(month, 10) - 1]} ${year}`;
}

// المدة بين تاريخين. الشهر الحالي محسوب كامل (زي LinkedIn). لو النهاية فاضية بنستخدم النهاردة.
export function formatDuration(startIso, endIso = null) {
  const [startYear, startMonth] = startIso.split('-').map(Number);
  const now = new Date();
  const [endYear, endMonth] = endIso ? endIso.split('-').map(Number) : [now.getFullYear(), now.getMonth() + 1];
  const total = Math.max(1, (endYear - startYear) * 12 + (endMonth - startMonth) + 1);
  const years = Math.floor(total / 12);
  const months = total % 12;
  const parts = [];
  if (years) parts.push(`${years} ${years === 1 ? 'year' : 'years'}`);
  if (months) parts.push(`${months} ${months === 1 ? 'month' : 'months'}`);
  return parts.join(' ');
}
