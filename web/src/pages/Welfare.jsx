import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { FiArrowLeft, FiHeart, FiCheckCircle } from 'react-icons/fi';
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
  background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
  color: white;
`;

const BackButton = styled.button`
  padding: var(--spacing-sm);
  background: transparent;
  color: white;
`;

const Content = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: var(--spacing-xl);
`;

const CategoryTabs = styled.div`
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xl);
  overflow-x: auto;
  padding-bottom: var(--spacing-sm);
`;

const Tab = styled.button`
  padding: var(--spacing-md) var(--spacing-lg);
  background: ${props => props.active ? 'var(--accent-primary)' : 'var(--bg-secondary)'};
  color: ${props => props.active ? 'white' : 'var(--text-primary)'};
  border-radius: var(--radius-md);
  white-space: nowrap;
  font-weight: ${props => props.active ? 600 : 400};
  transition: all var(--transition-base);

  &:hover {
    background: ${props => props.active ? 'var(--accent-secondary)' : 'var(--bg-tertiary)'};
  }
`;

const ProgramGrid = styled.div`
  display: grid;
  gap: var(--spacing-lg);
`;

const ProgramCard = styled.div`
  padding: var(--spacing-xl);
  background: white;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);

  &:hover {
    border-color: var(--accent-primary);
    box-shadow: var(--shadow-md);
  }
`;

const ProgramTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: var(--spacing-sm);
  color: var(--text-primary);
`;

const ProgramDescription = styled.p`
  color: var(--text-secondary);
  margin-bottom: var(--spacing-md);
  line-height: 1.6;
`;

const InfoRow = styled.div`
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
  font-size: 0.9rem;
`;

const InfoLabel = styled.span`
  font-weight: 600;
  color: var(--text-primary);
  min-width: 80px;
`;

const InfoValue = styled.span`
  color: var(--text-secondary);
  flex: 1;
`;

const ContactButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
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

function Welfare() {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrograms();
  }, [selectedCategory]);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const params = selectedCategory !== 'all' ? { category: selectedCategory } : {};
      const response = await api.get('/welfare/programs', { params });
      setPrograms(response.data.programs);
      if (categories.length === 0) {
        setCategories([
          { id: 'all', name: '전체' },
          ...response.data.categories,
        ]);
      }
    } catch (error) {
      toast.error('복지 프로그램 정보를 불러오는데 실패했습니다.');
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
        <FiHeart size={24} />
        <h1>복지 혜택 안내</h1>
      </Header>

      <Content>
        <CategoryTabs>
          {categories.map((category) => (
            <Tab
              key={category.id}
              active={selectedCategory === category.id}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </Tab>
          ))}
        </CategoryTabs>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 'var(--spacing-2xl)', color: 'var(--text-secondary)' }}>
            로딩 중...
          </div>
        ) : (
          <ProgramGrid>
            {programs.map((program) => (
              <ProgramCard key={program.id}>
                <ProgramTitle>{program.name}</ProgramTitle>
                <ProgramDescription>{program.description}</ProgramDescription>

                <InfoRow>
                  <InfoLabel>대상:</InfoLabel>
                  <InfoValue>{program.eligibility}</InfoValue>
                </InfoRow>

                <InfoRow>
                  <InfoLabel>혜택:</InfoLabel>
                  <InfoValue>{program.benefits}</InfoValue>
                </InfoRow>

                <InfoRow>
                  <InfoLabel>신청방법:</InfoLabel>
                  <InfoValue>{program.application}</InfoValue>
                </InfoRow>

                <ContactButton href={`tel:${program.contact.replace(/-/g, '')}`}>
                  <FiCheckCircle /> {program.contact} 문의하기
                </ContactButton>
              </ProgramCard>
            ))}
          </ProgramGrid>
        )}

        {!loading && programs.length === 0 && (
          <div style={{ textAlign: 'center', padding: 'var(--spacing-2xl)', color: 'var(--text-secondary)' }}>
            해당 카테고리에 프로그램이 없습니다.
          </div>
        )}
      </Content>
    </Container>
  );
}

export default Welfare;
