import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { FiSend, FiMenu, FiLogOut, FiPlus, FiAlertCircle, FiHeart, FiUser } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import {
  fetchConversations,
  createConversation,
  sendMessage,
  clearCurrentConversation,
} from '../store/chatSlice';
import { logout } from '../store/authSlice';
import toast from 'react-hot-toast';

const Container = styled.div`
  display: flex;
  height: 100vh;
  background-color: var(--bg-primary);
`;

const Sidebar = styled(motion.div)`
  width: 300px;
  background-color: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    z-index: 100;
    box-shadow: var(--shadow-lg);
  }
`;

const SidebarHeader = styled.div`
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
`;

const NewChatButton = styled.button`
  width: 100%;
  padding: var(--spacing-md);
  margin: var(--spacing-md);
  background: var(--accent-primary);
  color: white;
  border-radius: var(--radius-md);
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);

  &:hover {
    background: var(--accent-secondary);
    transform: translateY(-1px);
  }
`;

const ConversationList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
`;

const ConversationItem = styled.div`
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-base);
  background: ${props => props.active ? 'white' : 'transparent'};

  &:hover {
    background: white;
  }
`;

const SidebarFooter = styled.div`
  padding: var(--spacing-md);
  border-top: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
`;

const NavButton = styled.button`
  padding: var(--spacing-md);
  background: transparent;
  color: var(--text-primary);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  font-size: 0.95rem;

  &:hover {
    background: var(--bg-tertiary);
  }
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
`;

const Header = styled.div`
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);

  @media (min-width: 769px) {
    .menu-btn {
      display: none;
    }
  }
`;

const MenuButton = styled.button`
  padding: var(--spacing-sm);
  background: transparent;
  color: var(--text-primary);

  @media (min-width: 769px) {
    display: none;
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-xl);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
`;

const Message = styled(motion.div)`
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  background: ${props => props.role === 'assistant' ? 'var(--bg-secondary)' : 'transparent'};
`;

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${props => props.role === 'assistant' ? 'var(--accent-primary)' : 'var(--text-tertiary)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
`;

const MessageContent = styled.div`
  flex: 1;
  line-height: 1.6;
  color: var(--text-primary);

  p {
    margin: var(--spacing-sm) 0;
  }

  ul, ol {
    margin: var(--spacing-sm) 0;
    padding-left: var(--spacing-lg);
  }

  strong {
    font-weight: 600;
  }
`;

const InputContainer = styled.div`
  padding: var(--spacing-xl);
  border-top: 1px solid var(--border-color);
`;

const InputWrapper = styled.div`
  display: flex;
  gap: var(--spacing-md);
  background: var(--bg-secondary);
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);
  border: 2px solid var(--border-color);
  transition: border-color var(--transition-base);

  &:focus-within {
    border-color: var(--accent-primary);
  }
`;

const Input = styled.textarea`
  flex: 1;
  border: none;
  background: transparent;
  resize: none;
  font-size: 1rem;
  min-height: 24px;
  max-height: 200px;

  &::placeholder {
    color: var(--text-tertiary);
  }
`;

const SendButton = styled.button`
  padding: var(--spacing-md);
  background: var(--accent-primary);
  color: white;
  border-radius: var(--radius-md);
  transition: all var(--transition-base);

  &:hover:not(:disabled) {
    background: var(--accent-secondary);
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--text-secondary);
`;

function Chat() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { conversations, currentConversation, messages, sending } = useSelector(
    (state) => state.chat
  );

  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleNewChat = () => {
    dispatch(createConversation({ type: 'general', title: '새 대화' }));
    setSidebarOpen(false);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || sending) return;

    let conversationId = currentConversation?.id;

    if (!conversationId) {
      const result = await dispatch(createConversation({ type: 'general' }));
      conversationId = result.payload.id;
    }

    const message = input.trim();
    setInput('');

    await dispatch(sendMessage({ conversationId, content: message }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Container>
      <AnimatePresence>
        {(sidebarOpen || window.innerWidth > 768) && (
          <Sidebar
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 20 }}
          >
            <SidebarHeader>
              <Logo>🏥 의료 AI</Logo>
            </SidebarHeader>

            <NewChatButton onClick={handleNewChat}>
              <FiPlus /> 새 대화
            </NewChatButton>

            <ConversationList>
              {conversations.map((conv) => (
                <ConversationItem
                  key={conv.id}
                  active={currentConversation?.id === conv.id}
                  onClick={() => {
                    dispatch(clearCurrentConversation());
                    // Fetch conversation details would go here
                    setSidebarOpen(false);
                  }}
                >
                  {conv.title || '새 대화'}
                </ConversationItem>
              ))}
            </ConversationList>

            <SidebarFooter>
              <NavButton onClick={() => navigate('/emergency')}>
                <FiAlertCircle /> 긴급 상황
              </NavButton>
              <NavButton onClick={() => navigate('/welfare')}>
                <FiHeart /> 복지 혜택
              </NavButton>
              <NavButton onClick={() => navigate('/profile')}>
                <FiUser /> 프로필
              </NavButton>
              <NavButton onClick={handleLogout}>
                <FiLogOut /> 로그아웃
              </NavButton>
            </SidebarFooter>
          </Sidebar>
        )}
      </AnimatePresence>

      <MainContent>
        <Header>
          <MenuButton className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <FiMenu size={24} />
          </MenuButton>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 600 }}>
            {currentConversation?.title || '의료 AI 챗봇'}
          </h1>
        </Header>

        <MessagesContainer>
          {messages.length === 0 ? (
            <EmptyState>
              <h2>안녕하세요! 👋</h2>
              <p>의료 관련 질문이나 건강 상담이 필요하신가요?</p>
              <p>무엇이든 편하게 물어보세요.</p>
            </EmptyState>
          ) : (
            messages.map((message, index) => (
              <Message
                key={index}
                role={message.role}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Avatar role={message.role}>
                  {message.role === 'assistant' ? '🏥' : '👤'}
                </Avatar>
                <MessageContent>
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </MessageContent>
              </Message>
            ))
          )}
          {sending && (
            <Message role="assistant">
              <Avatar role="assistant">🏥</Avatar>
              <MessageContent>
                <span className="spinner">생각하는 중...</span>
              </MessageContent>
            </Message>
          )}
          <div ref={messagesEndRef} />
        </MessagesContainer>

        <InputContainer>
          <InputWrapper>
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="메시지를 입력하세요..."
              rows={1}
            />
            <SendButton onClick={handleSendMessage} disabled={!input.trim() || sending}>
              <FiSend />
            </SendButton>
          </InputWrapper>
        </InputContainer>
      </MainContent>
    </Container>
  );
}

export default Chat;
