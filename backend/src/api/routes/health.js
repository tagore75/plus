const express = require('express');
const { User } = require('../../models');

const router = express.Router();

// Get user health profile
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: [
        'id', 'name', 'dateOfBirth', 'gender', 'bloodType',
        'allergies', 'chronicConditions', 'emergencyContact'
      ]
    });

    res.json({ profile: user });
  } catch (error) {
    console.error('Get health profile error:', error);
    res.status(500).json({
      error: 'Failed to fetch health profile',
      message: '건강 프로필을 불러오는 중 오류가 발생했습니다.'
    });
  }
});

// Update health profile
router.put('/profile', async (req, res) => {
  try {
    const {
      bloodType,
      allergies,
      chronicConditions,
      emergencyContact
    } = req.body;

    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: '사용자를 찾을 수 없습니다.'
      });
    }

    await user.update({
      bloodType,
      allergies,
      chronicConditions,
      emergencyContact
    });

    res.json({
      message: '건강 프로필이 업데이트되었습니다.',
      profile: user
    });
  } catch (error) {
    console.error('Update health profile error:', error);
    res.status(500).json({
      error: 'Failed to update health profile',
      message: '건강 프로필 업데이트 중 오류가 발생했습니다.'
    });
  }
});

module.exports = router;
