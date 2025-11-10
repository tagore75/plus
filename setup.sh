#!/bin/bash

echo "🏥 의료 AI 챗봇 - 전체 설치 스크립트"
echo "===================================="
echo ""

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Node.js 버전 확인
echo "📦 Node.js 버전 확인 중..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js가 설치되어 있지 않습니다.${NC}"
    echo "Node.js 18 이상을 설치해주세요: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js 버전이 너무 낮습니다. (현재: $(node -v), 필요: v18+)${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node -v) 확인됨${NC}"
echo ""

# 백엔드 설치
echo "🔧 백엔드 설치 중..."
cd backend
if [ ! -d "node_modules" ]; then
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ 백엔드 설치 실패${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠️  node_modules가 이미 존재합니다. 건너뜁니다.${NC}"
fi

# 백엔드 환경 설정
npm run setup
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ 백엔드 설정 실패${NC}"
    exit 1
fi
echo -e "${GREEN}✅ 백엔드 설치 완료${NC}"
cd ..
echo ""

# 웹 프론트엔드 설치
echo "🌐 웹 프론트엔드 설치 중..."
cd web
if [ ! -d "node_modules" ]; then
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ 웹 프론트엔드 설치 실패${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠️  node_modules가 이미 존재합니다. 건너뜁니다.${NC}"
fi
echo -e "${GREEN}✅ 웹 프론트엔드 설치 완료${NC}"
cd ..
echo ""

# 실행 스크립트에 실행 권한 부여
chmod +x run.sh 2>/dev/null || true

echo ""
echo "🎉 설치가 완료되었습니다!"
echo ""
echo "다음 명령어로 애플리케이션을 실행하세요:"
echo -e "${GREEN}  ./run.sh${NC}"
echo ""
echo "또는 수동으로 실행:"
echo "  백엔드: cd backend && npm run dev"
echo "  웹: cd web && npm run dev"
echo ""
echo "💡 참고:"
echo "  - 백엔드는 http://localhost:3000 에서 실행됩니다"
echo "  - 웹은 http://localhost:3001 에서 실행됩니다"
echo "  - Mock AI를 사용하므로 API 키 없이도 테스트 가능합니다"
echo "  - 실제 Claude API를 사용하려면 backend/.env 파일을 수정하세요"
echo ""
