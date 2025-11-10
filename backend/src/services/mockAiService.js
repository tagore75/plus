// Mock AI Service - API 키 없이도 동작하는 테스트용 서비스

class MockAiService {
  async chat(messages, conversationType = 'general') {
    // 마지막 사용자 메시지 가져오기
    const lastUserMessage = messages.filter(m => m.role === 'user').slice(-1)[0];
    const userInput = lastUserMessage?.content?.toLowerCase() || '';

    let response = '';

    // 의료 관련 키워드 감지 및 응답
    if (userInput.includes('두통') || userInput.includes('머리') || userInput.includes('headache')) {
      response = `두통에 대해 말씀하셨군요.

**일반적인 두통 원인:**
1. 긴장성 두통 - 스트레스, 피로
2. 편두통 - 유전적 요인
3. 탈수 - 수분 부족
4. 수면 부족

**권장사항:**
- 충분한 수분 섭취
- 적절한 휴식
- 스트레레스 관리
- 규칙적인 수면 패턴

⚠️ **주의:** 심한 두통, 갑작스러운 두통, 고열을 동반한 두통은 즉시 병원을 방문하세요.

더 구체적인 증상을 말씀해주시면 더 자세히 안내해드릴 수 있습니다.`;
    } else if (userInput.includes('감기') || userInput.includes('기침') || userInput.includes('콧물')) {
      response = `감기 증상에 대해 문의하셨습니다.

**일반적인 감기 증상:**
- 콧물, 코막힘
- 기침
- 인후통
- 미열
- 전신 피로

**자가 관리 방법:**
1. 충분한 휴식 (하루 8시간 이상 수면)
2. 수분 섭취 (물, 따뜻한 차)
3. 영양가 있는 식사
4. 손 자주 씻기

**병원 방문이 필요한 경우:**
- 38.5도 이상 고열
- 증상이 10일 이상 지속
- 호흡 곤란
- 심한 흉통

무리하지 마시고 푹 쉬세요. 증상이 심해지면 병원을 방문하세요.`;
    } else if (userInput.includes('복통') || userInput.includes('배') || userInput.includes('stomach')) {
      response = `복통에 대해 말씀하셨군요.

**복통의 위치와 원인:**
- 상복부: 위염, 소화불량
- 우상복부: 담낭염
- 하복부: 장염, 변비
- 전체: 장염, 식중독

**응급 상황 (즉시 119):**
- 극심한 통증
- 구토를 동반한 심한 복통
- 혈변
- 복부 팽만

**일반적인 대처:**
- 가벼운 식사
- 수분 섭취
- 휴식
- 소화가 잘 되는 음식

복통의 위치, 강도, 지속 시간을 더 자세히 알려주시면 더 정확한 정보를 드릴 수 있습니다.`;
    } else if (userInput.includes('긴급') || userInput.includes('응급') || userInput.includes('emergency')) {
      response = `🚨 **긴급 상황 대응**

**즉시 119에 연락해야 하는 경우:**
- 의식 불명
- 호흡 곤란
- 심한 흉통
- 심한 출혈
- 심한 화상
- 골절 의심

**119 전화 시 알려야 할 정보:**
1. 정확한 위치
2. 환자 상태
3. 발생 시간
4. 환자 나이/성별

**응급처치 기본 원칙:**
- 환자를 안전한 곳으로 이동
- 119 연락
- 환자 상태 관찰
- 필요시 심폐소생술

생명이 위급한 상황이라면 지금 즉시 119에 연락하세요!`;
    } else if (userInput.includes('약') || userInput.includes('medication') || userInput.includes('medicine')) {
      response = `약물에 대해 문의하셨습니다.

**일반 의약품 복용 시 주의사항:**
- 용법, 용량 준수
- 식전/식후 구분
- 다른 약과의 상호작용 확인
- 알레르기 반응 주의

**의사/약사와 상담이 필요한 경우:**
- 처음 복용하는 약
- 다른 약을 함께 복용 중
- 임신/수유 중
- 만성 질환이 있는 경우

⚠️ **중요:** 처방전 없이 임의로 약을 복용하거나 중단하지 마세요.
구체적인 약물명과 증상을 알려주시면 더 자세한 정보를 드릴 수 있습니다.`;
    } else if (userInput.includes('안녕') || userInput.includes('hello') || userInput.includes('hi')) {
      response = `안녕하세요! 👋 의료 AI 챗봇입니다.

저는 다음과 같은 도움을 드릴 수 있습니다:

🏥 **의료 상담**
- 증상에 대한 일반적인 정보
- 자가 관리 방법
- 병원 방문 필요성 판단

🚨 **긴급 상황**
- 응급 처치 가이드
- 긴급 연락처 안내

🤝 **복지 정보**
- 의료비 지원 프로그램
- 건강검진 정보

어떤 것이 궁금하신가요? 편하게 말씀해주세요.`;
    } else {
      response = `말씀하신 내용에 대해 도움을 드리겠습니다.

**일반적인 건강 관리 팁:**
- 규칙적인 운동 (주 3-5회, 30분)
- 균형잡힌 식사
- 충분한 수면 (7-8시간)
- 스트레스 관리
- 정기 건강검진

더 구체적인 증상이나 궁금하신 내용을 말씀해주시면, 더 정확한 정보를 제공해드리겠습니다.

예를 들어:
- "두통이 있어요"
- "감기 증상이 있어요"
- "복통이 있어요"
- "약 복용 방법이 궁금해요"

⚠️ **중요:** 이 정보는 참고용이며, 전문 의료인의 진단을 대체할 수 없습니다.`;
    }

    // 긴급 상황 타입인 경우 경고 추가
    if (conversationType === 'emergency') {
      response = `🚨 **긴급 상황 모드**\n\n${response}\n\n⚠️ 생명이 위급한 상황이라면 지금 즉시 119에 연락하세요!`;
    }

    return {
      content: response,
      usage: {
        input_tokens: 100,
        output_tokens: 200
      }
    };
  }

  async analyzeSymptoms(symptoms, userInfo) {
    const response = `**증상 분석 결과**

입력하신 증상: ${symptoms}

**사용자 정보:**
- 나이: ${userInfo.age || '미제공'}세
- 성별: ${userInfo.gender || '미제공'}
- 기저질환: ${userInfo.chronicConditions?.join(', ') || '없음'}
- 알레르기: ${userInfo.allergies?.join(', ') || '없음'}

**분석:**
1. **증상 요약**: 입력하신 증상에 대한 일반적인 정보입니다.

2. **가능한 원인**:
   - 일시적인 신체 반응
   - 환경적 요인
   - 스트레스 관련

3. **응급 상황 여부**:
   ${symptoms.includes('심한') || symptoms.includes('극심') ? '⚠️ 응급 상황 가능성 있음 - 즉시 병원 방문 권장' : '일반적인 증상으로 보임'}

4. **권장 조치**:
   - 증상 관찰
   - 충분한 휴식
   - 수분 섭취
   ${symptoms.includes('심한') || symptoms.includes('극심') ? '- **즉시 병원 방문**' : '- 증상 지속 시 병원 방문'}

5. **병원 방문 필요성**:
   ${symptoms.includes('심한') || symptoms.includes('극심') ? '**즉시 방문 필요**' : '증상이 3일 이상 지속되거나 악화되면 방문 권장'}

⚠️ 이 분석은 참고용이며, 정확한 진단은 의료 전문가와 상담하세요.`;

    return {
      content: response,
      usage: {
        input_tokens: 150,
        output_tokens: 250
      }
    };
  }

  async getEmergencyGuidance(situation) {
    const response = `**응급 상황: ${situation}**

🚨 **즉시 취해야 할 행동:**

1. **119 연락**
   - 즉시 119에 전화하세요
   - 정확한 위치를 알려주세요
   - 환자 상태를 설명하세요

2. **응급 처치**
   - 환자를 안전한 곳으로 이동
   - 의식 확인
   - 호흡 확인
   - 필요시 심폐소생술 준비

3. **해서는 안 되는 행동:**
   - 무리하게 환자를 움직이지 않기
   - 골절 부위 억지로 움직이지 않기
   - 화상 부위에 얼음 직접 대지 않기

4. **119 도착 전까지:**
   - 환자 상태 지속 관찰
   - 의식 확인 (대화 시도)
   - 호흡 확인
   - 상태 변화 기록

⚠️ **경고:** 이것은 일반적인 가이드입니다. 생명이 위급한 상황이라면 즉시 119에 연락하세요!

**응급 연락처:**
- 응급의료: 119
- 경찰: 112
- 독극물중독: 1339`;

    return {
      content: response,
      usage: {
        input_tokens: 100,
        output_tokens: 200
      }
    };
  }
}

module.exports = new MockAiService();
