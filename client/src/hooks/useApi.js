import { useState, useCallback } from 'react';
import { quizService } from '../services/quizService';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (apiCall) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiCall();
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message || 'An error occurred');
      setLoading(false);
      throw err;
    }
  }, []);

  const generateQuiz = useCallback((config) => {
    return request(() => quizService.generateQuiz(config));
  }, [request]);

  const generateExplanation = useCallback((question, correctAnswer, userAnswer) => {
    return request(() => quizService.generateExplanation(question, correctAnswer, userAnswer));
  }, [request]);

  const checkHealth = useCallback(() => {
    return request(() => quizService.checkHealth());
  }, [request]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    generateQuiz,
    generateExplanation,
    checkHealth,
    clearError
  };
};

export default useApi;
