# 의료용 AI 챗봇 (Medical AI Chatbot)

클로드(Claude)와 유사한 성능과 UI/UX를 제공하는 의료 특화 AI 챗봇 플랫폼입니다.

## 주요 기능

### 🏥 의료 서비스
- **증상 분석**: AI 기반 증상 분석 및 초기 진단 지원
- **건강 상담**: 24/7 의료 상담 서비스
- **약물 정보**: 약물 정보 조회 및 상호작용 확인
- **건강 기록 관리**: 개인 건강 기록 추적 및 관리

### 🚨 긴급상황 대응
- **긴급 전화 빠른 연결**: 119, 응급의료센터 원터치 연결
- **응급처치 가이드**: 상황별 응급처치 안내
- **위치 기반 병원 찾기**: 가까운 응급실 및 병원 검색
- **긴급 연락처 관리**: 보호자 자동 알림 시스템

### 🤝 복지 서비스
- **복지 혜택 안내**: 의료비 지원, 건강보험 정보
- **취약계층 지원**: 노인, 장애인 맞춤 서비스
- **예방 접종 관리**: 접종 일정 및 알림
- **건강검진 정보**: 검진 일정 및 결과 관리

### 💬 Claude 수준의 대화 능력
- **자연스러운 대화**: 고급 자연어 처리
- **맥락 이해**: 이전 대화 기억 및 연속성
- **다국어 지원**: 한국어, 영어 등 다국어 서비스
- **개인화**: 사용자 맞춤 응답

## 기술 스택

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **AI Integration**: Claude API / OpenAI API
- **Database**: PostgreSQL
- **Cache**: Redis

### Web Frontend
- **Framework**: React 18
- **UI Library**: Material-UI + Custom Claude-style Components
- **State Management**: Redux Toolkit
- **Real-time**: Socket.io
- **Styling**: Tailwind CSS + Emotion

### Mobile App
- **Framework**: React Native
- **Navigation**: React Navigation
- **Cross-platform**: iOS + Android
- **Native Modules**: 위치, 전화, 알림

## 프로젝트 구조

```
plus/
├── backend/              # 백엔드 API 서버
│   ├── src/
│   │   ├── api/         # API 라우트
│   │   ├── services/    # 비즈니스 로직
│   │   ├── models/      # 데이터 모델
│   │   ├── middleware/  # 미들웨어
│   │   └── config/      # 설정
│   └── package.json
├── web/                  # 웹 프론트엔드
│   ├── src/
│   │   ├── components/  # React 컴포넌트
│   │   ├── pages/       # 페이지
│   │   ├── store/       # Redux 스토어
│   │   └── styles/      # 스타일
│   └── package.json
├── mobile/               # 모바일 앱
│   ├── src/
│   │   ├── components/
│   │   ├── screens/
│   │   └── navigation/
│   └── package.json
└── shared/               # 공유 코드
    └── types/           # TypeScript 타입
```

## 시작하기

### 필수 요구사항
- Node.js 18+
- npm 또는 yarn
- PostgreSQL 14+
- Redis (선택사항)

### 설치

```bash
# 백엔드 설치
cd backend
npm install

# 웹 프론트엔드 설치
cd ../web
npm install

# 모바일 앱 설치
cd ../mobile
npm install
```

### 환경 설정

각 폴더에 `.env` 파일을 생성하고 필요한 환경 변수를 설정합니다.

**backend/.env**:
```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/medical_chatbot
ANTHROPIC_API_KEY=your_claude_api_key
JWT_SECRET=your_jwt_secret
```

**web/.env**:
```env
REACT_APP_API_URL=http://localhost:3000
```

### 실행

```bash
# 백엔드 실행
cd backend
npm run dev

# 웹 프론트엔드 실행
cd web
npm start

# 모바일 앱 실행 (iOS)
cd mobile
npm run ios

# 모바일 앱 실행 (Android)
npm run android
```

## 보안 및 규정 준수

- **HIPAA 준수**: 의료 정보 보호 규정 준수
- **개인정보 보호**: 엔드투엔드 암호화
- **데이터 최소화**: 필요한 정보만 수집
- **감사 로그**: 모든 접근 기록

## 면책 조항

이 챗봇은 의료 정보 제공 목적이며, 전문 의료인의 진단과 치료를 대체할 수 없습니다. 응급 상황 시 즉시 119에 연락하시기 바랍니다.

## 라이선스

MIT License

## 기여

이슈 및 풀 리퀘스트를 환영합니다.
