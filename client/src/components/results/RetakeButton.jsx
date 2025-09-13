import React from 'react';
import { motion } from 'framer-motion';

const RetakeButton = ({ onRetake, onNewQuiz, disabled = false }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <motion.button
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        onClick={onRetake}
        disabled={disabled}
        className="
          px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 
          hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg
          focus:ring-4 focus:ring-blue-200 transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center justify-center space-x-2
          min-w-[160px]
        "
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span>Retake Quiz</span>
      </motion.button>

      <motion.button
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        onClick={onNewQuiz}
        disabled={disabled}
        className="
          px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg
          hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700
          focus:ring-4 focus:ring-blue-200 transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center justify-center space-x-2
          min-w-[160px]
        "
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <span>New Quiz</span>
      </motion.button>
    </div>
  );
};

export default RetakeButton;
