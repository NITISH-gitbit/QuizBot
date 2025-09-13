const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }
    
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Available models: gemini-1.5-flash, gemini-1.5-pro, gemini-pro
    this.model = this.genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 8192,
      }
    });
  }

  // Generate quiz prompt
  generateQuizPrompt(topic, difficulty, type, count) {
    const typeInstructions = type === 'mcq' 
      ? 'For MCQs, provide exactly 4 options without any labels (A, B, C, D will be added by the frontend)'
      : 'For true/false, options should be ["True", "False"]';

    return `Generate ${count} ${difficulty} difficulty ${type} questions about ${topic}.

Format the response as valid JSON with this exact structure:
{
  "questions": [
    {
      "question": "Question text here",
      "options": ["Option 1 text", "Option 2 text", "Option 3 text", "Option 4 text"],
      "correctAnswer": "Option 1 text",
      "explanation": "Brief explanation of why this is correct"
    }
  ]
}

Requirements:
- Questions should be clear and unambiguous
- ${typeInstructions}
- Do NOT include A, B, C, D labels in the options array - provide only the option text
- Include educational explanations for each answer
- Ensure ${difficulty} appropriate difficulty level
- correctAnswer must exactly match one of the options text
- Use proper grammar and spelling
- Make questions engaging and educational
- Avoid trick questions or ambiguous wording

Return ONLY the JSON object, no additional text.`;
  }

  // Generate explanation prompt
  generateExplanationPrompt(question, correctAnswer, userAnswer) {
    return `Given this question: "${question}"
Correct answer: "${correctAnswer}"
User's answer: "${userAnswer}"

Provide a clear, educational explanation (max 150 words) of:
1. Why the correct answer is right
2. Why the user's answer is wrong (if applicable)
3. Additional context or learning points

Keep the tone encouraging and educational.`;
  }

  // Main quiz generation method
  async generateQuiz(topic, difficulty, questionType, numberOfQuestions, totalTime = null) {
    try {
      // Default total time to numberOfQuestions * 60 if not provided
      const finalTotalTime = totalTime || (numberOfQuestions * 60);
      
      console.log(`Generating ${numberOfQuestions} ${difficulty} ${questionType} questions about ${topic} with ${finalTotalTime}s total time`);
      
      const prompt = this.generateQuizPrompt(topic, difficulty, questionType, numberOfQuestions);
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('Raw Gemini response:', text);
      
      // Clean the response - remove markdown formatting if present
      let cleanedText = text.trim();
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      // Parse JSON
      let quizData;
      try {
        quizData = JSON.parse(cleanedText);
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        console.error('Cleaned text:', cleanedText);
        throw new Error('Failed to parse quiz data from Gemini response');
      }
      
      // Validate the structure
      if (!quizData.questions || !Array.isArray(quizData.questions)) {
        throw new Error('Invalid quiz structure: missing questions array');
      }
      
      // Validate each question
      const validatedQuestions = quizData.questions.map((q, index) => {
        if (!q.question || !q.options || !q.correctAnswer || !q.explanation) {
          throw new Error(`Invalid question structure at index ${index}`);
        }
        
        if (!Array.isArray(q.options)) {
          throw new Error(`Invalid options format at question ${index}`);
        }
        
        if (!q.options.includes(q.correctAnswer)) {
          console.warn(`Warning: Correct answer not in options for question ${index}`);
          // Fix by using the first option as correct answer
          q.correctAnswer = q.options[0];
        }
        
        return {
          question: q.question.trim(),
          options: q.options.map(opt => opt.trim()),
          correctAnswer: q.correctAnswer.trim(),
          explanation: q.explanation.trim(),
          difficulty,
          type: questionType
        };
      });
      
      const finalQuiz = {
        id: Date.now().toString(),
        topic: topic.trim(),
        difficulty,
        questionType,
        numberOfQuestions: validatedQuestions.length,
        totalTime: finalTotalTime,
        questions: validatedQuestions,
        createdAt: new Date().toISOString()
      };
      
      console.log(`Successfully generated ${validatedQuestions.length} questions with ${finalTotalTime}s total time`);
      return finalQuiz;
      
    } catch (error) {
      console.error('Error generating quiz:', error);
      
      if (error.message.includes('API_KEY')) {
        throw new Error('Invalid API key configuration');
      }
      
      if (error.message.includes('quota') || error.message.includes('limit')) {
        throw new Error('API quota exceeded. Please try again later.');
      }
      
      throw new Error(`Failed to generate quiz: ${error.message}`);
    }
  }

  // Generate explanation for wrong answers
  async generateExplanation(question, correctAnswer, userAnswer) {
    try {
      if (correctAnswer === userAnswer) {
        return "Correct! Well done.";
      }
      
      const prompt = this.generateExplanationPrompt(question, correctAnswer, userAnswer);
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const explanation = response.text().trim();
      
      return explanation;
      
    } catch (error) {
      console.error('Error generating explanation:', error);
      return `The correct answer is "${correctAnswer}". Your answer "${userAnswer}" was incorrect.`;
    }
  }

  // Test API connectivity
  async testConnection() {
    try {
      const result = await this.model.generateContent("Say 'Hello' in response to this test message.");
      const response = await result.response;
      const text = response.text();
      
      return {
        status: 'connected',
        message: 'Gemini API is working',
        response: text.trim()
      };
    } catch (error) {
      console.error('Gemini API test failed:', error);
      return {
        status: 'error',
        message: error.message
      };
    }
  }
}

module.exports = new GeminiService();
