// Format time from seconds to readable format
export const formatTime = (seconds) => {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  
  if (mins < 60) {
    return `${mins}m ${secs}s`;
  }
  
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  return `${hours}h ${remainingMins}m ${secs}s`;
};

// Get performance grade based on percentage
export const getPerformanceGrade = (percentage) => {
  if (percentage >= 95) return { grade: 'A+', color: 'emerald' };
  if (percentage >= 90) return { grade: 'A', color: 'green' };
  if (percentage >= 85) return { grade: 'A-', color: 'green' };
  if (percentage >= 80) return { grade: 'B+', color: 'blue' };
  if (percentage >= 75) return { grade: 'B', color: 'blue' };
  if (percentage >= 70) return { grade: 'B-', color: 'blue' };
  if (percentage >= 65) return { grade: 'C+', color: 'yellow' };
  if (percentage >= 60) return { grade: 'C', color: 'yellow' };
  if (percentage >= 55) return { grade: 'C-', color: 'yellow' };
  if (percentage >= 50) return { grade: 'D', color: 'orange' };
  return { grade: 'F', color: 'red' };
};

// Generate encouragement message based on score
export const getEncouragementMessage = (percentage) => {
  if (percentage === 100) return "Perfect! You're absolutely brilliant! 🏆";
  if (percentage >= 95) return "Outstanding! Near perfect performance! 🌟";
  if (percentage >= 90) return "Excellent work! You really know your stuff! 🎉";
  if (percentage >= 80) return "Great job! You did very well! 👏";
  if (percentage >= 70) return "Good work! Keep up the good effort! 💪";
  if (percentage >= 60) return "Not bad! There's room for improvement! 📈";
  if (percentage >= 50) return "You're getting there! Keep practicing! 📚";
  return "Don't give up! Every quiz helps you learn! 💡";
};

// Shuffle array elements
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Debounce function for search inputs
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Validate quiz configuration
export const validateQuizConfig = (config) => {
  const errors = [];
  
  if (!config.topic || config.topic.trim().length < 2) {
    errors.push('Topic must be at least 2 characters long');
  }
  
  if (!['easy', 'medium', 'hard'].includes(config.difficulty)) {
    errors.push('Invalid difficulty level');
  }
  
  if (!['mcq', 'true-false'].includes(config.questionType)) {
    errors.push('Invalid question type');
  }
  
  const numQuestions = parseInt(config.numberOfQuestions);
  if (isNaN(numQuestions) || numQuestions < 1 || numQuestions > 20) {
    errors.push('Number of questions must be between 1 and 20');
  }
  
  return errors;
};

// Generate option labels (A, B, C, D)
export const getOptionLabel = (index) => {
  return String.fromCharCode(65 + index);
};

// Calculate quiz statistics
export const calculateQuizStats = (results) => {
  const { answers, questions, timeTaken } = results;
  
  let totalCorrect = 0;
  let totalIncorrect = 0;
  let totalUnanswered = 0;
  let fastestQuestion = Infinity;
  let slowestQuestion = 0;
  let averageTime = 0;
  
  Object.values(answers).forEach(answer => {
    if (answer.isCorrect) {
      totalCorrect++;
    } else {
      totalIncorrect++;
    }
    
    const questionTime = answer.timeTaken || 0;
    if (questionTime > 0) {
      fastestQuestion = Math.min(fastestQuestion, questionTime);
      slowestQuestion = Math.max(slowestQuestion, questionTime);
    }
  });
  
  totalUnanswered = questions.length - Object.keys(answers).length;
  averageTime = timeTaken / questions.length;
  
  return {
    totalCorrect,
    totalIncorrect,
    totalUnanswered,
    fastestQuestion: fastestQuestion === Infinity ? 0 : fastestQuestion,
    slowestQuestion,
    averageTime: Math.round(averageTime)
  };
};

// Generate share text for quiz results
export const generateShareText = (results) => {
  const { topic, percentage, score, totalQuestions } = results;
  const grade = getPerformanceGrade(percentage);
  
  return `🎯 Just completed a ${topic} quiz!\n📊 Score: ${score}/${totalQuestions} (${percentage}%)\n🏆 Grade: ${grade.grade}\n\nTry QuizMaster for yourself! 🚀`;
};

// Local storage helpers
export const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
    return false;
  }
};

export const loadFromLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return defaultValue;
  }
};

export const removeFromLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Failed to remove from localStorage:', error);
    return false;
  }
};

// Combined helpers object
const helpers = {
  formatTime,
  getPerformanceGrade,
  getEncouragementMessage,
  shuffleArray,
  debounce,
  validateQuizConfig,
  getOptionLabel,
  calculateQuizStats,
  generateShareText,
  saveToLocalStorage,
  loadFromLocalStorage,
  removeFromLocalStorage
};

export default helpers;
