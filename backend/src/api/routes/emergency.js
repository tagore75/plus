const express = require('express');
const { body, validationResult } = require('express-validator');
const aiService = require('../../services/aiService');

const router = express.Router();

// Emergency contacts
const EMERGENCY_CONTACTS = {
  korea: {
    emergency: '119',
    police: '112',
    fire: '119',
    poison: '1339',
    mental_health: '1577-0199',
    child_abuse: '112',
    women_hotline: '1366'
  }
};

// Get emergency contacts
router.get('/contacts', (req, res) => {
  res.json({
    contacts: EMERGENCY_CONTACTS.korea,
    message: '긴급 상황 시 주저하지 말고 119에 연락하세요.'
  });
});

// Get emergency guidance
router.post('/guidance',
  [body('situation').trim().notEmpty()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { situation } = req.body;

      const guidance = await aiService.getEmergencyGuidance(situation);

      res.json({
        guidance,
        emergencyNumber: '119',
        warning: '생명이 위험한 상황이라면 즉시 119에 연락하세요.'
      });
    } catch (error) {
      console.error('Emergency guidance error:', error);
      res.status(500).json({
        error: 'Failed to get emergency guidance',
        message: '응급 처치 정보를 불러오는 중 오류가 발생했습니다.',
        emergencyNumber: '119'
      });
    }
  }
);

// Find nearby hospitals (mock data - would integrate with real API)
router.post('/nearby-hospitals',
  [
    body('latitude').isFloat(),
    body('longitude').isFloat()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { latitude, longitude, radius = 5 } = req.body;

      // Mock data - in production, integrate with actual hospital API
      const hospitals = [
        {
          id: '1',
          name: '서울대학교병원',
          type: 'general',
          emergency: true,
          distance: 2.3,
          phone: '02-2072-2114',
          address: '서울특별시 종로구 대학로 101',
          coordinates: { lat: 37.5799, lng: 127.0017 }
        },
        {
          id: '2',
          name: '삼성서울병원',
          type: 'general',
          emergency: true,
          distance: 3.8,
          phone: '02-3410-2114',
          address: '서울특별시 강남구 일원로 81',
          coordinates: { lat: 37.4885, lng: 127.0856 }
        },
        {
          id: '3',
          name: '세브란스병원',
          type: 'general',
          emergency: true,
          distance: 4.2,
          phone: '02-2228-5800',
          address: '서울특별시 서대문구 연세로 50-1',
          coordinates: { lat: 37.5626, lng: 126.9409 }
        }
      ];

      res.json({
        hospitals,
        location: { latitude, longitude },
        radius,
        message: '가까운 응급실 정보입니다. 응급 상황 시 119를 이용하세요.'
      });
    } catch (error) {
      console.error('Find hospitals error:', error);
      res.status(500).json({
        error: 'Failed to find hospitals',
        message: '병원 검색 중 오류가 발생했습니다.'
      });
    }
  }
);

// Emergency alert (would send to emergency contacts)
router.post('/alert',
  [
    body('message').trim().notEmpty(),
    body('location').optional()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { message, location } = req.body;

      // In production: Send SMS/notifications to emergency contacts
      console.log('Emergency Alert:', { message, location });

      res.json({
        success: true,
        message: '긴급 알림이 전송되었습니다.',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Emergency alert error:', error);
      res.status(500).json({
        error: 'Failed to send alert',
        message: '긴급 알림 전송 중 오류가 발생했습니다.'
      });
    }
  }
);

module.exports = router;
