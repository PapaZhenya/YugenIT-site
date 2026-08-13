// Builds courses/cyberjunior.js from the HTML fragments under courses/cyberjunior-src/.
// Run from the project root: node scripts/build-cyberjunior-course.js
const fs = require('fs');
const path = require('path');

const projectDir = path.join(__dirname, '..');
const srcDir = path.join(projectDir, 'courses', 'cyberjunior-src');

const modules = [
  { id: 'overview', title: 'О курсе', file: 'overview.html' },
  { id: 'program-map', title: 'Карта программы', file: 'program-map.html' },
  { id: 'week-01', title: 'Неделя 1. Введение и модель угроз', file: 'week-01.html' },
  { id: 'week-02', title: 'Неделя 2. Сети', file: 'week-02.html' },
  { id: 'week-03', title: 'Неделя 3. Операционные системы и командная строка', file: 'week-03.html' },
  { id: 'week-04', title: 'Неделя 4. Разведка и сканирование', file: 'week-04.html' },
  { id: 'week-05', title: 'Неделя 5. Уязвимости и эксплуатация веб-приложений (OWASP Top 10)', file: 'week-05.html' },
  { id: 'week-06', title: 'Неделя 6. Пароли и социальная инженерия', file: 'week-06.html' },
  { id: 'week-07', title: 'Неделя 7. Харденинг и криптография', file: 'week-07.html' },
  { id: 'week-08', title: 'Неделя 8. Мониторинг и защита сети', file: 'week-08.html' },
  { id: 'week-09', title: 'Неделя 9. Основы реагирования и форензики', file: 'week-09.html' },
  { id: 'week-10', title: 'Неделя 10. Разбор атак и Blue Team', file: 'week-10.html' },
  { id: 'week-11', title: 'Неделя 11. Карьерные треки и подготовка', file: 'week-11.html' },
  { id: 'week-12', title: 'Неделя 12. Итоговый проект', file: 'week-12.html' },
  { id: 'resources', title: 'Бесплатные ресурсы и платформы', file: 'resources.html' },
  { id: 'assessment', title: 'Система оценивания', file: 'assessment.html' },
  { id: 'lab-setup', title: 'Сборка лабораторного стенда', file: 'lab-setup.html' },
  { id: 'test-bank', title: 'Банк тестовых вопросов', file: 'test-bank.html' },
];

let hadError = false;
const result = [];

for (const mod of modules) {
  const filePath = path.join(srcDir, mod.file);
  if (!fs.existsSync(filePath)) {
    console.error(`MISSING: ${filePath}`);
    hadError = true;
    continue;
  }
  const html = fs.readFileSync(filePath, 'utf8');
  if (html.includes('`')) {
    console.error(`BACKTICK FOUND (unexpected): ${mod.file}`);
    hadError = true;
  }
  if (!html.trim().startsWith('<div class="lesson-content">') || !html.trim().endsWith('</div>')) {
    console.error(`WRAPPER MISMATCH: ${mod.file} does not start/end with the expected lesson-content div`);
    hadError = true;
  }
  result.push({ id: mod.id, title: mod.title, html });
}

if (hadError) {
  console.error('Validation failed — not writing courses/cyberjunior.js');
  process.exit(1);
}

const course = {
  id: 'cyberjunior',
  title: 'Кибербезопасность с нуля до junior',
  cardIcon: '🛡️',
  cardText: 'Практический курс с нуля: сети, атаки, защита, реагирование на инциденты — 12 недель до уровня junior SOC-аналитика.',
  modules: result,
};

const output = `// Auto-generated course content.\n// Built from courses/cyberjunior-src/*.html by scripts/build-cyberjunior-course.js — do not hand-edit.\nwindow.CYBER_COURSE = ${JSON.stringify(course, null, 2)};\n`;

fs.writeFileSync(path.join(projectDir, 'courses', 'cyberjunior.js'), output, 'utf8');
console.log(`OK: wrote courses/cyberjunior.js with ${result.length} modules`);
