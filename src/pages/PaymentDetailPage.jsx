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

const RelationsSection = styled.div`
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

const Subsection = styled.div`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SubsectionTitle = styled.h4`
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TagsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const TagItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.primary};
`;

const TagDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ $color }) => $color || '#3B82F6'};
`;

const GoToChatButton = styled.button`
  margin-top: 16px;
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.accent};
  background-color: ${({ theme }) => theme.colors.accent};
  color: #FFFFFF;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.accentHover || theme.colors.accent};
    opacity: 0.9;
  }
`;

const DetailsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  overflow: hidden;
  margin-bottom: 24px;
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

const IdList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const IdItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: monospace;
  font-size: 12px;
  color: ${({ $color, theme }) => $color || theme.colors.primary};
`;

const CopyIcon = styled.span`
  cursor: pointer;
  opacity: 0.6;
  font-size: 14px;

  &:hover {
    opacity: 1;
  }
`;

const JsonSection = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 20px;
  margin-bottom: 24px;
`;

const JsonTitle = styled.h4`
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const JsonContent = styled.pre`
  margin: 0;
  font-size: 12px;
  font-family: monospace;
  color: ${({ theme }) => theme.colors.primary};
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-x: auto;
`;

// Моковые данные платежей
const mockPayments = [
  {
    id: 1,
    _id: '692ef39e1c07e718483352f1',
    name: 'hgategelato',
    activeOpen: true,
    activePending: true,
    externalIdType: 'transaction_reference',
    createdAt: '2025-12-02 14:11:42',
    updatedAt: '2025-12-02 14:11:42',
    tagIds: [
      '4f368b69-118c-41b3-b5b5-8b5a17e74a79',
      '38ed4e48-40a7-464c-b76d-efce8688312f',
      '3434a9fd-a77e-431b-821d-57454c22a6ba',
      '5d45e65a-d4d7-4e12-b689-e54100f03127',
    ],
    gatewayIds: [
      '692ef3bf1a9b21f5a26a7394',
      '692ef4611a9b21f5a26a742f',
      '692ef48f69b12babcd7521ea',
      '692ef4db1a9b21f5a26a74a1',
    ],
    tagsDetail: [
      { uuid: '4f368b69-118c-41b3-b5b5-8b5a17e74a79', id: 1, name: 'GELATO_SBP_ALFA_H2H_PAY_IN_TRUSTED' },
      { uuid: '38ed4e48-40a7-464c-b76d-efce8688312f', id: 2, name: 'GELATO_SBP_ALFA_H2H_PAY_IN_FTD' },
      { uuid: '3434a9fd-a77e-431b-821d-57454c22a6ba', id: 3, name: 'GELATO_P2P_RUB_H2H_PAY-IN' },
      { uuid: '5d45e65a-d4d7-4e12-b689-e54100f03127', id: 4, name: 'GELATO_SBP_RUB_H2H_PAY-IN_TRUSTED' },
    ],
    gatewaysDetail: [
      { id: '692ef3bf1a9b21f5a26a7394', name: 'GELATO_P2P_RUB_H2H_PAY-IN' },
      { id: '692ef4611a9b21f5a26a742f', name: 'GELATO_SBP_ALFA_H2H_PAY_IN_FTD' },
      { id: '692ef48f69b12babcd7521ea', name: 'GELATO_SBP_ALFA_H2H_PAY_IN_TRUSTED' },
      { id: '692ef4db1a9b21f5a26a74a1', name: 'GELATO_SBP_RUB_H2H_PAY-IN_TRUSTED' },
    ],
  },
];

export const PaymentDetailPage = () => {
  const { theme } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);

  useEffect(() => {
    // Находим платеж по ID
    const foundPayment = mockPayments.find((p) => p.id === Number(id) || p._id === id);
    setPayment(foundPayment || null);
  }, [id]);

  const handleRefresh = () => {
    console.log('Refresh payment', id);
  };

  const handleEdit = () => {
    navigate(`/models/payments/${id}/edit`);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      console.log('Delete payment', id);
      navigate('/models/payments');
    }
  };

  const handleBack = () => {
    navigate('/models/payments');
  };

  const handleCopyId = (text) => {
    navigator.clipboard.writeText(text);
  };

  if (!payment) {
    return (
      <Layout>
        <PageContent>
          <ContentWrapper>
            <div>Payment not found</div>
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
    { field: '_id', value: payment._id },
    { field: 'created_at', value: payment.createdAt },
    { field: 'updated_at', value: payment.updatedAt },
    { field: 'name', value: payment.name },
    { field: 'external_id_type', value: payment.externalIdType },
    { field: 'is_active_open', value: payment.activeOpen },
    { field: 'is_active_pending', value: payment.activePending },
    { field: 'tag_ids', value: payment.tagIds },
    { field: 'gateway_ids', value: payment.gatewayIds },
  ];

  return (
    <Layout>
      <ThemeProvider theme={theme}>
        <PageContent>
          <HeaderSection theme={theme}>
            <Title theme={theme}>
              Payments · {payment._id}
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
            <RelationsSection theme={theme}>
              <SectionTitle theme={theme}>Relations</SectionTitle>
              
              <Subsection>
                <SubsectionTitle theme={theme}>Tags</SubsectionTitle>
                <TagsList>
                  {payment.tagsDetail?.map((tag, index) => (
                    <TagItem key={index} theme={theme}>
                      <TagDot $color="#3B82F6" />
                      <span>{tag.name}</span>
                    </TagItem>
                  ))}
                </TagsList>
              </Subsection>

              <Subsection>
                <SubsectionTitle theme={theme}>Gateways</SubsectionTitle>
                <TagsList>
                  {payment.gatewaysDetail?.map((gateway, index) => (
                    <TagItem key={index} theme={theme}>
                      <TagDot $color="#10A37F" />
                      <span>{gateway.name}</span>
                    </TagItem>
                  ))}
                </TagsList>
                <GoToChatButton theme={theme}>Go to Chat</GoToChatButton>
              </Subsection>
            </RelationsSection>

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
                      ) : item.field === 'tag_ids' ? (
                        <IdList>
                          {Array.isArray(item.value) && item.value.map((id, idx) => (
                            <IdItem key={idx} $color="#3B82F6" theme={theme}>
                              {id}
                              <CopyIcon onClick={() => handleCopyId(id)}>📋</CopyIcon>
                            </IdItem>
                          ))}
                        </IdList>
                      ) : item.field === 'gateway_ids' ? (
                        <IdList>
                          {Array.isArray(item.value) && item.value.map((id, idx) => (
                            <IdItem key={idx} $color="#6B6B6B" theme={theme}>
                              {id}
                              <CopyIcon onClick={() => handleCopyId(id)}>📋</CopyIcon>
                            </IdItem>
                          ))}
                        </IdList>
                      ) : (
                        formatValue(item.value)
                      )}
                    </ValueCell>
                  </TableRow>
                ))}
              </TableBody>
            </DetailsTable>

            <JsonSection theme={theme}>
              <JsonTitle theme={theme}>tags_detail</JsonTitle>
              <JsonContent theme={theme}>
                {JSON.stringify(payment.tagsDetail, null, 2)}
              </JsonContent>
            </JsonSection>

            <JsonSection theme={theme}>
              <JsonTitle theme={theme}>gateways_detail</JsonTitle>
              <JsonContent theme={theme}>
                {JSON.stringify(payment.gatewaysDetail, null, 2)}
              </JsonContent>
            </JsonSection>
          </ContentWrapper>
        </PageContent>
      </ThemeProvider>
    </Layout>
  );
};

