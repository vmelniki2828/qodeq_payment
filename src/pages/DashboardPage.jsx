import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Layout } from '../components/Layout';
import { useTheme } from '../contexts/ThemeContext';
import { HiArrowLeft, HiArrowRight } from 'react-icons/hi2';
import { DatePicker } from '../components/DatePicker';
import { Loader } from '../components/Loader';

// Функция для получения токена из куки
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

const PageContent = styled.div`
  min-height: 100%;
  display: flex;
  flex-direction: column;
`;

const OverviewSection = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  gap: 20px;
`;

const OverviewHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-width: 0;
`;

const OverviewTitle = styled.h2`
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const OverviewSubtitle = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.secondary};
`;

const ContentWrapper = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 4px;

    &:hover {
      background: ${({ theme }) => theme.colors.secondary};
    }
  }
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  flex-shrink: 0;
`;

const DateSeparator = styled.span`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 14px;
  padding: 0 8px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  height: 100%;
`;

const StatsCardsContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const StatCard = styled.div`
  flex: 1;
  min-width: 200px;
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const StatCardLabel = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: 8px;
`;

const StatCardValue = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const ActionButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 14px;
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.accent};
  background-color: ${({ theme }) => theme.colors.accent};
  color: #FFFFFF;
  font-family: Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
  box-sizing: border-box;
  line-height: 1;

  &:hover {
    background-color: ${({ theme }) => theme.colors.accentHover || theme.colors.accent};
    opacity: 0.9;
  }
`;

const ButtonText = styled.span`
  display: flex;
  align-items: center;
`;

const BackIcon = styled(HiArrowLeft)`
  margin-right: 6px;
  font-size: 14px;
`;

const ArrowIcon = styled(HiArrowRight)`
  margin-left: 6px;
  font-size: 14px;
`;

export const DashboardPage = () => {
  const { theme } = useTheme();
  const [activeView, setActiveView] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statsData, setStatsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = getCookie('rb_admin_token');
        const headers = {
          'Content-Type': 'application/json',
        };
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch('https://repayment.cat-tools.com/api/v1/admin/stats/overview', {
          method: 'GET',
          headers,
        });

        // Если статус 401, просто показываем пустые ячейки
        if (response.status === 401) {
          setStatsData(null);
          setIsLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setStatsData(data);
      } catch (err) {
        console.error('Ошибка при загрузке статистики:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleSupportClick = () => {
    setActiveView('support');
  };

  const handleHelpdeskClick = () => {
    setActiveView('helpdesk');
  };

  const handleBackClick = () => {
    setActiveView(null);
  };

  const getTitle = () => {
    if (activeView === 'support') {
      return 'Support Messages — Statistics';
    }
    if (activeView === 'helpdesk') {
      return 'Helpdesk Tags — Statistics';
    }
    return 'Overview';
  };

  const getSubtitle = () => {
    if (activeView === 'support') {
      return 'Context- and type-based analytics, usage, and errors.';
    }
    if (activeView === 'helpdesk') {
      return 'Counts and percentages for FULL BOT / BOT + OPERATOR / FULL OPERATOR.';
    }
    return 'Quick stats and navigation.';
  };

  return (
    <Layout>
      <PageContent>
        <OverviewSection theme={theme}>
          <OverviewHeader>
            <OverviewTitle theme={theme}>{getTitle()}</OverviewTitle>
            <OverviewSubtitle theme={theme}>{getSubtitle()}</OverviewSubtitle>
          </OverviewHeader>
          {(activeView === 'support' || activeView === 'helpdesk') && (
            <FiltersContainer>
              <DatePicker
                id={activeView === 'support' ? 'support-start-date' : 'helpdesk-start-date'}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <DateSeparator theme={theme}>—</DateSeparator>
              <DatePicker
                id={activeView === 'support' ? 'support-end-date' : 'helpdesk-end-date'}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </FiltersContainer>
          )}
          <ActionButtonsContainer>
            {activeView === null ? (
              <>
                <ActionButton theme={theme} onClick={handleSupportClick}>
                  <ButtonText>
                    View Support Message Stats
                    <ArrowIcon />
                  </ButtonText>
                </ActionButton>
                <ActionButton theme={theme} onClick={handleHelpdeskClick}>
                  <ButtonText>
                    View Helpdesk Tags Stats
                    <ArrowIcon />
                  </ButtonText>
                </ActionButton>
              </>
            ) : (
              <ActionButton theme={theme} onClick={handleBackClick}>
                <ButtonText>
                  <BackIcon />
                  Back
                </ButtonText>
              </ActionButton>
            )}
          </ActionButtonsContainer>
        </OverviewSection>

        <ContentWrapper>
          {activeView === null && (
            <>
              {isLoading ? (
                <Loader />
              ) : error ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#ef4444' }}>
                  Ошибка при загрузке данных: {error}
                </div>
              ) : (
                <StatsCardsContainer>
                  {statsData && Object.keys(statsData).length > 0 ? (
                    Object.entries(statsData).map(([key, value]) => (
                      <StatCard key={key} theme={theme}>
                        <StatCardLabel theme={theme}>
                          {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}
                        </StatCardLabel>
                        <StatCardValue theme={theme}>
                          {typeof value === 'object' && value !== null
                            ? JSON.stringify(value, null, 2)
                            : value?.toString() || '-'}
                        </StatCardValue>
                      </StatCard>
                    ))
                  ) : (
                    <>
                      <StatCard theme={theme}>
                        <StatCardLabel theme={theme}>Payments</StatCardLabel>
                        <StatCardValue theme={theme}>-</StatCardValue>
                      </StatCard>
                      <StatCard theme={theme}>
                        <StatCardLabel theme={theme}>Chats</StatCardLabel>
                        <StatCardValue theme={theme}>-</StatCardValue>
                      </StatCard>
                      <StatCard theme={theme}>
                        <StatCardLabel theme={theme}>Tickets</StatCardLabel>
                        <StatCardValue theme={theme}>-</StatCardValue>
                      </StatCard>
                    </>
                  )}
                </StatsCardsContainer>
              )}
            </>
          )}
          {activeView === 'support' && (
            <div>
              {/* Контент для Support Messages — Statistics */}
            </div>
          )}
          {activeView === 'helpdesk' && (
            <div>
              {/* Контент для Helpdesk Tags — Statistics */}
            </div>
          )}
        </ContentWrapper>
      </PageContent>
    </Layout>
  );
};

