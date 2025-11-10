const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// Medical-specific system prompt
const MEDICAL_SYSTEM_PROMPT = `당신은 전문 의료 AI 어시스턴트입니다. 다음 지침을 따라주세요:

1. 역할과 책임:
   - 의료 정보 제공 및 건강 상담 지원
   - 증상에 대한 일반적인 정보 제공
   - 긴급 상황 식별 및 적절한 조치 안내
   - 약물 정보 및 건강 관리 조언

2. 중요한 제한사항:
   - 진단을 내리지 않습니다 (전문의 진단이 필요함을 안내)
   - 구체적인 치료법을 처방하지 않습니다
   - 응급 상황 시 즉시 119 연락을 권장합니다
   - 모든 조언은 참고용이며 전문의 상담을 대체할 수 없습니다

3. 대화 스타일:
   - 친절하고 공감적인 태도
   - 명확하고 이해하기 쉬운 설명
   - 의학 용어 사용 시 쉬운 설명 제공
   - 환자의 불안을 줄이는 따뜻한 응대

4. 긴급 상황 인식:
   - 심각한 증상 발견 시 즉시 응급실 방문 권고
   - 생명을 위협할 수 있는 상황 우선 처리
   - 119 연락이 필요한 경우 명확히 안내

5. 개인정보 보호:
   - 민감한 의료 정보는 안전하게 처리
   - 필요한 정보만 수집
   - HIPAA 및 개인정보보호법 준수

항상 환자의 안전을 최우선으로 하며, 의심스러운 경우 전문의 상담을 권장하세요.`;

class AIService {
  async chat(messages, conversationType = 'general') {
    try {
      // Prepare system prompt based on conversation type
      let systemPrompt = MEDICAL_SYSTEM_PROMPT;

      if (conversationType === 'emergency') {
        systemPrompt += '\n\n**긴급 상황 모드**: 빠르고 정확한 응급 처치 정보를 제공하고, 필요시 즉시 119 연락을 안내하세요.';
      } else if (conversationType === 'welfare') {
        systemPrompt += '\n\n**복지 상담 모드**: 의료비 지원, 건강보험, 정부 지원 프로그램 등 복지 관련 정보를 제공하세요.';
      }

      // Format messages for Claude API
      const formattedMessages = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      }));

      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        system: systemPrompt,
        messages: formattedMessages
      });

      return {
        content: response.content[0].text,
        usage: {
          input_tokens: response.usage.input_tokens,
          output_tokens: response.usage.output_tokens
        }
      };
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error('AI 서비스 오류가 발생했습니다.');
    }
  }

  async analyzeSymptoms(symptoms, userInfo) {
    try {
      const prompt = `다음 증상을 분석해주세요:

증상: ${symptoms}

사용자 정보:
- 나이: ${userInfo.age || '미제공'}
- 성별: ${userInfo.gender || '미제공'}
- 기저질환: ${userInfo.chronicConditions?.join(', ') || '없음'}
- 알레르기: ${userInfo.allergies?.join(', ') || '없음'}

다음 형식으로 응답해주세요:
1. 증상 요약
2. 가능한 원인 (일반적인 정보)
3. 응급 상황 여부
4. 권장 조치
5. 병원 방문 필요성`;

      const response = await this.chat([
        { role: 'user', content: prompt }
      ], 'medical');

      return response;
    } catch (error) {
      console.error('Symptom Analysis Error:', error);
      throw error;
    }
  }

  async getEmergencyGuidance(situation) {
    try {
      const prompt = `다음 긴급 상황에 대한 응급 처치 가이드를 제공해주세요:

상황: ${situation}

다음 형식으로 즉시 실행 가능한 단계별 가이드를 제공해주세요:
1. 즉시 취해야 할 행동
2. 해서는 안 되는 행동
3. 119 연락이 필요한 경우
4. 응급실 도착 전까지 유지해야 할 사항`;

      const response = await this.chat([
        { role: 'user', content: prompt }
      ], 'emergency');

      return response;
    } catch (error) {
      console.error('Emergency Guidance Error:', error);
      throw error;
    }
  }
}

module.exports = new AIService();
