@echo off
echo 의료 AI 챗봇 종료 중...
echo.

REM 포트 3000, 3001에서 실행 중인 Node.js 프로세스 종료
echo 백엔드 서버 종료 중...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
    taskkill /F /PID %%a >nul 2>&1
)
echo [OK] 백엔드 서버 종료됨

echo 웹 서버 종료 중...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do (
    taskkill /F /PID %%a >nul 2>&1
)
echo [OK] 웹 서버 종료됨

echo.
echo 모든 서버가 종료되었습니다
echo.
pause
