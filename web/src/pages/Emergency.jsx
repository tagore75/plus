import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { FiArrowLeft, FiPhone, FiMapPin, FiAlertCircle } from 'react-icons/fi';
import api from '../services/api';
import toast from 'react-hot-toast';

const Container = styled.div`
  min-height: 100vh;
  background-color: var(--bg-primary);
`;

const Header = styled.div`
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  background: var(--emergency);
  color: white;
`;

const BackButton = styled.button`
  padding: var(--spacing-sm);
  background: transparent;
  color: white;
`;

const Content = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: var(--spacing-xl);
`;

const EmergencyCallSection = styled.div`
  background: var(--emergency);
  color: white;
  padding: var(--spacing-2xl);
  border-radius: var(--radius-xl);
  text-align: center;
  margin-bottom: var(--spacing-xl);
`;

const BigButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  padding: var(--spacing-xl) var(--spacing-2xl);
  background: white;
  color: var(--emergency);
  border-radius: var(--radius-lg);
  font-size: 2rem;
  font-weight: 700;
  margin-top: var(--spacing-lg);
  text-decoration: none;
  transition: all var(--transition-base);

  &:hover {
    transform: scale(1.05);
    box-shadow: var(--shadow-lg);
  }
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
`;

const ContactCard = styled.div`
  padding: var(--spacing-lg);
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  border: 2px solid var(--border-color);
`;

const ContactTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
`;

const ContactNumber = styled.a`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: var(--accent-primary);
  color: white;
  border-radius: var(--radius-md);
  text-decoration: none;
  font-weight: 600;
  margin-top: var(--spacing-md);
  transition: all var(--transition-base);

  &:hover {
    background: var(--accent-secondary);
    transform: translateY(-2px);
  }
`;

const Section = styled.div`
  margin-bottom: var(--spacing-xl);
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: var(--spacing-lg);
`;

const Input = styled.input`
  width: 100%;
  padding: var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: 1rem;
  margin-bottom: var(--spacing-md);

  &:focus {
    border-color: var(--accent-primary);
  }
`;

const Button = styled.button`
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--accent-primary);
  color: white;
  border-radius: var(--radius-md);
  font-weight: 600;
  transition: all var(--transition-base);

  &:hover:not(:disabled) {
    background: var(--accent-secondary);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const GuidanceBox = styled.div`
  padding: var(--spacing-lg);
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  border-left: 4px solid var(--emergency);
  white-space: pre-wrap;
  line-height: 1.8;
`;

const HospitalCard = styled.div`
  padding: var(--spacing-lg);
  background: white;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-md);
`;

function Emergency() {
  const navigate = useNavigate();
  const [situation, setSituation] = useState('');
  const [guidance, setGuidance] = useState(null);
  const [loading, setLoading] = useState(false);

  const emergencyContacts = [
    { name: '응급의료', number: '119' },
    { name: '경찰', number: '112' },
    { name: '독극물 중독', number: '1339' },
    { name: '정신건강', number: '1577-0199' },
  ];

  const handleGetGuidance = async () => {
    if (!situation.trim()) {
      toast.error('상황을 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/emergency/guidance', { situation });
      setGuidance(response.data.guidance.content);
      toast.success('응급 처치 정보를 가져왔습니다.');
    } catch (error) {
      toast.error('정보를 가져오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate('/')}>
          <FiArrowLeft size={24} />
        </BackButton>
        <h1>🚨 긴급 상황 대응</h1>
      </Header>

      <Content>
        <EmergencyCallSection>
          <FiAlertCircle size={48} />
          <h2 style={{ fontSize: '1.75rem', marginTop: 'var(--spacing-md)' }}>
            생명이 위급한 상황이신가요?
          </h2>
          <p style={{ marginTop: 'var(--spacing-sm)', opacity: 0.9 }}>
            즉시 119에 연락하세요
          </p>
          <BigButton href="tel:119">
            <FiPhone /> 119 전화하기
          </BigButton>
        </EmergencyCallSection>

        <Section>
          <SectionTitle>긴급 연락처</SectionTitle>
          <ContactGrid>
            {emergencyContacts.map((contact) => (
              <ContactCard key={contact.number}>
                <ContactTitle>{contact.name}</ContactTitle>
                <ContactNumber href={`tel:${contact.number}`}>
                  <FiPhone /> {contact.number}
                </ContactNumber>
              </ContactCard>
            ))}
          </ContactGrid>
        </Section>

        <Section>
          <SectionTitle>응급 처치 가이드</SectionTitle>
          <Input
            type="text"
            placeholder="상황을 설명해주세요 (예: 심한 출혈, 의식 잃음, 화상 등)"
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
          />
          <Button onClick={handleGetGuidance} disabled={loading}>
            {loading ? '검색 중...' : '응급 처치 방법 찾기'}
          </Button>

          {guidance && (
            <GuidanceBox style={{ marginTop: 'var(--spacing-lg)' }}>
              {guidance}
            </GuidanceBox>
          )}
        </Section>

        <Section>
          <SectionTitle>
            <FiMapPin style={{ display: 'inline', marginRight: 'var(--spacing-sm)' }} />
            가까운 응급실
          </SectionTitle>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
            위치 기반 병원 검색 기능 (개발 중)
          </p>
          {/* Mock hospital data */}
          <HospitalCard>
            <h3 style={{ fontWeight: 600, marginBottom: 'var(--spacing-sm)' }}>
              서울대학교병원
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              서울특별시 종로구 대학로 101 • 2.3km
            </p>
            <ContactNumber href="tel:02-2072-2114" style={{ marginTop: 'var(--spacing-md)' }}>
              <FiPhone /> 02-2072-2114
            </ContactNumber>
          </HospitalCard>
        </Section>
      </Content>
    </Container>
  );
}

export default Emergency;
