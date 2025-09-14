import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ current, total, percentage }) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 mb-6 sm:mb-8">
      <motion.div
        className="h-2 sm:h-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
      <div className="flex justify-between items-center mt-3 sm:mt-4 px-1">
        <span className="text-xs sm:text-sm text-gray-600 font-medium">
          Question {current} of {total}
        </span>
        <span className="text-xs sm:text-sm font-semibold text-blue-600">
          {percentage}% Complete
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;
