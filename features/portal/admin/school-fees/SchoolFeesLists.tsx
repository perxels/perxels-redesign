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
import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
  limit,
} from 'firebase/firestore'
import { portalDb } from '../../../../portalFirebaseConfig'
import { PaymentReminderModal } from './PaymentReminderModal'
import {
  ImagePreviewModal,
  useImagePreview,
} from '../../../../components/ImagePreviewModal'
import { useClasses } from '../../../../hooks/useClasses'

// Helper function to format payment date
const formatPaymentDate = (dateString: string | any): string => {
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
      return formatted
    }

    // Handle ISO strings or other date formats
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return ''
    }

    const formatted = date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
    return formatted
  } catch (error) {
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
    installmentNumber: number
    isRejected: boolean
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
          <HStack>
            <Text
              fontWeight="medium"
              fontSize="md"
              color="black"
              isTruncated
              flex="1"
            >
              {record.name}
            </Text>
          </HStack>
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
            {record.installments.map((inst, idx) => (
              <VStack key={idx} spacing={1} minW="90px" align="center">
                <Text
                  fontSize="xs"
                  fontWeight="semibold"
                  color={inst.isRejected ? 'red.500' : 'gray.500'}
                >
                  Inst {inst.installmentNumber}
                </Text>
                <Text
                  fontSize="md"
                  fontWeight="bold"
                  color={
                    inst.status === 'approved'
                      ? 'green.500'
                      : inst.status === 'pending'
                      ? 'orange.500'
                      : inst.isRejected
                      ? 'red.500'
                      : 'gray.400'
                  }
                >
                  {inst.amount > 0 ? inst.amount.toLocaleString() : '-'}
                </Text>
                {inst.paymentDate && (
                  <Text fontSize="xs" color="gray.600" textAlign="center">
                    {formatPaymentDate(inst.paymentDate)}
                  </Text>
                )}
                {inst.isRejected && (
                  <Text fontSize="xs" color="red.500" textAlign="center">
                    Rejected
                  </Text>
                )}
                {inst.receipt && inst.receipt.trim() !== '' ? (
                  <Link
                    fontSize="xs"
                    color={inst.isRejected ? 'red.500' : 'blue.500'}
                    isTruncated
                    maxW="80px"
                    onClick={() => onReceiptClick(inst.receipt, record.name)}
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
            {/* Show empty state if no installments */}
            {record.installments.length === 0 && (
              <VStack spacing={1} minW="90px" align="center">
                <Text fontSize="xs" fontWeight="semibold" color="gray.400">
                  No payments
                </Text>
                <Text fontSize="md" fontWeight="bold" color="gray.400">
                  -
                </Text>
                <Text fontSize="xs" color="gray.400" textAlign="center">
                  Not submitted
                </Text>
                <Text fontSize="xs" color="gray.400">
                  No receipt
                </Text>
              </VStack>
            )}
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
        <VStack align="center" minW="120px" mr={8} spacing={0}>
          <Text fontSize="xs" fontWeight="semibold" color="gray.500">
            Total Sch Fee
          </Text>
          <Text fontSize="2xl" fontWeight="bold" color="black">
            {record.totalFee.toLocaleString()}
          </Text>
        </VStack>
        <Flex flex="1" direction="row" align="center" gap={4} w="full">
          <HStack w="full" flex="1" minW="650px">
            {record.installments.map((inst, idx) => (
              <VStack key={idx} align="center" minW="120px" mr={8} spacing={0}>
                <Text
                  fontSize="xs"
                  fontWeight="semibold"
                  color={inst.isRejected ? 'red.500' : 'gray.500'}
                >
                  Installment {inst.installmentNumber}
                </Text>
                <Text
                  fontSize="xl"
                  fontWeight="bold"
                  color={
                    inst.status === 'approved'
                      ? 'green.500'
                      : inst.status === 'pending'
                      ? 'orange.500'
                      : inst.isRejected
                      ? 'red.500'
                      : 'gray.400'
                  }
                >
                  {inst.amount > 0 ? inst.amount.toLocaleString() : '-'}
                </Text>
                {inst.paymentDate && (
                  <Text fontSize="xs" color="gray.600" mt={1}>
                    {formatPaymentDate(inst.paymentDate)}
                  </Text>
                )}
                {inst.isRejected && (
                  <Text fontSize="xs" color="red.500" mt={1}>
                    Rejected
                  </Text>
                )}
              </VStack>
            ))}
            {/* Show empty state if no installments */}
            {record.installments.length === 0 && (
              <VStack align="center" minW="120px" mr={8} spacing={0}>
                <Text fontSize="xs" fontWeight="semibold" color="gray.400">
                  No payments
                </Text>
                <Text fontSize="xl" fontWeight="bold" color="gray.400">
                  -
                </Text>
                <Text fontSize="xs" color="gray.400" mt={1}>
                  Not submitted
                </Text>
              </VStack>
            )}
          </HStack>
          <VStack align="center" minW="120px" spacing={0}>
            <Text fontSize="xs" fontWeight="semibold" color="gray.500">
              Receipt
            </Text>
            {record.installments.map((inst, i) =>
              inst.receipt && inst.receipt.trim() !== '' ? (
                <Link
                  key={i}
                  fontSize="xs"
                  color={inst.isRejected ? 'red.500' : 'blue.500'}
                  isTruncated
                  maxW="100px"
                  onClick={() => onReceiptClick(inst.receipt, record.name)}
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
            {/* Show empty state for receipts if no installments */}
            {record.installments.length === 0 && (
              <Text fontSize="xs" color="gray.400" isTruncated maxW="100px">
                No receipt
              </Text>
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
  
  // Get classes for classType filtering
  const { classes } = useClasses({ status: 'active' })

  const fetchData = useCallback(
    async (
      status: 'debtor' | 'paid',
      page: number,
      filters: SchoolFeesFilterState,
    ) => {
      setLoading(true)
      setError(null)
      try {
        // Build optimized query with filters at database level
        let usersQuery = query(
          collection(portalDb, 'users'),
          orderBy('fullName'),
        )

        // Add branch filter to reduce data transfer
        if (filters.branch && filters.branch !== 'all') {
          // Handle special case for "Fully Online Class"
          if (filters.branch === 'Fully Online Class') {
            usersQuery = query(usersQuery, where('branch', '==', 'Fully Online Class'))
          } else {
            usersQuery = query(usersQuery, where('branch', '==', filters.branch))
          }
        }

        // Add class plan filter if specified
        if (filters.classPlan) {
          usersQuery = query(
            usersQuery,
            where('schoolFeeInfo.classPlan', '==', filters.classPlan),
          )
        }

        // Add limit for pagination
        const queryLimit = pageSize * 2 // Fetch a bit more for better UX
        usersQuery = query(usersQuery, limit(queryLimit))

        const snapshot = await getDocs(usersQuery)

        let allUsers: StudentFeeRecord[] = []
        snapshot.forEach((doc) => {
          const data = doc.data()
          const fee = data.schoolFeeInfo
          if (!fee) return

          // Apply classType filter (cohort matching)
          if (filters.classType && filters.classType !== 'all') {
            const studentCohort = fee.cohort || ''
            if (studentCohort !== filters.classType) {
              return // Skip this student if cohort doesn't match
            }
          }

          const totalFee = fee.totalSchoolFee || 0
          const totalApproved = fee.totalApproved || 0
          const payments = Array.isArray(fee.payments) ? fee.payments : []

          // Process all valid installments (approved and pending)
          const validPayments = payments.filter(
            (pay: any) => pay.status === 'approved' || pay.status === 'pending',
          )

          // Process rejected payments separately
          const rejectedPayments = payments.filter(
            (pay: any) => pay.status === 'rejected',
          )

          // Create installments array with valid payments first, then rejected
          const installments: {
            amount: number
            receipt: string
            status: string
            paymentDate: string
            installmentNumber: number
            isRejected: boolean
          }[] = []

          // Add valid installments (1, 2, 3, etc.)
          validPayments.forEach((pay: any) => {
            installments.push({
              amount: pay.amount || 0,
              receipt: pay.paymentReceiptUrl || '',
              status: pay.status || 'unpaid',
              paymentDate:
                pay.submittedAt ||
                pay.createdAt ||
                pay.date ||
                pay.timestamp ||
                '',
              installmentNumber: pay.installmentNumber,
              isRejected: false,
            })
          })

          // Add rejected payments after valid ones
          rejectedPayments.forEach((pay: any) => {
            installments.push({
              amount: pay.amount || 0,
              receipt: pay.paymentReceiptUrl || '',
              status: 'rejected',
              paymentDate:
                pay.submittedAt ||
                pay.createdAt ||
                pay.date ||
                pay.timestamp ||
                '',
              installmentNumber: pay.installmentNumber,
              isRejected: true,
            })
          })

          // Sort by installment number
          installments.sort((a, b) => a.installmentNumber - b.installmentNumber)

          const userStatus: 'debtor' | 'paid' =
            totalApproved < totalFee ? 'debtor' : 'paid'

          // Apply status filter
          if (status === userStatus) {
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
    [classes],
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
        'Installment 4',
        'Installment 5',
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

          // Get up to 5 installments for CSV export
          const csvInstallments = []
          for (let i = 1; i <= 5; i++) {
            const inst = record.installments.find(
              (inst) => inst.installmentNumber === i,
            )
            csvInstallments.push(inst?.amount || 0)
          }

          return [
            `"${record.name}"`,
            `"${record.email}"`,
            `"${record.phone}"`,
            `"${record.classPlan}"`,
            `"${record.cohort}"`,
            record.totalFee,
            ...csvInstallments,
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
