# 의료용 AI 챗봇 + 인지학습 테트리스 게임 (Medical AI Chatbot + Cognitive Tetris Game)

클로드(Claude)와 유사한 성능과 UI/UX를 제공하는 의료 특화 AI 챗봇 플랫폼에 인지학습 개선을 위한 테트리스 게임이 추가되었습니다.

## 🚀 빠른 시작 (클릭만으로 실행!)

### 1단계: 설치

#### macOS / Linux
```bash
chmod +x setup.sh
./setup.sh
```

#### Windows
```cmd
setup.bat
```

### 2단계: 실행

#### macOS / Linux
```bash
./run.sh
```

#### Windows
```cmd
run.bat
```

자동으로 브라우저가 열리고 http://localhost:3001 에서 애플리케이션이 실행됩니다!

### 종료

#### macOS / Linux
```bash
./stop.sh
```

#### Windows
```cmd
stop.bat
```

## 📋 필수 요구사항

- **Node.js 18 이상** (https://nodejs.org/)
- 그게 전부입니다! 🎉

**별도 설치 불필요:**
- ✅ 데이터베이스 (SQLite 자동 사용)
- ✅ AI API 키 (Mock AI로 테스트 가능)
- ✅ PostgreSQL, Redis 등

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

### 🎮 인지학습 테트리스 게임 (신규!)
- **인지능력 향상**: 게임을 통한 두뇌 훈련 및 인지 능력 개선
- **레벨 시스템**: 10줄마다 자동 레벨업, 난이도 점진적 증가
- **인지 메트릭 추적**:
  - 반응 시간 측정 및 분석
  - 정확도 계산 (성공적인 블록 배치율)
  - 패턴 인식 능력 평가 (효율적인 줄 제거)
  - 의사결정 속도 측정
  - 공간 인식 능력 평가
- **상세 통계 및 진행도**:
  - 게임 기록 추적 (총 게임 수, 최고 점수, 평균 점수)
  - 인지 점수 계산 (0-100점)
  - 난이도 추천 시스템
  - 개인 맞춤 학습 팁 제공
- **직관적인 컨트롤**: 터치 기반 간편 조작
- **하드 드롭**: 빠른 게임 진행을 위한 즉시 낙하 기능
- **일시정지/재개**: 언제든 게임 중단 및 재개 가능

## 기술 스택

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite (자동 설정)
- **AI**: Mock AI (테스트용) / Claude API (선택사항)
- **Auth**: JWT

### Web Frontend
- **Framework**: React 18 + Vite
- **State Management**: Redux Toolkit
- **UI**: Emotion + Claude 스타일
- **Real-time**: Socket.io

### Mobile App
- **Framework**: React Native
- **Language**: TypeScript
- **State**: Redux Toolkit
- **Game Engine**: Custom Tetris Engine
- **Storage**: AsyncStorage (게임 통계 저장)

## 프로젝트 구조

```
plus/
├── backend/              # 백엔드 API 서버
│   ├── src/
│   │   ├── api/         # API 라우트
│   │   ├── services/    # 비즈니스 로직
│   │   ├── models/      # 데이터 모델
│   │   └── config/      # 설정
│   └── package.json
├── web/                  # 웹 프론트엔드
│   ├── src/
│   │   ├── components/  # React 컴포넌트
│   │   ├── pages/       # 페이지
│   │   └── store/       # Redux 스토어
│   └── package.json
├── mobile/               # 모바일 앱
│   └── src/
│       ├── components/   # React 컴포넌트
│       │   └── tetris/  # 테트리스 게임 컴포넌트
│       ├── screens/     # 화면
│       │   ├── auth/    # 인증 화면
│       │   ├── main/    # 메인 화면
│       │   └── game/    # 게임 화면 (테트리스)
│       ├── store/       # Redux 스토어
│       ├── utils/       # 유틸리티
│       │   └── tetris/  # 테트리스 게임 로직
│       └── types/       # TypeScript 타입 정의
├── setup.sh              # 설치 스크립트 (Mac/Linux)
├── setup.bat             # 설치 스크립트 (Windows)
├── run.sh                # 실행 스크립트 (Mac/Linux)
├── run.bat               # 실행 스크립트 (Windows)
├── stop.sh               # 종료 스크립트 (Mac/Linux)
└── stop.bat              # 종료 스크립트 (Windows)
```

## 💡 사용 팁

### Mock AI vs 실제 Claude API

기본적으로 **Mock AI**를 사용하여 API 키 없이도 테스트할 수 있습니다.

**실제 Claude API를 사용하려면:**
1. `backend/.env` 파일 열기
2. `ANTHROPIC_API_KEY=your_api_key_here`를 실제 API 키로 변경
3. 서버 재시작

### 테스트 계정

회원가입 화면에서 자유롭게 계정을 만들 수 있습니다. 모든 데이터는 로컬에 저장됩니다.

### 포트 변경

기본 포트:
- 백엔드: 3000
- 웹: 3001

변경하려면:
- 백엔드: `backend/.env`의 `PORT` 수정
- 웹: `web/vite.config.js`의 `port` 수정

## 🔧 수동 설치 및 실행

자동 스크립트를 사용하지 않고 수동으로 실행하려면:

### 백엔드
```bash
cd backend
npm install
npm run setup
npm run dev
```

### 웹
```bash
cd web
npm install
npm run dev
```

### 모바일 (선택사항)
```bash
cd mobile
npm install

# iOS
npm run ios

# Android
npm run android
```

**모바일 앱 주요 기능:**
- 의료 AI 챗봇
- 인지학습 테트리스 게임 (새로 추가!)
- 긴급상황 대응
- 복지혜택 안내
- 프로필 관리

## 📱 접속 주소

- **웹 애플리케이션**: http://localhost:3001
- **백엔드 API**: http://localhost:3000
- **API Health Check**: http://localhost:3000/api/health

## 🐛 문제 해결

### 포트가 이미 사용 중
```bash
# Mac/Linux
./stop.sh

# Windows
stop.bat
```

### 설치 오류
```bash
# 모든 node_modules 삭제 후 재설치
rm -rf backend/node_modules web/node_modules
./setup.sh  # 또는 setup.bat
```

### 백엔드 실행 오류
```bash
# 로그 확인
cat logs/backend.log  # Mac/Linux
type logs\backend.log  # Windows
```

### 데이터베이스 초기화
```bash
# SQLite 데이터베이스 파일 삭제
rm backend/database.sqlite
# 서버 재시작 시 자동으로 재생성됨
```

## 📝 Mock AI 응답 예시

Mock AI는 다음과 같은 의료 관련 질문에 응답할 수 있습니다:

- "두통이 있어요"
- "감기 증상이 있어요"
- "복통이 있어요"
- "긴급 상황이에요"
- "약을 어떻게 먹나요?"

## 🔐 보안

- JWT 토큰 기반 인증
- 비밀번호 암호화 (bcrypt)
- CORS 설정
- Helmet.js 보안 헤더
- 로컬 데이터 저장

## ⚠️ 면책 조항

이 챗봇은 의료 정보 제공 목적이며, 전문 의료인의 진단과 치료를 대체할 수 없습니다.
응급 상황 시 즉시 119에 연락하시기 바랍니다.

## 📄 라이선스

MIT License

## 🤝 기여

이슈 및 풀 리퀘스트를 환영합니다.

---

**즐거운 개발 되세요! 🚀**
