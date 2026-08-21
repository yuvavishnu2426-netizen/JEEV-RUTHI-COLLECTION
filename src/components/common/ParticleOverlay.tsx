import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export const ParticleOverlay: React.FC = () => {
  // Generate a fixed number of particles to avoid performance issues
  const particles = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      size: Math.random() * 4 + 1, // 1px to 5px
      x: Math.random() * 100, // 0 to 100vw
      y: Math.random() * 100, // 0 to 100vh
      duration: Math.random() * 20 + 10, // 10s to 30s
      delay: Math.random() * 5,
      opacityBase: 0.1 + Math.random() * 0.3,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden mix-blend-screen">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.8)]"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}vw`,
            top: `${p.y}vh`,
            opacity: p.opacityBase,
          }}
          animate={{
            y: [0, -100, 0, 100, 0],
            x: [0, 50, 0, -50, 0],
            opacity: [p.opacityBase, p.opacityBase + 0.4, p.opacityBase],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "linear",
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
};
