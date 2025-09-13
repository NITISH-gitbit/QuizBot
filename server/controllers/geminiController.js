const geminiService = require('../services/geminiService');

class GeminiController {
  // Test Gemini API connectivity
  async testConnection(req, res, next) {
    try {
      console.log('Testing Gemini API connection...');
      
      const result = await geminiService.testConnection();
      
      res.status(200).json({
        success: true,
        ...result,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error in testConnection controller:', error);
      
      res.status(500).json({
        success: false,
        status: 'error',
        message: 'Failed to connect to Gemini API',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Get API status and usage info
  async getStatus(req, res, next) {
    try {
      const hasApiKey = !!process.env.GEMINI_API_KEY;
      const apiKeyMasked = hasApiKey 
        ? `${process.env.GEMINI_API_KEY.substring(0, 8)}...` 
        : 'Not configured';

      res.status(200).json({
        success: true,
        status: 'OK',
        message: 'Gemini service status',
        config: {
          hasApiKey,
          apiKeyMasked,
          //model: 'gemini-pro'
          model: 'gemini-2.5-flash'
        },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error in getStatus controller:', error);
      next(error);
    }
  }
}

module.exports = new GeminiController();
