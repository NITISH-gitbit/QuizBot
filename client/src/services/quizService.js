import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL ;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout for quiz generation
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || error.response.data?.error || error.message;
      throw new Error(message);
    } else if (error.request) {
      // Network error
      throw new Error('Network error. Please check your connection.');
    } else {
      // Other error
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
);

export const quizService = {
  // Generate quiz using Gemini API
  async generateQuiz(config) {
    try {
      const { topic, difficulty, questionType, numberOfQuestions, totalTime } = config;
      
      if (!topic || !difficulty || !questionType || !numberOfQuestions) {
        throw new Error('Missing required quiz configuration');
      }

      console.log('Generating quiz with config:', config);
      
      const response = await api.post('/quiz/generate', {
        topic: topic.trim(),
        difficulty,
        questionType,
        numberOfQuestions: parseInt(numberOfQuestions),
        totalTime: parseInt(totalTime) || (parseInt(numberOfQuestions) * 60)
      });

      if (!response.data || !response.data.questions) {
        throw new Error('Invalid response format from server');
      }

      return response.data;
    } catch (error) {
      console.error('Error generating quiz:', error);
      throw error;
    }
  },

  // Generate explanation for wrong answers
  async generateExplanation(question, correctAnswer, userAnswer) {
    try {
      if (!question || !correctAnswer || !userAnswer) {
        throw new Error('Missing required parameters for explanation');
      }

      console.log('Generating explanation for wrong answer');
      
      const response = await api.post('/quiz/explanation', {
        question,
        correctAnswer,
        userAnswer
      });

      return response.data.explanation || 'Explanation not available';
    } catch (error) {
      console.error('Error generating explanation:', error);
      // Return fallback explanation
      return `The correct answer is "${correctAnswer}". Your answer "${userAnswer}" was incorrect.`;
    }
  },

  // Check server health
  async checkHealth() {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  },

  // Check Gemini API status
  async checkGeminiStatus() {
    try {
      const response = await api.get('/gemini/status');
      return response.data;
    } catch (error) {
      console.error('Gemini status check failed:', error);
      throw error;
    }
  }
};

export default quizService;
