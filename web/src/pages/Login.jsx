import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { login, clearError, loginAsGuest } from '../store/authSlice';
import toast from 'react-hot-toast';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: var(--spacing-md);
`;

const Card = styled.div`
  background: white;
  padding: var(--spacing-2xl);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: var(--spacing-sm);
  color: var(--text-primary);
  text-align: center;
`;

const Subtitle = styled.p`
  color: var(--text-secondary);
  text-align: center;
  margin-bottom: var(--spacing-xl);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
`;

const Input = styled.input`
  padding: var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: 1rem;
  transition: border-color var(--transition-base);

  &:focus {
    border-color: var(--accent-primary);
  }
`;

const Button = styled.button`
  padding: var(--spacing-md);
  background: var(--accent-primary);
  color: white;
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-weight: 600;
  transition: all var(--transition-base);

  &:hover:not(:disabled) {
    background: var(--accent-secondary);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const GuestButton = styled.button`
  padding: var(--spacing-md);
  background: transparent;
  color: var(--accent-primary);
  border: 2px solid var(--accent-primary);
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-weight: 600;
  transition: all var(--transition-base);

  &:hover {
    background: var(--accent-primary);
    color: white;
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin: var(--spacing-lg) 0;
  color: var(--text-secondary);

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border-color);
  }
`;

const LinkText = styled.p`
  text-align: center;
  color: var(--text-secondary);
  margin-top: var(--spacing-lg);

  a {
    color: var(--accent-primary);
    font-weight: 600;
  }
`;

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('이메일과 비밀번호를 입력해주세요.');
      return;
    }
    dispatch(login({ email, password }));
  };

  const handleGuestLogin = () => {
    dispatch(loginAsGuest());
    toast.success('게스트 모드로 시작합니다!');
  };

  return (
    <Container>
      <Card>
        <Title>🏥 의료 AI 챗봇</Title>
        <Subtitle>건강한 삶을 위한 AI 파트너</Subtitle>
        <Form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </Button>
        </Form>
        <Divider>또는</Divider>
        <GuestButton onClick={handleGuestLogin}>
          🚀 게스트로 바로 시작하기
        </GuestButton>
        <LinkText>
          계정이 없으신가요? <Link to="/register">회원가입</Link>
        </LinkText>
      </Card>
    </Container>
  );
}

export default Login;
