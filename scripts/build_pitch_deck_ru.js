const pptxgen = require('pptxgenjs');
const path = require('path');

const pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';
pres.title = 'Synq — Инвестиционный питч-дек';
pres.author = 'Synq';

const C = {
  bg:        '0A0A0D',
  card:      '141417',
  border:    '2C2C32',
  purple:    '7B6EF6',
  text:      'EEECEA',
  muted:     '888680',
  dim:       '4A4850',
  green:     '4ECBA0',
  blue:      '5BA4F5',
  purpleDim: '0D0A1E',
};

function darkSlide() {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  return s;
}

function addSlideLabel(s, num) {
  s.addText(`${num} / 10`, {
    x: 8.9, y: 5.25, w: 0.9, h: 0.2,
    fontSize: 8, fontFace: 'Calibri', color: C.dim, align: 'right'
  });
}

function addHeader(s, text) {
  s.addText(text, {
    x: 0.5, y: 0.35, w: 9.0, h: 0.65,
    fontSize: 24, fontFace: 'Calibri', bold: true,
    color: C.text, align: 'left', valign: 'middle', margin: 0
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.05, w: 9.0, h: 0.012,
    fill: { color: C.border }, line: { color: C.border, width: 0 }
  });
}

// ── СЛАЙД 1 · ЗАГОЛОВОК ───────────────────────────────────────────────────────
{
  const s = darkSlide();

  s.addShape(pres.shapes.OVAL, {
    x: 3.75, y: 0.45, w: 2.5, h: 2.5,
    fill: { color: C.purple, transparency: 91 },
    line: { color: C.purple, width: 0.5, transparency: 70 }
  });

  const barDefs = [
    { x: 4.38, y: 1.38, h: 0.72 },
    { x: 4.58, y: 1.10, h: 1.28 },
    { x: 4.78, y: 1.25, h: 0.98 },
    { x: 4.98, y: 1.48, h: 0.52 },
    { x: 5.18, y: 1.15, h: 1.18 },
    { x: 5.38, y: 1.38, h: 0.72 },
  ];
  barDefs.forEach(b => {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: b.x, y: b.y, w: 0.11, h: b.h,
      fill: { color: C.purple },
      line: { color: C.purple, width: 0 },
      rectRadius: 0.04
    });
  });

  s.addText('Synq', {
    x: 0, y: 2.82, w: 10, h: 0.9,
    fontSize: 72, fontFace: 'Calibri', bold: true,
    color: C.text, align: 'center', valign: 'middle'
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 4.35, y: 3.72, w: 1.3, h: 0.022,
    fill: { color: C.purple }, line: { color: C.purple, width: 0 }
  });

  s.addText('Приложение для продуктивности, созданное для того, как люди чувствуют себя на самом деле.', {
    x: 0.8, y: 3.85, w: 8.4, h: 0.45,
    fontSize: 15, fontFace: 'Calibri',
    color: C.muted, align: 'center'
  });

  s.addText('synq-web.vercel.app  ·  a16z Speedrun SR007  ·  Май 2026', {
    x: 0, y: 5.15, w: 10, h: 0.3,
    fontSize: 9.5, fontFace: 'Calibri',
    color: C.dim, align: 'center'
  });
}

// ── СЛАЙД 2 · ПРОБЛЕМА ────────────────────────────────────────────────────────
{
  const s = darkSlide();
  addSlideLabel(s, 2);

  s.addText('"Приложения для продуктивности\nпредполагают, что вы уже в порядке."', {
    x: 0.5, y: 0.3, w: 9.0, h: 1.2,
    fontSize: 28, fontFace: 'Calibri', bold: true,
    color: C.text, align: 'left'
  });

  const stats = [
    { num: '85%', body: 'специалистов чувствуют себя перегруженными регулярно', x: 0.5 },
    { num: '→✕', body: 'Большинство открывают планировщик — и сразу же закрывают его', x: 3.45 },
    { num: '∞', body: 'Ментальная нагрузка накапливается. Задачи теряются. Становится хуже.', x: 6.4 },
  ];
  stats.forEach(st => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: st.x, y: 1.65, w: 2.7, h: 2.1,
      fill: { color: C.card }, line: { color: C.border, width: 0.5 }
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: st.x, y: 1.65, w: 0.06, h: 2.1,
      fill: { color: C.purple }, line: { color: C.purple, width: 0 }
    });
    s.addText(st.num, {
      x: st.x + 0.18, y: 1.72, w: 2.4, h: 0.8,
      fontSize: 38, fontFace: 'Calibri', bold: true,
      color: C.purple, margin: 0
    });
    s.addText(st.body, {
      x: st.x + 0.18, y: 2.48, w: 2.42, h: 1.15,
      fontSize: 11, fontFace: 'Calibri', color: C.muted
    });
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 3.9, w: 9.0, h: 0.88,
    fill: { color: C.purpleDim }, line: { color: C.purple, width: 0.7 }
  });
  s.addText(
    '"Не существует ни одного приложения, которое встречает вас там, где вы находитесь эмоционально — И при этом помогает делать дела."',
    { x: 0.7, y: 3.96, w: 8.6, h: 0.76, fontSize: 12.5, fontFace: 'Calibri', italic: true, color: C.text, align: 'center', valign: 'middle' }
  );
}

// ── СЛАЙД 3 · РЕШЕНИЕ ─────────────────────────────────────────────────────────
{
  const s = darkSlide();
  addSlideLabel(s, 3);
  addHeader(s, 'Synq встречает вас там, где вы находитесь.');

  s.addText('КАК ЭТО РАБОТАЕТ', {
    x: 0.5, y: 1.15, w: 4.2, h: 0.28,
    fontSize: 8.5, fontFace: 'Calibri', bold: true, color: C.purple, charSpacing: 2
  });

  const steps = [
    { title: 'Вы говорите, что на уме', desc: 'Задачи, эмоции, напоминания — всё в одном предложении. Без форм.' },
    { title: 'Synq разбирает за <3 секунды', desc: 'ИИ определяет намерение, извлекает время, распознаёт эмоцию.' },
    { title: 'Всё попадает автоматически', desc: 'Нужный экран, нужное время, нужный формат. Нулевое трение.' },
  ];
  steps.forEach((step, i) => {
    const y = 1.5 + i * 1.1;
    s.addShape(pres.shapes.OVAL, {
      x: 0.5, y: y + 0.06, w: 0.42, h: 0.42,
      fill: { color: C.purple, transparency: 80 }, line: { color: C.purple, width: 0.5 }
    });
    s.addText(`${i + 1}`, {
      x: 0.5, y: y + 0.06, w: 0.42, h: 0.42,
      fontSize: 11, fontFace: 'Calibri', bold: true, color: C.purple,
      align: 'center', valign: 'middle', margin: 0
    });
    s.addText(step.title, {
      x: 1.08, y, w: 3.75, h: 0.35,
      fontSize: 13, fontFace: 'Calibri', bold: true, color: C.text, valign: 'middle', margin: 0
    });
    s.addText(step.desc, {
      x: 1.08, y: y + 0.33, w: 3.75, h: 0.55,
      fontSize: 11, fontFace: 'Calibri', color: C.muted
    });
  });

  s.addShape(pres.shapes.LINE, {
    x: 5.05, y: 1.1, w: 0, h: 4.2,
    line: { color: C.border, width: 0.5 }
  });

  s.addText('ПРИМЕР', {
    x: 5.3, y: 1.15, w: 4.2, h: 0.28,
    fontSize: 8.5, fontFace: 'Calibri', bold: true, color: C.purple, charSpacing: 2
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.3, y: 1.5, w: 4.2, h: 0.85,
    fill: { color: C.card }, line: { color: C.border, width: 0.5 }
  });
  s.addText('"Блин, я сейчас плохо себя чувствую. Купить хлеб, составить отчёт, позвонить маме сегодня в 5 часов."', {
    x: 5.45, y: 1.55, w: 3.9, h: 0.75,
    fontSize: 11, fontFace: 'Calibri', italic: true, color: C.muted, valign: 'middle'
  });

  s.addText('↓', {
    x: 5.3, y: 2.4, w: 4.2, h: 0.32,
    fontSize: 15, color: C.purple, align: 'center', fontFace: 'Calibri'
  });

  const outputs = [
    { label: 'Эмоция: Плохое самочувствие (4/5)',  color: C.purple },
    { label: 'Задача: Купить хлеб',                 color: C.green  },
    { label: 'Задача: Составить отчёт',             color: C.green  },
    { label: 'Напоминание: Позвонить маме · 17:00', color: C.blue   },
  ];
  outputs.forEach((o, i) => {
    const y = 2.78 + i * 0.5;
    s.addShape(pres.shapes.RECTANGLE, {
      x: 5.3, y, w: 4.2, h: 0.44,
      fill: { color: C.card }, line: { color: C.border, width: 0.5 }
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 5.3, y, w: 0.06, h: 0.44,
      fill: { color: o.color }, line: { color: o.color, width: 0 }
    });
    s.addText(o.label, {
      x: 5.5, y: y + 0.03, w: 3.9, h: 0.38,
      fontSize: 11, fontFace: 'Calibri', color: C.text, valign: 'middle'
    });
  });
}

// ── СЛАЙД 4 · ВОЗМОЖНОСТИ ─────────────────────────────────────────────────────
{
  const s = darkSlide();
  addSlideLabel(s, 4);
  addHeader(s, 'Всё, что нужно вашему мозгу. Ничего лишнего.');

  const features = [
    { icon: 'ГОЛОС', title: 'Голосовой захват', desc: 'Русский и английский. Задачи, эмоции, напоминания из одной фразы.' },
    { icon: 'НАСТР', title: 'Трекер настроения', desc: '7-дневный график с распознаванием паттернов и шкалой интенсивности.' },
    { icon: 'НАПОМ', title: 'Умные напоминания', desc: 'Время извлекается из речи. Вид календаря. Ничего не потеряется.' },
    { icon: 'ДЫХАН', title: 'Коробочное дыхание', desc: '4-4-4-4 — дыхательное упражнение при перегрузке. Один тап.' },
    { icon: 'ЧАТ',  title: 'ИИ-компаньон', desc: '"Поговори с Synq" — чат без осуждения, когда нужно выговориться.' },
    { icon: 'PWA',  title: 'Офлайн-PWA', desc: 'Работает без интернета. Устанавливается на любое устройство.' },
  ];

  features.forEach((f, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.5 + col * 4.75;
    const y = 1.18 + row * 1.35;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 4.35, h: 1.22,
      fill: { color: C.card }, line: { color: C.border, width: 0.5 }
    });
    s.addShape(pres.shapes.OVAL, {
      x: x + 0.18, y: y + 0.3, w: 0.55, h: 0.55,
      fill: { color: C.purple, transparency: 80 }, line: { color: C.purple, width: 0.5 }
    });
    s.addText(f.icon, {
      x: x + 0.18, y: y + 0.3, w: 0.55, h: 0.55,
      fontSize: 7, fontFace: 'Calibri', bold: true,
      color: C.purple, align: 'center', valign: 'middle', margin: 0
    });
    s.addText(f.title, {
      x: x + 0.88, y: y + 0.12, w: 3.3, h: 0.35,
      fontSize: 13, fontFace: 'Calibri', bold: true, color: C.text, valign: 'middle', margin: 0
    });
    s.addText(f.desc, {
      x: x + 0.88, y: y + 0.47, w: 3.3, h: 0.62,
      fontSize: 10.5, fontFace: 'Calibri', color: C.muted
    });
  });
}

// ── СЛАЙД 5 · РЫНОК ───────────────────────────────────────────────────────────
{
  const s = darkSlide();
  addSlideLabel(s, 5);
  addHeader(s, 'Рынок $102 млрд. Ниша $8,4 млрд, которую никто не занял.');

  const markets = [
    { tag: 'TAM', val: '$102 млрд', sub: 'Глобальный рынок ПО для продуктивности — рост 14% в год', color: C.blue   },
    { tag: 'SAM', val: '$8,4 млрд', sub: 'Пересечение ментального здоровья и продуктивности', color: C.purple },
    { tag: 'SOM', val: '$420 млн',  sub: 'Эмоциональная продуктивность — цель на 3 года', color: C.green  },
  ];
  markets.forEach((m, i) => {
    const y = 1.2 + i * 1.05;
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y, w: 4.4, h: 0.92,
      fill: { color: C.card }, line: { color: C.border, width: 0.5 }
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y, w: 0.06, h: 0.92,
      fill: { color: m.color }, line: { color: m.color, width: 0 }
    });
    s.addText(m.tag, {
      x: 0.7, y: y + 0.08, w: 0.62, h: 0.28,
      fontSize: 9, fontFace: 'Calibri', bold: true, color: m.color, margin: 0
    });
    s.addText(m.val, {
      x: 1.4, y: y + 0.04, w: 2.2, h: 0.42,
      fontSize: 22, fontFace: 'Calibri', bold: true, color: C.text, margin: 0
    });
    s.addText(m.sub, {
      x: 0.7, y: y + 0.52, w: 4.1, h: 0.32,
      fontSize: 10, fontFace: 'Calibri', color: C.muted
    });
  });

  const cx = 7.3, cy = 3.0;
  s.addShape(pres.shapes.OVAL, {
    x: cx - 2.1, y: cy - 2.1, w: 4.2, h: 4.2,
    fill: { color: C.blue, transparency: 88 }, line: { color: C.blue, width: 0.8 }
  });
  s.addShape(pres.shapes.OVAL, {
    x: cx - 1.45, y: cy - 1.45, w: 2.9, h: 2.9,
    fill: { color: C.purple, transparency: 83 }, line: { color: C.purple, width: 0.8 }
  });
  s.addShape(pres.shapes.OVAL, {
    x: cx - 0.75, y: cy - 0.75, w: 1.5, h: 1.5,
    fill: { color: C.green, transparency: 72 }, line: { color: C.green, width: 0.8 }
  });
  s.addText('TAM\n$102B', { x: cx + 0.95, y: cy - 2.1, w: 1.2, h: 0.55, fontSize: 9, fontFace: 'Calibri', bold: true, color: C.blue, align: 'left' });
  s.addText('SAM\n$8.4B', { x: cx + 0.4, y: cy - 1.45, w: 1.0, h: 0.55, fontSize: 9, fontFace: 'Calibri', bold: true, color: C.purple, align: 'left' });
  s.addText('$420M', { x: cx - 0.65, y: cy - 0.27, w: 1.3, h: 0.28, fontSize: 10, fontFace: 'Calibri', bold: true, color: C.green, align: 'center', margin: 0 });
  s.addText('SOM', { x: cx - 0.65, y: cy + 0.01, w: 1.3, h: 0.25, fontSize: 9, fontFace: 'Calibri', color: C.green, align: 'center', margin: 0 });

  s.addText('Осознанность в ментальном здоровье стала постоянной. Диагнозов СДВГ стало на 60% больше с 2020 года.', {
    x: 0.5, y: 5.0, w: 9.0, h: 0.38,
    fontSize: 9.5, fontFace: 'Calibri', italic: true, color: C.dim, align: 'center'
  });
}

// ── СЛАЙД 6 · ПОЧЕМУ СЕЙЧАС ───────────────────────────────────────────────────
{
  const s = darkSlide();
  addSlideLabel(s, 6);
  addHeader(s, 'Три вещи сошлись одновременно. Прямо сейчас.');

  const points = [
    {
      num: '01', icon: 'AI',
      title: 'LLM сделали NLP в реальном времени дешевле $0,001 за запрос',
      desc: 'Разбор голоса на задачи + эмоции + напоминания стоит почти ничего в 2026 году. Три года назад это было невозможно в масштабе.'
    },
    {
      num: '02', icon: 'МИК',
      title: '67% взрослых американцев используют голосовой ввод еженедельно (31% в 2021)',
      desc: 'Голосовые взаимодействия вышли за рамки раннего большинства. Поведение уже существует — нам нужно лишь встретить его правильным продуктом.'
    },
    {
      num: '03', icon: 'ПСИ',
      title: 'Десtigmatизация ментального здоровья стала необратимой',
      desc: 'Люди активно ищут инструменты, которые признают их эмоциональное состояние. Headspace при оценке $2 млрд доказал готовность платить за это.'
    },
  ];

  points.forEach((p, i) => {
    const y = 1.2 + i * 1.18;
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y, w: 9.0, h: 1.05,
      fill: { color: C.card }, line: { color: C.border, width: 0.5 }
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y, w: 0.06, h: 1.05,
      fill: { color: C.purple }, line: { color: C.purple, width: 0 }
    });
    s.addText(p.num, {
      x: 0.72, y: y + 0.08, w: 0.6, h: 0.88,
      fontSize: 22, fontFace: 'Calibri', bold: true, color: C.purple, valign: 'middle', margin: 0
    });
    s.addShape(pres.shapes.LINE, {
      x: 1.48, y: y + 0.14, w: 0, h: 0.76,
      line: { color: C.border, width: 0.5 }
    });
    s.addText(`${p.icon}  ${p.title}`, {
      x: 1.65, y: y + 0.08, w: 7.7, h: 0.36,
      fontSize: 12.5, fontFace: 'Calibri', bold: true, color: C.text, valign: 'middle', margin: 0
    });
    s.addText(p.desc, {
      x: 1.65, y: y + 0.44, w: 7.7, h: 0.52,
      fontSize: 10.5, fontFace: 'Calibri', color: C.muted
    });
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 4.78, w: 9.0, h: 0.52,
    fill: { color: C.purpleDim }, line: { color: C.purple, width: 0.6 }
  });
  s.addText(
    '"Headspace доказал это при оценке $2 млрд. Мы создаём продукт на пересечении: голос, эмоции, ИИ."',
    { x: 0.7, y: 4.8, w: 8.6, h: 0.48, fontSize: 10.5, fontFace: 'Calibri', italic: true, color: C.text, align: 'center', valign: 'middle' }
  );
}

// ── СЛАЙД 7 · КОНКУРЕНТНОЕ ПРЕИМУЩЕСТВО ──────────────────────────────────────
{
  const s = darkSlide();
  addSlideLabel(s, 7);
  addHeader(s, 'Наш ров — не функции. Это философия.');

  const cols = [
    {
      icon: 'UX', label: 'Эмоциональный UX', color: C.purple,
      body: 'Каждое дизайн-решение начинается с вопроса "как это заставит пользователя себя почувствовать?" Это невозможно скопировать добавлением кнопки — нужен полный пересмотр UX с нуля.'
    },
    {
      icon: 'NLP', label: 'Голосовой NLP-движок', color: C.blue,
      body: 'Обрабатывает фрагментированную, тревожную, "потоковую" речь, с которой стандартные парсеры не справляются. Кастомная грамматическая модель, а не просто промптинг GPT.'
    },
    {
      icon: 'COM', label: 'Доверительная дистрибуция', color: C.green,
      body: 'r/ADHD (1,7 млн участников), сети психотерапевтов, коучи по СДВГ. Вирусность через доверие в сообществах, которые активно ищут такие инструменты. Без платной рекламы.'
    },
  ];

  cols.forEach((c, i) => {
    const x = 0.5 + i * 3.1;
    s.addShape(pres.shapes.RECTANGLE, { x, y: 1.18, w: 2.88, h: 3.95, fill: { color: C.card }, line: { color: C.border, width: 0.5 } });
    s.addShape(pres.shapes.RECTANGLE, { x, y: 1.18, w: 2.88, h: 0.07, fill: { color: c.color }, line: { color: c.color, width: 0 } });
    s.addShape(pres.shapes.OVAL, { x: x + 1.04, y: 1.42, w: 0.78, h: 0.78, fill: { color: c.color, transparency: 82 }, line: { color: c.color, width: 0.5 } });
    s.addText(c.icon, { x: x + 1.04, y: 1.42, w: 0.78, h: 0.78, fontSize: 12, fontFace: 'Calibri', bold: true, color: c.color, align: 'center', valign: 'middle', margin: 0 });
    s.addText(c.label, { x: x + 0.12, y: 2.28, w: 2.64, h: 0.4, fontSize: 13, fontFace: 'Calibri', bold: true, color: c.color, align: 'center' });
    s.addText(c.body, { x: x + 0.18, y: 2.74, w: 2.52, h: 2.22, fontSize: 10.5, fontFace: 'Calibri', color: C.muted });
  });
}

// ── СЛАЙД 8 · ТРЕКШН ──────────────────────────────────────────────────────────
{
  const s = darkSlide();
  addSlideLabel(s, 8);
  addHeader(s, 'Пре-сид. Полностью рабочий. Создан за недели.');

  s.addText('ЧТО ГОТОВО', {
    x: 0.5, y: 1.15, w: 4.2, h: 0.28,
    fontSize: 8.5, fontFace: 'Calibri', bold: true, color: C.purple, charSpacing: 2
  });

  const built = [
    'React/Next.js веб-приложение — live: synq-web.vercel.app',
    'Flutter мобильное приложение (Android, протестировано)',
    'Голосовой захват + NLP-парсер (русский + английский)',
    'Трекер настроения, напоминания, дыхание, ИИ-чат',
    'Полный набор Jest-тестов (33 пройдено) + CI/CD',
  ];
  built.forEach((item, i) => {
    const y = 1.52 + i * 0.62;
    s.addShape(pres.shapes.OVAL, { x: 0.5, y: y + 0.05, w: 0.32, h: 0.32, fill: { color: C.green, transparency: 75 }, line: { color: C.green, width: 0.5 } });
    s.addText('V', { x: 0.5, y: y + 0.05, w: 0.32, h: 0.32, fontSize: 10, color: C.green, align: 'center', valign: 'middle', margin: 0, fontFace: 'Calibri', bold: true });
    s.addText(item, { x: 0.96, y, w: 3.8, h: 0.5, fontSize: 11.5, fontFace: 'Calibri', color: C.text, valign: 'middle' });
  });

  s.addShape(pres.shapes.LINE, { x: 5.05, y: 1.1, w: 0, h: 4.2, line: { color: C.border, width: 0.5 } });

  s.addText('ДОКАЗАТЕЛЬСТВО КОНЦЕПЦИИ', {
    x: 5.3, y: 1.15, w: 4.2, h: 0.28,
    fontSize: 8.5, fontFace: 'Calibri', bold: true, color: C.purple, charSpacing: 2
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 5.3, y: 1.52, w: 4.2, h: 2.35, fill: { color: C.purpleDim }, line: { color: C.purple, width: 0.7 } });
  s.addText(
    '"Создано в одиночку с использованием ИИ-нативной разработки — само по себе демонстрация возможного в 2026 году.\n\nТо, что раньше требовало команды из 5 инженеров, один сфокусированный основатель создал за несколько недель."',
    { x: 5.48, y: 1.62, w: 3.85, h: 2.15, fontSize: 11.5, fontFace: 'Calibri', italic: true, color: C.text, valign: 'middle' }
  );

  const miniStats = [
    { val: '5', label: 'экранов' },
    { val: '33', label: 'теста' },
    { val: '<3c', label: 'захват' },
    { val: '2', label: 'языка' },
  ];
  miniStats.forEach((st, i) => {
    const x = 5.3 + i * 1.05;
    s.addShape(pres.shapes.RECTANGLE, { x, y: 4.05, w: 0.97, h: 0.85, fill: { color: C.card }, line: { color: C.border, width: 0.5 } });
    s.addText(st.val, { x, y: 4.1, w: 0.97, h: 0.4, fontSize: 18, fontFace: 'Calibri', bold: true, color: C.purple, align: 'center', margin: 0 });
    s.addText(st.label, { x, y: 4.52, w: 0.97, h: 0.28, fontSize: 8.5, fontFace: 'Calibri', color: C.muted, align: 'center', margin: 0 });
  });
}

// ── СЛАЙД 9 · КОМАНДА ─────────────────────────────────────────────────────────
{
  const s = darkSlide();
  addSlideLabel(s, 9);
  addHeader(s, 'Соло-основатель. Усиленный ИИ.');

  s.addShape(pres.shapes.OVAL, { x: 0.65, y: 1.3, w: 1.6, h: 1.6, fill: { color: C.purple, transparency: 76 }, line: { color: C.purple, width: 1.0 } });
  s.addText('[Фото]', { x: 0.65, y: 1.3, w: 1.6, h: 1.6, fontSize: 14, fontFace: 'Calibri', color: C.muted, align: 'center', valign: 'middle', margin: 0 });

  s.addText('[Ваше имя]', { x: 2.5, y: 1.3, w: 7.0, h: 0.5, fontSize: 24, fontFace: 'Calibri', bold: true, color: C.text, valign: 'middle', margin: 0 });
  s.addText('Основатель и CEO', { x: 2.5, y: 1.78, w: 4.0, h: 0.28, fontSize: 12, fontFace: 'Calibri', color: C.purple });

  s.addShape(pres.shapes.RECTANGLE, { x: 2.5, y: 2.12, w: 7.0, h: 0.85, fill: { color: C.card }, line: { color: C.border, width: 0.5 } });
  s.addText('[2 предложения: технический бэкграунд и релевантный опыт — заполните самостоятельно]', {
    x: 2.65, y: 2.17, w: 6.7, h: 0.75, fontSize: 11.5, fontFace: 'Calibri', italic: true, color: C.muted, valign: 'middle'
  });

  s.addText('Ищем технического со-основателя через сеть Speedrun', { x: 0.5, y: 3.2, w: 9.0, h: 0.3, fontSize: 11, fontFace: 'Calibri', bold: true, color: C.blue, align: 'center' });
  s.addText('Мобильная разработка / ML · Владение голосовым AI-пайплайном', { x: 0.5, y: 3.48, w: 9.0, h: 0.28, fontSize: 11, fontFace: 'Calibri', color: C.muted, align: 'center' });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 4.02, w: 9.0, h: 0.92, fill: { color: C.purpleDim }, line: { color: C.purple, width: 0.7 } });
  s.addText(
    '"Инструментальный стек 2026 года позволяет одному сфокусированному основателю создать то, для чего раньше нужна была команда из 5 человек.\nSynq — доказательство этого."',
    { x: 0.7, y: 4.08, w: 8.6, h: 0.82, fontSize: 12.5, fontFace: 'Calibri', italic: true, color: C.text, align: 'center', valign: 'middle' }
  );
}

// ── СЛАЙД 10 · ЗАПРОС ─────────────────────────────────────────────────────────
{
  const s = darkSlide();
  addSlideLabel(s, 10);
  addHeader(s, '$250–500 тыс. пре-сид. Вот что нам нужно от Speedrun.');

  s.addText('ФИНАНСИРОВАНИЕ', { x: 0.5, y: 1.15, w: 4.2, h: 0.28, fontSize: 8.5, fontFace: 'Calibri', bold: true, color: C.green, charSpacing: 2 });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.48, w: 4.2, h: 0.72, fill: { color: C.card }, line: { color: C.green, width: 0.7 } });
  s.addText('Привлечение $250–500 тыс. (SAFE)', { x: 0.65, y: 1.52, w: 3.9, h: 0.64, fontSize: 13, fontFace: 'Calibri', bold: true, color: C.green, valign: 'middle' });

  const funds = [
    { pct: '60%', label: 'Разработка',    desc: 'Голосовой AI-пайплайн, полировка мобильного', color: C.purple, w: 4.2 * 0.60 },
    { pct: '25%', label: 'Привлечение',   desc: 'СДВГ-сообщества, каналы терапевтов', color: C.blue,   w: 4.2 * 0.25 },
    { pct: '15%', label: 'Операции',      desc: 'Инфраструктура, юридические вопросы, инструменты', color: C.green,  w: 4.2 * 0.15 },
  ];
  funds.forEach((f, i) => {
    const y = 2.35 + i * 0.82;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y, w: 4.2, h: 0.72, fill: { color: C.card }, line: { color: C.border, width: 0.5 } });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: y + 0.66, w: f.w, h: 0.06, fill: { color: f.color }, line: { color: f.color, width: 0 } });
    s.addText(f.pct, { x: 0.65, y: y + 0.04, w: 0.72, h: 0.38, fontSize: 20, fontFace: 'Calibri', bold: true, color: f.color, margin: 0 });
    s.addText(f.label, { x: 1.45, y: y + 0.06, w: 3.0, h: 0.28, fontSize: 12, fontFace: 'Calibri', bold: true, color: C.text, margin: 0 });
    s.addText(f.desc, { x: 1.45, y: y + 0.34, w: 3.1, h: 0.26, fontSize: 10, fontFace: 'Calibri', color: C.muted });
  });

  s.addShape(pres.shapes.LINE, { x: 5.05, y: 1.1, w: 0, h: 4.2, line: { color: C.border, width: 0.5 } });

  s.addText('ОТ SPEEDRUN', { x: 5.3, y: 1.15, w: 4.2, h: 0.28, fontSize: 8.5, fontFace: 'Calibri', bold: true, color: C.purple, charSpacing: 2 });

  const asks = [
    { num: '01', color: C.purple, title: 'Валидация GTM', desc: 'Позиционирование в ментальном здоровье vs. продуктивности — операторы a16z могут проверить это с реальными данными рынка.' },
    { num: '02', color: C.blue,   title: 'Дистрибуция', desc: 'Потребительские health-приложения, СДВГ-сообщества, редакция App Store. Ваша сеть сократит наш путь к пользователям на 6–12 месяцев.' },
    { num: '03', color: C.green,  title: 'Со-основатель', desc: 'Технический со-основатель с бэкграундом в мобильной разработке и ML для владения голосовым AI-пайплайном.' },
  ];
  asks.forEach((a, i) => {
    const y = 1.48 + i * 1.08;
    s.addShape(pres.shapes.RECTANGLE, { x: 5.3, y, w: 4.2, h: 0.95, fill: { color: C.card }, line: { color: C.border, width: 0.5 } });
    s.addShape(pres.shapes.RECTANGLE, { x: 5.3, y, w: 0.06, h: 0.95, fill: { color: a.color }, line: { color: a.color, width: 0 } });
    s.addText(a.num, { x: 5.45, y: y + 0.06, w: 0.45, h: 0.3, fontSize: 10.5, fontFace: 'Calibri', bold: true, color: a.color, margin: 0 });
    s.addText(a.title, { x: 5.9, y: y + 0.05, w: 3.45, h: 0.3, fontSize: 13, fontFace: 'Calibri', bold: true, color: C.text, margin: 0 });
    s.addText(a.desc, { x: 5.45, y: y + 0.4, w: 3.95, h: 0.5, fontSize: 10.5, fontFace: 'Calibri', color: C.muted });
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 4.88, w: 9.0, h: 0.5, fill: { color: C.purple, transparency: 88 }, line: { color: C.purple, width: 0.5 } });
  s.addText(
    'synq-web.vercel.app  ·  "Единственное приложение для продуктивности, которое сначала спрашивает, как вы себя чувствуете."',
    { x: 0.7, y: 4.9, w: 8.6, h: 0.46, fontSize: 10, fontFace: 'Calibri', italic: true, color: C.text, align: 'center', valign: 'middle' }
  );
}

// ── ЗАПИСЬ ────────────────────────────────────────────────────────────────────
const outPath = path.join('C:\\', 'Users', 'PC', 'Downloads', 'Synq_RU', 'SYNQ_PITCH_DECK_RU.pptx');
pres
  .writeFile({ fileName: outPath })
  .then(() => console.log('Done: ' + outPath))
  .catch(err => { console.error(err); process.exit(1); });
