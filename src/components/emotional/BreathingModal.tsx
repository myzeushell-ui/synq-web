'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Props {
  onClose: () => void;
}

type Phase = 'idle' | 'inhale' | 'hold-in' | 'exhale' | 'hold-out';

const PHASES: Phase[] = ['inhale', 'hold-in', 'exhale', 'hold-out'];
const DURATIONS: Record<Phase, number> = {
  idle: 0,
  inhale: 4000,
  'hold-in': 4000,
  exhale: 4000,
  'hold-out': 4000,
};
const LABELS: Record<Phase, string> = {
  idle: 'Готовы дышать',
  inhale: 'Вдох…',
  'hold-in': 'Держите…',
  exhale: 'Выдох…',
  'hold-out': 'Держите…',
};
const CIRCLE_SCALE: Record<Phase, number> = {
  idle: 1,
  inhale: 1.35,
  'hold-in': 1.35,
  exhale: 1,
  'hold-out': 1,
};

export function BreathingModal({ onClose }: Props) {
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<Phase>('idle');
  const [cycles, setCycles] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseIdx = useRef(0);

  const clearTimers = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (countRef.current) clearInterval(countRef.current);
  };

  const startCountdown = (ms: number) => {
    clearInterval(countRef.current!);
    setCountdown(Math.ceil(ms / 1000));
    countRef.current = setInterval(() => {
      setCountdown((c) => Math.max(0, c - 1));
    }, 1000);
  };

  const runPhase = (idx: number, cycleCount: number) => {
    const p = PHASES[idx % PHASES.length];
    setPhase(p);
    startCountdown(DURATIONS[p]);
    timerRef.current = setTimeout(() => {
      const nextIdx = idx + 1;
      if (nextIdx % PHASES.length === 0) setCycles(cycleCount + 1);
      runPhase(nextIdx, nextIdx % PHASES.length === 0 ? cycleCount + 1 : cycleCount);
    }, DURATIONS[p]);
  };

  const handleStart = () => {
    setRunning(true);
    setCycles(0);
    phaseIdx.current = 0;
    runPhase(0, 0);
  };

  const handleStop = () => {
    clearTimers();
    setRunning(false);
    setPhase('idle');
    setCountdown(0);
  };

  useEffect(() => () => clearTimers(), []);

  const circleColor = phase === 'inhale' ? '#7B6EF6' : phase === 'exhale' ? '#4ECBA0' : '#E8B84B';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-end"
      style={{ background: 'rgba(0,0,0,0.7)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        onClick={(e) => e.stopPropagation()}
        className="w-full rounded-t-3xl pt-6 pb-8 px-6"
        style={{
          background: '#1C1C21',
          border: '0.5px solid #2C2C32',
          maxWidth: 448,
          margin: '0 auto',
        }}
      >
        {/* Handle */}
        <div className="w-9 h-1 rounded-full mx-auto mb-6" style={{ background: '#2C2C32' }} />

        {/* Title */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-bold mb-1" style={{ color: '#EEECEA' }}>
            Коробочное дыхание
          </h3>
          <p className="text-xs" style={{ color: '#888680' }}>
            4-4-4-4 · {cycles} цикл{cycles === 1 ? '' : cycles < 5 ? 'а' : 'ов'} завершено
          </p>
        </div>

        {/* Breathing circle */}
        <div className="flex justify-center mb-8">
          <div
            className="relative flex items-center justify-center"
            style={{ width: 180, height: 180 }}
          >
            {/* Outer glow */}
            <motion.div
              animate={{ scale: CIRCLE_SCALE[phase], opacity: running ? 0.18 : 0.08 }}
              transition={{ duration: DURATIONS[phase] / 1000, ease: 'easeInOut' }}
              className="absolute rounded-full"
              style={{ width: 180, height: 180, background: circleColor }}
            />
            {/* Main circle */}
            <motion.div
              animate={{ scale: CIRCLE_SCALE[phase] }}
              transition={{ duration: DURATIONS[phase] / 1000, ease: 'easeInOut' }}
              className="absolute rounded-full flex items-center justify-center"
              style={{
                width: 130,
                height: 130,
                background: `${circleColor}22`,
                border: `2px solid ${circleColor}`,
              }}
            />
            {/* Center text */}
            <div className="relative text-center z-10">
              <p
                className="text-3xl font-light"
                style={{ color: running ? circleColor : '#4A4850' }}
              >
                {running ? countdown : '◎'}
              </p>
              <p
                className="text-[11px] mt-1 font-medium"
                style={{ color: running ? circleColor : '#4A4850' }}
              >
                {LABELS[phase]}
              </p>
            </div>
          </div>
        </div>

        {/* Phase indicator dots */}
        <div className="flex justify-center gap-3 mb-8">
          {PHASES.map((p) => (
            <div key={p} className="flex flex-col items-center gap-1">
              <div
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{
                  background: phase === p && running ? circleColor : '#2C2C32',
                  transform: phase === p && running ? 'scale(1.4)' : 'scale(1)',
                }}
              />
              <span className="text-[9px]" style={{ color: '#4A4850' }}>
                {p === 'inhale'
                  ? 'Вдох'
                  : p === 'hold-in'
                    ? 'Держ.'
                    : p === 'exhale'
                      ? 'Выдох'
                      : 'Держ.'}
              </span>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl text-sm font-medium"
            style={{ background: '#242428', color: '#888680' }}
          >
            Закрыть
          </button>
          <button
            onClick={running ? handleStop : handleStart}
            className="flex-1 py-3 rounded-2xl text-sm font-semibold"
            style={{
              background: running ? '#2A1510' : '#7B6EF6',
              color: running ? '#E07B62' : '#fff',
            }}
          >
            {running ? 'Стоп' : 'Начать'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
