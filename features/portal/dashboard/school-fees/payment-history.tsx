import React, { useEffect, useState, useMemo } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Spinner,
  Link,
  Button,
  Grid,
  Alert,
  AlertIcon,
  keyframes,
} from '@chakra-ui/react'
import { usePaymentData } from '../../../../hooks/usePaymentData'
import { getRemainingBalance } from '../../../../types/school-fee.types'
import {
  ImagePreviewModal,
  useImagePreview,
} from '../../../../components/ImagePreviewModal'

interface PaymentRecord {
  id: string
  date: string
  paid: number
  owing: number
  receiptLink: string
  status: 'Approved' | 'Pending' | 'Rejected'
}

interface PaymentHistoryProps {
  payments?: PaymentRecord[]
}

function PaymentHistory({ payments: propPayments }: PaymentHistoryProps) {
  const { schoolFeeInfo, loading, error } = usePaymentData()
  const { isOpen, onClose, imageUrl, title, openImagePreview } =
    useImagePreview()

  // Animation keyframes for pending status
  const pulseAnimation = keyframes`
    0% { 
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.8);
    }
    50% { 
      transform: scale(1.08);
      box-shadow: 0 0 0 12px rgba(245, 158, 11, 0);
    }
    100% { 
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(245, 158, 11, 0);
    }
  `

  const scaleAnimation = keyframes`
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  `

  // Animated Badge component for pending status
  const AnimatedBadge = ({
    status,
    children,
  }: {
    status: string
    children: React.ReactNode
  }) => {
    const isPending = status === 'Pending'

    return (
      <Badge
        colorScheme={getStatusColor(status as PaymentRecord['status'])}
        px={3}
        py={1}
        borderRadius="full"
        fontSize="xs"
        fontWeight="medium"
        w="fit-content"
        animation={isPending ? `${scaleAnimation} 2s infinite` : undefined}
        bg={isPending ? 'yellow.400' : undefined}
        color={isPending ? 'black' : undefined}
        _hover={
          isPending
            ? {
                transform: 'scale(1.05)',
                transition: 'transform 0.2s ease-in-out',
              }
            : undefined
        }
      >
        {children}
      </Badge>
    )
  }

  // Helper function to safely parse dates from Firestore
  const parseFirestoreDate = (dateValue: any): string => {
    try {
      let date: Date

      // Handle Firestore Timestamp object
      if (dateValue && typeof dateValue === 'object' && dateValue.seconds) {
        date = new Date(dateValue.seconds * 1000)
      }
      // Handle Firestore Timestamp with toDate method
      else if (dateValue && typeof dateValue.toDate === 'function') {
        date = dateValue.toDate()
      }
      // Handle ISO string
      else if (typeof dateValue === 'string') {
        date = new Date(dateValue)
      }
      // Handle already parsed Date object
      else if (dateValue instanceof Date) {
        date = dateValue
      }
      // Handle milliseconds timestamp
      else if (typeof dateValue === 'number') {
        date = new Date(dateValue)
      } else {
        // Fallback to current date if parsing fails
        console.warn('Could not parse date:', dateValue)
        date = new Date()
      }

      // Validate the date
      if (isNaN(date.getTime())) {
        console.warn('Invalid date created from:', dateValue)
        date = new Date()
      }

      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    } catch (error) {
      console.warn('Error parsing date:', dateValue, error)
      // Return current date formatted as fallback
      return new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    }
  }

  // Transform school fee data to payment records
  const paymentData = useMemo(() => {
    if (propPayments) return propPayments

    if (!schoolFeeInfo?.payments?.length) return []

    return schoolFeeInfo.payments.map((payment, index) => {
      const currentOwed =
        index === 0
          ? schoolFeeInfo.totalSchoolFee - payment.amount
          : schoolFeeInfo.totalSchoolFee -
            (schoolFeeInfo.totalApproved + payment.amount)

      return {
        id: `${payment.installmentNumber}-${Date.now()}-${index}`,
        date: parseFirestoreDate(payment.submittedAt),
        paid: payment.amount,
        owing: currentOwed,
        receiptLink: payment.paymentReceiptUrl,
        status:
          payment.status === 'approved'
            ? 'Approved'
            : payment.status === 'pending'
            ? 'Pending'
            : 'Rejected',
      } as PaymentRecord
    })
  }, [schoolFeeInfo, propPayments])

  const getStatusColor = (status: PaymentRecord['status']) => {
    switch (status) {
      case 'Approved':
        return 'green'
      case 'Pending':
        return 'yellow'
      case 'Rejected':
        return 'red'
      default:
        return 'gray'
    }
  }

  const getRowStyles = (status: PaymentRecord['status']) => {
    return {
      bg: '#E8E8FF',
      borderRadius: 'xl',
      cursor: 'pointer',
    }
  }

  const formatAmount = (amount: number) => {
    return amount.toLocaleString()
  }

  const truncateUrl = (url: string) => {
    if (url.length <= 50) return url
    return url.substring(0, 47) + '...'
  }

  const handleReceiptClick = (receiptUrl: string) => {
    openImagePreview(receiptUrl, 'Payment Receipt')
  }

  if (loading) {
    return (
      <VStack spacing={6} align="stretch" w="full">
        <Text fontSize="2xl" fontWeight="semibold" color="#5B6B99">
          Payment History
        </Text>
        <Box display="flex" justifyContent="center" py={8}>
          <Spinner size="lg" color="blue.500" />
        </Box>
      </VStack>
    )
  }

  if (error) {
    return (
      <VStack spacing={6} align="stretch" w="full">
        <Text fontSize="2xl" fontWeight="semibold" color="#5B6B99">
          Payment History
        </Text>
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      </VStack>
    )
  }

  if (paymentData.length === 0) {
    return (
      <VStack spacing={6} align="stretch" w="full">
        <Text fontSize="2xl" fontWeight="semibold" color="#5B6B99">
          Payment History
        </Text>
        <Box bg="gray.50" borderRadius="xl" p={8} textAlign="center">
          <Text color="gray.500" fontSize="lg">
            No payment history found. Make your first payment to see records
            here.
          </Text>
        </Box>
      </VStack>
    )
  }

  return (
    <VStack spacing={6} align="stretch" w="full" pb={8}>
      <Text fontSize="2xl" fontWeight="semibold" color="#5B6B99">
        Payment History
      </Text>

      {/* Header */}
      <Grid
        templateColumns="repeat(5, 1fr)"
        gap={4}
        px={6}
        py={4}
        display={{ base: 'none', md: 'grid' }}
      >
        <Text fontSize="sm" fontWeight="medium" color="gray.600">
          Date
        </Text>
        <Text fontSize="sm" fontWeight="medium" color="gray.600">
          Paid
        </Text>
        <Text fontSize="sm" fontWeight="medium" color="gray.600">
          Owing
        </Text>
        <Text fontSize="sm" fontWeight="medium" color="gray.600">
          Receipt Link
        </Text>
        <Text fontSize="sm" fontWeight="medium" color="gray.600">
          Status
        </Text>
      </Grid>

      {/* Payment Rows */}
      <VStack spacing={4} align="stretch">
        {paymentData.map((payment) => (
          <Box
            key={payment.id}
            mx={0}
            px={{ base: 4, md: 6 }}
            py={6}
            {...getRowStyles(payment.status)}
          >
            {/* Mobile Card */}
            <Box display={{ base: 'block', md: 'none' }}>
              <Grid templateColumns="1fr 1fr" gap={2} alignItems="center">
                <Text fontSize="xs" color="gray.500">
                  Date
                </Text>
                <Text fontSize="sm" color="gray.900">
                  {payment.date}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  Paid / Owing
                </Text>
                <Text fontSize="sm" color="gray.900">
                  ₦{formatAmount(payment.paid)} / ₦{formatAmount(payment.owing)}
                </Text>
                {payment.receiptLink && (
                  <>
                    <Text fontSize="xs" color="gray.500">
                      Receipt
                    </Text>
                    <Link
                      fontSize="sm"
                      fontWeight="medium"
                      color="blue.600"
                      _hover={{ color: 'blue.800' }}
                      cursor="pointer"
                      onClick={() => handleReceiptClick(payment.receiptLink)}
                    >
                      {truncateUrl(payment.receiptLink)}
                    </Link>
                  </>
                )}
                <Text fontSize="xs" color="gray.500">
                  Status
                </Text>
                <AnimatedBadge status={payment.status}>
                  {payment.status}
                </AnimatedBadge>
              </Grid>
            </Box>
            {/* Desktop Grid Row */}
            <Grid
              templateColumns="repeat(5, 1fr)"
              gap={4}
              alignItems="center"
              display={{ base: 'none', md: 'grid' }}
            >
              <Text fontSize="sm" fontWeight="medium" color="gray.900">
                {payment.date}
              </Text>
              <Text fontSize="sm" fontWeight="medium" color="gray.900">
                ₦{formatAmount(payment.paid)}
              </Text>
              <Text fontSize="sm" fontWeight="medium" color="gray.900">
                ₦{formatAmount(payment.owing)}
              </Text>
              {payment.receiptLink && (
                <Link
                  fontSize="sm"
                  fontWeight="medium"
                  color="blue.600"
                  _hover={{ color: 'blue.800' }}
                  cursor="pointer"
                  onClick={() => handleReceiptClick(payment.receiptLink)}
                >
                  {truncateUrl(payment.receiptLink)}
                </Link>
              )}
              <AnimatedBadge status={payment.status}>
                {payment.status}
              </AnimatedBadge>
            </Grid>
          </Box>
        ))}
      </VStack>
      <ImagePreviewModal
        isOpen={isOpen}
        onClose={onClose}
        imageUrl={imageUrl}
        title={title}
      />
    </VStack>
  )
}

export { PaymentHistory }
