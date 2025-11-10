#!/bin/bash

echo "🏥 의료 AI 챗봇 실행 중..."
echo "===================================="
echo ""

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 설치 확인
if [ ! -d "backend/node_modules" ] || [ ! -d "web/node_modules" ]; then
    echo -e "${YELLOW}⚠️  의존성이 설치되지 않았습니다.${NC}"
    echo "먼저 설치 스크립트를 실행하세요:"
    echo -e "${GREEN}  ./setup.sh${NC}"
    echo ""
    read -p "지금 설치하시겠습니까? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        ./setup.sh
        if [ $? -ne 0 ]; then
            echo -e "${RED}❌ 설치 실패${NC}"
            exit 1
        fi
    else
        exit 1
    fi
fi

# 이미 실행 중인 프로세스 확인
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  포트 3000이 이미 사용 중입니다.${NC}"
    echo "기존 백엔드 프로세스를 종료하시겠습니까?"
    read -p "(y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        lsof -ti:3000 | xargs kill -9 2>/dev/null
        echo "백엔드 프로세스가 종료되었습니다."
    fi
fi

if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  포트 3001이 이미 사용 중입니다.${NC}"
    echo "기존 웹 프로세스를 종료하시겠습니까?"
    read -p "(y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        lsof -ti:3001 | xargs kill -9 2>/dev/null
        echo "웹 프로세스가 종료되었습니다."
    fi
fi

# 로그 디렉토리 생성
mkdir -p logs

# 백엔드 실행
echo ""
echo -e "${BLUE}🚀 백엔드 서버 시작 중...${NC}"
cd backend
npm run dev > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# 백엔드 시작 대기
echo "백엔드 서버 시작 대기 중..."
sleep 3

# 백엔드 상태 확인
if ! ps -p $BACKEND_PID > /dev/null; then
    echo -e "${RED}❌ 백엔드 서버 시작 실패${NC}"
    echo "로그를 확인하세요: cat logs/backend.log"
    exit 1
fi

echo -e "${GREEN}✅ 백엔드 서버 실행 중 (PID: $BACKEND_PID)${NC}"
echo -e "   ${BLUE}http://localhost:3000${NC}"

# 웹 프론트엔드 실행
echo ""
echo -e "${BLUE}🌐 웹 프론트엔드 시작 중...${NC}"
cd web
npm run dev > ../logs/web.log 2>&1 &
WEB_PID=$!
cd ..

# 웹 시작 대기
sleep 3

# 웹 상태 확인
if ! ps -p $WEB_PID > /dev/null; then
    echo -e "${RED}❌ 웹 서버 시작 실패${NC}"
    echo "로그를 확인하세요: cat logs/web.log"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo -e "${GREEN}✅ 웹 서버 실행 중 (PID: $WEB_PID)${NC}"
echo -e "   ${BLUE}http://localhost:3001${NC}"

# PID 저장
echo $BACKEND_PID > logs/backend.pid
echo $WEB_PID > logs/web.pid

echo ""
echo "===================================="
echo -e "${GREEN}🎉 애플리케이션이 실행되었습니다!${NC}"
echo "===================================="
echo ""
echo "📱 접속 주소:"
echo -e "   웹 애플리케이션: ${BLUE}http://localhost:3001${NC}"
echo -e "   백엔드 API:     ${BLUE}http://localhost:3000${NC}"
echo ""
echo "📋 로그 확인:"
echo "   백엔드: tail -f logs/backend.log"
echo "   웹:     tail -f logs/web.log"
echo ""
echo "🛑 종료하려면:"
echo "   ./stop.sh"
echo "   또는 Ctrl+C 후 프로세스 종료"
echo ""
echo "💡 팁:"
echo "   - 브라우저에서 http://localhost:3001 을 열어보세요"
echo "   - 회원가입 후 바로 사용할 수 있습니다"
echo "   - Mock AI를 사용하므로 API 키 없이도 동작합니다"
echo ""

# 브라우저 자동 열기 (macOS/Linux)
sleep 2
if command -v open &> /dev/null; then
    echo "🌐 브라우저를 여는 중..."
    open http://localhost:3001
elif command -v xdg-open &> /dev/null; then
    echo "🌐 브라우저를 여는 중..."
    xdg-open http://localhost:3001
fi

# 종료 시그널 처리
trap "echo ''; echo '🛑 서버를 종료합니다...'; kill $BACKEND_PID $WEB_PID 2>/dev/null; exit 0" INT TERM

# 프로세스 모니터링
while true; do
    if ! ps -p $BACKEND_PID > /dev/null; then
        echo -e "${RED}❌ 백엔드 서버가 중지되었습니다${NC}"
        kill $WEB_PID 2>/dev/null
        exit 1
    fi
    if ! ps -p $WEB_PID > /dev/null; then
        echo -e "${RED}❌ 웹 서버가 중지되었습니다${NC}"
        kill $BACKEND_PID 2>/dev/null
        exit 1
    fi
    sleep 5
done
