const express = require('express');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Welfare programs data (mock - would integrate with government API)
const WELFARE_PROGRAMS = [
  {
    id: '1',
    name: '의료급여',
    category: 'medical_support',
    description: '저소득층 의료비 지원 제도',
    eligibility: '기초생활수급자, 차상위계층',
    benefits: '병원비 무료 또는 감면',
    application: '주민센터 방문 신청',
    contact: '129 (보건복지상담센터)'
  },
  {
    id: '2',
    name: '긴급복지지원',
    category: 'emergency_support',
    description: '갑작스러운 위기상황으로 생계유지가 어려운 가구 지원',
    eligibility: '소득 및 재산 기준 충족',
    benefits: '생계비, 의료비, 주거비 등 지원',
    application: '주민센터 또는 129 전화 신청',
    contact: '129'
  },
  {
    id: '3',
    name: '노인장기요양보험',
    category: 'elderly_care',
    description: '고령이나 노인성 질병으로 일상생활이 어려운 노인 지원',
    eligibility: '65세 이상 또는 노인성질환자',
    benefits: '방문요양, 방문목욕, 주·야간보호 등',
    application: '국민건강보험공단 신청',
    contact: '1577-1000'
  },
  {
    id: '4',
    name: '장애인활동지원',
    category: 'disability_support',
    description: '장애인의 자립생활과 사회참여 지원',
    eligibility: '만 6세~65세 미만 장애인',
    benefits: '활동보조, 방문목욕, 방문간호',
    application: '읍면동 주민센터',
    contact: '129'
  },
  {
    id: '5',
    name: '영유아 건강검진',
    category: 'child_health',
    description: '영유아 성장 발달 확인 및 건강증진',
    eligibility: '생후 4개월~71개월 영유아',
    benefits: '무료 건강검진',
    application: '검진기관 방문',
    contact: '1577-1000'
  }
];

// Get all welfare programs
router.get('/programs', (req, res) => {
  try {
    const { category } = req.query;

    let programs = WELFARE_PROGRAMS;

    if (category) {
      programs = programs.filter(p => p.category === category);
    }

    res.json({
      programs,
      categories: [
        { id: 'medical_support', name: '의료지원' },
        { id: 'emergency_support', name: '긴급지원' },
        { id: 'elderly_care', name: '노인요양' },
        { id: 'disability_support', name: '장애인지원' },
        { id: 'child_health', name: '아동건강' }
      ]
    });
  } catch (error) {
    console.error('Get welfare programs error:', error);
    res.status(500).json({
      error: 'Failed to fetch welfare programs',
      message: '복지 프로그램 정보를 불러오는 중 오류가 발생했습니다.'
    });
  }
});

// Get specific program
router.get('/programs/:id', (req, res) => {
  try {
    const program = WELFARE_PROGRAMS.find(p => p.id === req.params.id);

    if (!program) {
      return res.status(404).json({
        error: 'Program not found',
        message: '해당 복지 프로그램을 찾을 수 없습니다.'
      });
    }

    res.json({ program });
  } catch (error) {
    console.error('Get program error:', error);
    res.status(500).json({
      error: 'Failed to fetch program',
      message: '복지 프로그램 정보를 불러오는 중 오류가 발생했습니다.'
    });
  }
});

// Check eligibility (simplified - would use actual eligibility logic)
router.post('/check-eligibility',
  [
    body('programId').notEmpty(),
    body('userInfo').isObject()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { programId, userInfo } = req.body;

      const program = WELFARE_PROGRAMS.find(p => p.id === programId);

      if (!program) {
        return res.status(404).json({
          error: 'Program not found',
          message: '해당 복지 프로그램을 찾을 수 없습니다.'
        });
      }

      // Simplified eligibility check (would use actual criteria)
      const eligible = true; // Placeholder

      res.json({
        program,
        eligible,
        message: eligible
          ? '수급 자격이 있을 것으로 예상됩니다. 정확한 확인을 위해 해당 기관에 문의하세요.'
          : '수급 자격 요건을 충족하지 못할 수 있습니다. 자세한 내용은 해당 기관에 문의하세요.',
        nextSteps: [
          '신청 서류 준비',
          '주민센터 또는 해당 기관 방문',
          '상담 및 신청서 작성',
          '서류 심사',
          '결과 통보'
        ]
      });
    } catch (error) {
      console.error('Check eligibility error:', error);
      res.status(500).json({
        error: 'Failed to check eligibility',
        message: '자격 확인 중 오류가 발생했습니다.'
      });
    }
  }
);

module.exports = router;
