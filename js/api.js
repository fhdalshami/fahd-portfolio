/* ==========================================================================
   api.js — قراءة البيانات من Supabase + النسخة المحفوظة في المتصفح (cache)
   ========================================================================== */
import { SB_URL, SB_KEY } from './config.js';

const CACHE_KEY = 'portfolio-data-v2';

// اسم البيان -> [اسم الجدول، شروط الاستعلام]
const QUERIES = {
  settings: ['site_settings', '&limit=1'],
  sections: ['sections', '&order=sort_order'],
  experiences: ['experiences', '&order=sort_order'],
  projects: ['projects', '&order=sort_order'],
  education: ['education', '&order=sort_order'],
  certifications: ['certifications', '&order=sort_order'],
  skills: ['skills', '&order=sort_order'],
};

// قراءة جدول. لو فشل بنرجع null وباقي الجداول تكمل شغلها.
async function fetchTable(table, query) {
  try {
    const response = await fetch(`${SB_URL}/rest/v1/${table}?select=*${query}`, { headers: { apikey: SB_KEY } });
    if (!response.ok) throw new Error(`${table}: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn('Supabase', error);
    return null;
  }
}

// بتجيب كل الجداول مرة واحدة وبترجع كائن بنفس مفاتيح QUERIES
export async function fetchAll() {
  const keys = Object.keys(QUERIES);
  const results = await Promise.all(keys.map((key) => fetchTable(...QUERIES[key])));
  const data = Object.fromEntries(keys.map((key, i) => [key, results[i]]));
  data.settings = data.settings?.[0] ?? null; // جدول الإعدادات صف واحد
  return data;
}

export function readCache() {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY)); } catch { return null; }
}

export function writeCache(data) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(data)); } catch { /* التخزين ممنوع: عادي */ }
}

// أي جدول فشل ومعانا نسخة قديمة منه نستخدمها
export function mergeWithCache(fresh, cached) {
  const merged = { ...fresh };
  for (const key of Object.keys(merged)) {
    if (!merged[key] && cached?.[key]) merged[key] = cached[key];
  }
  return merged;
}

export const hasData = (data) => Object.values(data).some(Boolean);
