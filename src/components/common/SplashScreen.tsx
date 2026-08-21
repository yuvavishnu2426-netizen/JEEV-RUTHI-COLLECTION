import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  isLoading: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ isLoading }) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#111111]"
        >
          <motion.div
            initial={{ scale: 0.5, rotateY: 90, opacity: 0 }}
            animate={{ scale: 1, rotateY: 0, opacity: 1 }}
            transition={{
              duration: 1.5,
              ease: [0.25, 1, 0.5, 1], // Custom spring-like easing
            }}
            className="flex flex-col items-center"
          >
            <img 
              src="/logo.png" 
              alt="Jeev Ruthi Collection Loading" 
              className="w-48 md:w-64 h-auto object-contain filter drop-shadow-[0_0_15px_rgba(212,175,55,0.6)]"
            />
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
              className="h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mt-8"
              style={{ width: '200px' }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
