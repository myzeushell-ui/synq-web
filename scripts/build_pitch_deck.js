const pptxgen = require('pptxgenjs');

const pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';
pres.title = 'Synq — Investor Pitch Deck';
pres.author = 'Synq';

// ── Palette (no # prefix) ──────────────────────────────────────────────────────
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
    fontSize: 26, fontFace: 'Calibri', bold: true,
    color: C.text, align: 'left', valign: 'middle', margin: 0
  });
  // Thin section divider
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.05, w: 9.0, h: 0.012,
    fill: { color: C.border }, line: { color: C.border, width: 0 }
  });
}

// ── SLIDE 1 · TITLE ───────────────────────────────────────────────────────────
{
  const s = darkSlide();

  // Glow circle behind logo
  s.addShape(pres.shapes.OVAL, {
    x: 3.75, y: 0.45, w: 2.5, h: 2.5,
    fill: { color: C.purple, transparency: 91 },
    line: { color: C.purple, width: 0.5, transparency: 70 }
  });

  // Waveform bars (soundwave)
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

  // Title
  s.addText('Synq', {
    x: 0, y: 2.82, w: 10, h: 0.9,
    fontSize: 72, fontFace: 'Calibri', bold: true,
    color: C.text, align: 'center', valign: 'middle'
  });

  // Accent line under title
  s.addShape(pres.shapes.RECTANGLE, {
    x: 4.35, y: 3.72, w: 1.3, h: 0.022,
    fill: { color: C.purple }, line: { color: C.purple, width: 0 }
  });

  // Tagline
  s.addText('The productivity app built for how people actually feel.', {
    x: 1.0, y: 3.85, w: 8.0, h: 0.45,
    fontSize: 16, fontFace: 'Calibri',
    color: C.muted, align: 'center'
  });

  // Footer info
  s.addText('synq-web.vercel.app  ·  a16z Speedrun SR007  ·  May 2026', {
    x: 0, y: 5.15, w: 10, h: 0.3,
    fontSize: 9.5, fontFace: 'Calibri',
    color: C.dim, align: 'center'
  });
}

// ── SLIDE 2 · THE PROBLEM ─────────────────────────────────────────────────────
{
  const s = darkSlide();
  addSlideLabel(s, 2);

  // Large headline
  s.addText('"Productivity apps assume\nyou\'re already okay."', {
    x: 0.5, y: 0.3, w: 9.0, h: 1.2,
    fontSize: 30, fontFace: 'Calibri', bold: true,
    color: C.text, align: 'left'
  });

  // 3 stat cards
  const stats = [
    { num: '85%', body: 'of knowledge workers feel overwhelmed regularly', x: 0.5 },
    { num: '→✕', body: 'Most open their task manager — then immediately close it', x: 3.45 },
    { num: '∞', body: 'The mental load compounds. Tasks get dropped. It gets worse.', x: 6.4 },
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
      fontSize: 11.5, fontFace: 'Calibri',
      color: C.muted
    });
  });

  // Callout box
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 3.9, w: 9.0, h: 0.88,
    fill: { color: C.purpleDim }, line: { color: C.purple, width: 0.7 }
  });
  s.addText(
    '"There is no app that meets you where you are emotionally AND gets things done."',
    {
      x: 0.7, y: 3.96, w: 8.6, h: 0.76,
      fontSize: 13, fontFace: 'Calibri', italic: true,
      color: C.text, align: 'center', valign: 'middle'
    }
  );
}

// ── SLIDE 3 · THE SOLUTION ────────────────────────────────────────────────────
{
  const s = darkSlide();
  addSlideLabel(s, 3);
  addHeader(s, 'Synq meets you where you are.');

  // Left column label
  s.addText('HOW IT WORKS', {
    x: 0.5, y: 1.15, w: 4.2, h: 0.28,
    fontSize: 8.5, fontFace: 'Calibri', bold: true,
    color: C.purple, charSpacing: 2
  });

  const steps = [
    { icon: '🎙', title: 'You speak your mind', desc: 'Tasks, feelings, reminders — all in one sentence. No form-filling.' },
    { icon: '🧠', title: 'Synq parses in <3 seconds', desc: 'AI NLP detects intent, extracts time references, identifies emotion.' },
    { icon: '✅', title: 'Everything lands automatically', desc: 'Right screen, right time, right format. Zero friction.' },
  ];
  steps.forEach((step, i) => {
    const y = 1.5 + i * 1.1;
    s.addShape(pres.shapes.OVAL, {
      x: 0.5, y: y + 0.06, w: 0.42, h: 0.42,
      fill: { color: C.purple, transparency: 80 },
      line: { color: C.purple, width: 0.5 }
    });
    s.addText(`${i + 1}`, {
      x: 0.5, y: y + 0.06, w: 0.42, h: 0.42,
      fontSize: 11, fontFace: 'Calibri', bold: true,
      color: C.purple, align: 'center', valign: 'middle', margin: 0
    });
    s.addText(step.title, {
      x: 1.08, y, w: 3.75, h: 0.35,
      fontSize: 13, fontFace: 'Calibri', bold: true,
      color: C.text, valign: 'middle', margin: 0
    });
    s.addText(step.desc, {
      x: 1.08, y: y + 0.33, w: 3.75, h: 0.55,
      fontSize: 11, fontFace: 'Calibri', color: C.muted
    });
  });

  // Vertical divider
  s.addShape(pres.shapes.LINE, {
    x: 5.05, y: 1.1, w: 0, h: 4.2,
    line: { color: C.border, width: 0.5 }
  });

  // Right column
  s.addText('EXAMPLE', {
    x: 5.3, y: 1.15, w: 4.2, h: 0.28,
    fontSize: 8.5, fontFace: 'Calibri', bold: true,
    color: C.purple, charSpacing: 2
  });

  // Input quote
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.3, y: 1.5, w: 4.2, h: 0.85,
    fill: { color: C.card }, line: { color: C.border, width: 0.5 }
  });
  s.addText('"I feel overwhelmed. Buy groceries, finish the report, call Mom today at 5pm."', {
    x: 5.45, y: 1.55, w: 3.9, h: 0.75,
    fontSize: 11, fontFace: 'Calibri', italic: true,
    color: C.muted, valign: 'middle'
  });

  // Arrow
  s.addText('↓', {
    x: 5.3, y: 2.4, w: 4.2, h: 0.32,
    fontSize: 15, color: C.purple, align: 'center', fontFace: 'Calibri'
  });

  // Output rows
  const outputs = [
    { label: 'Emotion: Overwhelmed (4/5)',  color: C.purple },
    { label: 'Task: Buy groceries',          color: C.green  },
    { label: 'Task: Finish report',          color: C.green  },
    { label: 'Reminder: Call Mom · 17:00',  color: C.blue   },
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
      fontSize: 11, fontFace: 'Calibri',
      color: C.text, valign: 'middle'
    });
  });
}

// ── SLIDE 4 · FEATURES ────────────────────────────────────────────────────────
{
  const s = darkSlide();
  addSlideLabel(s, 4);
  addHeader(s, 'Everything your brain needs. Nothing it doesn\'t.');

  const features = [
    { icon: '⚡', title: 'Voice Capture', desc: 'Russian & English NLP. Detects tasks, emotions, reminders in one sentence.' },
    { icon: '♡', title: 'Mood Tracking',  desc: '7-day mood chart with pattern recognition and intensity scoring.' },
    { icon: '🔔', title: 'Smart Reminders', desc: 'Time extracted from speech. Full calendar view. Nothing falls through.' },
    { icon: '🌬', title: 'Box Breathing', desc: '4-4-4-4 breathing exercise for overwhelm moments. One tap away.' },
    { icon: '💬', title: 'AI Companion',  desc: '"Talk to Synq" — judgment-free chat for when you need to process.' },
    { icon: '📱', title: 'Offline-First PWA', desc: 'Works without internet. Installs on any device. No app store.' },
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
      fill: { color: C.purple, transparency: 80 },
      line: { color: C.purple, width: 0.5 }
    });
    s.addText(f.icon, {
      x: x + 0.18, y: y + 0.3, w: 0.55, h: 0.55,
      fontSize: 15, align: 'center', valign: 'middle', margin: 0
    });
    s.addText(f.title, {
      x: x + 0.88, y: y + 0.12, w: 3.3, h: 0.35,
      fontSize: 13, fontFace: 'Calibri', bold: true,
      color: C.text, valign: 'middle', margin: 0
    });
    s.addText(f.desc, {
      x: x + 0.88, y: y + 0.47, w: 3.3, h: 0.62,
      fontSize: 10.5, fontFace: 'Calibri', color: C.muted
    });
  });
}

// ── SLIDE 5 · MARKET SIZE ─────────────────────────────────────────────────────
{
  const s = darkSlide();
  addSlideLabel(s, 5);
  addHeader(s, '$102B market. An $8.4B niche nobody has claimed.');

  // Left: 3 market rows
  const markets = [
    { tag: 'TAM', val: '$102B',  sub: 'Global productivity software — 14% CAGR', color: C.blue   },
    { tag: 'SAM', val: '$8.4B',  sub: 'Mental health + productivity intersection', color: C.purple },
    { tag: 'SOM', val: '$420M',  sub: 'Emotional productivity niche — 3-year target', color: C.green  },
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
      fontSize: 9, fontFace: 'Calibri', bold: true,
      color: m.color, margin: 0
    });
    s.addText(m.val, {
      x: 1.4, y: y + 0.04, w: 1.8, h: 0.42,
      fontSize: 26, fontFace: 'Calibri', bold: true,
      color: C.text, margin: 0
    });
    s.addText(m.sub, {
      x: 0.7, y: y + 0.52, w: 4.1, h: 0.32,
      fontSize: 10, fontFace: 'Calibri', color: C.muted
    });
  });

  // Right: concentric circles
  const cx = 7.3, cy = 3.0;
  s.addShape(pres.shapes.OVAL, {
    x: cx - 2.1, y: cy - 2.1, w: 4.2, h: 4.2,
    fill: { color: C.blue, transparency: 88 },
    line: { color: C.blue, width: 0.8 }
  });
  s.addShape(pres.shapes.OVAL, {
    x: cx - 1.45, y: cy - 1.45, w: 2.9, h: 2.9,
    fill: { color: C.purple, transparency: 83 },
    line: { color: C.purple, width: 0.8 }
  });
  s.addShape(pres.shapes.OVAL, {
    x: cx - 0.75, y: cy - 0.75, w: 1.5, h: 1.5,
    fill: { color: C.green, transparency: 72 },
    line: { color: C.green, width: 0.8 }
  });
  // Circle labels
  s.addText('TAM\n$102B', {
    x: cx + 0.95, y: cy - 2.1, w: 1.2, h: 0.55,
    fontSize: 9, fontFace: 'Calibri', bold: true, color: C.blue, align: 'left'
  });
  s.addText('SAM\n$8.4B', {
    x: cx + 0.4, y: cy - 1.45, w: 1.0, h: 0.55,
    fontSize: 9, fontFace: 'Calibri', bold: true, color: C.purple, align: 'left'
  });
  s.addText('$420M', {
    x: cx - 0.65, y: cy - 0.27, w: 1.3, h: 0.28,
    fontSize: 10, fontFace: 'Calibri', bold: true, color: C.green, align: 'center', margin: 0
  });
  s.addText('SOM', {
    x: cx - 0.65, y: cy + 0.01, w: 1.3, h: 0.25,
    fontSize: 9, fontFace: 'Calibri', color: C.green, align: 'center', margin: 0
  });

  // Footer note
  s.addText('Post-pandemic mental health awareness is permanent. ADHD diagnoses up 60% since 2020.', {
    x: 0.5, y: 5.0, w: 9.0, h: 0.38,
    fontSize: 9.5, fontFace: 'Calibri', italic: true,
    color: C.dim, align: 'center'
  });
}

// ── SLIDE 6 · WHY NOW ─────────────────────────────────────────────────────────
{
  const s = darkSlide();
  addSlideLabel(s, 6);
  addHeader(s, 'Three things converged. Right now.');

  const points = [
    {
      num: '01', icon: '🤖',
      title: 'LLMs made real-time NLP cost <$0.001 per capture',
      desc: 'Parsing voice into structured tasks + emotions + reminders costs almost nothing in 2026. This was impossible at scale three years ago.'
    },
    {
      num: '02', icon: '🎙',
      title: '67% of US adults use voice input weekly (up from 31% in 2021)',
      desc: 'Voice-first interaction has crossed the mainstream threshold. The behavior already exists — we just meet it with the right product.'
    },
    {
      num: '03', icon: '💜',
      title: 'Mental health destigmatization is permanent',
      desc: 'People actively seek tools that acknowledge their emotional state. Headspace at $2B valuation proved the willingness to pay.'
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
      fontSize: 22, fontFace: 'Calibri', bold: true,
      color: C.purple, valign: 'middle', margin: 0
    });
    s.addShape(pres.shapes.LINE, {
      x: 1.48, y: y + 0.14, w: 0, h: 0.76,
      line: { color: C.border, width: 0.5 }
    });
    s.addText(`${p.icon}  ${p.title}`, {
      x: 1.65, y: y + 0.08, w: 7.7, h: 0.36,
      fontSize: 13, fontFace: 'Calibri', bold: true,
      color: C.text, valign: 'middle', margin: 0
    });
    s.addText(p.desc, {
      x: 1.65, y: y + 0.44, w: 7.7, h: 0.52,
      fontSize: 10.5, fontFace: 'Calibri', color: C.muted
    });
  });

  // Callout
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 4.78, w: 9.0, h: 0.52,
    fill: { color: C.purpleDim }, line: { color: C.purple, width: 0.6 }
  });
  s.addText(
    '"Headspace proved it at $2B valuation. We\'re building the convergence product: voice-first, emotionally aware, AI-organized."',
    {
      x: 0.7, y: 4.8, w: 8.6, h: 0.48,
      fontSize: 10.5, fontFace: 'Calibri', italic: true,
      color: C.text, align: 'center', valign: 'middle'
    }
  );
}

// ── SLIDE 7 · MOAT ────────────────────────────────────────────────────────────
{
  const s = darkSlide();
  addSlideLabel(s, 7);
  addHeader(s, 'Our moat isn\'t features. It\'s philosophy.');

  const cols = [
    {
      icon: '🎨', label: 'Emotional UX', color: C.purple,
      body: 'Every design decision starts with "how does this make the user feel?" This cannot be copied by adding an emotion toggle — it requires fundamentally rethinking UX from scratch.'
    },
    {
      icon: '🎙', label: 'Voice NLP Engine', color: C.blue,
      body: 'Handles fragmented, anxious, run-on speech that standard parsers fail on entirely. "I feel bad but I need to... and also..." — our parser gets it. Custom grammar model.'
    },
    {
      icon: '📣', label: 'Trust Distribution', color: C.green,
      body: 'r/ADHD (1.7M members), therapist partner channels, ADHD coaches. Trust-based virality in communities actively seeking tools like this — no paid ads required.'
    },
  ];

  cols.forEach((c, i) => {
    const x = 0.5 + i * 3.1;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.18, w: 2.88, h: 3.95,
      fill: { color: C.card }, line: { color: C.border, width: 0.5 }
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.18, w: 2.88, h: 0.07,
      fill: { color: c.color }, line: { color: c.color, width: 0 }
    });
    s.addShape(pres.shapes.OVAL, {
      x: x + 1.04, y: 1.42, w: 0.78, h: 0.78,
      fill: { color: c.color, transparency: 82 },
      line: { color: c.color, width: 0.5 }
    });
    s.addText(c.icon, {
      x: x + 1.04, y: 1.42, w: 0.78, h: 0.78,
      fontSize: 20, align: 'center', valign: 'middle', margin: 0
    });
    s.addText(c.label, {
      x: x + 0.12, y: 2.28, w: 2.64, h: 0.4,
      fontSize: 14, fontFace: 'Calibri', bold: true,
      color: c.color, align: 'center'
    });
    s.addText(c.body, {
      x: x + 0.18, y: 2.74, w: 2.52, h: 2.22,
      fontSize: 11, fontFace: 'Calibri', color: C.muted
    });
  });
}

// ── SLIDE 8 · TRACTION ────────────────────────────────────────────────────────
{
  const s = darkSlide();
  addSlideLabel(s, 8);
  addHeader(s, 'Pre-seed. Fully functional. Built in weeks.');

  // Left: checklist
  s.addText("WHAT'S BUILT", {
    x: 0.5, y: 1.15, w: 4.2, h: 0.28,
    fontSize: 8.5, fontFace: 'Calibri', bold: true,
    color: C.purple, charSpacing: 2
  });

  const built = [
    'React/Next.js web app — live at synq-web.vercel.app',
    'Flutter mobile app (Android, tested on device)',
    'Voice capture + NLP parser (Russian + English)',
    'Mood tracking, reminders, breathing, AI chat',
    'Full Jest test suite (33 passing) + CI/CD pipeline',
  ];
  built.forEach((item, i) => {
    const y = 1.52 + i * 0.62;
    s.addShape(pres.shapes.OVAL, {
      x: 0.5, y: y + 0.05, w: 0.32, h: 0.32,
      fill: { color: C.green, transparency: 75 },
      line: { color: C.green, width: 0.5 }
    });
    s.addText('✓', {
      x: 0.5, y: y + 0.05, w: 0.32, h: 0.32,
      fontSize: 10, color: C.green,
      align: 'center', valign: 'middle', margin: 0, fontFace: 'Calibri'
    });
    s.addText(item, {
      x: 0.96, y, w: 3.8, h: 0.5,
      fontSize: 11.5, fontFace: 'Calibri',
      color: C.text, valign: 'middle'
    });
  });

  // Vertical divider
  s.addShape(pres.shapes.LINE, {
    x: 5.05, y: 1.1, w: 0, h: 4.2,
    line: { color: C.border, width: 0.5 }
  });

  // Right: quote
  s.addText('PROOF OF CONCEPT', {
    x: 5.3, y: 1.15, w: 4.2, h: 0.28,
    fontSize: 8.5, fontFace: 'Calibri', bold: true,
    color: C.purple, charSpacing: 2
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.3, y: 1.52, w: 4.2, h: 2.35,
    fill: { color: C.purpleDim }, line: { color: C.purple, width: 0.7 }
  });
  s.addText(
    '"Built solo using AI-native development — itself a demonstration of what\'s possible in 2026.\n\nWhat previously required a team of 5 engineers took one focused founder weeks to build end-to-end."',
    {
      x: 5.48, y: 1.62, w: 3.85, h: 2.15,
      fontSize: 12, fontFace: 'Calibri', italic: true,
      color: C.text, valign: 'middle'
    }
  );

  // Mini stat row
  const miniStats = [
    { val: '5', label: 'Screens' },
    { val: '33', label: 'Tests' },
    { val: '<3s', label: 'Capture' },
    { val: '2', label: 'Languages' },
  ];
  miniStats.forEach((st, i) => {
    const x = 5.3 + i * 1.05;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 4.05, w: 0.97, h: 0.85,
      fill: { color: C.card }, line: { color: C.border, width: 0.5 }
    });
    s.addText(st.val, {
      x, y: 4.1, w: 0.97, h: 0.4,
      fontSize: 18, fontFace: 'Calibri', bold: true,
      color: C.purple, align: 'center', margin: 0
    });
    s.addText(st.label, {
      x, y: 4.52, w: 0.97, h: 0.28,
      fontSize: 8.5, fontFace: 'Calibri',
      color: C.muted, align: 'center', margin: 0
    });
  });
}

// ── SLIDE 9 · TEAM ────────────────────────────────────────────────────────────
{
  const s = darkSlide();
  addSlideLabel(s, 9);
  addHeader(s, 'Solo founder. AI-amplified.');

  // Avatar
  s.addShape(pres.shapes.OVAL, {
    x: 0.65, y: 1.3, w: 1.6, h: 1.6,
    fill: { color: C.purple, transparency: 76 },
    line: { color: C.purple, width: 1.0 }
  });
  s.addText('👤', {
    x: 0.65, y: 1.3, w: 1.6, h: 1.6,
    fontSize: 36, align: 'center', valign: 'middle', margin: 0
  });

  // Name & role
  s.addText('[Your Name]', {
    x: 2.5, y: 1.3, w: 7.0, h: 0.5,
    fontSize: 24, fontFace: 'Calibri', bold: true,
    color: C.text, valign: 'middle', margin: 0
  });
  s.addText('Founder & CEO', {
    x: 2.5, y: 1.78, w: 4.0, h: 0.28,
    fontSize: 12, fontFace: 'Calibri', color: C.purple
  });

  // Bio box (placeholder)
  s.addShape(pres.shapes.RECTANGLE, {
    x: 2.5, y: 2.12, w: 7.0, h: 0.85,
    fill: { color: C.card }, line: { color: C.border, width: 0.5 }
  });
  s.addText('[Replace with: 2 sentences on technical background and relevant experience]', {
    x: 2.65, y: 2.17, w: 6.7, h: 0.75,
    fontSize: 11.5, fontFace: 'Calibri', italic: true,
    color: C.muted, valign: 'middle'
  });

  // Co-founder search
  s.addText('Looking for a technical co-founder through Speedrun\'s network', {
    x: 0.5, y: 3.2, w: 9.0, h: 0.3,
    fontSize: 11, fontFace: 'Calibri', bold: true,
    color: C.blue, align: 'center'
  });
  s.addText('Mobile / ML background · Voice AI pipeline ownership', {
    x: 0.5, y: 3.48, w: 9.0, h: 0.28,
    fontSize: 11, fontFace: 'Calibri',
    color: C.muted, align: 'center'
  });

  // Callout
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 4.02, w: 9.0, h: 0.92,
    fill: { color: C.purpleDim }, line: { color: C.purple, width: 0.7 }
  });
  s.addText(
    '"The tool stack of 2026 lets a single focused founder build what previously required a team of 5.\nSynq is the proof."',
    {
      x: 0.7, y: 4.08, w: 8.6, h: 0.82,
      fontSize: 13, fontFace: 'Calibri', italic: true,
      color: C.text, align: 'center', valign: 'middle'
    }
  );
}

// ── SLIDE 10 · THE ASK ────────────────────────────────────────────────────────
{
  const s = darkSlide();
  addSlideLabel(s, 10);
  addHeader(s, '$250K–$500K pre-seed. Here\'s what we need from Speedrun.');

  // Left: funding
  s.addText('FUNDING', {
    x: 0.5, y: 1.15, w: 4.2, h: 0.28,
    fontSize: 8.5, fontFace: 'Calibri', bold: true,
    color: C.green, charSpacing: 2
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.48, w: 4.2, h: 0.72,
    fill: { color: C.card }, line: { color: C.green, width: 0.7 }
  });
  s.addText('Raising $250K – $500K (SAFE)', {
    x: 0.65, y: 1.52, w: 3.9, h: 0.64,
    fontSize: 14, fontFace: 'Calibri', bold: true,
    color: C.green, valign: 'middle'
  });

  const funds = [
    { pct: '60%', label: 'Engineering',      desc: 'Voice AI pipeline, mobile polish', color: C.purple, w: 4.2 * 0.60 },
    { pct: '25%', label: 'User Acquisition', desc: 'ADHD communities, therapist channels', color: C.blue,   w: 4.2 * 0.25 },
    { pct: '15%', label: 'Operations',       desc: 'Infrastructure, legal, tools', color: C.green,  w: 4.2 * 0.15 },
  ];
  funds.forEach((f, i) => {
    const y = 2.35 + i * 0.82;
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y, w: 4.2, h: 0.72,
      fill: { color: C.card }, line: { color: C.border, width: 0.5 }
    });
    // Progress bar
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y: y + 0.66, w: f.w, h: 0.06,
      fill: { color: f.color }, line: { color: f.color, width: 0 }
    });
    s.addText(f.pct, {
      x: 0.65, y: y + 0.04, w: 0.72, h: 0.38,
      fontSize: 20, fontFace: 'Calibri', bold: true,
      color: f.color, margin: 0
    });
    s.addText(f.label, {
      x: 1.45, y: y + 0.06, w: 3.0, h: 0.28,
      fontSize: 12, fontFace: 'Calibri', bold: true,
      color: C.text, margin: 0
    });
    s.addText(f.desc, {
      x: 1.45, y: y + 0.34, w: 3.1, h: 0.26,
      fontSize: 10, fontFace: 'Calibri', color: C.muted
    });
  });

  // Vertical divider
  s.addShape(pres.shapes.LINE, {
    x: 5.05, y: 1.1, w: 0, h: 4.2,
    line: { color: C.border, width: 0.5 }
  });

  // Right: from Speedrun
  s.addText('FROM SPEEDRUN', {
    x: 5.3, y: 1.15, w: 4.2, h: 0.28,
    fontSize: 8.5, fontFace: 'Calibri', bold: true,
    color: C.purple, charSpacing: 2
  });

  const asks = [
    {
      num: '01', color: C.purple, title: 'GTM Validation',
      desc: 'Mental health positioning vs. productivity positioning — which horse to back first. a16z operators can stress-test this with real market data.'
    },
    {
      num: '02', color: C.blue, title: 'Distribution',
      desc: 'Consumer health apps, ADHD communities, App Store editorial. Your network compresses our user acquisition timeline by 6–12 months.'
    },
    {
      num: '03', color: C.green, title: 'The Co-Founder',
      desc: 'Technical co-founder with mobile/ML background to own the voice AI pipeline. Speedrun\'s founder network is the right place to find them.'
    },
  ];
  asks.forEach((a, i) => {
    const y = 1.48 + i * 1.08;
    s.addShape(pres.shapes.RECTANGLE, {
      x: 5.3, y, w: 4.2, h: 0.95,
      fill: { color: C.card }, line: { color: C.border, width: 0.5 }
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 5.3, y, w: 0.06, h: 0.95,
      fill: { color: a.color }, line: { color: a.color, width: 0 }
    });
    s.addText(a.num, {
      x: 5.45, y: y + 0.06, w: 0.45, h: 0.3,
      fontSize: 10.5, fontFace: 'Calibri', bold: true,
      color: a.color, margin: 0
    });
    s.addText(a.title, {
      x: 5.9, y: y + 0.05, w: 3.45, h: 0.3,
      fontSize: 13, fontFace: 'Calibri', bold: true,
      color: C.text, margin: 0
    });
    s.addText(a.desc, {
      x: 5.45, y: y + 0.4, w: 3.95, h: 0.5,
      fontSize: 10.5, fontFace: 'Calibri', color: C.muted
    });
  });

  // Bottom CTA bar
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 4.88, w: 9.0, h: 0.5,
    fill: { color: C.purple, transparency: 88 },
    line: { color: C.purple, width: 0.5 }
  });
  s.addText(
    'synq-web.vercel.app  ·  "The only productivity app that asks how you\'re feeling before it asks what you need to do."',
    {
      x: 0.7, y: 4.9, w: 8.6, h: 0.46,
      fontSize: 10, fontFace: 'Calibri', italic: true,
      color: C.text, align: 'center', valign: 'middle'
    }
  );
}

// ── WRITE ─────────────────────────────────────────────────────────────────────
pres
  .writeFile({ fileName: 'C:\\Users\\PC\\synq-web\\SYNQ_PITCH_DECK.pptx' })
  .then(() => console.log('✓ SYNQ_PITCH_DECK.pptx written'))
  .catch(err => { console.error(err); process.exit(1); });
