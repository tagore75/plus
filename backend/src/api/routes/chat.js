const express = require('express');
const { body, validationResult } = require('express-validator');
const { Conversation, Message } = require('../../models');
const aiService = require('../../services/aiService');

const router = express.Router();

// Get all conversations for user
router.get('/conversations', async (req, res) => {
  try {
    const conversations = await Conversation.findAll({
      where: { userId: req.userId },
      order: [['updatedAt', 'DESC']],
      include: [{
        model: Message,
        as: 'messages',
        limit: 1,
        order: [['createdAt', 'DESC']]
      }]
    });

    res.json({ conversations });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      error: 'Failed to fetch conversations',
      message: '대화 목록을 불러오는 중 오류가 발생했습니다.'
    });
  }
});

// Get specific conversation with messages
router.get('/conversations/:id', async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      where: {
        id: req.params.id,
        userId: req.userId
      },
      include: [{
        model: Message,
        as: 'messages',
        order: [['createdAt', 'ASC']]
      }]
    });

    if (!conversation) {
      return res.status(404).json({
        error: 'Conversation not found',
        message: '대화를 찾을 수 없습니다.'
      });
    }

    res.json({ conversation });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({
      error: 'Failed to fetch conversation',
      message: '대화를 불러오는 중 오류가 발생했습니다.'
    });
  }
});

// Create new conversation
router.post('/conversations',
  [body('type').optional().isIn(['general', 'medical', 'emergency', 'welfare'])],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { type = 'general', title } = req.body;

      const conversation = await Conversation.create({
        userId: req.userId,
        type,
        title: title || '새 대화'
      });

      res.status(201).json({ conversation });
    } catch (error) {
      console.error('Create conversation error:', error);
      res.status(500).json({
        error: 'Failed to create conversation',
        message: '대화 생성 중 오류가 발생했습니다.'
      });
    }
  }
);

// Send message and get AI response
router.post('/conversations/:id/messages',
  [body('content').trim().notEmpty()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { content } = req.body;
      const conversationId = req.params.id;

      // Verify conversation ownership
      const conversation = await Conversation.findOne({
        where: {
          id: conversationId,
          userId: req.userId
        }
      });

      if (!conversation) {
        return res.status(404).json({
          error: 'Conversation not found',
          message: '대화를 찾을 수 없습니다.'
        });
      }

      // Save user message
      const userMessage = await Message.create({
        conversationId,
        role: 'user',
        content
      });

      // Get conversation history
      const messages = await Message.findAll({
        where: { conversationId },
        order: [['createdAt', 'ASC']],
        limit: 20 // Last 20 messages for context
      });

      // Get AI response
      const aiResponse = await aiService.chat(
        messages.map(m => ({ role: m.role, content: m.content })),
        conversation.type
      );

      // Save assistant message
      const assistantMessage = await Message.create({
        conversationId,
        role: 'assistant',
        content: aiResponse.content,
        tokens: aiResponse.usage.output_tokens
      });

      // Update conversation title if it's the first message
      if (messages.length === 1) {
        const title = content.substring(0, 50) + (content.length > 50 ? '...' : '');
        await conversation.update({ title });
      }

      res.json({
        userMessage,
        assistantMessage,
        usage: aiResponse.usage
      });
    } catch (error) {
      console.error('Send message error:', error);
      res.status(500).json({
        error: 'Failed to send message',
        message: '메시지 전송 중 오류가 발생했습니다.'
      });
    }
  }
);

// Analyze symptoms
router.post('/analyze-symptoms',
  [body('symptoms').trim().notEmpty()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { symptoms } = req.body;
      const userInfo = {
        age: req.user.dateOfBirth ? new Date().getFullYear() - new Date(req.user.dateOfBirth).getFullYear() : null,
        gender: req.user.gender,
        chronicConditions: req.user.chronicConditions,
        allergies: req.user.allergies
      };

      const analysis = await aiService.analyzeSymptoms(symptoms, userInfo);

      res.json({ analysis });
    } catch (error) {
      console.error('Symptom analysis error:', error);
      res.status(500).json({
        error: 'Failed to analyze symptoms',
        message: '증상 분석 중 오류가 발생했습니다.'
      });
    }
  }
);

module.exports = router;
