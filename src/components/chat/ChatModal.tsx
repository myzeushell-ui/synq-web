'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  speak,
  stop,
  getVoicesForLang,
  getSavedVoiceName,
  saveVoiceName,
  isMuted,
  setMuted,
} from '@/lib/tts';

interface Message {
  id: string;
  role: 'user' | 'synq';
  text: string;
  ts: number;
}

// Fallback responses when no API key
const FALLBACKS: Record<string, string> = {
  default: "I'm here with you. Tell me what's on your mind — no judgement, just space to think.",
  anxious:
    "That sounds really heavy. When you feel anxious, your mind is trying to protect you. What's the one thing worrying you most right now?",
  overwhelmed:
    "Totally understandable. Let's not tackle everything at once. What's one tiny thing you could set down for now?",
  tired:
    'Rest is productive too. Is there something specific draining your energy, or does it feel more general?',
  stuck:
    "Being stuck is a signal, not a failure. What would 'unstuck' look like for you, even just a little bit?",
  stressed: 'I hear you. Stress often means something matters to you. What matters most right now?',
};

function fallbackPick(input: string): string {
  const l = input.toLowerCase();
  if (l.includes('anxious') || l.includes('тревог')) return FALLBACKS.anxious;
  if (l.includes('overwhelm') || l.includes('перегруз') || l.includes('слишком много'))
    return FALLBACKS.overwhelmed;
  if (l.includes('tired') || l.includes('устал') || l.includes('exhaust')) return FALLBACKS.tired;
  if (l.includes('stuck') || l.includes('застр') || l.includes('block')) return FALLBACKS.stuck;
  if (l.includes('stress') || l.includes('стресс') || l.includes('давлени'))
    return FALLBACKS.stressed;
  return FALLBACKS.default;
}

const QUICK_PROMPTS = ["I'm feeling anxious today", "I'm overwhelmed", "I feel stuck", "I don't know where to start"];

interface Props {
  onClose: () => void;
}

export function ChatModal({ onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: 'intro',
      role: 'synq',
      text: "Hey 👋 I'm Synq. What's going on for you right now?",
      ts: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [muted, setMutedState] = useState(false);
  const [showVoicePicker, setShowVoicePicker] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [aiEnabled, setAiEnabled] = useState(false);
  const historyRef = useRef<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Load TTS state + voices
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMutedState(isMuted());

    setSelectedVoice(getSavedVoiceName());

    const loadVoices = () => {
      const all = [...getVoicesForLang('en'), ...getVoicesForLang('ru')];
      setVoices(all);
    };
    loadVoices();
    if (typeof speechSynthesis !== 'undefined') {
      speechSynthesis.onvoiceschanged = loadVoices;
    }

    // Check AI availability
    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'ping', history: [] }),
    })
      .then((r) => r.json())
      .then((d) => setAiEnabled(!d.fallback))
      .catch(() => setAiEnabled(false));

    return () => {
      stop();
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const handleVoiceSelect = useCallback((name: string) => {
    setSelectedVoice(name);
    saveVoiceName(name);
    setShowVoicePicker(false);
    // Preview the voice
    speak("Hi, I'm your Synq companion.", undefined);
  }, []);

  const toggleMute = useCallback(() => {
    const next = !muted;
    setMutedState(next);
    setMuted(next);
    if (next) stop();
  }, [muted]);

  const addSynqMessage = useCallback((text: string) => {
    const msg: Message = { id: crypto.randomUUID(), role: 'synq', text, ts: Date.now() };
    setMessages((p) => [...p, msg]);
    speak(text);
    historyRef.current.push({ role: 'assistant', content: text });
  }, []);

  const send = useCallback(
    async (text: string) => {
      if (!text.trim() || typing) return;

      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        text: text.trim(),
        ts: Date.now(),
      };
      setMessages((p) => [...p, userMsg]);
      historyRef.current.push({ role: 'user', content: text.trim() });
      setInput('');
      setTyping(true);

      if (aiEnabled) {
        try {
          const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text.trim(), history: historyRef.current.slice(-10) }),
          });
          const data = await res.json();

          setTyping(false);
          if (data.text) {
            addSynqMessage(data.text);
          } else {
            addSynqMessage(fallbackPick(text));
          }
        } catch {
          setTyping(false);
          addSynqMessage(fallbackPick(text));
        }
      } else {
        // Fallback with realistic typing delay
        const delay = 900 + Math.random() * 600;
        setTimeout(() => {
          setTyping(false);
          addSynqMessage(fallbackPick(text));
        }, delay);
      }
    },
    [typing, aiEnabled, addSynqMessage]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex flex-col"
      style={{ background: 'rgba(10,10,13,0.95)', backdropFilter: 'blur(12px)' }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 shrink-0"
        style={{ borderBottom: '0.5px solid #2C2C32' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-base"
            style={{ background: 'linear-gradient(135deg, #7B6EF6, #9B8EFF)' }}
          >
            🧠
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-semibold" style={{ color: '#EEECEA' }}>
                Synq AI
              </p>
              {aiEnabled && (
                <span
                  className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
                  style={{ background: '#0A2820', color: '#4ECBA0', border: '1px solid #4ECBA033' }}
                >
                  Gemini
                </span>
              )}
            </div>
            <p className="text-[10px]" style={{ color: '#4ECBA0' }}>
              ● Online · emotional-safe
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Voice picker toggle */}
          <button
            onClick={() => setShowVoicePicker((v) => !v)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
            style={{ background: showVoicePicker ? '#1E1A3A' : '#1C1C21', color: '#7B6EF6' }}
            title="Voice settings"
          >
            🔊
          </button>
          {/* Mute */}
          <button
            onClick={toggleMute}
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
            style={{ background: '#1C1C21', color: muted ? '#4A4850' : '#888680' }}
            title={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? '🔇' : '🔈'}
          </button>
          {/* Close */}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
            style={{ background: '#1C1C21', color: '#888680' }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Voice picker panel */}
      <AnimatePresence>
        {showVoicePicker && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden shrink-0"
            style={{ borderBottom: '0.5px solid #2C2C32', background: '#0D0D11' }}
          >
            <div className="px-5 py-3">
              <p
                className="text-[10px] font-semibold tracking-widest mb-2"
                style={{ color: '#4A4850' }}
              >
                VOICE SELECTION
              </p>
              {voices.length === 0 ? (
                <p className="text-xs" style={{ color: '#4A4850' }}>
                  No voices available in this browser.
                </p>
              ) : (
                <div className="flex flex-col gap-1 max-h-36 overflow-y-auto">
                  {voices.map((v) => (
                    <button
                      key={v.name}
                      onClick={() => handleVoiceSelect(v.name)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs transition-all"
                      style={{
                        background: selectedVoice === v.name ? '#1E1A3A' : 'transparent',
                        border: `1px solid ${selectedVoice === v.name ? '#7B6EF6' : 'transparent'}`,
                        color: selectedVoice === v.name ? '#9B8EFF' : '#888680',
                      }}
                    >
                      <span>{v.lang.startsWith('ru') ? '🇷🇺' : '🇺🇸'}</span>
                      <span className="flex-1 truncate">{v.name}</span>
                      {!v.localService && (
                        <span className="text-[9px] shrink-0" style={{ color: '#4ECBA0' }}>
                          neural
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className="max-w-[82%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
                style={
                  msg.role === 'user'
                    ? { background: '#7B6EF6', color: '#fff', borderBottomRightRadius: 6 }
                    : {
                        background: '#1C1C21',
                        color: '#EEECEA',
                        border: '0.5px solid #2C2C32',
                        borderBottomLeftRadius: 6,
                      }
                }
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {typing && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex justify-start"
            >
              <div
                className="px-4 py-3 rounded-2xl flex items-center gap-1"
                style={{
                  background: '#1C1C21',
                  border: '0.5px solid #2C2C32',
                  borderBottomLeftRadius: 6,
                }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: '#4A4850' }}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      {messages.length < 3 && (
        <div className="px-5 pb-2 flex gap-2 overflow-x-auto shrink-0 scrollbar-none">
          {QUICK_PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => send(p)}
              className="shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium whitespace-nowrap"
              style={{ background: '#1C1C21', border: '0.5px solid #2C2C32', color: '#888680' }}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div
        className="px-4 py-3 flex items-end gap-3 shrink-0"
        style={{ borderTop: '0.5px solid #2C2C32' }}
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              send(input);
            }
          }}
          placeholder="Type anything…"
          rows={1}
          className="flex-1 resize-none text-sm outline-none bg-transparent leading-relaxed"
          style={{ color: '#EEECEA', caretColor: '#7B6EF6' }}
        />
        <button
          onClick={() => send(input)}
          disabled={!input.trim() || typing}
          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-opacity"
          style={{
            background: input.trim() && !typing ? '#7B6EF6' : '#1C1C21',
            opacity: input.trim() && !typing ? 1 : 0.4,
          }}
        >
          <span className="text-white text-sm">↑</span>
        </button>
      </div>
    </motion.div>
  );
}
