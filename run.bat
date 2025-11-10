@echo off
echo 의료 AI 챗봇 실행 중...
echo ====================================
echo.

REM 설치 확인
if not exist backend\node_modules (
    echo [ERROR] 백엔드가 설치되지 않았습니다.
    echo 먼저 setup.bat을 실행하세요.
    pause
    exit /b 1
)

if not exist web\node_modules (
    echo [ERROR] 웹이 설치되지 않았습니다.
    echo 먼저 setup.bat을 실행하세요.
    pause
    exit /b 1
)

REM 로그 디렉토리 생성
if not exist logs mkdir logs

REM 백엔드 실행
echo [시작] 백엔드 서버 시작 중...
cd backend
start /B cmd /c "npm run dev > ..\logs\backend.log 2>&1"
cd ..
timeout /t 3 /nobreak >nul
echo [OK] 백엔드 서버 실행 중
echo    http://localhost:3000
echo.

REM 웹 프론트엔드 실행
echo [시작] 웹 프론트엔드 시작 중...
cd web
start /B cmd /c "npm run dev > ..\logs\web.log 2>&1"
cd ..
timeout /t 3 /nobreak >nul
echo [OK] 웹 서버 실행 중
echo    http://localhost:3001
echo.

echo ====================================
echo 애플리케이션이 실행되었습니다!
echo ====================================
echo.
echo 접속 주소:
echo    웹 애플리케이션: http://localhost:3001
echo    백엔드 API:     http://localhost:3000
echo.
echo 로그 확인:
echo    백엔드: type logs\backend.log
echo    웹:     type logs\web.log
echo.
echo 종료하려면:
echo    stop.bat 실행 또는 이 창을 닫으세요
echo.
echo [팁]
echo    - 브라우저에서 http://localhost:3001 을 열어보세요
echo    - 회원가입 후 바로 사용할 수 있습니다
echo    - Mock AI를 사용하므로 API 키 없이도 동작합니다
echo.

REM 브라우저 자동 열기
timeout /t 2 /nobreak >nul
start http://localhost:3001

pause
