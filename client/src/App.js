import React, { useState } from 'react';
import { BrowserRouter as Router, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QuizProvider, useQuiz } from './contexts/QuizContext';

// Components
import HomePage from './components/home/HomePage';
import QuizPage from './components/quiz/QuizPage';
import ResultsPage from './components/results/ResultsPage';

// App states
const APP_STATES = {
  HOME: 'home',
  QUIZ: 'quiz',
  RESULTS: 'results'
};

function AppContent() {
  const [appState, setAppState] = useState(APP_STATES.HOME);
  const { currentQuiz, currentSession, results, resetQuiz, startQuiz } = useQuiz();

  // Handle quiz start
  const handleStartQuiz = (quiz) => {
    startQuiz(quiz);
    setAppState(APP_STATES.QUIZ);
  };

  // Handle quiz completion
  const handleQuizComplete = (quizResults) => {
    setAppState(APP_STATES.RESULTS);
  };

  // Handle retake same quiz
  const handleRetake = () => {
    if (currentQuiz) {
      startQuiz(currentQuiz);
      setAppState(APP_STATES.QUIZ);
    }
  };

  // Handle new quiz
  const handleNewQuiz = () => {
    resetQuiz();
    setAppState(APP_STATES.HOME);
  };

  // Handle back to home
  const handleBackToHome = () => {
    resetQuiz();
    setAppState(APP_STATES.HOME);
  };

  // Render appropriate component based on state
  const renderCurrentPage = () => {
    switch (appState) {
      case APP_STATES.HOME:
        return <HomePage onStartQuiz={handleStartQuiz} />;
      
      case APP_STATES.QUIZ:
        if (!currentQuiz || !currentSession) {
          return <Navigate to="/" replace />;
        }
        return (
          <QuizPage 
            onComplete={handleQuizComplete}
            onBack={handleBackToHome}
          />
        );
      
      case APP_STATES.RESULTS:
        if (!results) {
          return <Navigate to="/" replace />;
        }
        return (
          <ResultsPage
            results={results}
            onRetake={handleRetake}
            onNewQuiz={handleNewQuiz}
          />
        );
      
      default:
        return <HomePage onStartQuiz={handleStartQuiz} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderCurrentPage()}
      
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 2000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
}

function App() {
  return (
    <QuizProvider>
      <Router>
        <AppContent />
      </Router>
    </QuizProvider>
  );
}

export default App;
