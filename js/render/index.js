/* ==========================================================================
   render/index.js — بيطبّق كل البيانات على الصفحة
   كل دالة بتتنفذ لوحدها: لو واحدة فشلت الباقي بيكمل.
   ========================================================================== */
import { renderSections } from './sections.js';
import { renderSettings } from './settings.js';
import { renderExperience } from './experience.js';
import { renderProjects } from './projects.js';
import { renderEducation, renderCertifications } from './lists.js';
import { renderSkills } from './skills.js';

const STEPS = [
  ['sections', renderSections],        // الأقسام الأول (الترتيب والقائمة)
  ['settings', renderSettings],
  ['experiences', renderExperience],
  ['projects', renderProjects],
  ['education', renderEducation],
  ['certifications', renderCertifications],
  ['skills', renderSkills],            // آخر واحد: بيقيس عرض الشاشة بعد ما الأقسام ظهرت
];

export function renderAll(data) {
  STEPS.forEach(([key, render]) => {
    try { render(data[key]); } catch (error) { console.warn(`render ${key} failed`, error); }
  });
}
