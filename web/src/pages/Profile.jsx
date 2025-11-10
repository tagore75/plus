import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from '@emotion/styled';
import { FiArrowLeft, FiSave, FiUser } from 'react-icons/fi';
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
`;

const BackButton = styled.button`
  padding: var(--spacing-sm);
  background: transparent;
  color: var(--text-primary);
`;

const Content = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: var(--spacing-xl);
`;

const Section = styled.div`
  background: white;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: var(--spacing-lg);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
`;

const FormGroup = styled.div`
  margin-bottom: var(--spacing-lg);
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
  color: var(--text-primary);
`;

const Input = styled.input`
  width: 100%;
  padding: var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: 1rem;

  &:focus {
    border-color: var(--accent-primary);
  }

  &:disabled {
    background: var(--bg-secondary);
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: 1rem;
  background: white;

  &:focus {
    border-color: var(--accent-primary);
  }
`;

const TagInput = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  min-height: 48px;
`;

const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--accent-primary);
  color: white;
  border-radius: var(--radius-md);
  font-size: 0.875rem;

  button {
    background: transparent;
    color: white;
    padding: 0;
    font-size: 1rem;
  }
`;

const Button = styled.button`
  padding: var(--spacing-md) var(--spacing-xl);
  background: var(--accent-primary);
  color: white;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  transition: all var(--transition-base);

  &:hover:not(:disabled) {
    background: var(--accent-secondary);
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

function Profile() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState({
    bloodType: '',
    allergies: [],
    chronicConditions: [],
    emergencyContact: { name: '', phone: '' },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newAllergy, setNewAllergy] = useState('');
  const [newCondition, setNewCondition] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/health-records/profile');
      setProfile({
        bloodType: response.data.profile.bloodType || '',
        allergies: response.data.profile.allergies || [],
        chronicConditions: response.data.profile.chronicConditions || [],
        emergencyContact: response.data.profile.emergencyContact || { name: '', phone: '' },
      });
    } catch (error) {
      toast.error('프로필을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/health-records/profile', profile);
      toast.success('프로필이 저장되었습니다.');
    } catch (error) {
      toast.error('프로필 저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const addAllergy = () => {
    if (newAllergy.trim() && !profile.allergies.includes(newAllergy.trim())) {
      setProfile({
        ...profile,
        allergies: [...profile.allergies, newAllergy.trim()],
      });
      setNewAllergy('');
    }
  };

  const removeAllergy = (allergy) => {
    setProfile({
      ...profile,
      allergies: profile.allergies.filter((a) => a !== allergy),
    });
  };

  const addCondition = () => {
    if (newCondition.trim() && !profile.chronicConditions.includes(newCondition.trim())) {
      setProfile({
        ...profile,
        chronicConditions: [...profile.chronicConditions, newCondition.trim()],
      });
      setNewCondition('');
    }
  };

  const removeCondition = (condition) => {
    setProfile({
      ...profile,
      chronicConditions: profile.chronicConditions.filter((c) => c !== condition),
    });
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate('/')}>
          <FiArrowLeft size={24} />
        </BackButton>
        <h1>프로필 설정</h1>
      </Header>

      <Content>
        <Section>
          <SectionTitle>
            <FiUser /> 기본 정보
          </SectionTitle>
          <FormGroup>
            <Label>이름</Label>
            <Input type="text" value={user?.name || ''} disabled />
          </FormGroup>
          <FormGroup>
            <Label>이메일</Label>
            <Input type="email" value={user?.email || ''} disabled />
          </FormGroup>
        </Section>

        <Section>
          <SectionTitle>건강 정보</SectionTitle>
          <FormGroup>
            <Label>혈액형</Label>
            <Select
              value={profile.bloodType}
              onChange={(e) => setProfile({ ...profile, bloodType: e.target.value })}
            >
              <option value="">선택하세요</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>알레르기</Label>
            <TagInput>
              {profile.allergies.map((allergy) => (
                <Tag key={allergy}>
                  {allergy}
                  <button onClick={() => removeAllergy(allergy)}>×</button>
                </Tag>
              ))}
            </TagInput>
            <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-sm)' }}>
              <Input
                type="text"
                placeholder="알레르기 추가"
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addAllergy()}
              />
              <Button type="button" onClick={addAllergy}>
                추가
              </Button>
            </div>
          </FormGroup>

          <FormGroup>
            <Label>기저질환</Label>
            <TagInput>
              {profile.chronicConditions.map((condition) => (
                <Tag key={condition}>
                  {condition}
                  <button onClick={() => removeCondition(condition)}>×</button>
                </Tag>
              ))}
            </TagInput>
            <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-sm)' }}>
              <Input
                type="text"
                placeholder="기저질환 추가"
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCondition()}
              />
              <Button type="button" onClick={addCondition}>
                추가
              </Button>
            </div>
          </FormGroup>
        </Section>

        <Section>
          <SectionTitle>긴급 연락처</SectionTitle>
          <FormGroup>
            <Label>이름</Label>
            <Input
              type="text"
              value={profile.emergencyContact.name}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  emergencyContact: { ...profile.emergencyContact, name: e.target.value },
                })
              }
            />
          </FormGroup>
          <FormGroup>
            <Label>전화번호</Label>
            <Input
              type="tel"
              value={profile.emergencyContact.phone}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  emergencyContact: { ...profile.emergencyContact, phone: e.target.value },
                })
              }
            />
          </FormGroup>
        </Section>

        <Button onClick={handleSave} disabled={saving}>
          <FiSave /> {saving ? '저장 중...' : '저장하기'}
        </Button>
      </Content>
    </Container>
  );
}

export default Profile;
