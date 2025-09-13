const geminiService = require('../services/geminiService');

class QuizController {
  // Generate quiz using Gemini API
  async generateQuiz(req, res, next) {
    try {
      const { topic, difficulty, questionType, numberOfQuestions, totalTime } = req.body;

      console.log('Quiz generation request:', { topic, difficulty, questionType, numberOfQuestions, totalTime });

      // Validate required fields
      if (!topic || !difficulty || !questionType || !numberOfQuestions) {
        return res.status(400).json({
          error: true,
          message: 'Missing required fields: topic, difficulty, questionType, numberOfQuestions'
        });
      }

      // Validate field values
      const validDifficulties = ['easy', 'medium', 'hard'];
      const validQuestionTypes = ['mcq', 'true-false'];

      if (!validDifficulties.includes(difficulty)) {
        return res.status(400).json({
          error: true,
          message: 'Invalid difficulty. Must be one of: easy, medium, hard'
        });
      }

      if (!validQuestionTypes.includes(questionType)) {
        return res.status(400).json({
          error: true,
          message: 'Invalid question type. Must be one of: mcq, true-false'
        });
      }

      if (numberOfQuestions < 1 || numberOfQuestions > 20) {
        return res.status(400).json({
          error: true,
          message: 'Number of questions must be between 1 and 20'
        });
      }

      // Calculate suggested minimum time based on difficulty and question type
      const getSuggestedMinTime = (difficulty, questionType, numberOfQuestions) => {
        const baseTimePerQuestion = {
          'easy': questionType === 'mcq' ? 30 : 20,
          'medium': questionType === 'mcq' ? 45 : 30,
          'hard': questionType === 'mcq' ? 60 : 45
        };
        const timePerQuestion = baseTimePerQuestion[difficulty] || 45;
        return timePerQuestion * numberOfQuestions;
      };

      // Validate totalTime with dynamic minimum
      const validTotalTime = totalTime ? parseInt(totalTime) : getSuggestedMinTime(difficulty, questionType, numberOfQuestions);
      const minTime = getSuggestedMinTime(difficulty, questionType, numberOfQuestions);
      const maxTime = 1800; // 30 minutes

      if (validTotalTime < minTime) {
        return res.status(400).json({
          error: true,
          message: `Total time must be at least ${Math.ceil(minTime/60)} minutes for this configuration`
        });
      }

      if (validTotalTime > maxTime) {
        return res.status(400).json({
          error: true,
          message: 'Total time cannot exceed 30 minutes'
        });
      }

      // Generate quiz using Gemini
      const quiz = await geminiService.generateQuiz(
        topic.trim(),
        difficulty,
        questionType,
        numberOfQuestions,
        validTotalTime
      );

      res.status(200).json({
        success: true,
        message: 'Quiz generated successfully',
        ...quiz
      });

    } catch (error) {
      console.error('Error in generateQuiz controller:', error);
      next(error);
    }
  }

  // Generate explanation for wrong answers
  async generateExplanation(req, res, next) {
    try {
      const { question, correctAnswer, userAnswer } = req.body;

      console.log('Explanation request:', { question, correctAnswer, userAnswer });

      // Validate required fields
      if (!question || !correctAnswer || !userAnswer) {
        return res.status(400).json({
          error: true,
          message: 'Missing required fields: question, correctAnswer, userAnswer'
        });
      }

      // Generate explanation using Gemini
      const explanation = await geminiService.generateExplanation(
        question.trim(),
        correctAnswer.trim(),
        userAnswer.trim()
      );

      res.status(200).json({
        success: true,
        explanation
      });

    } catch (error) {
      console.error('Error in generateExplanation controller:', error);
      next(error);
    }
  }
}

module.exports = new QuizController();
