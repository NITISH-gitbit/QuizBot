import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import ScoreCard from './ScoreCard';
import AnswerReview from './AnswerReview';
import RetakeButton from './RetakeButton';

const ResultsPage = ({ results, onRetake, onNewQuiz }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // Show confetti for good scores
  useEffect(() => {
    if (results && results.percentage >= 80) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [results]);

  // Handle window resize for confetti
  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  const getMotivationalMessage = () => {
    const { percentage } = results;
    if (percentage === 100) return "Perfect score! You're a quiz master! 🏆";
    if (percentage >= 90) return "Outstanding! You really know your stuff! 🌟";
    if (percentage >= 80) return "Great job! You did excellent! 🎉";
    if (percentage >= 70) return "Well done! Good performance! 👏";
    if (percentage >= 60) return "Not bad! Keep practicing! 💪";
    return "Don't give up! Every quiz is a learning opportunity! 📚";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Confetti */}
      {showConfetti && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.1}
        />
      )}

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Quiz Results
            </h1>
            <p className="text-gray-600">
              Topic: <span className="font-medium">{results.topic}</span> • 
              Difficulty: <span className="font-medium capitalize">{results.difficulty}</span>
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Motivational Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <p className="text-xl text-gray-700 font-medium">
            {getMotivationalMessage()}
          </p>
        </motion.div>

        {/* Score Card */}
        <div className="mb-8">
          <ScoreCard results={results} />
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <RetakeButton onRetake={onRetake} onNewQuiz={onNewQuiz} />
        </motion.div>

        {/* Share Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mb-8"
        >
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Share Your Results
            </h3>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  const text = `I just scored ${results.percentage}% on a ${results.topic} quiz! 🎯`;
                  if (navigator.share) {
                    navigator.share({ text });
                  } else {
                    navigator.clipboard.writeText(text);
                    alert('Results copied to clipboard!');
                  }
                }}
                className="
                  flex items-center space-x-2 px-4 py-2 
                  bg-blue-500 hover:bg-blue-600 text-white rounded-lg
                  transition-colors duration-200
                "
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                <span>Share</span>
              </button>
              
              <button
                onClick={() => {
                  const dataStr = JSON.stringify(results, null, 2);
                  const dataBlob = new Blob([dataStr], { type: 'application/json' });
                  const url = URL.createObjectURL(dataBlob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `quiz-results-${Date.now()}.json`;
                  link.click();
                  URL.revokeObjectURL(url);
                }}
                className="
                  flex items-center space-x-2 px-4 py-2 
                  border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg
                  transition-colors duration-200
                "
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Download</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Answer Review */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <AnswerReview results={results} />
        </motion.div>

        {/* Quiz Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Quiz Statistics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {results.totalQuestions}
                </div>
                <div className="text-sm text-gray-600">Total Questions</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {results.correctAnswers}
                </div>
                <div className="text-sm text-gray-600">Correct</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {results.totalQuestions - results.correctAnswers}
                </div>
                <div className="text-sm text-gray-600">Incorrect</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(results.timeTaken / results.totalQuestions)}s
                </div>
                <div className="text-sm text-gray-600">Avg. Time</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResultsPage;
