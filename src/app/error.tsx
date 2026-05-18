'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: Props) {
  useEffect(() => {
    console.error('[Synq error boundary]', error);
  }, [error]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: '#0A0A0D' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="max-w-sm w-full"
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{ background: '#2A1510', border: '0.5px solid #3A2018' }}
        >
          <span className="text-3xl">⚠</span>
        </div>

        <h1 className="text-xl font-bold mb-2" style={{ color: '#EEECEA' }}>
          Something went wrong
        </h1>
        <p className="text-sm mb-8 leading-relaxed" style={{ color: '#888680' }}>
          {error.message || 'An unexpected error occurred. Your data is safe.'}
        </p>

        {error.digest && (
          <p className="text-[10px] font-mono mb-6" style={{ color: '#4A4850' }}>
            {error.digest}
          </p>
        )}

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={reset}
          className="w-full py-3 rounded-2xl text-sm font-semibold text-white"
          style={{ background: '#7B6EF6' }}
        >
          Try again
        </motion.button>

        <button
          onClick={() => (window.location.href = '/')}
          className="mt-3 w-full py-3 rounded-2xl text-sm font-medium"
          style={{ background: '#1C1C21', color: '#888680', border: '0.5px solid #2C2C32' }}
        >
          Go home
        </button>
      </motion.div>
    </div>
  );
}
