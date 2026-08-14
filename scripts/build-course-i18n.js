// Builds courses/<course>-i18n.js and courses/<course>-quiz-i18n.js from the
// per-language translation source under courses/i18n-src/<course>/<lang>/.
// Run from the project root: node scripts/build-course-i18n.js [course]
// (omit course to build all configured courses)
const fs = require('fs');
const path = require('path');

const projectDir = path.join(__dirname, '..');
const langs = ['en', 'uk', 'es'];

const courses = {
  cyberjunior: {
    srcDir: path.join(projectDir, 'courses', 'cyberjunior-src'),
    i18nSrcDir: path.join(projectDir, 'courses', 'i18n-src', 'cyberjunior'),
    quizFile: path.join(projectDir, 'courses', 'cyberjunior-quiz.js'),
    quizVarName: 'CYBER_COURSE_QUIZZES',
    courseVar: 'CYBER_COURSE_I18N',
    quizI18nVar: 'CYBER_COURSE_QUIZZES_I18N',
    outFile: path.join(projectDir, 'courses', 'cyberjunior-i18n.js'),
    quizOutFile: path.join(projectDir, 'courses', 'cyberjunior-quiz-i18n.js'),
  },
  'networking-zero': {
    srcDir: path.join(projectDir, 'courses', 'networking-zero-src'),
    i18nSrcDir: path.join(projectDir, 'courses', 'i18n-src', 'networking-zero'),
    quizFile: path.join(projectDir, 'courses', 'networking-zero-quiz.js'),
    quizVarName: 'NETWORKING_COURSE_QUIZZES',
    courseVar: 'NETWORKING_COURSE_I18N',
    quizI18nVar: 'NETWORKING_COURSE_QUIZZES_I18N',
    outFile: path.join(projectDir, 'courses', 'networking-zero-i18n.js'),
    quizOutFile: path.join(projectDir, 'courses', 'networking-zero-quiz-i18n.js'),
  },
};

function loadRuQuiz(quizFile, varName) {
  const sandbox = { window: {} };
  const vm = require('vm');
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(quizFile, 'utf8'), sandbox);
  return sandbox.window[varName];
}

function sectionCount(html) {
  return (html.match(/<section class="lesson-section"/g) || []).length;
}

function buildCourse(key) {
  const cfg = courses[key];
  if (!cfg) {
    console.error(`Unknown course: ${key}`);
    process.exit(1);
  }

  let hadError = false;
  const moduleIds = fs.readdirSync(cfg.srcDir)
    .filter(f => f.endsWith('.html'))
    .map(f => f.replace(/\.html$/, ''))
    .sort();

  const ruQuiz = loadRuQuiz(cfg.quizFile, cfg.quizVarName);
  const ruTitles = JSON.parse(fs.readFileSync(path.join(cfg.i18nSrcDir, 'ru', 'titles.json'), 'utf8'));

  const ruSectionCounts = {};
  for (const id of moduleIds) {
    ruSectionCounts[id] = sectionCount(fs.readFileSync(path.join(cfg.srcDir, `${id}.html`), 'utf8'));
  }

  const courseI18n = { title: {}, cardText: {}, modules: {} };
  for (const id of moduleIds) courseI18n.modules[id] = {};
  const quizI18n = {};

  for (const lang of langs) {
    const langDir = path.join(cfg.i18nSrcDir, lang);
    if (!fs.existsSync(langDir)) {
      console.error(`MISSING LANG DIR: ${langDir}`);
      hadError = true;
      continue;
    }

    // --- titles.json ---
    const titlesPath = path.join(langDir, 'titles.json');
    let titles;
    try {
      titles = JSON.parse(fs.readFileSync(titlesPath, 'utf8'));
    } catch (e) {
      console.error(`[${key}/${lang}] titles.json invalid JSON: ${e.message}`);
      hadError = true;
      continue;
    }
    if (!titles.title || !titles.cardText || !titles.modules) {
      console.error(`[${key}/${lang}] titles.json missing title/cardText/modules`);
      hadError = true;
    }
    for (const id of moduleIds) {
      if (!titles.modules[id]) {
        console.error(`[${key}/${lang}] titles.json missing module title for "${id}"`);
        hadError = true;
      }
    }
    courseI18n.title[lang] = titles.title || ruTitles.title;
    courseI18n.cardText[lang] = titles.cardText || ruTitles.cardText;

    // --- module html files ---
    for (const id of moduleIds) {
      const filePath = path.join(langDir, `${id}.html`);
      if (!fs.existsSync(filePath)) {
        console.error(`[${key}/${lang}] MISSING module file: ${id}.html`);
        hadError = true;
        continue;
      }
      const html = fs.readFileSync(filePath, 'utf8');
      if (html.includes('`')) {
        console.error(`[${key}/${lang}] BACKTICK FOUND in ${id}.html`);
        hadError = true;
      }
      if (!html.trim().startsWith('<div class="lesson-content">') || !html.trim().endsWith('</div>')) {
        console.error(`[${key}/${lang}] WRAPPER MISMATCH in ${id}.html`);
        hadError = true;
      }
      const count = sectionCount(html);
      if (count !== ruSectionCounts[id]) {
        console.error(`[${key}/${lang}] SECTION COUNT MISMATCH in ${id}.html: got ${count}, expected ${ruSectionCounts[id]}`);
        hadError = true;
      }
      courseI18n.modules[id][lang] = { title: titles.modules[id] || ruTitles.modules[id], html };
    }

    // --- quiz.json ---
    const quizPath = path.join(langDir, 'quiz.json');
    let quiz;
    try {
      quiz = JSON.parse(fs.readFileSync(quizPath, 'utf8'));
    } catch (e) {
      console.error(`[${key}/${lang}] quiz.json invalid JSON: ${e.message}`);
      hadError = true;
      continue;
    }
    for (const modId of Object.keys(ruQuiz)) {
      const ruQs = ruQuiz[modId];
      const trQs = quiz[modId];
      if (!Array.isArray(trQs) || trQs.length !== ruQs.length) {
        console.error(`[${key}/${lang}] quiz.json module "${modId}" length mismatch: got ${trQs ? trQs.length : 'missing'}, expected ${ruQs.length}`);
        hadError = true;
        continue;
      }
      for (let i = 0; i < ruQs.length; i++) {
        const ruQ = ruQs[i];
        const trQ = trQs[i];
        if (!trQ || trQ.id !== ruQ.id || trQ.type !== ruQ.type || trQ.correct !== ruQ.correct) {
          console.error(`[${key}/${lang}] quiz.json "${modId}[${i}]" id/type/correct mismatch (expected id=${ruQ.id} type=${ruQ.type} correct=${ruQ.correct}, got id=${trQ && trQ.id} type=${trQ && trQ.type} correct=${trQ && trQ.correct})`);
          hadError = true;
        }
        if (ruQ.type === 'mc') {
          const ruKeys = Object.keys(ruQ.options || {}).sort().join(',');
          const trKeys = Object.keys((trQ && trQ.options) || {}).sort().join(',');
          if (ruKeys !== trKeys) {
            console.error(`[${key}/${lang}] quiz.json "${modId}[${i}]" mc option keys mismatch: expected ${ruKeys}, got ${trKeys}`);
            hadError = true;
          }
        }
      }
    }
    quizI18n[lang] = quiz;
  }

  if (hadError) {
    console.error(`Validation failed for "${key}" — not writing output files`);
    return false;
  }

  const courseOutput = `// Auto-generated course translations (EN/UK/ES).\n// Russian source content lives in courses/${key === 'cyberjunior' ? 'cyberjunior' : 'networking-zero'}.js.\n// Built from courses/i18n-src/${key}/*/ by scripts/build-course-i18n.js — do not hand-edit.\nwindow.${cfg.courseVar} = ${JSON.stringify(courseI18n, null, 2)};\n`;
  fs.writeFileSync(cfg.outFile, courseOutput, 'utf8');

  const quizOutput = `// Auto-generated quiz translations (EN/UK/ES).\n// Russian source lives in courses/${path.basename(cfg.quizFile)}.\n// Built from courses/i18n-src/${key}/*/quiz.json by scripts/build-course-i18n.js — do not hand-edit.\nwindow.${cfg.quizI18nVar} = ${JSON.stringify(quizI18n, null, 2)};\n`;
  fs.writeFileSync(cfg.quizOutFile, quizOutput, 'utf8');

  console.log(`OK: wrote ${path.relative(projectDir, cfg.outFile)} and ${path.relative(projectDir, cfg.quizOutFile)} for "${key}" (${moduleIds.length} modules x ${langs.length} langs)`);
  return true;
}

const target = process.argv[2];
const keys = target ? [target] : Object.keys(courses);
let allOk = true;
for (const key of keys) {
  const ok = buildCourse(key);
  allOk = allOk && ok;
}
process.exit(allOk ? 0 : 1);
