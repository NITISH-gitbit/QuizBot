import React from 'react';
import { motion } from 'framer-motion';

const ScoreCard = ({ results }) => {
  const { score, totalQuestions, percentage, performanceMessage, timeTaken } = results;
  
  const getScoreColor = () => {
    if (percentage >= 90) return 'text-green-600 border-green-200 bg-green-50';
    if (percentage >= 80) return 'text-blue-600 border-blue-200 bg-blue-50';
    if (percentage >= 70) return 'text-yellow-600 border-yellow-200 bg-yellow-50';
    if (percentage >= 60) return 'text-orange-600 border-orange-200 bg-orange-50';
    return 'text-red-600 border-red-200 bg-red-50';
  };

  const getGrade = () => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 85) return 'A';
    if (percentage >= 80) return 'A-';
    if (percentage >= 75) return 'B+';
    if (percentage >= 70) return 'B';
    if (percentage >= 65) return 'B-';
    if (percentage >= 60) return 'C+';
    if (percentage >= 55) return 'C';
    if (percentage >= 50) return 'C-';
    return 'F';
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`rounded-xl border-2 p-8 text-center ${getScoreColor()}`}
    >
      {/* Grade */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <div className="text-6xl font-bold mb-2">
          {getGrade()}
        </div>
        <div className="text-xl font-semibold">
          {performanceMessage}
        </div>
      </motion.div>

      {/* Score Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white bg-opacity-50 rounded-lg p-4"
        >
          <div className="text-3xl font-bold">
            {score}/{totalQuestions}
          </div>
          <div className="text-sm font-medium opacity-75">
            Correct Answers
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white bg-opacity-50 rounded-lg p-4"
        >
          <div className="text-3xl font-bold">
            {percentage}%
          </div>
          <div className="text-sm font-medium opacity-75">
            Score Percentage
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white bg-opacity-50 rounded-lg p-4"
        >
          <div className="text-3xl font-bold">
            {formatTime(timeTaken)}
          </div>
          <div className="text-sm font-medium opacity-75">
            Total Time
          </div>
        </motion.div>
      </div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="w-full bg-white bg-opacity-50 rounded-full h-4 mb-4"
      >
        <motion.div
          className="h-4 rounded-full bg-current"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
        />
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-sm opacity-75"
      >
        You answered {score} out of {totalQuestions} questions correctly
      </motion.p>
    </motion.div>
  );
};

export default ScoreCard;
