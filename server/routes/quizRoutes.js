const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const { quizGenerationRules, explanationRules, validateRequest } = require('../middleware/validation');

// POST /api/quiz/generate - Generate quiz using Gemini API
router.post('/generate', 
  quizGenerationRules,
  validateRequest,
  quizController.generateQuiz
);

// POST /api/quiz/explanation - Generate explanation for wrong answers
router.post('/explanation',
  explanationRules,
  validateRequest,
  quizController.generateExplanation
);

module.exports = router;
