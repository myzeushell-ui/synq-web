/**
 * Voice transcript parser.
 * Extracts structured thoughts, reminders, and emotions from a raw voice transcript.
 * Supports Russian and English.
 */

import type { Category, TaskState, Priority, MoodTag, Thought, Reminder, Emotion } from '@/types';

// ─── Output types ────────────────────────────────────────────────────────────

export interface ParseResult {
  thoughts: Thought[];
  reminders: Reminder[];
  emotions: Emotion[];
}

// ─── Constants ───────────────────────────────────────────────────────────────

/** Russian verbal numbers → digit */
const VERBAL_NUMS_RU: Record<string, number> = {
  один: 1,
  одного: 1,
  два: 2,
  двух: 2,
  двое: 2,
  три: 3,
  трёх: 3,
  трое: 3,
  четыре: 4,
  четырёх: 4,
  пять: 5,
  пяти: 5,
  шесть: 6,
  шести: 6,
  семь: 7,
  семи: 7,
  восемь: 8,
  восьми: 8,
  девять: 9,
  девяти: 9,
  десять: 10,
  десяти: 10,
  одиннадцать: 11,
  одиннадцати: 11,
  двенадцать: 12,
  двенадцати: 12,
};

/** English verbal numbers */
const VERBAL_NUMS_EN: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
};

/** Emotion keyword → MoodTag + intensity */
const EMOTION_MAP: Array<{ keywords: string[]; mood: MoodTag; intensity: number }> = [
  {
    keywords: ['плохо', 'нехорошо', 'bad', 'terrible', 'awful', 'horrible'],
    mood: 'sad',
    intensity: 3,
  },
  {
    keywords: ['устал', 'усталость', 'уставший', 'tired', 'exhausted', 'fatigue', 'drained'],
    mood: 'tired',
    intensity: 3,
  },
  {
    keywords: [
      'тревожно',
      'тревога',
      'беспокоюсь',
      'тревожусь',
      'anxious',
      'worried',
      'nervous',
      'anxious',
      'anxiety',
    ],
    mood: 'anxious',
    intensity: 4,
  },
  {
    keywords: ['грустно', 'грусть', 'грустный', 'sad', 'unhappy', 'down', 'blue'],
    mood: 'sad',
    intensity: 2,
  },
  {
    keywords: [
      'злюсь',
      'злость',
      'злой',
      'раздражён',
      'раздражен',
      'angry',
      'frustrated',
      'irritated',
      'mad',
    ],
    mood: 'overwhelmed',
    intensity: 4,
  },
  {
    keywords: ['перегружен', 'перегружена', 'overwhelmed', 'слишком много', 'too much'],
    mood: 'overwhelmed',
    intensity: 5,
  },
  {
    keywords: [
      'счастлив',
      'счастливый',
      'радостно',
      'радость',
      'happy',
      'joyful',
      'great',
      'wonderful',
      'amazing',
    ],
    mood: 'energized',
    intensity: 4,
  },
  {
    keywords: ['благодарен', 'благодарна', 'благодарность', 'grateful', 'thankful', 'appreciative'],
    mood: 'grateful',
    intensity: 3,
  },
  {
    keywords: [
      'спокойно',
      'спокойный',
      'спокоен',
      'расслаблен',
      'calm',
      'peaceful',
      'relaxed',
      'serene',
    ],
    mood: 'calm',
    intensity: 2,
  },
  {
    keywords: ['энергично', 'бодро', 'бодрый', 'energized', 'energetic', 'pumped', 'alive'],
    mood: 'energized',
    intensity: 4,
  },
  {
    keywords: ['нормально', 'окей', 'ничего', 'okay', 'fine', 'alright', 'normal', 'neutral'],
    mood: 'neutral',
    intensity: 2,
  },
];

/** Phrases that indicate an emotion statement */
const EMOTION_TRIGGERS_RU = [
  'чувствую',
  'чувствую себя',
  'себя чувствую',
  'настроение',
  'на душе',
  'ощущаю',
];
const EMOTION_TRIGGERS_EN = ['feel', 'feeling', 'mood', 'emotion', 'emotionally'];

/** Filler words to strip from the beginning */
const FILLERS =
  /^(блин|ну|вот|знаешь|слушай|в общем|итак|так|окей|ладно|хм|эм|well|okay|so|um|uh|hey|right|like)[,\s]*/i;

/** Task action prefixes to strip (clean up captured text) */
const TASK_PREFIXES_RU = /^(мне\s+)?(нужно|надо|следует|необходимо|требуется)\s+/i;
const TASK_PREFIXES_EN = /^(I\s+)?(need\s+to|have\s+to|must|should|got\s+to|gotta)\s+/i;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function uid() {
  return `voice-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function normalize(s: string) {
  return s.toLowerCase().replace(/\s+/g, ' ').trim();
}

/** Strip task prefixes, filler words, personal pronouns */
function cleanTaskText(clause: string): string {
  return clause
    .replace(FILLERS, '')
    .replace(TASK_PREFIXES_RU, '')
    .replace(TASK_PREFIXES_EN, '')
    .replace(/^(я\s+)/i, '')
    .replace(/^(me\s+|I\s+)/i, '')
    .trim();
}

/** Strip everything except the emotional content */
function cleanEmotionText(clause: string): string {
  return clause
    .replace(FILLERS, '')
    .replace(/^(я|I)\s+/i, '')
    .trim();
}

/** Guess category from clause text */
function guessCategory(text: string): Category {
  const l = normalize(text);
  if (/чувству|устал|тревожн|грустн|злюсь|feel|mood|emotion|anxious|tired|sad/.test(l))
    return 'emotion';
  if (/идея|idea|что если|what if|может быть|maybe|imagine|придумал/.test(l)) return 'idea';
  if (
    /нужно|надо|купить|сходить|позвонить|написать|сделать|прочитать|забрать|need|buy|call|write|read|pick|finish|send|book|pay|fix/.test(
      l
    )
  )
    return 'task';
  return 'note';
}

/** Detect priority from text */
function detectPriority(text: string): Priority {
  const l = normalize(text);
  if (/срочно|важно|критично|urgent|important|critical|asap|deadline|quickly/.test(l))
    return 'high';
  return 'normal';
}

// ─── Time parsing ─────────────────────────────────────────────────────────────

/**
 * Extract a specific time reference from a text clause.
 * Returns an ISO datetime string or null if no time reference found.
 */
export function parseTimeFromClause(text: string): string | null {
  const lower = normalize(text);
  const now = new Date();

  let hour = -1;
  let minute = 0;
  let dayOffset = 0;

  // Day references
  if (/завтра|tomorrow/.test(lower)) dayOffset = 1;
  else if (/послезавтра|day after tomorrow/.test(lower)) dayOffset = 2;
  // "сегодня" / "today" = 0 (default)

  // AM/PM indicators
  const isAM = /\bутра\b|\bутром\b|\bam\b|\bmorning\b/.test(lower);
  const isPM = /\bвечера\b|\bвечером\b|\bночи\b|\bночью\b|\bpm\b|\bevening\b|\bnight\b/.test(lower);
  const isAfternoon = /\bдня\b|\bднём\b|\bдня\b|\bafternoon\b/.test(lower);

  // Try digit-based patterns first:
  // Russian: "в 5", "в 17:30", "в 5:30"
  // English: "at 5", "at 5:30", "at 5pm", "at 5 pm"
  const digitMatch =
    lower.match(/(?:в|at)\s+(\d{1,2})(?:[:.:](\d{2}))?\s*(?:pm|am|ч(?:ас(?:ов|а)?)?)?/i) ||
    lower.match(/(\d{1,2}):(\d{2})/);

  if (digitMatch) {
    hour = parseInt(digitMatch[1]);
    minute = digitMatch[2] ? parseInt(digitMatch[2]) : 0;
  } else {
    // Try Russian verbal numbers: "в пять часов", "в девять утра"
    for (const [word, num] of Object.entries(VERBAL_NUMS_RU)) {
      if (
        lower.includes(` ${word} `) ||
        lower.includes(` ${word},`) ||
        lower.endsWith(` ${word}`)
      ) {
        const context = lower.indexOf(word);
        const before = lower.slice(Math.max(0, context - 4), context);
        if (/\bв\s*$/.test(before)) {
          hour = num;
          break;
        }
      }
    }
    // Try English verbal numbers: "at five", "at nine"
    if (hour === -1) {
      for (const [word, num] of Object.entries(VERBAL_NUMS_EN)) {
        const pattern = new RegExp(`\\bat ${word}\\b`);
        if (pattern.test(lower)) {
          hour = num;
          break;
        }
      }
    }
  }

  if (hour === -1) return null;

  // Smart 12/24h resolution
  if (hour <= 12) {
    if (isAM) {
      if (hour === 12) hour = 0; // 12am = midnight
    } else if (isPM || isAfternoon) {
      if (hour !== 12) hour += 12;
    } else {
      // No indicator: 1–6 → assume PM (afternoon/evening); 7–11 → AM; 12 → noon
      if (hour >= 1 && hour <= 6) hour += 12;
    }
  }

  const result = new Date(now);
  result.setDate(result.getDate() + dayOffset);
  result.setHours(hour, minute, 0, 0);

  // If computed time is in the past and day wasn't specified, push to tomorrow
  if (dayOffset === 0 && result.getTime() < now.getTime()) {
    result.setDate(result.getDate() + 1);
  }

  return result.toISOString();
}

/**
 * Remove the time expression from a clause to get the clean action text.
 * e.g. "позвонить маме сегодня в 5 часов" → "позвонить маме"
 */
function removeTimePhrase(text: string): string {
  return (
    text
      // Russian day+time: "сегодня в X часов", "завтра в X"
      .replace(
        /\s*(?:сегодня|завтра|послезавтра)?\s*в\s+\d{1,2}(?:[:.]\d{2})?\s*(?:час(?:ов|а)?|утра|утром|дня|вечера|вечером|ночи|ночью)?\s*/gi,
        ' '
      )
      // Verbal: "в пять часов", "в девять вечера"
      .replace(
        new RegExp(
          `\\s*в\\s+(${Object.keys(VERBAL_NUMS_RU).join('|')})\\s*(?:час(?:ов|а)?|утра|вечера|дня)?\\s*`,
          'gi'
        ),
        ' '
      )
      // English: "today at 5pm", "at 5:30", "tomorrow at 9am"
      .replace(/\s*(?:today|tomorrow|tonight)?\s*at\s+\d{1,2}(?::\d{2})?\s*(?:am|pm)?\s*/gi, ' ')
      // Verbal English
      .replace(
        new RegExp(
          `\\s*at\\s+(${Object.keys(VERBAL_NUMS_EN).join('|')})\\s*(?:am|pm|o'clock)?\\s*`,
          'gi'
        ),
        ' '
      )
      // Day words alone: "сегодня", "завтра", "today", "tomorrow"
      .replace(/\s*(?:сегодня|завтра|послезавтра|today|tomorrow|tonight)\s*/gi, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim()
  );
}

// ─── Emotion detection ────────────────────────────────────────────────────────

function detectMood(clause: string): { mood: MoodTag; intensity: number } | null {
  const lower = normalize(clause);

  // Must contain an emotion trigger phrase
  const hasEmotionTrigger = [...EMOTION_TRIGGERS_RU, ...EMOTION_TRIGGERS_EN].some((t) =>
    lower.includes(t)
  );

  if (!hasEmotionTrigger) return null;

  for (const entry of EMOTION_MAP) {
    if (entry.keywords.some((k) => lower.includes(k))) {
      return { mood: entry.mood, intensity: entry.intensity };
    }
  }

  // Generic "feel" without specific mood → neutral
  return { mood: 'neutral', intensity: 2 };
}

// ─── Clause splitting ─────────────────────────────────────────────────────────

/**
 * Split transcript into individual clause candidates.
 */
function splitIntoClauses(text: string): string[] {
  // Normalize the text first
  const t = text
    .replace(FILLERS, '')
    .replace(/[.!?]+/g, ',') // treat sentence ends as clause boundaries
    .trim();

  // Split on common Russian and English list/clause separators
  const clauses: string[] = t
    .split(
      /,\s*(?:но\s+)?(?:мне\s+|я\s+)?(?:нужно|надо|также\s+нужно|ещё\s+нужно|ещё\s+надо|and\s+I\s+need\s+to|also\s+need\s+to|I\s+also\s+need\s+to)\s+/i
    )
    .flatMap((s) =>
      s.split(/,\s*(?:а\s+также|а\s+ещё|но\s+также|also|additionally|furthermore)\s+/i)
    )
    .flatMap((s) =>
      // Split on " и " or " and " before action verbs (infinitives)
      s.split(
        /\s+(?:и|and)\s+(?=(?:позвонить|сходить|купить|написать|сделать|прочитать|забрать|составить|отправить|оплатить|починить|call|buy|go|make|write|read|pick|finish|send|book|pay|fix|get|check|review|update|schedule)\b)/i
      )
    )
    .flatMap((s) => s.split(/[,;]\s+/))
    .map((s) => s.trim())
    .filter((s) => s.length > 3);

  return clauses;
}

// ─── Main export ──────────────────────────────────────────────────────────────

/**
 * Parse a raw voice transcript into structured data:
 * thoughts (tasks/ideas/notes), reminders (with datetimes), and emotions.
 */
export function parseVoiceTranscript(rawText: string): ParseResult {
  const result: ParseResult = { thoughts: [], reminders: [], emotions: [] };
  const now = new Date().toISOString();

  const clauses = splitIntoClauses(rawText);
  const usedAsTitles = new Set<string>(); // de-dupe reminders vs tasks

  // ── Pass 1: find all reminder-clauses (clause has a time reference) ──
  for (const clause of clauses) {
    const dueAt = parseTimeFromClause(clause);
    if (!dueAt) continue;

    const rawTitle = removeTimePhrase(cleanTaskText(clause));
    const title = capitalize(rawTitle.replace(FILLERS, '').trim());
    if (title.length < 4) continue;

    result.reminders.push({
      id: uid(),
      title,
      dueAt,
      category: guessCategory(clause),
      done: false,
      repeat: 'none',
    });
    usedAsTitles.add(normalize(title));
  }

  // ── Pass 2: emotions and plain tasks ──
  for (const clause of clauses) {
    // Skip if already became a reminder
    if (parseTimeFromClause(clause)) continue;

    // Detect emotion
    const mood = detectMood(clause);
    if (mood) {
      const note = capitalize(cleanEmotionText(clause));
      result.emotions.push({
        id: uid(),
        mood: mood.mood,
        note: note.length > 3 ? note : undefined,
        intensity: mood.intensity,
        loggedAt: now,
      });
      continue;
    }

    // Plain task / note / idea
    const rawText2 = cleanTaskText(clause);
    const text = capitalize(rawText2.replace(FILLERS, '').trim());
    if (text.length < 4) continue;

    // Skip if this text is already captured as a reminder title
    if (usedAsTitles.has(normalize(text))) continue;

    // Skip duplicate thoughts
    const already = result.thoughts.some((t) => normalize(t.text) === normalize(text));
    if (already) continue;

    result.thoughts.push({
      id: uid(),
      text,
      category: guessCategory(clause),
      state: 'active' as TaskState,
      priority: detectPriority(clause),
      createdAt: now,
    });
  }

  return result;
}
