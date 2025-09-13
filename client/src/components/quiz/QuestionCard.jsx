import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const QuestionCard = ({ 
  question, 
  questionNumber, 
  totalQuestions, 
  selectedAnswer, 
  onAnswerSelect,
  disabled = false 
}) => {
  const [localSelectedAnswer, setLocalSelectedAnswer] = useState(selectedAnswer || '');

  useEffect(() => {
    setLocalSelectedAnswer(selectedAnswer || '');
  }, [selectedAnswer, question]);

  const handleAnswerSelect = (answer) => {
    if (disabled) return;
    
    setLocalSelectedAnswer(answer);
    onAnswerSelect(answer);
  };

  const getOptionLabel = (index) => {
    return String.fromCharCode(65 + index); // A, B, C, D
  };

  return (
    <motion.div
      key={question.question}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto"
    >
      {/* Question Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className="text-sm text-gray-500 capitalize">
            {question.difficulty} • {question.type === 'mcq' ? 'Multiple Choice' : 'True/False'}
          </span>
        </div>
        
        <h2 className="text-2xl font-semibold text-gray-800 leading-relaxed">
          {question.question}
        </h2>
      </div>

      {/* Answer Options */}
      <div className="space-y-3">
        <AnimatePresence mode="wait">
          {question.options.map((option, index) => {
            const isSelected = localSelectedAnswer === option;
            const optionLabel = getOptionLabel(index);
            
            return (
              <motion.button
                key={`${question.question}-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleAnswerSelect(option)}
                disabled={disabled}
                className={`
                  w-full p-4 rounded-lg border-2 text-left transition-all duration-200
                  flex items-center space-x-4 group
                  ${isSelected
                    ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }
                  ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}
                  focus:outline-none focus:ring-4 focus:ring-blue-200
                `}
              >
                {/* Option Label */}
                <div 
                  className={`
                    flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center
                    font-semibold text-sm transition-colors duration-200
                    ${isSelected
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-gray-300 text-gray-500 group-hover:border-blue-400 group-hover:text-blue-600'
                    }
                  `}
                >
                  {optionLabel}
                </div>
                
                {/* Option Text */}
                <span className="flex-1 text-gray-700 group-hover:text-gray-800">
                  {option}
                </span>
                
                {/* Selection Indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex-shrink-0"
                  >
                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Helper Text */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          {localSelectedAnswer ? 'Answer selected' : 'Select an answer to continue'}
        </p>
      </div>
    </motion.div>
  );
};

export default QuestionCard;
