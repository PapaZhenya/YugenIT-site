// Builds lessons-i18n.js from the per-language HTML files under translations/.
// Run from the project root: node scripts/build-lessons-i18n.js
// Russian lesson content stays hardcoded in script.js (the original source);
// this only assembles the EN/UK/ES translations into window.LESSON_I18N.
const fs = require('fs');
const path = require('path');

const projectDir = path.join(__dirname, '..');

const topics = ['domain', 'docker', 'linux', 'devops', 'networking', 'server', 'security', 'mikrotik'];
const langs = ['en', 'uk', 'es'];

const expectedSectionCounts = {
  domain: 7,
  docker: 7,
  linux: 10,
  devops: 7,
  networking: 9,
  server: 12,
  security: 27,
  mikrotik: 26,
};

const dir = path.join(projectDir, 'translations');
const result = {};
let hadError = false;

for (const topic of topics) {
  result[topic] = {};
  for (const lang of langs) {
    const file = path.join(dir, `${topic}.${lang}.html`);
    if (!fs.existsSync(file)) {
      console.error(`MISSING: ${file}`);
      hadError = true;
      continue;
    }
    const content = fs.readFileSync(file, 'utf8');
    const sectionCount = (content.match(/<section class="lesson-section"/g) || []).length;
    const expected = expectedSectionCounts[topic];
    if (sectionCount !== expected) {
      console.error(`SECTION COUNT MISMATCH: ${topic}.${lang} has ${sectionCount}, expected ${expected}`);
      hadError = true;
    }
    if (content.includes('`')) {
      console.error(`BACKTICK FOUND (unexpected): ${topic}.${lang}`);
      hadError = true;
    }
    result[topic][lang] = content;
  }
}

if (hadError) {
  console.error('Validation failed — not writing lessons-i18n.js');
  process.exit(1);
}

const output = `// Auto-generated lesson translations (EN/UK/ES).\n// Russian source content lives in script.js as the original lesson constants.\n// Built from translations/*.html by scripts/build-lessons-i18n.js — do not hand-edit.\nwindow.LESSON_I18N = ${JSON.stringify(result, null, 2)};\n`;

fs.writeFileSync(path.join(projectDir, 'lessons-i18n.js'), output, 'utf8');
console.log('OK: wrote lessons-i18n.js');
for (const topic of topics) {
  const counts = langs.map(l => `${l}=${(result[topic][l].match(/<section class="lesson-section"/g) || []).length}`).join(' ');
  console.log(`${topic}: expected=${expectedSectionCounts[topic]} ${counts}`);
}
