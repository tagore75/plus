#!/bin/bash

echo "🛑 의료 AI 챗봇 종료 중..."
echo ""

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# PID 파일에서 프로세스 종료
if [ -f "logs/backend.pid" ]; then
    BACKEND_PID=$(cat logs/backend.pid)
    if ps -p $BACKEND_PID > /dev/null 2>&1; then
        echo "백엔드 서버 종료 중... (PID: $BACKEND_PID)"
        kill $BACKEND_PID 2>/dev/null
        echo -e "${GREEN}✅ 백엔드 서버 종료됨${NC}"
    else
        echo -e "${YELLOW}⚠️  백엔드 서버가 실행 중이지 않습니다${NC}"
    fi
    rm logs/backend.pid
fi

if [ -f "logs/web.pid" ]; then
    WEB_PID=$(cat logs/web.pid)
    if ps -p $WEB_PID > /dev/null 2>&1; then
        echo "웹 서버 종료 중... (PID: $WEB_PID)"
        kill $WEB_PID 2>/dev/null
        echo -e "${GREEN}✅ 웹 서버 종료됨${NC}"
    else
        echo -e "${YELLOW}⚠️  웹 서버가 실행 중이지 않습니다${NC}"
    fi
    rm logs/web.pid
fi

# 포트로 실행 중인 프로세스 강제 종료
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "포트 3000에서 실행 중인 프로세스 강제 종료 중..."
    lsof -ti:3000 | xargs kill -9 2>/dev/null
fi

if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "포트 3001에서 실행 중인 프로세스 강제 종료 중..."
    lsof -ti:3001 | xargs kill -9 2>/dev/null
fi

echo ""
echo -e "${GREEN}✅ 모든 서버가 종료되었습니다${NC}"
echo ""
