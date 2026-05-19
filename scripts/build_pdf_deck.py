"""
Synq — a16z Speedrun Pitch Deck PDF
Dark theme, 10 slides, 1920x1080 (16:9)
"""

from reportlab.lib.pagesizes import landscape
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.lib.units import inch
import os

# ── Dimensions ─────────────────────────────────────────────────────────────────
W, H = 1280, 720  # px at 96dpi equivalent
PAGE = (W, H)

# ── Brand Colors ───────────────────────────────────────────────────────────────
BG       = HexColor('#0A0A0D')
SURFACE  = HexColor('#141417')
SURF2    = HexColor('#1C1C21')
BORDER   = HexColor('#2C2C32')
PURPLE   = HexColor('#7B6EF6')
PURPLE2  = HexColor('#9B8EFF')
GREEN    = HexColor('#4ECBA0')
AMBER    = HexColor('#E8B84B')
RED      = HexColor('#E07B62')
WHITE    = HexColor('#EEECEA')
GRAY     = HexColor('#888680')
DARKGRAY = HexColor('#4A4850')

OUT = r"C:\Users\PC\Downloads\Synq_EN\SYNQ_PITCH_DECK_EN.pdf"

# ── Helpers ────────────────────────────────────────────────────────────────────

def new_page(c: canvas.Canvas):
    c.setFillColor(BG)
    c.rect(0, 0, W, H, fill=1, stroke=0)

def label(c, text, x, y, size=11, color=GRAY, bold=False, center=False):
    c.setFillColor(color)
    font = 'Helvetica-Bold' if bold else 'Helvetica'
    c.setFont(font, size)
    if center:
        c.drawCentredString(x, y, text)
    else:
        c.drawString(x, y, text)

def pill(c, x, y, w, h, bg, border=None):
    c.setFillColor(bg)
    if border:
        c.setStrokeColor(border)
        c.roundRect(x, y, w, h, 6, fill=1, stroke=1)
    else:
        c.roundRect(x, y, w, h, 6, fill=1, stroke=0)

def tag(c, text, x, y, bg, fg, size=9):
    tw = c.stringWidth(text, 'Helvetica-Bold', size)
    pad = 10
    pill(c, x, y - 4, tw + pad * 2, 20, bg)
    c.setFillColor(fg)
    c.setFont('Helvetica-Bold', size)
    c.drawString(x + pad, y + 1, text)

def slide_number(c, n, total=10):
    c.setFillColor(DARKGRAY)
    c.setFont('Helvetica', 9)
    c.drawRightString(W - 40, 24, f"{n} / {total}")

def divider(c, x, y, w):
    c.setStrokeColor(BORDER)
    c.setLineWidth(0.5)
    c.line(x, y, x + w, y)

def gradient_rect(c, x, y, w, h, color, alpha=0.12):
    c.setFillColor(color)
    c.setFillAlpha(alpha)
    c.roundRect(x, y, w, h, 16, fill=1, stroke=0)
    c.setFillAlpha(1.0)

# ── Slide 01 — Cover ───────────────────────────────────────────────────────────

def slide_01(c):
    new_page(c)

    # Glow blobs
    gradient_rect(c, -60, 300, 500, 400, PURPLE, 0.08)
    gradient_rect(c, 900, 100, 500, 400, HexColor('#9B6EF6'), 0.06)

    # Logo mark
    c.setFillColor(PURPLE)
    c.roundRect(W//2 - 32, H//2 + 60, 64, 64, 16, fill=1, stroke=0)
    c.setFillColor(WHITE)
    c.setFont('Helvetica-Bold', 28)
    c.drawCentredString(W//2, H//2 + 82, 'S')

    # Title
    c.setFillColor(WHITE)
    c.setFont('Helvetica-Bold', 64)
    c.drawCentredString(W//2, H//2 + 20, 'Synq')

    # Tagline
    c.setFillColor(GRAY)
    c.setFont('Helvetica', 18)
    c.drawCentredString(W//2, H//2 - 16, 'Feel it. Say it. Done.')

    divider(c, W//2 - 120, H//2 - 36, 240)

    # Sub tagline
    c.setFillColor(DARKGRAY)
    c.setFont('Helvetica', 13)
    c.drawCentredString(W//2, H//2 - 58, 'The AI productivity companion that meets you where you are — emotionally.')

    # Tags
    tag(c, 'a16z Speedrun SR007', W//2 - 110, 80, HexColor('#1E1A3A'), PURPLE2, 10)
    tag(c, 'Pre-Seed', W//2 + 20, 80, SURF2, GRAY, 10)

    slide_number(c, 1)
    c.showPage()

# ── Slide 02 — Problem ─────────────────────────────────────────────────────────

def slide_02(c):
    new_page(c)

    label(c, 'THE PROBLEM', 60, H - 60, 10, PURPLE, bold=True)
    label(c, 'Productivity apps assume you\'re already okay.', 60, H - 100, 32, WHITE, bold=True)
    label(c, 'They\'re wrong.', 60, H - 138, 32, PURPLE2, bold=True)

    divider(c, 60, H - 158, W - 120)

    stats = [
        ('85%', 'of knowledge workers report\nregular overwhelm at work'),
        ('60%', 'abandon productivity apps\nwithin 2 weeks'),
        ('$1T+', 'lost annually to reduced\nproductivity from mental load'),
    ]

    bw = (W - 160) // 3
    bx = 60
    for stat, desc in stats:
        pill(c, bx, 160, bw - 20, 300, SURFACE)
        c.setStrokeColor(BORDER)
        c.setLineWidth(0.5)
        c.roundRect(bx, 160, bw - 20, 300, 12, fill=0, stroke=1)

        c.setFillColor(PURPLE)
        c.setFont('Helvetica-Bold', 52)
        c.drawCentredString(bx + (bw - 20) // 2, 380, stat)

        lines = desc.split('\n')
        c.setFillColor(GRAY)
        c.setFont('Helvetica', 14)
        c.drawCentredString(bx + (bw - 20) // 2, 340, lines[0])
        if len(lines) > 1:
            c.drawCentredString(bx + (bw - 20) // 2, 320, lines[1])

        bx += bw + 10

    label(c, 'People avoid their tools exactly when they need them most — creating a vicious cycle of avoidance and overwhelm.',
          60, 130, 13, DARKGRAY)

    slide_number(c, 2)
    c.showPage()

# ── Slide 03 — Solution ────────────────────────────────────────────────────────

def slide_03(c):
    new_page(c)

    label(c, 'THE SOLUTION', 60, H - 60, 10, GREEN, bold=True)
    label(c, 'Synq — the judgment-free AI capture layer', 60, H - 100, 30, WHITE, bold=True)
    label(c, 'between your brain and your productivity system.', 60, H - 136, 30, PURPLE2, bold=True)

    divider(c, 60, H - 156, W - 120)

    # Demo flow
    steps = [
        ('🎙', 'You say it', '"Call Mom today at 5pm,\nfeel anxious, buy groceries"'),
        ('✦', 'AI parses it', 'Emotion → mood log\nTask → thought list\nTime → reminder 17:00'),
        ('✓', 'It\'s organized', 'Zero form-filling\nZero friction\nZero cognitive load'),
    ]

    sw = (W - 200) // 3
    sx = 70
    for icon, title, desc in steps:
        # Arrow connector (not for last)
        if sx > 70:
            c.setFillColor(BORDER)
            c.setFont('Helvetica', 20)
            c.drawString(sx - 38, 360, '→')

        pill(c, sx, 170, sw - 10, 280, SURFACE)
        c.setStrokeColor(BORDER)
        c.roundRect(sx, 170, sw - 10, 280, 12, fill=0, stroke=1)

        c.setFont('Helvetica', 28)
        c.drawCentredString(sx + (sw - 10) // 2, 400, icon)

        c.setFillColor(WHITE)
        c.setFont('Helvetica-Bold', 16)
        c.drawCentredString(sx + (sw - 10) // 2, 370, title)

        lines = desc.split('\n')
        c.setFillColor(GRAY)
        c.setFont('Helvetica', 12)
        for i, line in enumerate(lines):
            c.drawCentredString(sx + (sw - 10) // 2, 340 - i * 18, line)

        sx += sw + 20

    label(c, 'One sentence. Three categories. Instant organization.',
          60, 140, 14, DARKGRAY)

    slide_number(c, 3)
    c.showPage()

# ── Slide 04 — Product ─────────────────────────────────────────────────────────

def slide_04(c):
    new_page(c)

    label(c, 'PRODUCT', 60, H - 60, 10, PURPLE, bold=True)
    label(c, 'Everything you need. Nothing you don\'t.', 60, H - 100, 30, WHITE, bold=True)

    divider(c, 60, H - 120, W - 120)

    features = [
        ('🎙', 'Voice-first AI capture', 'One sentence captures tasks, emotions\nand reminders simultaneously'),
        ('♡', 'Emotion tracking', '7-day mood chart. Box breathing.\nYour mental patterns, visible.'),
        ('◷', 'Smart reminders', 'NLP time parsing — say "5pm" and it\nautomatically sets the alarm'),
        ('🧠', 'AI companion chat', 'Warm, judgment-free — responds in\nyour language (EN + RU)'),
        ('🔔', 'Browser notifications', 'Cross-reload persistence — reminders\nsurvive app restarts'),
        ('⚡', 'Offline-ready PWA', 'Installable. Works without internet.\nFull voice recognition built-in'),
    ]

    fw = (W - 160) // 3
    cols = 3
    fx, fy = 60, 490
    for i, (icon, title, desc) in enumerate(features):
        col = i % cols
        row = i // cols
        x = fx + col * (fw + 20)
        y = fy - row * 160

        pill(c, x, y - 100, fw, 120, SURFACE)
        c.setStrokeColor(BORDER)
        c.roundRect(x, y - 100, fw, 120, 10, fill=0, stroke=1)

        c.setFont('Helvetica', 20)
        c.drawString(x + 16, y - 20, icon)

        c.setFillColor(WHITE)
        c.setFont('Helvetica-Bold', 13)
        c.drawString(x + 16, y - 44, title)

        lines = desc.split('\n')
        c.setFillColor(GRAY)
        c.setFont('Helvetica', 11)
        for j, line in enumerate(lines):
            c.drawString(x + 16, y - 66 - j * 15, line)

    slide_number(c, 4)
    c.showPage()

# ── Slide 05 — Demo ────────────────────────────────────────────────────────────

def slide_05(c):
    new_page(c)

    label(c, 'LIVE DEMO', 60, H - 60, 10, GREEN, bold=True)
    label(c, 'See it in action.', 60, H - 100, 30, WHITE, bold=True)

    divider(c, 60, H - 120, W - 120)

    # Phone mockup (left)
    px, py, pw, ph = 80, 120, 220, 440
    c.setFillColor(SURF2)
    c.setStrokeColor(BORDER)
    c.roundRect(px, py, pw, ph, 24, fill=1, stroke=1)

    # Screen inside phone
    c.setFillColor(BG)
    c.roundRect(px + 8, py + 8, pw - 16, ph - 16, 18, fill=1, stroke=0)

    # Notch
    c.setFillColor(SURF2)
    c.roundRect(px + pw//2 - 30, py + ph - 20, 60, 14, 7, fill=1, stroke=0)

    # App UI sketch inside
    c.setFillColor(PURPLE)
    c.setFont('Helvetica-Bold', 14)
    c.drawCentredString(px + pw//2, py + ph - 50, 'Synq')

    c.setFillColor(DARKGRAY)
    c.setFont('Helvetica', 9)
    c.drawCentredString(px + pw//2, py + ph - 68, '● Online · emotional-safe')

    # Waveform bars
    import random
    random.seed(42)
    bar_x = px + 20
    for _ in range(20):
        bh2 = random.randint(10, 40)
        c.setFillColor(PURPLE)
        c.setFillAlpha(0.7)
        c.roundRect(bar_x, py + 320, 6, bh2, 3, fill=1, stroke=0)
        bar_x += 9
    c.setFillAlpha(1.0)

    c.setFillColor(GREEN)
    c.setFont('Helvetica-Bold', 9)
    c.drawCentredString(px + pw//2, py + 290, 'Listening...')

    # Emotion chip
    pill(c, px + 20, py + 250, pw - 40, 28, HexColor('#2A1510'))
    c.setFillColor(RED)
    c.setFont('Helvetica', 10)
    c.drawString(px + 30, py + 259, '♡ Anxious  ·  intensity 3/5')

    # Reminder chip
    pill(c, px + 20, py + 210, pw - 40, 28, HexColor('#2A2010'))
    c.setFillColor(AMBER)
    c.setFont('Helvetica', 10)
    c.drawString(px + 30, py + 219, '◷ Call Mom  ·  17:00')

    # Task chip
    pill(c, px + 20, py + 170, pw - 40, 28, HexColor('#1E1A3A'))
    c.setFillColor(PURPLE2)
    c.setFont('Helvetica', 10)
    c.drawString(px + 30, py + 179, '✦ Buy groceries')

    # Right side — links and highlights
    rx = 380

    label(c, 'Try it now:', rx, H - 145, 14, WHITE, bold=True)

    link_y = H - 185
    c.setFillColor(SURF2)
    c.setStrokeColor(PURPLE)
    c.roundRect(rx, link_y - 14, 320, 36, 8, fill=1, stroke=1)
    c.setFillColor(PURPLE2)
    c.setFont('Helvetica-Bold', 14)
    c.drawString(rx + 16, link_y + 4, '🇬🇧  synq-web.vercel.app')

    link_y -= 56
    c.setFillColor(SURF2)
    c.setStrokeColor(HexColor('#4ECBA0'))
    c.roundRect(rx, link_y - 14, 320, 36, 8, fill=1, stroke=1)
    c.setFillColor(GREEN)
    c.setFont('Helvetica-Bold', 14)
    c.drawString(rx + 16, link_y + 4, '🇷🇺  synq-web-ru.vercel.app')

    link_y -= 56
    c.setFillColor(SURF2)
    c.setStrokeColor(BORDER)
    c.roundRect(rx, link_y - 14, 320, 36, 8, fill=1, stroke=1)
    c.setFillColor(GRAY)
    c.setFont('Helvetica', 13)
    c.drawString(rx + 16, link_y + 4, '▶  Demo video: gofile.io/d/3GWKlm')

    label(c, 'What you\'ll see:', rx, 380, 14, WHITE, bold=True)
    highlights = [
        '✦  Say "call Mom at 5" — watch it parse to a reminder',
        '♡  Mention feeling anxious — watch emotion get logged',
        '🧠  Chat with AI companion — responses in your language',
        '🔔  Close and reopen — notifications still fire',
    ]
    hy = 350
    for h_text in highlights:
        c.setFillColor(GRAY)
        c.setFont('Helvetica', 12)
        c.drawString(rx, hy, h_text)
        hy -= 26

    slide_number(c, 5)
    c.showPage()

# ── Slide 06 — Market ──────────────────────────────────────────────────────────

def slide_06(c):
    new_page(c)

    label(c, 'MARKET', 60, H - 60, 10, AMBER, bold=True)
    label(c, '$102B productivity market.', 60, H - 100, 32, WHITE, bold=True)
    label(c, 'Zero products for emotionally overwhelmed users.', 60, H - 138, 22, GRAY)

    divider(c, 60, H - 158, W - 120)

    # Three concentric circles (simplified as nested rounded rects)
    cx, cy = 280, 340

    sizes = [
        (240, 200, HexColor('#1A1A3A'), BORDER, '$102B', 'TAM — Productivity Software', '14% CAGR', WHITE),
        (170, 140, HexColor('#1E1E3A'), PURPLE, '$8.4B', 'SAM — Mental Health + Productivity', '', PURPLE2),
        (100, 80, PURPLE, HexColor('#9B8EFF'), '$420M', 'SOM — Emotional Productivity', '3-yr target', WHITE),
    ]

    for w2, h2, bg, stroke, amount, desc, sub, fg in sizes:
        c.setFillColor(bg)
        c.setStrokeColor(stroke)
        c.setLineWidth(1)
        c.ellipse(cx - w2, cy - h2, cx + w2, cy + h2, fill=1, stroke=1)
        c.setFillColor(fg)
        c.setFont('Helvetica-Bold', 14)
        c.drawCentredString(cx, cy + 8, amount)
        if sub:
            c.setFont('Helvetica', 9)
            c.setFillColor(WHITE)
            c.drawCentredString(cx, cy - 8, sub)

    # Legend
    lx = 600
    ly = 500
    for _, _, bg, stroke, amount, desc, sub, _ in sizes:
        c.setFillColor(bg)
        c.setStrokeColor(stroke)
        c.roundRect(lx, ly - 6, 16, 16, 4, fill=1, stroke=1)
        c.setFillColor(WHITE)
        c.setFont('Helvetica-Bold', 13)
        c.drawString(lx + 26, ly + 4, amount)
        c.setFillColor(GRAY)
        c.setFont('Helvetica', 12)
        c.drawString(lx + 100, ly + 4, desc)
        ly -= 40

    # Timing box
    label(c, 'Why now:', 600, 300, 14, WHITE, bold=True)
    reasons = [
        '→  LLMs made voice parsing cost <$0.001/capture',
        '→  Voice input: 67% of adults use weekly (vs 31% in 2021)',
        '→  ADHD diagnoses up 60% since 2020',
        '→  Post-pandemic mental health destigmatization is permanent',
    ]
    ry = 270
    for r in reasons:
        c.setFillColor(GRAY)
        c.setFont('Helvetica', 12)
        c.drawString(600, ry, r)
        ry -= 22

    slide_number(c, 6)
    c.showPage()

# ── Slide 07 — Business Model ──────────────────────────────────────────────────

def slide_07(c):
    new_page(c)

    label(c, 'BUSINESS MODEL', 60, H - 60, 10, PURPLE, bold=True)
    label(c, 'Simple. Subscription. Scalable.', 60, H - 100, 32, WHITE, bold=True)

    divider(c, 60, H - 120, W - 120)

    tiers = [
        ('Free', '$0', 'Always free', ['Voice capture (5/day)', 'Mood tracking', 'Basic reminders', 'AI companion (limited)'], SURF2, GRAY, BORDER),
        ('Pro', '$9/mo', 'Most popular', ['Unlimited voice captures', 'Full AI parsing', 'Priority notifications', 'Advanced mood analytics', 'Export to Notion / Cal'], HexColor('#1E1A3A'), PURPLE2, PURPLE),
        ('Team', '$29/mo', 'Coming Q4 2026', ['Everything in Pro', 'Shared team check-ins', 'Manager mood dashboards', 'Slack / Teams integration', 'SSO + admin controls'], HexColor('#0A2820'), GREEN, GREEN),
    ]

    tw = (W - 160) // 3
    tx = 60
    for name, price, note, features, bg, fg, border in tiers:
        c.setFillColor(bg)
        c.setStrokeColor(border)
        c.setLineWidth(1.5 if name == 'Pro' else 0.5)
        c.roundRect(tx, 120, tw - 16, 450, 14, fill=1, stroke=1)

        if name == 'Pro':
            tag(c, '★ RECOMMENDED', tx + 20, 546, HexColor('#1E1A3A'), PURPLE, 8)

        c.setFillColor(fg)
        c.setFont('Helvetica-Bold', 22)
        c.drawString(tx + 20, 520, name)

        c.setFillColor(WHITE)
        c.setFont('Helvetica-Bold', 36)
        c.drawString(tx + 20, 474, price)

        c.setFillColor(DARKGRAY)
        c.setFont('Helvetica', 11)
        c.drawString(tx + 20, 456, note)

        c.setStrokeColor(border)
        c.setLineWidth(0.5)
        c.line(tx + 20, 444, tx + tw - 36, 444)

        fy2 = 420
        for feat in features:
            c.setFillColor(fg)
            c.setFont('Helvetica', 10)
            c.drawString(tx + 20, fy2, '✓  ' + feat)
            fy2 -= 22

        tx += tw + 8

    label(c, 'AI cost per user: ~$0.02/month at typical usage. 450x+ margin at $9/mo.',
          60, 95, 12, DARKGRAY)

    slide_number(c, 7)
    c.showPage()

# ── Slide 08 — Traction ────────────────────────────────────────────────────────

def slide_08(c):
    new_page(c)

    label(c, 'TRACTION', 60, H - 60, 10, GREEN, bold=True)
    label(c, 'Zero to deployed in record time.', 60, H - 100, 32, WHITE, bold=True)

    divider(c, 60, H - 120, W - 120)

    milestones = [
        (GREEN,  '✓', 'Week 0',   'Concept & research'),
        (GREEN,  '✓', 'Week 1',   'Full web app built (Next.js + React 19)'),
        (GREEN,  '✓', 'Week 2',   'AI voice parsing + Gemini integration'),
        (GREEN,  '✓', 'Week 2',   'Browser notifications + TTS voice picker'),
        (GREEN,  '✓', 'Week 2',   'Deployed to Vercel (EN + RU versions)'),
        (PURPLE, '→', 'Week 3',   'First 100 beta users'),
        (DARKGRAY,'○','Q3 2026',  'Mobile app (React Native)'),
        (DARKGRAY,'○','Q4 2026',  'Team product + integrations'),
    ]

    my = 530
    lx = 60
    for color, sym, when, what in milestones:
        c.setFillColor(color)
        c.setFont('Helvetica-Bold', 13)
        c.drawString(lx, my, sym)

        c.setFillColor(DARKGRAY)
        c.setFont('Helvetica', 11)
        c.drawString(lx + 24, my, when)

        c.setFillColor(WHITE if color != DARKGRAY else DARKGRAY)
        c.setFont('Helvetica', 12)
        c.drawString(lx + 130, my, what)

        if color == GREEN:
            tw2 = c.stringWidth(what, 'Helvetica', 12)
            if sym == '✓':
                c.setStrokeColor(GREEN)
                c.setLineWidth(0.5)
                c.line(lx + 130, my + 6, lx + 130 + tw2, my + 6)

        my -= 44

    # Stats on right
    stats2 = [
        (GREEN,   '2',      'weeks to\nfull MVP'),
        (PURPLE,  '100%',   'AI features\nworking'),
        (AMBER,   '2',      'live demo\nURLs'),
        (WHITE,   '$0',     'raised\n(bootstrapped)'),
    ]

    sx = 700
    sy = 540
    for col, val, desc in stats2:
        pill(c, sx, sy - 80, 220, 100, SURFACE)
        c.setStrokeColor(BORDER)
        c.roundRect(sx, sy - 80, 220, 100, 10, fill=0, stroke=1)
        c.setFillColor(col)
        c.setFont('Helvetica-Bold', 36)
        c.drawString(sx + 20, sy - 22, val)
        lines = desc.split('\n')
        c.setFillColor(GRAY)
        c.setFont('Helvetica', 12)
        for i, line in enumerate(lines):
            c.drawString(sx + 20, sy - 48 - i * 16, line)
        sx += 240
        if sx > 900:
            sx = 700
            sy -= 126

    slide_number(c, 8)
    c.showPage()

# ── Slide 09 — Team ────────────────────────────────────────────────────────────

def slide_09(c):
    new_page(c)

    label(c, 'TEAM', 60, H - 60, 10, PURPLE, bold=True)
    label(c, 'Founder-led. Moving fast.', 60, H - 100, 32, WHITE, bold=True)

    divider(c, 60, H - 120, W - 120)

    # Founder card
    c.setFillColor(SURFACE)
    c.setStrokeColor(PURPLE)
    c.setLineWidth(1)
    c.roundRect(60, 280, 500, 300, 16, fill=1, stroke=1)

    # Avatar circle
    c.setFillColor(HexColor('#1E1A3A'))
    c.circle(160, 460, 60, fill=1, stroke=0)
    c.setFillColor(PURPLE2)
    c.setFont('Helvetica-Bold', 32)
    c.drawCentredString(160, 452, '👤')

    c.setFillColor(WHITE)
    c.setFont('Helvetica-Bold', 20)
    c.drawString(240, 490, 'Founder & CEO')

    c.setFillColor(GRAY)
    c.setFont('Helvetica', 13)
    c.drawString(240, 468, 'Full-stack engineer & product designer')
    c.drawString(240, 448, 'Built Synq 0→1 in 2 weeks solo')

    c.setFillColor(DARKGRAY)
    c.setFont('Helvetica', 11)
    c.drawString(240, 420, 'Stack: Next.js · React 19 · Framer Motion')
    c.drawString(240, 402, 'AI: Gemini · Web Speech API · PWA')

    tag(c, 'Full-stack', 240, 368, HexColor('#1E1A3A'), PURPLE2, 9)
    tag(c, 'AI/ML', 330, 368, HexColor('#1E1A3A'), PURPLE2, 9)
    tag(c, 'Product', 395, 368, HexColor('#1E1A3A'), PURPLE2, 9)

    label(c, 'Actively seeking:', 60, 258, 13, WHITE, bold=True)
    roles = [
        ('Mobile engineer', 'React Native + voice AI pipeline'),
        ('Clinical advisor', 'Mental health / ADHD space credibility'),
        ('Growth advisor', 'Consumer health community distribution'),
    ]
    ry = 228
    for role, desc in roles:
        pill(c, 60, ry - 8, 560, 30, SURF2)
        c.setFillColor(PURPLE2)
        c.setFont('Helvetica-Bold', 11)
        c.drawString(76, ry + 4, role + ':')
        tw2 = c.stringWidth(role + ': ', 'Helvetica-Bold', 11)
        c.setFillColor(GRAY)
        c.setFont('Helvetica', 11)
        c.drawString(76 + tw2, ry + 4, desc)
        ry -= 40

    slide_number(c, 9)
    c.showPage()

# ── Slide 10 — Ask ─────────────────────────────────────────────────────────────

def slide_10(c):
    new_page(c)

    gradient_rect(c, W - 600, 200, 700, 500, PURPLE, 0.07)

    label(c, 'THE ASK', 60, H - 60, 10, PURPLE, bold=True)
    label(c, 'Join us at the start of something', 60, H - 100, 30, WHITE, bold=True)
    label(c, 'emotionally intelligent.', 60, H - 136, 30, PURPLE2, bold=True)

    divider(c, 60, H - 156, W - 120)

    # Funding box
    c.setFillColor(SURFACE)
    c.setStrokeColor(PURPLE)
    c.setLineWidth(1)
    c.roundRect(60, 360, 380, 240, 16, fill=1, stroke=1)

    label(c, 'Raising', 80, 572, 12, DARKGRAY, bold=True)
    label(c, '$250K–$500K', 80, 538, 32, WHITE, bold=True)
    label(c, 'Pre-seed SAFE', 80, 514, 13, PURPLE2)

    divider(c, 80, 504, 340)

    alloc = [
        ('60%', 'Engineering — voice AI, mobile app'),
        ('25%', 'User acquisition — community seeding'),
        ('15%', 'Operations & infrastructure'),
    ]
    ay = 484
    for pct, desc in alloc:
        c.setFillColor(PURPLE)
        c.setFont('Helvetica-Bold', 12)
        c.drawString(80, ay, pct)
        c.setFillColor(GRAY)
        c.setFont('Helvetica', 12)
        c.drawString(130, ay, desc)
        ay -= 24

    # Speedrun box
    c.setFillColor(HexColor('#0A2820'))
    c.setStrokeColor(GREEN)
    c.setLineWidth(1)
    c.roundRect(480, 360, 380, 240, 16, fill=1, stroke=1)

    label(c, 'Why a16z Speedrun', 500, 572, 12, GREEN, bold=True)
    label(c, '$500K SAFE +', 500, 538, 24, WHITE, bold=True)
    label(c, '$500K follow-on', 500, 510, 24, WHITE, bold=True)

    divider(c, 500, 500, 340)

    reasons = [
        'GTM validation in consumer health',
        'Co-founder network (mobile + ML)',
        'a16z community distribution',
        'Demo Day → seed round path',
    ]
    ry2 = 480
    for r in reasons:
        c.setFillColor(GREEN)
        c.setFont('Helvetica', 10)
        c.drawString(500, ry2, '✓  ' + r)
        ry2 -= 22

    # Bottom CTA
    label(c, 'Try the live demo:', 60, 300, 13, WHITE, bold=True)

    c.setFillColor(SURF2)
    c.setStrokeColor(PURPLE)
    c.roundRect(60, 256, 300, 36, 8, fill=1, stroke=1)
    c.setFillColor(PURPLE2)
    c.setFont('Helvetica-Bold', 14)
    c.drawString(76, 268, '🇬🇧  synq-web.vercel.app')

    c.setFillColor(SURF2)
    c.setStrokeColor(GREEN)
    c.roundRect(380, 256, 300, 36, 8, fill=1, stroke=1)
    c.setFillColor(GREEN)
    c.setFont('Helvetica-Bold', 14)
    c.drawString(396, 268, '🇷🇺  synq-web-ru.vercel.app')

    label(c, 'contact:', 60, 220, 12, DARKGRAY)
    label(c, 'synq-web.vercel.app  ·  sr-team@a16z.com', 110, 220, 12, GRAY)

    label(c, 'synq', W - 100, 40, 28, HexColor('#2C2C32'), bold=True)
    slide_number(c, 10)
    c.showPage()

# ── Build ──────────────────────────────────────────────────────────────────────

def build():
    c = canvas.Canvas(OUT, pagesize=PAGE)
    c.setTitle("Synq — a16z Speedrun Pitch Deck")
    c.setAuthor("Synq")
    c.setSubject("Pre-seed pitch deck for a16z Speedrun SR007")

    slide_01(c)
    slide_02(c)
    slide_03(c)
    slide_04(c)
    slide_05(c)
    slide_06(c)
    slide_07(c)
    slide_08(c)
    slide_09(c)
    slide_10(c)

    c.save()
    size = os.path.getsize(OUT) / 1024
    print(f"OK — {OUT}")
    print(f"Size: {size:.0f} KB, 10 slides, 1280x720px")

if __name__ == '__main__':
    build()
