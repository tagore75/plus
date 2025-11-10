@echo off
echo 의료 AI 챗봇 - 전체 설치 스크립트 (Windows)
echo ====================================
echo.

REM Node.js 확인
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js가 설치되어 있지 않습니다.
    echo Node.js 18 이상을 설치해주세요: https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js 확인됨
node -v
echo.

REM 백엔드 설치
echo [설치] 백엔드 설치 중...
cd backend
if not exist node_modules (
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] 백엔드 설치 실패
        pause
        exit /b 1
    )
) else (
    echo [SKIP] node_modules가 이미 존재합니다.
)

REM 백엔드 환경 설정
call npm run setup
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] 백엔드 설정 실패
    pause
    exit /b 1
)
echo [OK] 백엔드 설치 완료
cd ..
echo.

REM 웹 프론트엔드 설치
echo [설치] 웹 프론트엔드 설치 중...
cd web
if not exist node_modules (
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] 웹 프론트엔드 설치 실패
        pause
        exit /b 1
    )
) else (
    echo [SKIP] node_modules가 이미 존재합니다.
)
echo [OK] 웹 프론트엔드 설치 완료
cd ..
echo.

echo.
echo 설치가 완료되었습니다!
echo.
echo 다음 명령어로 애플리케이션을 실행하세요:
echo   run.bat
echo.
echo 또는 수동으로 실행:
echo   백엔드: cd backend ^&^& npm run dev
echo   웹: cd web ^&^& npm run dev
echo.
echo [참고]
echo   - 백엔드는 http://localhost:3000 에서 실행됩니다
echo   - 웹은 http://localhost:3001 에서 실행됩니다
echo   - Mock AI를 사용하므로 API 키 없이도 테스트 가능합니다
echo.
pause
