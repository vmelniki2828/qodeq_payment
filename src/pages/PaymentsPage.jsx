import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { Layout } from '../components/Layout';
import { HiPencil, HiTrash, HiArrowUp, HiArrowDown, HiEye, HiChevronLeft } from 'react-icons/hi2';

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

  ${({ $primary, theme }) =>
    $primary &&
    `
    background-color: ${theme.colors.accent};
    color: #FFFFFF;
    border-color: ${theme.colors.accent};

    &:hover {
      background-color: ${theme.colors.accentHover || theme.colors.accent};
      opacity: 0.9;
    }
  `}
`;

const FiltersSection = styled.div`
  padding: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  gap: 16px;
  align-items: center;
  flex-shrink: 0;
`;

const FilterLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary};
  white-space: nowrap;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 13px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s ease;
  box-sizing: border-box;
  max-width: 400px;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const SortSelect = styled.select`
  padding: 8px 32px 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 13px;
  cursor: pointer;
  outline: none;
  transition: border-color 0.15s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B6B6B' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  background-size: 12px;
  box-sizing: border-box;
  min-width: 150px;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  option {
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const TableContainer = styled.div`
  flex: 1;
  padding: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: ${({ theme }) =>
    theme.colors.surface === '#F9FAFB' ? '#F0F1F3' : theme.colors.surface};
`;

const TableHeader = styled.thead`
  background-color: ${({ theme }) =>
    theme.colors.surface === '#F9FAFB' ? '#F0F1F3' : theme.colors.surface};
`;

const TableHeaderRow = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const TableHeaderCell = styled.th`
  padding: 12px 16px;
  text-align: center;
  vertical-align: middle;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background-color: ${({ theme }) =>
    theme.colors.surface === '#F9FAFB' ? '#F0F1F3' : theme.colors.surface};
  cursor: pointer;
  user-select: none;
  transition: background-color 0.15s ease;
  position: relative;

  &:hover {
    background-color: ${({ theme }) =>
      theme.colors.primary === '#0D0D0D' ? '#f8f8f8' : 'rgba(255,255,255,0.04)'};
  }

  ${({ $sorted }) =>
    $sorted &&
    `
    color: ${({ theme }) => theme.colors.primary};
  `}

  ${({ $width }) =>
    $width &&
    `
    width: ${$width};
  `}
`;

const SortIcon = styled.span`
  margin-left: 8px;
  font-size: 10px;
  opacity: 0.6;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  transition: background-color 0.15s ease;

  &:hover {
    background-color: ${({ theme }) =>
      theme.colors.primary === '#0D0D0D' ? '#f8f8f8' : 'rgba(255,255,255,0.04)'};
  }
`;

const TableCell = styled.td`
  padding: 12px 16px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
  vertical-align: middle;
`;

const IdCell = styled(TableCell)`
  text-align: left;
  font-family: monospace;
  font-size: 11px;
`;

const NameCell = styled(TableCell)`
  text-align: left;
`;

const ActiveCell = styled(TableCell)`
  font-size: 16px;
  color: ${({ $active, theme }) => ($active ? '#10A37F' : '#ef4444')};
`;

const ExternalIdTypeCell = styled(TableCell)`
  text-align: left;
  font-size: 12px;
`;

const CreatedAtCell = styled(TableCell)`
  font-size: 12px;
`;

const ActionsCell = styled(TableCell)`
  width: 120px;
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border: none;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.secondary};
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.15s ease;

  &:hover {
    background-color: ${({ theme }) =>
      theme.colors.primary === '#0D0D0D' ? '#f0f0f0' : 'rgba(255,255,255,0.08)'};
    color: ${({ theme }) => theme.colors.primary};
  }

  ${({ $danger }) =>
    $danger &&
    `
    &:hover {
      color: #ef4444;
      background-color: rgba(239,68,68,0.1);
    }
  `}
`;

const PaginationSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const TotalText = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.secondary};
`;

const PaginationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const PaginationText = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.secondary};
`;

const PaginationButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const PaginationButton = styled.button`
  padding: 6px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) =>
      theme.colors.primary === '#0D0D0D'
        ? '#f0f0f0'
        : 'rgba(255,255,255,0.08)'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${({ $active }) =>
    $active &&
    `
    background-color: ${({ theme }) => theme.colors.accent};
    color: #FFFFFF;
    border-color: ${({ theme }) => theme.colors.accent};
    
    &:hover {
      background-color: ${({ theme }) => theme.colors.accentHover || theme.colors.accent};
    }
  `}
`;

const PageContainer = styled.div`
  display: flex;
  flex: 1;
  position: relative;
  min-height: 0;
  overflow: hidden;
  height: 100%;
`;

const LeftPanel = styled.div`
  width: ${({ $isFullWidth }) => ($isFullWidth ? '100%' : '75%')};
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: width 0.3s ease;
`;

const Divider = styled.div`
  width: ${({ $isHidden }) => ($isHidden ? '0' : '1px')};
  background-color: ${({ theme }) => theme.colors.border};
  flex-shrink: 0;
  position: relative;
  opacity: ${({ $isHidden }) => ($isHidden ? 0 : 1)};
  pointer-events: ${({ $isHidden }) => ($isHidden ? 'none' : 'auto')};
  overflow: hidden;
  transition: opacity 0.3s ease, width 0.3s ease;
`;

const RightPanel = styled.div`
  width: ${({ $isVisible }) => ($isVisible ? '25%' : '0')};
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  pointer-events: ${({ $isVisible }) => ($isVisible ? 'auto' : 'none')};
  transition: opacity 0.3s ease, width 0.3s ease;
`;

const RightContent = styled.div`
  padding: 20px;
  overflow-y: auto;
  height: 100%;
  display: flex;
  flex-direction: column;

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

const BackButton = styled.button`
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
  align-self: flex-start;
  margin-bottom: 20px;

  &:hover {
    background-color: ${({ theme }) =>
      theme.colors.primary === '#0D0D0D' ? '#f0f0f0' : 'rgba(255,255,255,0.08)'};
  }
`;

const SettingSection = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
`;

const SettingLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  width: 180px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SettingContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const TextInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 13px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s ease;
  box-sizing: border-box;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 8px 32px 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 13px;
  cursor: pointer;
  outline: none;
  transition: border-color 0.15s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B6B6B' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  background-size: 12px;
  box-sizing: border-box;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  option {
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: ${({ theme }) => theme.colors.primary};
`;

const SaveButton = styled.button`
  align-self: flex-end;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.background};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

  &:hover {
    opacity: 0.9;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
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
  {
    id: 2,
    _id: '692eeff469b12babcd752019',
    name: '1pat',
    activeOpen: true,
    activePending: true,
    externalIdType: 'transaction_reference',
    createdAt: '2025-12-02 13:56:04',
  },
  {
    id: 3,
    _id: '692eea221a9b21f5a26a6c9f',
    name: 'hgatesarexpay',
    activeOpen: false,
    activePending: false,
    externalIdType: 'hgate_id',
    createdAt: '2025-11-04 11:01:21',
  },
  {
    id: 4,
    _id: '692eea221a9b21f5a26a6ca0',
    name: 'hgatepropayller',
    activeOpen: true,
    activePending: true,
    externalIdType: 'transaction_reference',
    createdAt: '2025-11-04 10:58:15',
  },
  {
    id: 5,
    _id: '692eea221a9b21f5a26a6ca1',
    name: 'hgateargospay',
    activeOpen: true,
    activePending: true,
    externalIdType: 'hgate_id',
    createdAt: '2025-11-04 10:55:30',
  },
  {
    id: 6,
    _id: '692eea221a9b21f5a26a6ca2',
    name: 'hgateikra',
    activeOpen: true,
    activePending: true,
    externalIdType: 'transaction_reference',
    createdAt: '2025-11-04 10:52:45',
  },
  {
    id: 7,
    _id: '692eea221a9b21f5a26a6ca3',
    name: 'hgatetrustcloud',
    activeOpen: true,
    activePending: true,
    externalIdType: 'hgate_id',
    createdAt: '2025-11-04 10:50:00',
  },
  {
    id: 8,
    _id: '692eea221a9b21f5a26a6ca4',
    name: 'hgatebigldea',
    activeOpen: true,
    activePending: true,
    externalIdType: 'transaction_reference',
    createdAt: '2025-11-04 10:47:15',
  },
  {
    id: 9,
    _id: '692eea221a9b21f5a26a6ca5',
    name: 'hgatepaytop',
    activeOpen: false,
    activePending: true,
    externalIdType: 'hgate_id',
    createdAt: '2025-11-04 10:44:30',
  },
  {
    id: 10,
    _id: '692eea221a9b21f5a26a6ca6',
    name: 'hgatenextgen',
    activeOpen: true,
    activePending: true,
    externalIdType: 'transaction_reference',
    createdAt: '2025-11-04 10:41:45',
  },
  {
    id: 11,
    _id: '692eea221a9b21f5a26a6ca7',
    name: 'IDMhgate',
    activeOpen: true,
    activePending: true,
    externalIdType: 'hgate_id',
    createdAt: '2025-11-04 10:39:00',
  },
];

export const PaymentsPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [payments, setPayments] = useState(mockPayments);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPaymentId, setEditingPaymentId] = useState(null);
  const [newPayment, setNewPayment] = useState({
    name: '',
    activeOpen: true,
    activePending: true,
    externalIdType: 'transaction_reference',
  });

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      !searchQuery ||
      payment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.externalIdType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const sortedPayments = [...filteredPayments].sort((a, b) => {
    if (!sortField) return 0;

    let aValue, bValue;

    switch (sortField) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'active_open':
        aValue = a.activeOpen ? 1 : 0;
        bValue = b.activeOpen ? 1 : 0;
        break;
      case 'active_pending':
        aValue = a.activePending ? 1 : 0;
        bValue = b.activePending ? 1 : 0;
        break;
      case 'external_id_type':
        aValue = a.externalIdType.toLowerCase();
        bValue = b.externalIdType.toLowerCase();
        break;
      case 'created_at':
        aValue = a.createdAt || '';
        bValue = b.createdAt || '';
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <HiArrowUp /> : <HiArrowDown />;
  };

  const handleRefresh = () => {
    console.log('Refresh payments');
  };

  const handleCreate = () => {
    setEditingPaymentId(null);
    setNewPayment({
      name: '',
      activeOpen: true,
      activePending: true,
      externalIdType: 'transaction_reference',
    });
    setIsCreateOpen(true);
  };

  const handleCloseCreate = () => {
    setIsCreateOpen(false);
    setEditingPaymentId(null);
    setNewPayment({
      name: '',
      activeOpen: true,
      activePending: true,
      externalIdType: 'transaction_reference',
    });
  };

  const handleSavePayment = () => {
    if (editingPaymentId) {
      // Update existing payment
      setPayments((prevPayments) =>
        prevPayments.map((payment) =>
          payment.id === editingPaymentId
            ? {
                ...payment,
                name: newPayment.name,
                activeOpen: newPayment.activeOpen,
                activePending: newPayment.activePending,
                externalIdType: newPayment.externalIdType,
              }
            : payment
        )
      );
      console.log('Update payment:', editingPaymentId, newPayment);
    } else {
      // Create new payment
      const newId = Math.max(...payments.map((p) => p.id), 0) + 1;
      const createdPayment = {
        id: newId,
        _id: `692eea221a9b21f5a26a6c${String(newId).padStart(2, '0')}`,
        name: newPayment.name,
        activeOpen: newPayment.activeOpen,
        activePending: newPayment.activePending,
        externalIdType: newPayment.externalIdType,
        createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      };
      setPayments((prevPayments) => [...prevPayments, createdPayment]);
      console.log('Create new payment', createdPayment);
    }
    handleCloseCreate();
  };

  const handleView = (paymentId, e) => {
    e?.stopPropagation();
    navigate(`/models/payments/${paymentId}`);
  };

  const handleEdit = (paymentId, e) => {
    e.stopPropagation();
    const payment = payments.find((p) => p.id === paymentId);
    if (payment) {
      setEditingPaymentId(paymentId);
      setNewPayment({
        name: payment.name,
        activeOpen: payment.activeOpen,
        activePending: payment.activePending,
        externalIdType: payment.externalIdType,
      });
      setIsCreateOpen(true);
    }
  };

  const handleDelete = (paymentId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this payment?')) {
      setPayments((prevPayments) => prevPayments.filter((payment) => payment.id !== paymentId));
      console.log('Delete payment', paymentId);
    }
  };

  const ITEMS_PER_PAGE = 10;
  const totalPayments = sortedPayments.length;
  const totalPages = Math.ceil(totalPayments / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedPayments = sortedPayments.slice(startIndex, endIndex);

  return (
    <Layout>
      <ThemeProvider theme={theme}>
        <div
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <HeaderSection theme={theme}>
            <Title theme={theme}>Payments</Title>
            <ButtonsGroup>
              <Button theme={theme} onClick={handleRefresh}>
                Refresh
              </Button>
              <Button theme={theme} $primary onClick={handleCreate}>
                Create
              </Button>
            </ButtonsGroup>
          </HeaderSection>

          <FiltersSection theme={theme}>
            <FilterLabel theme={theme}>Created At:</FilterLabel>
            <SortSelect
              theme={theme}
              value={sortField}
              onChange={(e) => {
                setSortField(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="created_at">Created At</option>
              <option value="name">Name</option>
              <option value="active_open">Active (Open)</option>
              <option value="active_pending">Active (Pending)</option>
              <option value="external_id_type">External ID Type</option>
            </SortSelect>
            <FilterLabel theme={theme}>Desc:</FilterLabel>
            <SortSelect
              theme={theme}
              value={sortDirection}
              onChange={(e) => {
                setSortDirection(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </SortSelect>
            <FilterLabel theme={theme}>Search:</FilterLabel>
            <SearchInput
              theme={theme}
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </FiltersSection>

          <PageContainer>
            <LeftPanel $isFullWidth={!isCreateOpen}>
              <TableContainer>
            <Table theme={theme}>
              <TableHeader theme={theme}>
                <TableHeaderRow>
                  <TableHeaderCell
                    theme={theme}
                    onClick={() => handleSort('_id')}
                    $sorted={sortField === '_id'}
                  >
                    ID
                    <SortIcon>{getSortIcon('_id')}</SortIcon>
                  </TableHeaderCell>
                  <TableHeaderCell
                    theme={theme}
                    onClick={() => handleSort('name')}
                    $sorted={sortField === 'name'}
                  >
                    Name
                    <SortIcon>{getSortIcon('name')}</SortIcon>
                  </TableHeaderCell>
                  <TableHeaderCell
                    theme={theme}
                    onClick={() => handleSort('active_open')}
                    $sorted={sortField === 'active_open'}
                  >
                    Active (Open)
                    <SortIcon>{getSortIcon('active_open')}</SortIcon>
                  </TableHeaderCell>
                  <TableHeaderCell
                    theme={theme}
                    onClick={() => handleSort('active_pending')}
                    $sorted={sortField === 'active_pending'}
                  >
                    Active (Pending)
                    <SortIcon>{getSortIcon('active_pending')}</SortIcon>
                  </TableHeaderCell>
                  <TableHeaderCell
                    theme={theme}
                    onClick={() => handleSort('external_id_type')}
                    $sorted={sortField === 'external_id_type'}
                  >
                    External ID Type
                    <SortIcon>{getSortIcon('external_id_type')}</SortIcon>
                  </TableHeaderCell>
                  <TableHeaderCell
                    theme={theme}
                    onClick={() => handleSort('created_at')}
                    $sorted={sortField === 'created_at'}
                  >
                    Created At
                    <SortIcon>{getSortIcon('created_at')}</SortIcon>
                  </TableHeaderCell>
                  <TableHeaderCell theme={theme} $width="120px">
                    Actions
                  </TableHeaderCell>
                </TableHeaderRow>
              </TableHeader>
              <TableBody>
                {paginatedPayments.map((payment) => (
                  <TableRow key={payment.id} theme={theme}>
                    <IdCell theme={theme}>{payment._id}</IdCell>
                    <NameCell theme={theme}>{payment.name}</NameCell>
                    <ActiveCell theme={theme} $active={payment.activeOpen}>
                      {payment.activeOpen ? '✓' : '✗'}
                    </ActiveCell>
                    <ActiveCell theme={theme} $active={payment.activePending}>
                      {payment.activePending ? '✓' : '✗'}
                    </ActiveCell>
                    <ExternalIdTypeCell theme={theme}>{payment.externalIdType}</ExternalIdTypeCell>
                    <CreatedAtCell theme={theme}>{payment.createdAt}</CreatedAtCell>
                    <ActionsCell theme={theme}>
                      <ActionButton
                        theme={theme}
                        onClick={(e) => handleView(payment.id, e)}
                        title="View"
                      >
                        <HiEye size={16} />
                      </ActionButton>
                      <ActionButton
                        theme={theme}
                        onClick={(e) => handleEdit(payment.id, e)}
                        title="Edit"
                      >
                        <HiPencil size={16} />
                      </ActionButton>
                      <ActionButton
                        theme={theme}
                        $danger
                        onClick={(e) => handleDelete(payment.id, e)}
                        title="Delete"
                      >
                        <HiTrash size={16} />
                      </ActionButton>
                    </ActionsCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
              </TableContainer>
            </LeftPanel>

            <Divider $isHidden={!isCreateOpen} theme={theme} />

            <RightPanel $isVisible={isCreateOpen} theme={theme}>
              <RightContent theme={theme}>
                <BackButton theme={theme} onClick={handleCloseCreate}>
                  <HiChevronLeft size={16} />
                  Back
                </BackButton>

                <SettingSection>
                  <SettingLabel theme={theme}>Name</SettingLabel>
                  <SettingContent>
                    <TextInput
                      theme={theme}
                      type="text"
                      value={newPayment.name}
                      onChange={(e) => setNewPayment({ ...newPayment, name: e.target.value })}
                      placeholder="Enter payment name"
                    />
                  </SettingContent>
                </SettingSection>

                <SettingSection>
                  <SettingLabel theme={theme}>Active (Open)</SettingLabel>
                  <SettingContent>
                    <Checkbox
                      type="checkbox"
                      checked={newPayment.activeOpen}
                      onChange={(e) => setNewPayment({ ...newPayment, activeOpen: e.target.checked })}
                      theme={theme}
                    />
                  </SettingContent>
                </SettingSection>

                <SettingSection>
                  <SettingLabel theme={theme}>Active (Pending)</SettingLabel>
                  <SettingContent>
                    <Checkbox
                      type="checkbox"
                      checked={newPayment.activePending}
                      onChange={(e) => setNewPayment({ ...newPayment, activePending: e.target.checked })}
                      theme={theme}
                    />
                  </SettingContent>
                </SettingSection>

                <SettingSection>
                  <SettingLabel theme={theme}>External ID Type</SettingLabel>
                  <SettingContent>
                    <Select
                      theme={theme}
                      value={newPayment.externalIdType}
                      onChange={(e) => setNewPayment({ ...newPayment, externalIdType: e.target.value })}
                    >
                      <option value="transaction_reference">transaction_reference</option>
                      <option value="hgate_id">hgate_id</option>
                    </Select>
                  </SettingContent>
                </SettingSection>

                <SaveButton theme={theme} onClick={handleSavePayment}>
                  {editingPaymentId ? 'Save Changes' : 'Create Payment'}
                </SaveButton>
              </RightContent>
            </RightPanel>
          </PageContainer>

          <PaginationSection theme={theme}>
            <TotalText theme={theme}>Total: {totalPayments}</TotalText>
            <PaginationInfo>
              <PaginationText theme={theme}>
                Page {currentPage} of {totalPages} • Total {totalPayments}
              </PaginationText>
              <PaginationButtons>
                <PaginationButton
                  theme={theme}
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Prev
                </PaginationButton>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationButton
                    key={page}
                    theme={theme}
                    $active={currentPage === page}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </PaginationButton>
                ))}
                <PaginationButton
                  theme={theme}
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </PaginationButton>
              </PaginationButtons>
            </PaginationInfo>
          </PaginationSection>
        </div>
      </ThemeProvider>
    </Layout>
  );
};

