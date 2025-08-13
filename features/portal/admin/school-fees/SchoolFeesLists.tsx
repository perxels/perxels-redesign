import React, { useState, useEffect, useCallback } from 'react'
import {
  Box,
  Flex,
  Text,
  Button,
  HStack,
  VStack,
  Spinner,
  Alert,
  AlertIcon,
  useDisclosure,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Link,
} from '@chakra-ui/react'
import { FiDownload, FiMoreVertical, FiExternalLink } from 'react-icons/fi'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { portalDb } from '../../../../portalFirebaseConfig'
import { PaymentReminderModal } from './PaymentReminderModal'
import {
  ImagePreviewModal,
  useImagePreview,
} from '../../../../components/ImagePreviewModal'

// Helper function to format payment date
const formatPaymentDate = (dateString: string | any): string => {
  console.log('formatPaymentDate input:', dateString, typeof dateString) // Debug log

  if (!dateString) return ''

  try {
    // Handle Firestore Timestamp objects
    if (typeof dateString === 'object' && dateString.seconds) {
      const date = new Date(dateString.seconds * 1000)
      const formatted = date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
      console.log('Firestore timestamp formatted:', formatted) // Debug log
      return formatted
    }

    // Handle ISO strings or other date formats
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      console.log('Invalid date:', dateString) // Debug log
      return ''
    }

    const formatted = date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
    console.log('Date string formatted:', formatted) // Debug log
    return formatted
  } catch (error) {
    console.log('Date formatting error:', error) // Debug log
    return ''
  }
}

export interface StudentFeeRecord {
  id: string
  name: string
  email: string
  phone: string
  classPlan: string
  cohort: string
  totalFee: number
  installments: {
    amount: number
    receipt: string
    status: string
    paymentDate?: string
  }[]
  status: 'debtor' | 'paid'
}

export interface SchoolFeesFilterState {
  branch: string
  classType: string
  classPlan: string
}

interface SchoolFeesListsProps {
  filters: SchoolFeesFilterState
}

function SchoolFeesListHeader({
  selected,
  onSelect,
  onSendReminder,
  onExport,
  hasData,
}: {
  selected: 'debtor' | 'paid'
  onSelect: (s: 'debtor' | 'paid') => void
  onSendReminder: () => void
  onExport: () => void
  hasData: boolean
}) {
  return (
    <Flex align="center" justify="space-between" mb={8}>
      <HStack spacing={[6, 8]}>
        <Button
          variant="ghost"
          fontSize={{ base: 'lg', md: '2xl' }}
          fontWeight={selected === 'debtor' ? 'bold' : 'semibold'}
          color={selected === 'debtor' ? 'black' : 'gray.400'}
          bg="transparent"
          onClick={() => onSelect('debtor')}
          px={0}
        >
          Debtors
        </Button>
        <Button
          variant="ghost"
          fontSize={{ base: 'lg', md: '2xl' }}
          fontWeight={selected === 'paid' ? 'bold' : 'semibold'}
          color={selected === 'paid' ? 'black' : 'gray.400'}
          bg="transparent"
          onClick={() => onSelect('paid')}
          px={0}
        >
          Fully paid
        </Button>
      </HStack>

      <HStack spacing={3}>
        {hasData && (
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<FiMoreVertical />}
              variant="outline"
              aria-label="Export options"
            />
            <MenuList>
              <MenuItem icon={<FiDownload />} onClick={onExport}>
                Export to CSV
              </MenuItem>
            </MenuList>
          </Menu>
        )}

        {selected === 'debtor' && (
          <Button colorScheme="purple" onClick={onSendReminder} px={[4, 6]}>
            Send Payment Reminder
          </Button>
        )}
      </HStack>
    </Flex>
  )
}

const SchoolFeesListRow = React.memo(function SchoolFeesListRow({
  record,
  onReceiptClick,
}: {
  record: StudentFeeRecord
  onReceiptClick: (url: string, studentName: string) => void
}) {
  return (
    <Box
      bg="gray.100"
      borderRadius="2xl"
      px={{ base: 4, md: 8 }}
      py={6}
      mb={4}
      w="full"
    >
      {/* Mobile Layout - Compact */}
      <Box display={{ base: 'block', md: 'none' }}>
        <Flex justify="space-between" align="center" mb={3}>
          <Text
            fontWeight="medium"
            fontSize="md"
            color="black"
            isTruncated
            flex="1"
          >
            {record.name}
          </Text>
          <VStack align="flex-end" spacing={0} ml={2}>
            <Text fontSize="xs" fontWeight="semibold" color="gray.500">
              Total
            </Text>
            <Text fontSize="lg" fontWeight="bold" color="black">
              {record.totalFee.toLocaleString()}
            </Text>
          </VStack>
        </Flex>

        {/* Horizontal scrollable installments on mobile */}
        <Box overflowX="auto" pb={1}>
          <Flex gap={4} minW="max-content">
            {record.installments.map((amt, idx) => (
              <VStack key={idx} spacing={1} minW="90px" align="center">
                <Text fontSize="xs" fontWeight="semibold" color="gray.500">
                  Inst {idx + 1}
                </Text>
                <Text
                  fontSize="md"
                  fontWeight="bold"
                  color={amt.status === 'approved' ? 'green.500' : 'red.500'}
                >
                  {amt.amount > 0 ? amt.amount.toLocaleString() : '-'}
                </Text>
                {amt.paymentDate && (
                  <Text fontSize="xs" color="gray.600" textAlign="center">
                    {formatPaymentDate(amt.paymentDate)}
                  </Text>
                )}
                {/* Debug: Show raw payment date */}
                {amt.paymentDate && (
                  <Text fontSize="xs" color="red.500" textAlign="center">
                    Raw: {JSON.stringify(amt.paymentDate)}
                  </Text>
                )}
                {amt.receipt && amt.receipt.trim() !== '' ? (
                  <Link
                    fontSize="xs"
                    color="blue.500"
                    isTruncated
                    maxW="80px"
                    onClick={() => onReceiptClick(amt.receipt, record.name)}
                    cursor="pointer"
                    _hover={{ textDecoration: 'underline' }}
                    display="flex"
                    alignItems="center"
                    gap={1}
                  >
                    <FiExternalLink size={10} />
                    View
                  </Link>
                ) : (
                  <Text fontSize="xs" color="gray.400">
                    No receipt
                  </Text>
                )}
              </VStack>
            ))}
          </Flex>
        </Box>
      </Box>

      {/* Desktop Layout - Keep exactly as it was */}
      <Flex
        display={{ base: 'none', md: 'flex' }}
        direction="row"
        align="center"
      >
        <Box flex="1" minW="180px" fontWeight="medium" fontSize="lg" mb={0}>
          {record.name}
        </Box>
        <Flex flex="1" direction="row" align="center" gap={4} w="full">
          <VStack align="center" minW="120px" mr={8} spacing={0}>
            <Text fontSize="xs" fontWeight="semibold" color="gray.500">
              Total Sch Fee
            </Text>
            <Text fontSize="2xl" fontWeight="bold" color="black">
              {record.totalFee.toLocaleString()}
            </Text>
          </VStack>
          {record.installments.map((amt, idx) => (
            <VStack key={idx} align="center" minW="120px" mr={8} spacing={0}>
              <Text fontSize="xs" fontWeight="semibold" color="gray.500">
                Installment {idx + 1}
              </Text>
              <Text
                fontSize="xl"
                fontWeight="bold"
                color={amt.status === 'approved' ? 'green.500' : 'red.500'}
              >
                {amt.amount > 0 ? amt.amount.toLocaleString() : '-'}
              </Text>
              {amt.paymentDate && (
                <Text fontSize="xs" color="gray.600" mt={1}>
                  {formatPaymentDate(amt.paymentDate)}
                </Text>
              )}
              {/* Debug: Show raw payment date */}
              {amt.paymentDate && (
                <Text fontSize="xs" color="red.500" mt={1}>
                  Raw: {JSON.stringify(amt.paymentDate)}
                </Text>
              )}
            </VStack>
          ))}
          <VStack align="center" minW="120px" spacing={0}>
            <Text fontSize="xs" fontWeight="semibold" color="gray.500">
              Receipt
            </Text>
            {record.installments.map((amt, i) =>
              amt.receipt && amt.receipt.trim() !== '' ? (
                <Link
                  key={i}
                  fontSize="xs"
                  color="blue.500"
                  isTruncated
                  maxW="100px"
                  onClick={() => onReceiptClick(amt.receipt, record.name)}
                  cursor="pointer"
                  _hover={{ textDecoration: 'underline' }}
                  display="flex"
                  alignItems="center"
                  gap={1}
                >
                  <FiExternalLink size={10} />
                  View
                </Link>
              ) : (
                <Text
                  key={i}
                  fontSize="xs"
                  color="gray.400"
                  isTruncated
                  maxW="100px"
                >
                  No receipt
                </Text>
              ),
            )}
          </VStack>
        </Flex>
      </Flex>
    </Box>
  )
})

const SchoolFeesListTable = React.memo(function SchoolFeesListTable({
  records,
  onReceiptClick,
}: {
  records: StudentFeeRecord[]
  onReceiptClick: (url: string, studentName: string) => void
}) {
  return (
    <Box>
      {records.map((rec) => (
        <SchoolFeesListRow
          key={rec.id}
          record={rec}
          onReceiptClick={onReceiptClick}
        />
      ))}
    </Box>
  )
})

export function SchoolFeesLists({ filters }: SchoolFeesListsProps) {
  const [selected, setSelected] = useState<'debtor' | 'paid'>('debtor')
  const [data, setData] = useState<StudentFeeRecord[]>([])
  const [allData, setAllData] = useState<StudentFeeRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const pageSize = 20
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const {
    isOpen: isImageOpen,
    onClose: onImageClose,
    imageUrl,
    title,
    openImagePreview,
  } = useImagePreview()

  const fetchData = useCallback(
    async (
      status: 'debtor' | 'paid',
      page: number,
      filters: SchoolFeesFilterState,
    ) => {
      setLoading(true)
      setError(null)
      try {
        const usersQuery = query(
          collection(portalDb, 'users'),
          orderBy('fullName'),
        )
        const snapshot = await getDocs(usersQuery)
        let allUsers: StudentFeeRecord[] = []
        snapshot.forEach((doc) => {
          const data = doc.data()
          const fee = data.schoolFeeInfo
          if (!fee) return
          const totalFee = fee.totalSchoolFee || 0
          const totalApproved = fee.totalApproved || 0
          const payments = Array.isArray(fee.payments) ? fee.payments : []
          // Always return 3 installments
          const installments = [0, 1, 2].map((idx) => {
            const p = payments.find(
              (pay: any) => pay.installmentNumber === idx + 1,
            )
            console.log(`Payment data for installment ${idx + 1}:`, p) // Debug log
            return p
              ? {
                  amount: p.amount || 0,
                  receipt: p.paymentReceiptUrl || '',
                  status: p.status || 'unpaid',
                  paymentDate:
                    p.paymentDate || p.createdAt || p.date || p.timestamp || '',
                }
              : { amount: 0, receipt: '', status: 'unpaid', paymentDate: '' }
          })
          const userStatus: 'debtor' | 'paid' =
            totalApproved < totalFee ? 'debtor' : 'paid'
          // Filtering logic
          if (
            ((status === 'debtor' && userStatus === 'debtor') ||
              (status === 'paid' && userStatus === 'paid')) &&
            (!filters.branch ||
              filters.branch === 'all' ||
              (data.branch &&
                data.branch.toLowerCase() ===
                  String(filters.branch).toLowerCase())) &&
            (!filters.classPlan ||
              (fee.classPlan &&
                fee.classPlan.toLowerCase() ===
                  String(filters.classPlan).toLowerCase()))
          ) {
            allUsers.push({
              id: doc.id,
              name: data.fullName || '',
              email: data.email || '',
              phone: data.phone || '',
              classPlan: fee.classPlan || '',
              cohort: fee.cohort || '',
              totalFee,
              installments,
              status: userStatus,
            })
          }
        })
        // Store all data for export
        setAllData(allUsers)

        // Pagination
        const startIdx = (page - 1) * pageSize
        const paged = allUsers.slice(startIdx, startIdx + pageSize)
        setData(paged)
        setHasMore(startIdx + pageSize < allUsers.length)
      } catch (e: any) {
        setError(e.message || 'Failed to fetch school fees')
        setData([])
        setHasMore(false)
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  useEffect(() => {
    setPage(1) // Reset to first page on filter change
  }, [filters, selected])

  useEffect(() => {
    fetchData(selected, page, filters)
  }, [selected, page, filters, fetchData])

  const handlePrev = () => setPage((p) => Math.max(1, p - 1))
  const handleNext = () => setPage((p) => p + 1)
  const handleSelect = (s: 'debtor' | 'paid') => {
    setSelected(s)
    setPage(1)
  }

  const handleExport = () => {
    try {
      // Create CSV content
      const headers = [
        'Student Name',
        'Email',
        'Phone Number',
        'Class Plan',
        'Cohort',
        'Total School Fee',
        'Installment 1',
        'Installment 2',
        'Installment 3',
        'Total Paid',
        'Balance',
        'Status',
      ]

      const csvContent = [
        headers.join(','),
        ...allData.map((record) => {
          const totalPaid = record.installments
            .filter((inst) => inst.status === 'approved')
            .reduce((sum, inst) => sum + inst.amount, 0)
          const balance = record.totalFee - totalPaid

          return [
            `"${record.name}"`,
            `"${record.email}"`,
            `"${record.phone}"`,
            `"${record.classPlan}"`,
            `"${record.cohort}"`,
            record.totalFee,
            record.installments[0]?.amount || 0,
            record.installments[1]?.amount || 0,
            record.installments[2]?.amount || 0,
            totalPaid,
            balance,
            record.status,
          ].join(',')
        }),
      ].join('\n')

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute(
        'download',
        `school-fees-${selected}-${new Date().toISOString().split('T')[0]}.csv`,
      )
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: 'Export Successful',
        description: `School fees data exported as CSV`,
        status: 'success',
        duration: 3000,
      })
    } catch (error) {
      console.error('Export error:', error)
      toast({
        title: 'Export Failed',
        description: 'Failed to export data. Please try again.',
        status: 'error',
        duration: 3000,
      })
    }
  }

  const handleReceiptClick = (receiptUrl: string, studentName: string) => {
    openImagePreview(receiptUrl, `${studentName} - Payment Receipt`)
  }

  return (
    <Box w="full" maxW="7xl" mx="auto" mt={8}>
      <SchoolFeesListHeader
        selected={selected}
        onSelect={handleSelect}
        onSendReminder={onOpen}
        onExport={handleExport}
        hasData={allData.length > 0}
      />
      {loading ? (
        <Flex justify="center" align="center" minH="200px">
          <Spinner size="lg" />
        </Flex>
      ) : error ? (
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      ) : data.length === 0 ? (
        <Flex justify="center" align="center" minH="200px">
          <Text>No records found.</Text>
        </Flex>
      ) : (
        <SchoolFeesListTable
          records={data}
          onReceiptClick={handleReceiptClick}
        />
      )}
      <Flex justify="flex-end" align="center" mt={4} gap={2}>
        <Button onClick={handlePrev} isDisabled={page === 1 || loading}>
          Previous
        </Button>
        <Text>Page {page}</Text>
        <Button onClick={handleNext} isDisabled={!hasMore || loading}>
          Next
        </Button>
      </Flex>

      <PaymentReminderModal
        isOpen={isOpen}
        onClose={onClose}
        filters={filters}
      />

      <ImagePreviewModal
        isOpen={isImageOpen}
        onClose={onImageClose}
        imageUrl={imageUrl}
        title={title}
      />
    </Box>
  )
}
