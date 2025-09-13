const { body, param, query, validationResult } = require('express-validator');

// Validation middleware
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: true,
      message: 'Validation failed',
      details: errors.array()
    });
  }
  
  next();
};

// Quiz generation validation rules
const quizGenerationRules = [
  body('topic')
    .trim()
    .notEmpty()
    .withMessage('Topic is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Topic must be between 2-100 characters'),
  
  body('difficulty')
    .isIn(['easy', 'medium', 'hard'])
    .withMessage('Difficulty must be easy, medium, or hard'),
  
  body('questionType')
    .isIn(['mcq', 'true-false'])
    .withMessage('Question type must be mcq or true-false'),
  
  body('numberOfQuestions')
    .isInt({ min: 1, max: 20 })
    .withMessage('Number of questions must be between 1-20')
];

// Explanation generation validation rules
const explanationRules = [
  body('question')
    .trim()
    .notEmpty()
    .withMessage('Question is required'),
  
  body('correctAnswer')
    .trim()
    .notEmpty()
    .withMessage('Correct answer is required'),
  
  body('userAnswer')
    .trim()
    .notEmpty()
    .withMessage('User answer is required')
];

module.exports = {
  validateRequest,
  quizGenerationRules,
  explanationRules
};
