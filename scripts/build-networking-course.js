// Builds courses/networking-zero.js from the HTML fragments under courses/networking-zero-src/.
// Run from the project root: node scripts/build-networking-course.js
const fs = require('fs');
const path = require('path');

const projectDir = path.join(__dirname, '..');
const srcDir = path.join(projectDir, 'courses', 'networking-zero-src');

const modules = [
  { id: 'overview', title: 'О курсе', file: 'overview.html' },
  { id: 'program-map', title: 'Карта курса', file: 'program-map.html' },
  { id: 'module-01', title: 'Модуль 1. Путешествие одного сообщения', file: 'module-01.html' },
  { id: 'module-02', title: 'Модуль 2. Адреса, имена и порты', file: 'module-02.html' },
  { id: 'module-03', title: 'Модуль 3. Две модели, что раскладывают всё по полочкам', file: 'module-03.html' },
  { id: 'module-04', title: 'Модуль 4. Локальная сеть изнутри', file: 'module-04.html' },
  { id: 'module-05', title: 'Модуль 5. Соединяем сети', file: 'module-05.html' },
  { id: 'module-06', title: 'Модуль 6. Магия автонастройки: DHCP и NAT', file: 'module-06.html' },
  { id: 'module-07', title: 'Модуль 7. Без проводов: Wi-Fi', file: 'module-07.html' },
  { id: 'module-08', title: 'Модуль 8. Когда что-то сломалось: диагностика', file: 'module-08.html' },
  { id: 'module-09', title: 'Модуль 9. Защита сети', file: 'module-09.html' },
  { id: 'resources', title: 'Бесплатные инструменты и площадки', file: 'resources.html' },
  { id: 'assessment', title: 'Система оценивания', file: 'assessment.html' },
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
  console.error('Validation failed — not writing courses/networking-zero.js');
  process.exit(1);
}

const course = {
  id: 'networking-zero',
  title: 'Сети с нуля: как устроена связь',
  cardIcon: '🌐',
  cardText: 'Практический курс: от «что происходит, когда жмёшь Enter» до сборки и диагностики своей сети. 9 модулей, 3 части.',
  modules: result,
};

const output = `// Auto-generated course content.\n// Built from courses/networking-zero-src/*.html by scripts/build-networking-course.js — do not hand-edit.\nwindow.NETWORKING_COURSE = ${JSON.stringify(course, null, 2)};\n`;

fs.writeFileSync(path.join(projectDir, 'courses', 'networking-zero.js'), output, 'utf8');
console.log(`OK: wrote courses/networking-zero.js with ${result.length} modules`);
