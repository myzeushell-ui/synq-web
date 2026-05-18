'use client';

import { motion } from 'framer-motion';

const shimmer = {
  animate: { opacity: [0.4, 0.7, 0.4] },
  transition: { duration: 1.4, repeat: Infinity, ease: 'easeInOut' as const },
};

function Bone({ w, h, radius = 6 }: { w: string; h: number; radius?: number }) {
  return (
    <motion.div
      {...shimmer}
      style={{
        width: w,
        height: h,
        borderRadius: radius,
        background: '#242428',
      }}
    />
  );
}

export function ThoughtCardSkeleton() {
  return (
    <div
      className="rounded-2xl overflow-hidden relative"
      style={{ background: '#141417', border: '0.5px solid #2C2C32' }}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl"
        style={{ background: '#242428' }}
      />
      <div className="pl-4 pr-3 py-3 flex items-start gap-3">
        <Bone w="22px" h={22} radius={11} />
        <div className="flex-1 flex flex-col gap-2 pt-0.5">
          <Bone w="85%" h={13} />
          <Bone w="60%" h={13} />
          <div className="flex gap-2 mt-0.5">
            <Bone w="52px" h={10} radius={4} />
            <Bone w="40px" h={10} radius={4} />
          </div>
        </div>
      </div>
    </div>
  );
}
