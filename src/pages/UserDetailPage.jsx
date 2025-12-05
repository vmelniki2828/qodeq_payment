import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { Layout } from '../components/Layout';
import { HiArrowPath, HiPencil, HiTrash, HiUserCircle, HiChevronLeft } from 'react-icons/hi2';

const PageContent = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const UserIcon = styled(HiUserCircle)`
  font-size: 32px;
  color: ${({ theme }) => theme.colors.secondary};
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Username = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const Email = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.secondary};
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: #10A37F;
  background-color: rgba(16, 163, 127, 0.1);
`;

const ButtonsGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background-color: ${({ theme }) =>
      theme.colors.primary === '#0D0D0D' ? '#f0f0f0' : 'rgba(255,255,255,0.08)'};
  }

  ${({ $danger }) =>
    $danger &&
    `
    &:hover {
      color: #ef4444;
      border-color: #ef4444;
      background-color: rgba(239,68,68,0.1);
    }
  `}
`;

const ContentWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;

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

const ProfileSection = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 20px;
  margin-bottom: 24px;
`;

const SectionTitle = styled.h3`
  margin: 0 0 20px 0;
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
`;

const ProfileItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ProfileLabel = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ProfileValue = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.primary};
  word-break: break-word;
`;

const DetailsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  overflow: hidden;
`;

const TableHeader = styled.thead`
  background-color: ${({ theme }) => theme.colors.surface};
`;

const TableHeaderRow = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const TableHeaderCell = styled.th`
  padding: 12px 16px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background-color: ${({ theme }) => theme.colors.surface};
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  transition: background-color 0.15s ease;

  &:hover {
    background-color: ${({ theme }) =>
      theme.colors.primary === '#0D0D0D' ? '#f8f8f8' : 'rgba(255,255,255,0.04)'};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: 12px 16px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.primary};
`;

const FieldCell = styled(TableCell)`
  font-weight: 500;
  width: 200px;
`;

const ValueCell = styled(TableCell)`
  word-break: break-word;
  font-family: monospace;
  font-size: 12px;
`;

// Моковые данные пользователей
const mockUsers = [
  {
    id: 1,
    _id: '692f327569b12babcd753db0',
    username: 'VladOK',
    telegramChatId: '@VladOK151',
    email: 'v.bernik@softqod.com',
    roles: ['VIEWER'],
    permissions: [],
    isActive: true,
    createdAt: '2025-12-02 18:39:49',
    updatedAt: '2025-12-02 18:39:49',
    ipWhitelist: [],
    resourceWhitelist: [],
    allowedPaymentNames: [],
  },
  {
    id: 2,
    _id: '692f327569b12babcd753db1',
    username: 'pappper',
    telegramChatId: '@pappper',
    email: '',
    roles: ['SUPERUSER'],
    permissions: [],
    isActive: true,
    createdAt: '2025-11-11 19:05:10',
    updatedAt: '2025-11-11 19:05:10',
    ipWhitelist: [],
    resourceWhitelist: [],
    allowedPaymentNames: [],
  },
];

export const UserDetailPage = () => {
  const { theme } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Находим пользователя по ID
    const foundUser = mockUsers.find((u) => u.id === Number(id) || u._id === id);
    setUser(foundUser || null);
  }, [id]);

  const handleRefresh = () => {
    console.log('Refresh user', id);
    // Логика обновления данных пользователя
  };

  const handleEdit = () => {
    navigate(`/models/users/${id}/edit`);
    // Или можно открыть панель редактирования
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      console.log('Delete user', id);
      navigate('/models/users');
    }
  };

  const handleBack = () => {
    navigate('/models/users');
  };

  if (!user) {
    return (
      <Layout>
        <PageContent>
          <ContentWrapper>
            <div>User not found</div>
          </ContentWrapper>
        </PageContent>
      </Layout>
    );
  }

  const formatValue = (value) => {
    if (Array.isArray(value)) {
      return JSON.stringify(value);
    }
    if (typeof value === 'boolean') {
      return value.toString();
    }
    if (value === null || value === undefined) {
      return '';
    }
    return String(value);
  };

  const fields = [
    { field: '_id', value: user._id },
    { field: 'created_at', value: user.createdAt },
    { field: 'updated_at', value: user.updatedAt },
    { field: 'username', value: user.username },
    { field: 'email', value: user.email },
    { field: 'telegram_chat_id', value: user.telegramChatId },
    { field: 'roles', value: user.roles },
    { field: 'permissions', value: user.permissions },
    { field: 'is_active', value: user.isActive },
    { field: 'ip_whitelist', value: user.ipWhitelist },
    { field: 'resource_whitelist', value: user.resourceWhitelist },
    { field: 'allowed_payment_names', value: user.allowedPaymentNames },
  ];

  return (
    <Layout>
      <ThemeProvider theme={theme}>
        <PageContent>
          <HeaderSection theme={theme}>
            <UserInfo>
              <UserIcon theme={theme} />
              <UserDetails>
                <Username theme={theme}>{user.username}</Username>
                <Email theme={theme}>{user.email || 'No email'}</Email>
              </UserDetails>
              {user.isActive && <StatusBadge>Active</StatusBadge>}
            </UserInfo>
            <ButtonsGroup>
              <Button theme={theme} onClick={handleRefresh}>
                <HiArrowPath size={16} />
                Refresh
              </Button>
              <Button theme={theme} onClick={handleEdit}>
                <HiPencil size={16} />
                Edit
              </Button>
              <Button theme={theme} $danger onClick={handleDelete}>
                <HiTrash size={16} />
                Delete
              </Button>
              <Button theme={theme} onClick={handleBack}>
                <HiChevronLeft size={16} />
                Back
              </Button>
            </ButtonsGroup>
          </HeaderSection>

          <ContentWrapper>
            <ProfileSection theme={theme}>
              <SectionTitle theme={theme}>Profile</SectionTitle>
              <ProfileGrid>
                <ProfileItem>
                  <ProfileLabel theme={theme}>ID</ProfileLabel>
                  <ProfileValue theme={theme}>{user._id}</ProfileValue>
                </ProfileItem>
                <ProfileItem>
                  <ProfileLabel theme={theme}>Username</ProfileLabel>
                  <ProfileValue theme={theme}>{user.username}</ProfileValue>
                </ProfileItem>
                <ProfileItem>
                  <ProfileLabel theme={theme}>Email</ProfileLabel>
                  <ProfileValue theme={theme}>{user.email || '—'}</ProfileValue>
                </ProfileItem>
                <ProfileItem>
                  <ProfileLabel theme={theme}>Roles</ProfileLabel>
                  <ProfileValue theme={theme}>
                    {Array.isArray(user.roles) ? user.roles.join(', ') : user.roles}
                  </ProfileValue>
                </ProfileItem>
                <ProfileItem>
                  <ProfileLabel theme={theme}>Permissions</ProfileLabel>
                  <ProfileValue theme={theme}>
                    {user.permissions && user.permissions.length > 0
                      ? user.permissions.join(', ')
                      : '—'}
                  </ProfileValue>
                </ProfileItem>
                <ProfileItem>
                  <ProfileLabel theme={theme}>Status</ProfileLabel>
                  <ProfileValue theme={theme}>
                    {user.isActive ? (
                      <StatusBadge>Active</StatusBadge>
                    ) : (
                      <span>Inactive</span>
                    )}
                  </ProfileValue>
                </ProfileItem>
              </ProfileGrid>
            </ProfileSection>

            <DetailsTable theme={theme}>
              <TableHeader theme={theme}>
                <TableHeaderRow>
                  <TableHeaderCell theme={theme}>Field</TableHeaderCell>
                  <TableHeaderCell theme={theme}>Value</TableHeaderCell>
                </TableHeaderRow>
              </TableHeader>
              <TableBody>
                {fields.map((item, index) => (
                  <TableRow key={index} theme={theme}>
                    <FieldCell theme={theme}>{item.field}</FieldCell>
                    <ValueCell theme={theme}>{formatValue(item.value)}</ValueCell>
                  </TableRow>
                ))}
              </TableBody>
            </DetailsTable>
          </ContentWrapper>
        </PageContent>
      </ThemeProvider>
    </Layout>
  );
};

