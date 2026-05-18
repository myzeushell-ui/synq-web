'use client';

const VOICE_KEY = 'synq_tts_voice';
const MUTED_KEY = 'synq_tts_muted';

// ─── Voice list ───────────────────────────────────────────────────────────────

export function getVoices(): SpeechSynthesisVoice[] {
  if (typeof speechSynthesis === 'undefined') return [];
  return speechSynthesis.getVoices();
}

/** Returns voices filtered to a given language prefix, preferring remote/natural ones */
export function getVoicesForLang(langPrefix: string): SpeechSynthesisVoice[] {
  return getVoices()
    .filter((v) => v.lang.startsWith(langPrefix))
    .sort((a, b) => {
      // Prefer "natural" or "neural" (non-local) voices
      const aScore = a.localService ? 0 : 1;
      const bScore = b.localService ? 0 : 1;
      return bScore - aScore;
    });
}

export function getSavedVoiceName(): string {
  return typeof localStorage !== 'undefined' ? (localStorage.getItem(VOICE_KEY) ?? '') : '';
}

export function saveVoiceName(name: string): void {
  localStorage.setItem(VOICE_KEY, name);
}

export function isMuted(): boolean {
  return typeof localStorage !== 'undefined' ? localStorage.getItem(MUTED_KEY) === 'true' : false;
}

export function setMuted(val: boolean): void {
  localStorage.setItem(MUTED_KEY, String(val));
}

// ─── Speak ────────────────────────────────────────────────────────────────────

let pending: SpeechSynthesisUtterance | null = null;

export function speak(text: string, onEnd?: () => void): void {
  if (typeof speechSynthesis === 'undefined') return;
  if (isMuted()) return;

  stop();

  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 0.93;
  utter.pitch = 1.05;
  utter.volume = 0.95;

  const savedName = getSavedVoiceName();
  const applyVoice = () => {
    if (savedName) {
      const voice = getVoices().find((v) => v.name === savedName);
      if (voice) utter.voice = voice;
    }
  };

  // Voices may not be loaded yet on first call
  if (getVoices().length > 0) {
    applyVoice();
    if (onEnd) utter.onend = onEnd;
    pending = utter;
    speechSynthesis.speak(utter);
  } else {
    speechSynthesis.onvoiceschanged = () => {
      applyVoice();
      if (onEnd) utter.onend = onEnd;
      pending = utter;
      speechSynthesis.speak(utter);
      speechSynthesis.onvoiceschanged = null;
    };
  }
}

export function stop(): void {
  if (typeof speechSynthesis !== 'undefined') speechSynthesis.cancel();
  pending = null;
}

export function isSpeaking(): boolean {
  return typeof speechSynthesis !== 'undefined' && speechSynthesis.speaking;
}
