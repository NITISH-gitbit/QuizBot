import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { quizService } from '../services/quizService';

// Initial state
const initialState = {
  currentQuiz: null,
  currentSession: null,
  results: null,
  loading: false,
  error: null,
  quizHistory: []
};

// Action types
const QUIZ_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_QUIZ: 'SET_QUIZ',
  START_QUIZ: 'START_QUIZ',
  SUBMIT_ANSWER: 'SUBMIT_ANSWER',
  NEXT_QUESTION: 'NEXT_QUESTION',
  PREVIOUS_QUESTION: 'PREVIOUS_QUESTION',
  COMPLETE_QUIZ: 'COMPLETE_QUIZ',
  RESET_QUIZ: 'RESET_QUIZ',
  SET_RESULTS: 'SET_RESULTS'
};

// Quiz reducer
const quizReducer = (state, action) => {
  switch (action.type) {
    case QUIZ_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload, error: null };
    
    case QUIZ_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case QUIZ_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    
    case QUIZ_ACTIONS.SET_QUIZ:
      return { 
        ...state, 
        currentQuiz: action.payload, 
        loading: false, 
        error: null 
      };
    
    case QUIZ_ACTIONS.START_QUIZ:
      return {
        ...state,
        currentSession: {
          sessionId: Date.now().toString(),
          startTime: new Date().toISOString(),
          answers: {},
          currentQuestionIndex: 0,
          isCompleted: false,
          timeSpent: 0
        },
        results: null,
        error: null
      };
    
    case QUIZ_ACTIONS.SUBMIT_ANSWER:
      const { questionIndex, answer, isCorrect, timeTaken } = action.payload;
      return {
        ...state,
        currentSession: {
          ...state.currentSession,
          answers: {
            ...state.currentSession.answers,
            [questionIndex]: {
              selectedAnswer: answer,
              isCorrect,
              timeTaken: timeTaken || 0
            }
          }
        }
      };
    
    case QUIZ_ACTIONS.NEXT_QUESTION:
      const nextIndex = Math.min(
        state.currentSession.currentQuestionIndex + 1,
        state.currentQuiz.questions.length - 1
      );
      return {
        ...state,
        currentSession: {
          ...state.currentSession,
          currentQuestionIndex: nextIndex
        }
      };
    
    case QUIZ_ACTIONS.PREVIOUS_QUESTION:
      const prevIndex = Math.max(state.currentSession.currentQuestionIndex - 1, 0);
      return {
        ...state,
        currentSession: {
          ...state.currentSession,
          currentQuestionIndex: prevIndex
        }
      };
    
    case QUIZ_ACTIONS.COMPLETE_QUIZ:
      return {
        ...state,
        currentSession: {
          ...state.currentSession,
          isCompleted: true,
          endTime: new Date().toISOString()
        }
      };
    
    case QUIZ_ACTIONS.SET_RESULTS:
      return {
        ...state,
        results: action.payload,
        quizHistory: [...state.quizHistory, action.payload]
      };
    
    case QUIZ_ACTIONS.RESET_QUIZ:
      return {
        ...initialState
      };
    
    default:
      return state;
  }
};

// Create context
const QuizContext = createContext();

// Quiz provider component
export const QuizProvider = ({ children }) => {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  // Helper function to calculate quiz results
  const calculateResults = useCallback((quiz, session) => {
    const answers = session.answers;
    const totalQuestions = quiz.questions.length;
    let correctAnswers = 0;
    let totalTimeTaken = 0;

    // Calculate score and time
    Object.values(answers).forEach(answer => {
      if (answer.isCorrect) correctAnswers++;
      totalTimeTaken += answer.timeTaken || 0;
    });

    const score = correctAnswers;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    
    // Determine performance message
    let performanceMessage = '';
    if (percentage >= 90) performanceMessage = 'Excellent! Outstanding performance!';
    else if (percentage >= 80) performanceMessage = 'Great job! Well done!';
    else if (percentage >= 70) performanceMessage = 'Good work! Keep it up!';
    else if (percentage >= 60) performanceMessage = 'Not bad! Room for improvement.';
    else performanceMessage = 'Keep practicing! You can do better!';

    return {
      quizId: quiz.id,
      sessionId: session.sessionId,
      topic: quiz.topic,
      difficulty: quiz.difficulty,
      questionType: quiz.questionType,
      totalQuestions,
      correctAnswers,
      score,
      percentage,
      timeTaken: totalTimeTaken,
      performanceMessage,
      answers: answers,
      questions: quiz.questions,
      completedAt: new Date().toISOString(),
      startTime: session.startTime,
      endTime: session.endTime
    };
  }, []);

  // Complete quiz and calculate results
  const completeQuiz = useCallback(async () => {
    if (!state.currentQuiz || !state.currentSession) {
      dispatch({ type: QUIZ_ACTIONS.SET_ERROR, payload: 'No active quiz session' });
      return;
    }

    try {
      dispatch({ type: QUIZ_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: QUIZ_ACTIONS.COMPLETE_QUIZ });

      // Calculate results
      const results = calculateResults(state.currentQuiz, state.currentSession);
      
      // Generate explanations for wrong answers
      const questionsWithExplanations = await Promise.all(
        state.currentQuiz.questions.map(async (question, index) => {
          const userAnswer = state.currentSession.answers[index];
          
          if (!userAnswer || userAnswer.isCorrect) {
            return {
              ...question,
              userAnswer: userAnswer?.selectedAnswer || 'Not answered',
              isCorrect: userAnswer?.isCorrect || false,
              customExplanation: userAnswer?.isCorrect ? 'Correct!' : question.explanation
            };
          }

          // Generate custom explanation for wrong answer
          try {
            const customExplanation = await quizService.generateExplanation(
              question.question,
              question.correctAnswer,
              userAnswer.selectedAnswer
            );
            
            return {
              ...question,
              userAnswer: userAnswer.selectedAnswer,
              isCorrect: false,
              customExplanation
            };
          } catch (error) {
            console.error('Error generating explanation:', error);
            return {
              ...question,
              userAnswer: userAnswer.selectedAnswer,
              isCorrect: false,
              customExplanation: question.explanation
            };
          }
        })
      );

      const finalResults = {
        ...results,
        questions: questionsWithExplanations
      };

      dispatch({ type: QUIZ_ACTIONS.SET_RESULTS, payload: finalResults });
      dispatch({ type: QUIZ_ACTIONS.SET_LOADING, payload: false });
      
      return finalResults;
    } catch (error) {
      console.error('Error completing quiz:', error);
      dispatch({ type: QUIZ_ACTIONS.SET_ERROR, payload: error.message });
    }
  }, [state.currentQuiz, state.currentSession, calculateResults]);

  // Generate quiz
  const generateQuiz = useCallback(async (config) => {
    try {
      dispatch({ type: QUIZ_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: QUIZ_ACTIONS.CLEAR_ERROR });

      const quiz = await quizService.generateQuiz(config);
      dispatch({ type: QUIZ_ACTIONS.SET_QUIZ, payload: quiz });
      
      return quiz;
    } catch (error) {
      console.error('Error generating quiz:', error);
      dispatch({ type: QUIZ_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  }, []);

  // Start quiz session
  const startQuiz = useCallback((quiz) => {
    if (!quiz || !quiz.questions || quiz.questions.length === 0) {
      dispatch({ type: QUIZ_ACTIONS.SET_ERROR, payload: 'Invalid quiz data' });
      return;
    }
    
    dispatch({ type: QUIZ_ACTIONS.START_QUIZ });
  }, []);

  // Submit answer for current question
  const submitAnswer = useCallback((questionIndex, selectedAnswer, timeTaken = 0) => {
    if (!state.currentQuiz || !state.currentSession) {
      dispatch({ type: QUIZ_ACTIONS.SET_ERROR, payload: 'No active quiz session' });
      return;
    }

    const question = state.currentQuiz.questions[questionIndex];
    if (!question) {
      dispatch({ type: QUIZ_ACTIONS.SET_ERROR, payload: 'Invalid question index' });
      return;
    }

    const isCorrect = question.correctAnswer === selectedAnswer;
    
    dispatch({
      type: QUIZ_ACTIONS.SUBMIT_ANSWER,
      payload: {
        questionIndex,
        answer: selectedAnswer,
        isCorrect,
        timeTaken
      }
    });

    return isCorrect;
  }, [state.currentQuiz, state.currentSession]);

  // Navigate to next question
  const nextQuestion = useCallback(() => {
    if (!state.currentSession || !state.currentQuiz) return;
    
    const isLastQuestion = state.currentSession.currentQuestionIndex >= state.currentQuiz.questions.length - 1;
    
    if (isLastQuestion) {
      // Auto-complete quiz if on last question - call completeQuiz directly
      completeQuiz();
    } else {
      dispatch({ type: QUIZ_ACTIONS.NEXT_QUESTION });
    }
  }, [state.currentSession, state.currentQuiz, completeQuiz]);

  // Navigate to previous question
  const previousQuestion = useCallback(() => {
    dispatch({ type: QUIZ_ACTIONS.PREVIOUS_QUESTION });
  }, []);

  // Reset quiz state
  const resetQuiz = useCallback(() => {
    dispatch({ type: QUIZ_ACTIONS.RESET_QUIZ });
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: QUIZ_ACTIONS.CLEAR_ERROR });
  }, []);

  // Get current question
  const getCurrentQuestion = useCallback(() => {
    if (!state.currentQuiz || !state.currentSession) return null;
    
    const index = state.currentSession.currentQuestionIndex;
    return state.currentQuiz.questions[index] || null;
  }, [state.currentQuiz, state.currentSession]);

  // Check if question is answered
  const isQuestionAnswered = useCallback((questionIndex) => {
    if (!state.currentSession) return false;
    return state.currentSession.answers[questionIndex] !== undefined;
  }, [state.currentSession]);

  // Get quiz progress
  const getQuizProgress = useCallback(() => {
    if (!state.currentQuiz || !state.currentSession) return { current: 0, total: 0, percentage: 0 };
    
    const current = state.currentSession.currentQuestionIndex + 1;
    const total = state.currentQuiz.questions.length;
    const answered = Object.keys(state.currentSession.answers).length;
    const percentage = Math.round((answered / total) * 100);
    
    return { current, total, answered, percentage };
  }, [state.currentQuiz, state.currentSession]);

  const value = {
    // State
    ...state,
    
    // Actions
    generateQuiz,
    startQuiz,
    submitAnswer,
    nextQuestion,
    previousQuestion,
    completeQuiz,
    resetQuiz,
    clearError,
    
    // Helpers
    getCurrentQuestion,
    isQuestionAnswered,
    getQuizProgress
  };

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
};

// Custom hook to use quiz context
export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};

export default QuizContext;
