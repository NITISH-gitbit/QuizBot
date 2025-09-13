import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import Modal from '../common/Modal';
import LoadingSpinner from '../common/LoadingSpinner';
import { QUIZ_CONSTANTS, QUIZ_TOPICS } from '../../utils/constants';
import { useQuiz } from '../../contexts/QuizContext';

const QuizConfigModal = ({ isOpen, onClose, onQuizGenerated }) => {
  const { generateQuiz, loading, error } = useQuiz();
  
  const [config, setConfig] = useState({
    topic: '',
    difficulty: QUIZ_CONSTANTS.DIFFICULTIES.MEDIUM,
    questionType: QUIZ_CONSTANTS.QUESTION_TYPES.MCQ,
    numberOfQuestions: QUIZ_CONSTANTS.DEFAULT_QUESTIONS,
    totalTime: 600
  });

  const [showTopicSuggestions, setShowTopicSuggestions] = useState(false);
  const [filteredTopics, setFilteredTopics] = useState(QUIZ_TOPICS);

  // Get suggested timer based on difficulty and number of questions
  const getSuggestedTime = useCallback(() => {
    const baseTimePerQuestion = {
      [QUIZ_CONSTANTS.DIFFICULTIES.EASY]: config.questionType === QUIZ_CONSTANTS.QUESTION_TYPES.MCQ ? 30 : 20,
      [QUIZ_CONSTANTS.DIFFICULTIES.MEDIUM]: config.questionType === QUIZ_CONSTANTS.QUESTION_TYPES.MCQ ? 45 : 30,
      [QUIZ_CONSTANTS.DIFFICULTIES.HARD]: config.questionType === QUIZ_CONSTANTS.QUESTION_TYPES.MCQ ? 60 : 45
    };
    const timePerQuestion = baseTimePerQuestion[config.difficulty] || 45;
    return timePerQuestion * config.numberOfQuestions;
  }, [config.difficulty, config.questionType, config.numberOfQuestions]);

  const getMinTime = useCallback(() => getSuggestedTime(), [getSuggestedTime]);
  const getMaxTime = () => 1800; // 30 minutes

  // Auto-update timer when difficulty, question type, or number of questions changes
  useEffect(() => {
    const suggestedTime = getSuggestedTime();
    setConfig(prev => ({ ...prev, totalTime: Math.max(suggestedTime, prev.totalTime) }));
  }, [getSuggestedTime]);

  // Handle topic input change with filtering
  const handleTopicChange = (value) => {
    setConfig({ ...config, topic: value });
    
    if (value.length > 0) {
      const filtered = QUIZ_TOPICS.filter(topic =>
        topic.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredTopics(filtered);
      setShowTopicSuggestions(true);
    } else {
      setFilteredTopics(QUIZ_TOPICS);
      setShowTopicSuggestions(false);
    }
  };

  // Handle topic selection from suggestions
  const handleTopicSelect = (topic) => {
    setConfig({ ...config, topic });
    setShowTopicSuggestions(false);
  };

  // Handle clicks outside topic input to close suggestions
  const handleTopicBlur = (e) => {
    // Delay to allow click on suggestion
    setTimeout(() => {
      if (!e.relatedTarget || !e.relatedTarget.closest('.topic-suggestions')) {
        setShowTopicSuggestions(false);
      }
    }, 150);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!config.topic.trim()) {
      toast.error('Please enter a topic for your quiz');
      return;
    }

    if (config.topic.trim().length < 2) {
      toast.error('Topic must be at least 2 characters long');
      return;
    }

    const minTime = getMinTime();
    if (config.totalTime < minTime) {
      toast.error(`Total time must be at least ${Math.ceil(minTime/60)} minutes for this configuration`);
      return;
    }

    if (config.totalTime > getMaxTime()) {
      toast.error('Total time cannot exceed 30 minutes');
      return;
    }

    try {
      const quiz = await generateQuiz(config);
      toast.success('Quiz generated successfully!');
      onQuizGenerated(quiz);
      onClose();
    } catch (error) {
      console.error('Error generating quiz:', error);
      toast.error(error.message || 'Failed to generate quiz. Please try again.');
    }
  };

  // Reset form
  const handleReset = () => {
    const suggestedTime = getSuggestedTime();
    setConfig({
      topic: '',
      difficulty: QUIZ_CONSTANTS.DIFFICULTIES.MEDIUM,
      questionType: QUIZ_CONSTANTS.QUESTION_TYPES.MCQ,
      numberOfQuestions: QUIZ_CONSTANTS.DEFAULT_QUESTIONS,
      totalTime: suggestedTime
    });
    setShowTopicSuggestions(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      maxWidth="max-w-3xl"
    >
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-t-lg sm:rounded-t-xl p-3 sm:p-4 lg:p-6 -m-4 sm:-m-6 mb-0">
        <div className="text-center mb-4 sm:mb-6">
          <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-2 sm:mb-3">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Create Your Quiz
          </h2>
          <p className="text-gray-600 mt-1 text-sm">Design a personalized quiz experience</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 pt-4 sm:pt-6">
        {/* Topic Input - Made Prominent */}
        <div className="relative">
          <label className="block text-sm sm:text-base font-semibold text-gray-800 mb-2 sm:mb-3">
            🎯 What topic interests you today?
          </label>
          <div className="relative">
            <input
              type="text"
              value={config.topic}
              onChange={(e) => handleTopicChange(e.target.value)}
              onFocus={() => config.topic.length === 0 && setShowTopicSuggestions(true)}
              onBlur={handleTopicBlur}
              placeholder="Type any topic... (e.g., JavaScript, History, Science)"
              className="
                w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 
                border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 sm:focus:ring-4 focus:ring-blue-100 
                focus:border-blue-500 transition-all duration-300 bg-white shadow-sm
                placeholder-gray-400
              "
              disabled={loading}
              required
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          {/* Enhanced Topic Suggestions */}
          {showTopicSuggestions && filteredTopics.length > 0 && (
            <div className="topic-suggestions absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-lg sm:rounded-xl shadow-xl max-h-40 sm:max-h-48 overflow-y-auto">
              <div className="p-2 sm:p-3 border-b border-gray-100">
                <p className="text-xs sm:text-sm font-medium text-gray-500">Popular topics</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 p-2">
                {filteredTopics.slice(0, 8).map((topic, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleTopicSelect(topic)}
                    className="
                      text-left px-2 sm:px-3 py-1 sm:py-2 hover:bg-blue-50 rounded-md sm:rounded-lg
                      focus:bg-blue-50 focus:outline-none transition-colors
                      text-xs sm:text-sm text-gray-700 hover:text-blue-600
                    "
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Difficulty Selection */}
          <div>
            <label className="block text-sm sm:text-base font-semibold text-gray-800 mb-3">
              ⚡ Difficulty Level
            </label>
            <div className="space-y-2">
              {Object.entries(QUIZ_CONSTANTS.DIFFICULTY_LABELS).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setConfig({ ...config, difficulty: value })}
                  disabled={loading}
                  className={`
                    w-full py-2 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl border-2 transition-all duration-300 text-left
                    ${config.difficulty === value
                      ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md transform scale-105'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }
                    ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-xs sm:text-sm">{label}</span>
                    <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                      value === 'easy' ? 'bg-green-400' :
                      value === 'medium' ? 'bg-yellow-400' : 'bg-red-400'
                    }`}></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {value === 'easy' ? 'Perfect for beginners' :
                     value === 'medium' ? 'Balanced challenge' : 'For experts'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Question Type Selection */}
          <div>
            <label className="block text-sm sm:text-base font-semibold text-gray-800 mb-3">
              📝 Question Format
            </label>
            <div className="space-y-2">
              {Object.entries(QUIZ_CONSTANTS.QUESTION_TYPE_LABELS).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setConfig({ ...config, questionType: value })}
                  disabled={loading}
                  className={`
                    w-full py-2 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl border-2 transition-all duration-300 text-left
                    ${config.questionType === value
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-md transform scale-105'
                      : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
                    }
                    ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-xs sm:text-sm">{label}</span>
                    <div className="text-lg sm:text-xl">
                      {value === 'mcq' ? '🔤' : '✅'}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {value === 'mcq' ? 'Multiple choice options' : 'True or false questions'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Number of Questions Slider */}
        <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
          <label className="block text-sm sm:text-base font-semibold text-gray-800 mb-3">
            📊 Number of Questions: <span className="text-blue-600">{config.numberOfQuestions}</span>
          </label>
          <div className="relative">
            <input
              type="range"
              min={QUIZ_CONSTANTS.MIN_QUESTIONS}
              max={QUIZ_CONSTANTS.MAX_QUESTIONS}
              value={config.numberOfQuestions}
              onChange={(e) => setConfig({ ...config, numberOfQuestions: parseInt(e.target.value) })}
              disabled={loading}
              className="
                w-full h-2 sm:h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer
                slider-modern focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-blue-100
              "
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((config.numberOfQuestions - QUIZ_CONSTANTS.MIN_QUESTIONS) / (QUIZ_CONSTANTS.MAX_QUESTIONS - QUIZ_CONSTANTS.MIN_QUESTIONS)) * 100}%, #e5e7eb ${((config.numberOfQuestions - QUIZ_CONSTANTS.MIN_QUESTIONS) / (QUIZ_CONSTANTS.MAX_QUESTIONS - QUIZ_CONSTANTS.MIN_QUESTIONS)) * 100}%, #e5e7eb 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span className="flex items-center">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full mr-1"></span>
                {QUIZ_CONSTANTS.MIN_QUESTIONS} min
              </span>
              <span className="flex items-center">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full mr-1"></span>
                {QUIZ_CONSTANTS.MAX_QUESTIONS} max
              </span>
            </div>
          </div>
        </div>

        {/* Enhanced Timer Configuration */}
        <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
          <label className="block text-sm sm:text-base font-semibold text-gray-800 mb-3">
            ⏱️ Total Quiz Time: <span className="text-indigo-600">{formatTime(config.totalTime)}</span>
          </label>
          <div className="mb-3 p-2 sm:p-3 bg-white rounded-md sm:rounded-lg border border-gray-200">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center text-green-600">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Suggested: {formatTime(getSuggestedTime())}</span>
              </div>
              <button
                type="button"
                onClick={() => setConfig({ ...config, totalTime: getSuggestedTime() })}
                className="text-blue-600 hover:text-blue-700 font-medium text-xs sm:text-sm hover:underline"
              >
                Use Suggested
              </button>
            </div>
          </div>
          <div className="relative">
            <input
              type="range"
              min={getMinTime()}
              max={getMaxTime()}
              step={30}
              value={config.totalTime}
              onChange={(e) => setConfig({ ...config, totalTime: parseInt(e.target.value) })}
              disabled={loading}
              className="
                w-full h-2 sm:h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer
                slider-modern focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-indigo-100
              "
              style={{
                background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${((config.totalTime - getMinTime()) / (getMaxTime() - getMinTime())) * 100}%, #e5e7eb ${((config.totalTime - getMinTime()) / (getMaxTime() - getMinTime())) * 100}%, #e5e7eb 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span className="flex items-center">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-indigo-500 rounded-full mr-1"></span>
                {formatTime(getMinTime())} min
              </span>
              <span className="flex items-center">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-indigo-500 rounded-full mr-1"></span>
                {formatTime(getMaxTime())} max
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            ≈{Math.round(config.totalTime / config.numberOfQuestions)}s per question
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-3 sm:pt-4">
          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            className="
              flex-1 py-2 sm:py-3 px-3 sm:px-4 border-2 border-gray-300 rounded-lg sm:rounded-xl
              text-gray-700 hover:bg-gray-50 focus:ring-2 sm:focus:ring-4 focus:ring-gray-100
              transition-all duration-300 disabled:opacity-50 font-medium text-sm sm:text-base
              hover:border-gray-400 hover:shadow-md
            "
          >
            Reset
          </button>
          
          <button
            type="submit"
            disabled={loading || !config.topic.trim()}
            className="
              flex-1 sm:flex-2 py-2 sm:py-3 px-4 sm:px-6 bg-gradient-to-r from-blue-600 to-indigo-600
              hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg sm:rounded-xl
              focus:ring-2 sm:focus:ring-4 focus:ring-blue-100 transition-all duration-300
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center justify-center space-x-2 sm:space-x-3 font-semibold text-sm sm:text-base
              hover:shadow-lg transform hover:scale-105
            "
          >
            {loading ? (
              <LoadingSpinner size="small" color="white" text="" />
            ) : (
              <>
                <span>Generate Quiz</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default QuizConfigModal;
