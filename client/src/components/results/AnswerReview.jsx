import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AnswerReview = ({ results }) => {
  const { questions, answers } = results;
  const [expandedQuestions, setExpandedQuestions] = useState(new Set());

  const toggleQuestion = (index) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedQuestions(newExpanded);
  };

  const getAnswerStatus = (question, index) => {
    const userAnswer = answers[index];
    if (!userAnswer) return { status: 'unanswered', color: 'gray' };
    
    if (userAnswer.isCorrect) {
      return { status: 'correct', color: 'green' };
    }
    return { status: 'incorrect', color: 'red' };
  };

  const getOptionLabel = (optionIndex) => {
    return String.fromCharCode(65 + optionIndex); // A, B, C, D
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Answer Review
      </h2>

      {questions.map((question, index) => {
        const answerStatus = getAnswerStatus(question, index);
        const userAnswer = answers[index];
        const isExpanded = expandedQuestions.has(index);

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          >
            {/* Question Header */}
            <button
              onClick={() => toggleQuestion(index)}
              className="w-full p-4 text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {/* Status Icon */}
                  <div 
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center
                      ${answerStatus.color === 'green' ? 'bg-green-100 text-green-600' : ''}
                      ${answerStatus.color === 'red' ? 'bg-red-100 text-red-600' : ''}
                      ${answerStatus.color === 'gray' ? 'bg-gray-100 text-gray-600' : ''}
                    `}
                  >
                    {answerStatus.status === 'correct' && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    {answerStatus.status === 'incorrect' && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                    {answerStatus.status === 'unanswered' && (
                      <span className="text-xs font-medium">?</span>
                    )}
                  </div>

                  {/* Question Number and Text */}
                  <div>
                    <div className="text-sm font-medium text-gray-500">
                      Question {index + 1}
                    </div>
                    <div className="text-gray-800 font-medium line-clamp-2">
                      {question.question}
                    </div>
                  </div>
                </div>

                {/* Expand Icon */}
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.div>
              </div>
            </button>

            {/* Expanded Content */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-gray-200"
                >
                  <div className="p-4 space-y-4">
                    {/* Question Details */}
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">
                        {question.question}
                      </h4>
                      <div className="text-sm text-gray-500 mb-4">
                        Difficulty: <span className="capitalize">{question.difficulty}</span> • 
                        Type: <span className="capitalize">{question.type === 'mcq' ? 'Multiple Choice' : 'True/False'}</span>
                      </div>
                    </div>

                    {/* Options */}
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => {
                        const isCorrect = option === question.correctAnswer;
                        const isUserAnswer = userAnswer && option === userAnswer.selectedAnswer;
                        const optionLabel = getOptionLabel(optionIndex);

                        return (
                          <div
                            key={optionIndex}
                            className={`
                              p-3 rounded-lg border flex items-center space-x-3
                              ${isCorrect ? 'bg-green-50 border-green-200' : ''}
                              ${isUserAnswer && !isCorrect ? 'bg-red-50 border-red-200' : ''}
                              ${!isCorrect && !isUserAnswer ? 'bg-gray-50 border-gray-200' : ''}
                            `}
                          >
                            <div 
                              className={`
                                w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-medium
                                ${isCorrect ? 'border-green-500 bg-green-500 text-white' : ''}
                                ${isUserAnswer && !isCorrect ? 'border-red-500 bg-red-500 text-white' : ''}
                                ${!isCorrect && !isUserAnswer ? 'border-gray-300 text-gray-500' : ''}
                              `}
                            >
                              {optionLabel}
                            </div>
                            
                            <span className="flex-1 text-gray-700">
                              {option}
                            </span>

                            <div className="flex items-center space-x-2">
                              {isCorrect && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                  Correct
                                </span>
                              )}
                              {isUserAnswer && !isCorrect && (
                                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                                  Your answer
                                </span>
                              )}
                              {isUserAnswer && isCorrect && (
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                  Your answer ✓
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    {question.customExplanation && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h5 className="font-medium text-blue-800 mb-2">
                          Explanation
                        </h5>
                        <p className="text-blue-700 text-sm">
                          {question.customExplanation}
                        </p>
                      </div>
                    )}

                    {/* Answer Stats */}
                    {userAnswer && (
                      <div className="text-xs text-gray-500 border-t pt-3">
                        Time taken: {userAnswer.timeTaken || 0} seconds
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
};

export default AnswerReview;
