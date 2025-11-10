const fs = require('fs');
const path = require('path');

console.log('🚀 의료 AI 챗봇 설정을 시작합니다...\n');

// .env 파일 생성
const envPath = path.join(__dirname, '../.env');
const envExamplePath = path.join(__dirname, '../.env.example');

if (!fs.existsSync(envPath)) {
  console.log('📝 .env 파일 생성 중...');

  const envContent = `# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Secret
JWT_SECRET=medical_chatbot_secret_key_change_this_in_production

# AI API Keys (선택사항 - 없으면 Mock AI 사용)
ANTHROPIC_API_KEY=your_api_key_here

# CORS
CORS_ORIGIN=http://localhost:3001

# Emergency Services
EMERGENCY_NUMBER=119

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env 파일이 생성되었습니다.');
} else {
  console.log('✅ .env 파일이 이미 존재합니다.');
}

console.log('\n🎉 설정이 완료되었습니다!');
console.log('\n다음 명령어로 서버를 실행하세요:');
console.log('  npm run dev\n');
console.log('💡 참고: ANTHROPIC_API_KEY가 설정되지 않으면 Mock AI를 사용합니다.');
console.log('   실제 Claude API를 사용하려면 .env 파일을 수정하세요.\n');
