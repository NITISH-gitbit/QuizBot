import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import QuestionCard from './QuestionCard';
import ProgressBar from './ProgressBar';
import Timer from './Timer';
import LoadingSpinner from '../common/LoadingSpinner';
import { useQuiz } from '../../contexts/QuizContext';

const QuizPage = ({ onComplete, onBack }) => {
  const {
    currentQuiz,
    currentSession,
    getCurrentQuestion,
    getQuizProgress,
    submitAnswer,
    nextQuestion,
    previousQuestion,
    completeQuiz,
    isQuestionAnswered,
    loading
  } = useQuiz();

  const [quizStartTime] = useState(Date.now());
  const [showConfirmComplete, setShowConfirmComplete] = useState(false);

  const currentQuestion = getCurrentQuestion();
  const progress = getQuizProgress();
  const isLastQuestion = currentSession?.currentQuestionIndex === currentQuiz?.questions?.length - 1;
  const currentAnswered = isQuestionAnswered(currentSession?.currentQuestionIndex || 0);

  // Don't reset timer on question change - only on quiz start

  // Handle answer selection
  const handleAnswerSelect = (answer) => {
    if (!currentSession || !currentQuiz) return;
    
    const timeTaken = Math.floor((Date.now() - quizStartTime) / 1000);
    const questionIndex = currentSession.currentQuestionIndex;
    
    submitAnswer(questionIndex, answer, timeTaken);
    
    // Show neutral feedback without revealing correctness
    toast.success('Answer selected!', { duration: 1000 });
  };

  // Handle next question
  const handleNext = () => {
    if (!currentAnswered) {
      toast.error('Please select an answer before continuing');
      return;
    }

    if (isLastQuestion) {
      setShowConfirmComplete(true);
    } else {
      nextQuestion();
    }
  };

  // Handle previous question
  const handlePrevious = () => {
    previousQuestion();
  };

  // Handle quiz completion
  const handleCompleteQuiz = async () => {
    try {
      const results = await completeQuiz();
      onComplete(results);
    } catch (error) {
      toast.error('Failed to complete quiz');
    }
  };

  // Handle quiz exit
  const handleExit = () => {
    if (window.confirm('Are you sure you want to exit? Your progress will be lost.')) {
      onBack();
    }
  };

  if (!currentQuiz || !currentSession || !currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Quiz Info */}
            <div>
              <h1 className="text-xl font-semibold text-gray-800">
                {currentQuiz.topic}
              </h1>
              <p className="text-sm text-gray-500 capitalize">
                {currentQuiz.difficulty} • {currentQuiz.questionType === 'mcq' ? 'Multiple Choice' : 'True/False'}
              </p>
            </div>

            {/* Timer and Exit */}
            <div className="flex items-center space-x-4">
              <Timer 
                duration={currentQuiz.totalTime || (currentQuiz.numberOfQuestions * 60)} 
                isActive={true}
                onTimeUp={() => {
                  toast.error('Time is up! Quiz will be completed automatically.');
                  setTimeout(() => handleCompleteQuiz(), 2000);
                }}
              />
              <button
                onClick={handleExit}
                className="
                  px-4 py-2 text-gray-600 hover:text-red-600 
                  border border-gray-300 hover:border-red-300 rounded-lg
                  transition-colors duration-200
                "
              >
                Exit Quiz
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Progress Bar */}
        <ProgressBar
          current={progress.current}
          total={progress.total}
          percentage={(progress.current / progress.total) * 100}
        />

        {/* Question Card */}
        <QuestionCard
          question={currentQuestion}
          questionNumber={currentSession.currentQuestionIndex + 1}
          totalQuestions={currentQuiz.questions.length}
          selectedAnswer={currentSession.answers[currentSession.currentQuestionIndex]?.selectedAnswer}
          onAnswerSelect={handleAnswerSelect}
          disabled={loading}
        />

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentSession.currentQuestionIndex === 0 || loading}
            className="
              flex items-center space-x-2 px-6 py-3 
              border border-gray-300 rounded-lg
              text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors duration-200
            "
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Previous</span>
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              {progress.answered} of {progress.total} questions answered
            </p>
          </div>

          <button
            onClick={handleNext}
            disabled={!currentAnswered || loading}
            className="
              flex items-center space-x-2 px-6 py-3 
              bg-gradient-to-r from-blue-600 to-indigo-600 
              hover:from-blue-700 hover:to-indigo-700 
              text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors duration-200
            "
          >
            <span>{isLastQuestion ? 'Complete Quiz' : 'Next'}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Completion Confirmation Modal */}
        {showConfirmComplete && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl p-6 max-w-md w-full"
            >
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Complete Quiz?
                </h3>
                
                <p className="text-sm text-gray-500 mb-6">
                  You've answered all questions. Are you ready to see your results?
                </p>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowConfirmComplete(false)}
                    className="
                      flex-1 px-4 py-2 border border-gray-300 rounded-lg
                      text-gray-700 hover:bg-gray-50
                    "
                  >
                    Review Answers
                  </button>
                  
                  <button
                    onClick={handleCompleteQuiz}
                    disabled={loading}
                    className="
                      flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 
                      text-white rounded-lg disabled:opacity-50
                      flex items-center justify-center
                    "
                  >
                    {loading ? <LoadingSpinner size="small" color="white" text="" /> : 'Complete Quiz'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
