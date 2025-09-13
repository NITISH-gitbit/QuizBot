import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ current, total, percentage }) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
      <motion.div
        className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
      <div className="flex justify-between items-center mt-2">
        <span className="text-sm text-gray-600">
          Question {current} of {total}
        </span>
        <span className="text-sm font-medium text-blue-600">
          {percentage}% Complete
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;
