'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

type ToastProps = {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
};

export default function Toast({ message, type = 'success', onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.3 }}
          className={`fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-white font-medium z-50
            ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}
          `}
        >
          {type === 'success' ? (
            <FaCheckCircle className="text-white text-lg" />
          ) : (
            <FaTimesCircle className="text-white text-lg" />
          )}
          <span>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
