const express = require('express');
const router = express.Router();
const geminiController = require('../controllers/geminiController');

// GET /api/gemini/status - Get Gemini API configuration status
router.get('/status', geminiController.getStatus);

// GET /api/gemini/test - Test Gemini API connectivity
router.get('/test', geminiController.testConnection);

module.exports = router;
