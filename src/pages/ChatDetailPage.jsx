import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { Layout } from '../components/Layout';
import { HiArrowPath, HiPencil, HiTrash, HiChevronLeft } from 'react-icons/hi2';

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

const Title = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
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

const ChatSection = styled.div`
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

const ChatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
`;

const ChatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ChatLabel = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ChatValue = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.primary};
  word-break: break-word;
  font-family: ${({ $monospace }) => ($monospace ? 'monospace' : 'inherit')};
  font-size: ${({ $monospace }) => ($monospace ? '12px' : '14px')};
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

const IdValue = styled.span`
  color: #3B82F6;
  cursor: pointer;
`;

// Моковые данные chats
const mockChats = [
  {
    id: 1,
    _id: '692ef62e69b12babcd7522b1',
    payment: 'hgategelato',
    chatId: '-2439134796',
    operators: [342926003, 8250662366, 330162182, 351516779, 110345101, 7337175521, 969997649, 7535676711, 7852716369, 7856284707, 323718363, 8258611696, 5255314681, 7946413946],
    template: 'with_file',
    extraText: null,
    createdAt: '2025-12-02 14:22:38',
    updatedAt: '2025-12-02 14:22:38',
  },
  {
    id: 2,
    _id: '692ef62e69b12babcd7522b2',
    payment: '1pat',
    chatId: '-4979836069',
    operators: [7755983628, 7646979697, 7504629166, 7626314980, 8077361366, 7483660988],
    template: 'with_url',
    extraText: null,
    createdAt: '2025-12-02 13:57:45',
    updatedAt: '2025-12-02 13:57:45',
  },
];

export const ChatDetailPage = () => {
  const { theme } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const [chat, setChat] = useState(null);

  useEffect(() => {
    // Находим chat по ID
    const foundChat = mockChats.find((c) => c.id === Number(id) || c._id === id);
    setChat(foundChat || null);
  }, [id]);

  const handleRefresh = () => {
    console.log('Refresh chat', id);
  };

  const handleEdit = () => {
    navigate(`/models/chats/${id}/edit`);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this chat?')) {
      console.log('Delete chat', id);
      navigate('/models/chats');
    }
  };

  const handleBack = () => {
    navigate('/models/chats');
  };

  const handleCopyId = (text) => {
    navigator.clipboard.writeText(text);
  };

  if (!chat) {
    return (
      <Layout>
        <PageContent>
          <ContentWrapper>
            <div>Chat not found</div>
          </ContentWrapper>
        </PageContent>
      </Layout>
    );
  }

  const formatValue = (value) => {
    if (value === null || value === undefined || value === '') {
      return '—';
    }
    if (Array.isArray(value)) {
      return `[${value.join(', ')}]`;
    }
    if (typeof value === 'boolean') {
      return value.toString();
    }
    return String(value);
  };

  const fields = [
    { field: '_id', value: chat._id },
    { field: 'created_at', value: chat.createdAt },
    { field: 'updated_at', value: chat.updatedAt },
    { field: 'chat_id', value: chat.chatId },
    { field: 'payment_name', value: chat.payment },
    { field: 'payment_operator_ids', value: chat.operators },
    { field: 'message_template', value: chat.template },
    { field: 'extra_text', value: chat.extraText },
  ];

  return (
    <Layout>
      <ThemeProvider theme={theme}>
        <PageContent>
          <HeaderSection theme={theme}>
            <Title theme={theme}>
              Chats · {chat._id}
            </Title>
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
            <ChatSection theme={theme}>
              <SectionTitle theme={theme}>Chat</SectionTitle>
              <ChatGrid>
                <ChatItem>
                  <ChatLabel theme={theme}>Payment</ChatLabel>
                  <ChatValue theme={theme}>{chat.payment}</ChatValue>
                </ChatItem>
                <ChatItem>
                  <ChatLabel theme={theme}>Operators</ChatLabel>
                  <ChatValue theme={theme} $monospace>
                    {chat.operators.join(', ')}
                  </ChatValue>
                </ChatItem>
                <ChatItem>
                  <ChatLabel theme={theme}>Chat ID</ChatLabel>
                  <ChatValue theme={theme} $monospace>
                    {chat.chatId}
                  </ChatValue>
                </ChatItem>
                <ChatItem>
                  <ChatLabel theme={theme}>Template</ChatLabel>
                  <ChatValue theme={theme}>{chat.template}</ChatValue>
                </ChatItem>
              </ChatGrid>
            </ChatSection>

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
                    <ValueCell theme={theme}>
                      {item.field === '_id' ? (
                        <IdValue onClick={() => handleCopyId(item.value)}>
                          {formatValue(item.value)}
                        </IdValue>
                      ) : (
                        formatValue(item.value)
                      )}
                    </ValueCell>
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

