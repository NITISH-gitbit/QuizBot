import React, { useState } from 'react';
import HeroSection from './HeroSection';
import QuizConfigModal from './QuizConfigModal';

const HomePage = ({ onStartQuiz }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStartQuiz = () => {
    setIsModalOpen(true);
  };

  const handleQuizGenerated = (quiz) => {
    onStartQuiz(quiz);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <HeroSection onStartQuiz={handleStartQuiz} />
      
      <QuizConfigModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onQuizGenerated={handleQuizGenerated}
      />
    </div>
  );
};

export default HomePage;
