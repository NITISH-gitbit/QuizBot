// API endpoints
export const API_ENDPOINTS = {
  BASE_URL: process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api',
  QUIZ: {
    GENERATE: '/quiz/generate',
    VALIDATE: '/quiz/validate'
  },
  GEMINI: {
    CHAT: '/gemini/chat'
  }
};

// Quiz configuration options
export const QUIZ_CONFIG = {
  DIFFICULTIES: [
    { value: 'easy', label: 'Easy', description: 'Basic level questions' },
    { value: 'medium', label: 'Medium', description: 'Intermediate level questions' },
    { value: 'hard', label: 'Hard', description: 'Advanced level questions' }
  ],
  
  QUESTION_TYPES: [
    { value: 'mcq', label: 'Multiple Choice', description: 'Questions with 4 options' },
    { value: 'true-false', label: 'True/False', description: 'Simple yes/no questions' }
  ],
  
  QUESTION_LIMITS: {
    MIN: 1,
    MAX: 20,
    DEFAULT: 10
  },
  
  TIME_LIMITS: {
    PER_QUESTION: 60, // seconds
    WARNING_TIME: 10  // show warning when 10 seconds left
  }
};

// UI configuration
export const UI_CONFIG = {
  COLORS: {
    PRIMARY: 'blue',
    SUCCESS: 'green',
    WARNING: 'yellow',
    DANGER: 'red',
    INFO: 'blue'
  },
  
  ANIMATIONS: {
    DURATION: {
      FAST: 150,
      NORMAL: 300,
      SLOW: 500
    },
    EASING: 'ease-in-out'
  },
  
  BREAKPOINTS: {
    SM: '640px',
    MD: '768px',
    LG: '1024px',
    XL: '1280px'
  }
};

// Local storage keys
export const STORAGE_KEYS = {
  QUIZ_HISTORY: 'quizmaster_history',
  USER_PREFERENCES: 'quizmaster_preferences',
  LAST_QUIZ_CONFIG: 'quizmaster_last_config'
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK: 'Network error. Please check your connection and try again.',
  INVALID_TOPIC: 'Please enter a valid topic (at least 2 characters).',
  INVALID_QUESTIONS: 'Number of questions must be between 1 and 20.',
  QUIZ_GENERATION_FAILED: 'Failed to generate quiz. Please try again.',
  QUESTION_LOAD_FAILED: 'Failed to load question. Please try again.',
  GENERIC: 'Something went wrong. Please try again.'
};

// Success messages
export const SUCCESS_MESSAGES = {
  QUIZ_GENERATED: 'Quiz generated successfully!',
  QUIZ_COMPLETED: 'Quiz completed! Check your results.',
  QUIZ_SUBMITTED: 'Answers submitted successfully!'
};

// Grade configurations
export const GRADE_CONFIG = {
  THRESHOLDS: {
    'A+': 95,
    'A': 90,
    'A-': 85,
    'B+': 80,
    'B': 75,
    'B-': 70,
    'C+': 65,
    'C': 60,
    'C-': 55,
    'D': 50,
    'F': 0
  },
  
  COLORS: {
    'A+': 'emerald-500',
    'A': 'green-500',
    'A-': 'green-400',
    'B+': 'blue-500',
    'B': 'blue-400',
    'B-': 'blue-300',
    'C+': 'yellow-500',
    'C': 'yellow-400',
    'C-': 'yellow-300',
    'D': 'orange-500',
    'F': 'red-500'
  }
};

// Quiz states
export const QUIZ_STATES = {
  IDLE: 'idle',
  CONFIGURING: 'configuring',
  LOADING: 'loading',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  ERROR: 'error'
};

// Question types
export const QUESTION_TYPES = {
  MCQ: 'mcq',
  TRUE_FALSE: 'true-false'
};

// Difficulty levels
export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
};

// Toast configuration
export const TOAST_CONFIG = {
  DURATION: 4000,
  POSITION: 'top-right',
  SUCCESS: {
    icon: '✅',
    style: {
      border: '1px solid #10b981',
      padding: '16px',
      color: '#065f46'
    }
  },
  ERROR: {
    icon: '❌',
    style: {
      border: '1px solid #ef4444',
      padding: '16px',
      color: '#991b1b'
    }
  },
  LOADING: {
    icon: '⏳',
    style: {
      border: '1px solid #3b82f6',
      padding: '16px',
      color: '#1e40af'
    }
  }
};

// API request timeouts
export const TIMEOUTS = {
  QUIZ_GENERATION: 30000, // 30 seconds
  QUESTION_SUBMIT: 10000,  // 10 seconds
  DEFAULT: 15000           // 15 seconds
};

// Popular quiz topics for suggestions
export const POPULAR_TOPICS = [
  'JavaScript',
  'React',
  'Python',
  'Data Science',
  'Machine Learning',
  'History',
  'Geography',
  'Science',
  'Mathematics',
  'Literature',
  'Sports',
  'Movies',
  'Music',
  'Art',
  'Technology'
];

// Performance messages
export const PERFORMANCE_MESSAGES = {
  PERFECT: [
    "Absolutely perfect! You're a genius! 🏆",
    "Flawless performance! Outstanding work! 🌟",
    "Perfect score! You really know your stuff! 🎯"
  ],
  EXCELLENT: [
    "Excellent work! You're doing great! 🎉",
    "Outstanding performance! Keep it up! 👏",
    "Fantastic job! You're really skilled! 🌟"
  ],
  GOOD: [
    "Good job! Solid performance! 💪",
    "Well done! You're on the right track! 📈",
    "Nice work! Keep improving! 👍"
  ],
  AVERAGE: [
    "Not bad! There's room for improvement! 📚",
    "You're getting there! Keep practicing! 💡",
    "Good effort! Keep learning! 🎯"
  ],
  POOR: [
    "Don't give up! Every quiz helps you learn! 💪",
    "Keep trying! Practice makes perfect! 📖",
    "Learning is a journey! You've got this! 🚀"
  ]
};

// Combined constants object
const constants = {
  API_ENDPOINTS,
  QUIZ_CONFIG,
  UI_CONFIG,
  STORAGE_KEYS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  GRADE_CONFIG,
  QUIZ_STATES,
  QUESTION_TYPES,
  DIFFICULTY_LEVELS,
  TOAST_CONFIG,
  TIMEOUTS,
  POPULAR_TOPICS,
  PERFORMANCE_MESSAGES
};

export default constants;
