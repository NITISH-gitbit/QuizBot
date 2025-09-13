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
    totalTime: 600 // seconds (10 minutes default)
  });

  const [showTopicSuggestions, setShowTopicSuggestions] = useState(false);
  const [filteredTopics, setFilteredTopics] = useState(QUIZ_TOPICS);

  // Get suggested timer based on difficulty and number of questions
  const getSuggestedTime = useCallback(() => {
    const baseTimePerQuestion = {
      [QUIZ_CONSTANTS.DIFFICULTIES.EASY]: config.questionType === QUIZ_CONSTANTS.QUESTION_TYPES.MCQ ? 45 : 30,
      [QUIZ_CONSTANTS.DIFFICULTIES.MEDIUM]: config.questionType === QUIZ_CONSTANTS.QUESTION_TYPES.MCQ ? 60 : 45,
      [QUIZ_CONSTANTS.DIFFICULTIES.HARD]: config.questionType === QUIZ_CONSTANTS.QUESTION_TYPES.MCQ ? 90 : 60
    };
    const timePerQuestion = baseTimePerQuestion[config.difficulty] || 60;
    return timePerQuestion * config.numberOfQuestions;
  }, [config.difficulty, config.questionType, config.numberOfQuestions]);

  // Auto-update timer when difficulty, question type, or number of questions changes
  useEffect(() => {
    const suggestedTime = getSuggestedTime();
    setConfig(prev => ({ ...prev, totalTime: suggestedTime }));
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
    setConfig({
      topic: '',
      difficulty: QUIZ_CONSTANTS.DIFFICULTIES.MEDIUM,
      questionType: QUIZ_CONSTANTS.QUESTION_TYPES.MCQ,
      numberOfQuestions: QUIZ_CONSTANTS.DEFAULT_QUESTIONS,
      totalTime: 600
    });
    setShowTopicSuggestions(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Your Quiz"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Topic Input */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quiz Topic *
          </label>
          <input
            type="text"
            value={config.topic}
            onChange={(e) => handleTopicChange(e.target.value)}
            onFocus={() => config.topic.length === 0 && setShowTopicSuggestions(true)}
            placeholder="Enter a topic (e.g., Science, History, Technology)"
            className="
              w-full px-4 py-3 border border-gray-300 rounded-lg
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              transition-colors duration-200
            "
            disabled={loading}
            required
          />
          
          {/* Topic Suggestions */}
          {showTopicSuggestions && filteredTopics.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {filteredTopics.slice(0, 8).map((topic, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleTopicSelect(topic)}
                  className="
                    w-full text-left px-4 py-2 hover:bg-blue-50 
                    focus:bg-blue-50 focus:outline-none
                    first:rounded-t-lg last:rounded-b-lg
                  "
                >
                  {topic}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Difficulty Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Difficulty Level
          </label>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(QUIZ_CONSTANTS.DIFFICULTY_LABELS).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setConfig({ ...config, difficulty: value })}
                disabled={loading}
                className={`
                  py-2 px-4 rounded-lg border-2 transition-all duration-200
                  ${config.difficulty === value
                    ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                    : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                  }
                  ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Question Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Question Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(QUIZ_CONSTANTS.QUESTION_TYPE_LABELS).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setConfig({ ...config, questionType: value })}
                disabled={loading}
                className={`
                  py-2 px-4 rounded-lg border-2 transition-all duration-200
                  ${config.questionType === value
                    ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                    : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                  }
                  ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Number of Questions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Questions: {config.numberOfQuestions}
          </label>
          <input
            type="range"
            min={QUIZ_CONSTANTS.MIN_QUESTIONS}
            max={QUIZ_CONSTANTS.MAX_QUESTIONS}
            value={config.numberOfQuestions}
            onChange={(e) => setConfig({ ...config, numberOfQuestions: parseInt(e.target.value) })}
            disabled={loading}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{QUIZ_CONSTANTS.MIN_QUESTIONS}</span>
            <span>{QUIZ_CONSTANTS.MAX_QUESTIONS}</span>
          </div>
        </div>

        {/* Timer Configuration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total Quiz Time: {Math.floor(config.totalTime / 60)}m {config.totalTime % 60}s
          </label>
          <div className="mb-2">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>Suggested: {Math.floor(getSuggestedTime() / 60)}m {getSuggestedTime() % 60}s</span>
              <button
                type="button"
                onClick={() => setConfig({ ...config, totalTime: getSuggestedTime() })}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Use Suggested
              </button>
            </div>
          </div>
          <input
            type="range"
            min="300"
            max="3600"
            step="60"
            value={config.totalTime}
            onChange={(e) => setConfig({ ...config, totalTime: parseInt(e.target.value) })}
            disabled={loading}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>5m</span>
            <span>60m</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Total time for completing all {config.numberOfQuestions} questions
            {config.numberOfQuestions > 0 && ` (≈${Math.round(config.totalTime / config.numberOfQuestions)}s per question)`}
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4">
          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            className="
              flex-1 py-3 px-4 border border-gray-300 rounded-lg
              text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-gray-300
              transition-colors duration-200 disabled:opacity-50
            "
          >
            Reset
          </button>
          
          <button
            type="submit"
            disabled={loading || !config.topic.trim()}
            className="
              flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600
              hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg
              focus:ring-2 focus:ring-blue-300 transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center justify-center space-x-2
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
