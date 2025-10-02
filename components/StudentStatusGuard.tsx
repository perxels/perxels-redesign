import React from 'react'
import {
  Box,
  Text,
  VStack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useColorModeValue,
  Button,
  HStack,
  Badge,
  Spinner,
  Center,
} from '@chakra-ui/react'
import Link from 'next/link'
import { usePortalAuth } from '../hooks/usePortalAuth'

interface StudentStatusGuardProps {
  children: React.ReactNode
  loading?: boolean
  fallback?: React.ReactNode
  showContactSupport?: boolean
  student?: any
}

// Helper function to format Firestore timestamps
const formatTimestamp = (timestamp: any): string => {
  if (!timestamp) return 'Unknown date'

  try {
    const date = timestamp.seconds
      ? new Date(timestamp.seconds * 1000)
      : new Date(timestamp)

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch (error) {
    return 'Invalid date'
  }
}

// Calculate owing status based on payment data
const calculateOwingStatus = (student: any): string => {
  const schoolFeeInfo = student.schoolFeeInfo

  if (!schoolFeeInfo) {
    return 'No Payment Info'
  }

  const totalSchoolFee = schoolFeeInfo.totalSchoolFee || 0
  const totalApproved = schoolFeeInfo.totalApproved || 0

  // If approved payments equal or exceed total school fee, student is paid
  if (totalApproved >= totalSchoolFee) {
    return 'Paid'
  }

  // Otherwise, student is owing
  return 'Owing'
}

// Default loading fallback component
const DefaultLoadingFallback: React.FC = () => (
  <Center h="200px">
    <VStack spacing={4}>
      <Spinner size="xl" color="blue.500" />
      <Text color="gray.600">Loading student status...</Text>
    </VStack>
  </Center>
)

// Default error fallback component
const DefaultErrorFallback: React.FC = () => (
  <Box textAlign="center" py={8}>
    <Alert status="error" maxW="md" mx="auto">
      <AlertIcon />
      <Box>
        <AlertTitle>Student data not found</AlertTitle>
        <AlertDescription>
          Unable to load your student information. Please try again later.
        </AlertDescription>
      </Box>
    </Alert>
  </Box>
)

const StudentStatusGuard: React.FC<StudentStatusGuardProps> = ({
  children,
  loading: externalLoading,
  fallback,
  showContactSupport = false,
  student: externalStudent,
}) => {
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const bgColor = useColorModeValue('gray.50', 'gray.700')

  // Use your existing auth hook
  const { portalUser, loading: authLoading } = usePortalAuth()

  // Determine loading state and student data
  const loading = externalLoading !== undefined ? externalLoading : authLoading
  const student = externalStudent || portalUser

  // Loading state
  if (loading) {
    return fallback ? <>{fallback}</> : <DefaultLoadingFallback />
  }

  // Error state - no student data after loading
  if (!student) {
    return fallback ? <>{fallback}</> : <DefaultErrorFallback />
  }

  // If user is not a student, just render children (let other guards handle roles)
  if (student.role !== 'student') {
    return <>{children}</>
  }

  // Check if student is active (default to true for backward compatibility)
  const isActive = student.isStudentActive !== false

  // Active state - render children
  if (isActive) {
    return <>{children}</>
  }

  // Inactive state - Student is deactivated
  return (
    <Box
      p={6}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      maxW="2xl"
      mx="auto"
      mt={8}
    >
      <Alert
        status="warning"
        borderRadius="md"
        mb={4}
        variant="subtle"
        flexDirection="column"
        alignItems="flex-start"
      >
        <Box display="flex" alignItems="center" mb={2}>
          <AlertIcon />
          <AlertTitle>Account Inactive</AlertTitle>
        </Box>
        <AlertDescription>
          You are not currently an Active Student.{' '}
          {showContactSupport &&
            'Please contact support if you believe this is an error.'}
        </AlertDescription>
      </Alert>

      {/* Deactivation Details */}
      <VStack spacing={4} align="stretch">
        {student.deactivationReason && (
          <Box>
            {/* <Text fontWeight="semibold" fontSize="sm" mb={2}>
              Deactivation Reason:
            </Text> */}
            <Text fontWeight="semibold" fontSize="medium" mb={2}>
              Reason:
            </Text>
            <Box
              p={4}
              bg={bgColor}
              borderRadius="md"
              borderLeft="4px solid"
              borderColor="orange.400"
            >
              <Text fontSize="sm" whiteSpace="pre-wrap">
                {student.deactivationReason}
              </Text>
            </Box>
          </Box>
        )}

        {student.studentDeactivatedAt && (
          <HStack>
            <Text fontSize="sm" fontWeight="medium">
              Deactivated on:
            </Text>
            <Text fontSize="sm">
              {formatTimestamp(student.studentDeactivatedAt)}
            </Text>
          </HStack>
        )}

        {/* Additional context from your data */}
        {student && (
          <Alert status="info" borderRadius="md" size="sm">
            <AlertIcon />
            <Box gap={1} display={'flex'} flexDirection={'column'}>
              <Text fontSize="medium" fontWeight="semibold">
                Payment Status
              </Text>
              <Text fontSize="sm">
                Currently:{' '}
                <Badge colorScheme="orange">
                  {calculateOwingStatus(student)}
                </Badge>
              </Text>
            </Box>
          </Alert>
        )}

        {/* Contact Support */}
        {showContactSupport && (
          <Box pt={2}>
            <Link href="/contact-support" passHref>
              <Button colorScheme="blue" size="sm">
                Contact Support
              </Button>
            </Link>
          </Box>
        )}
      </VStack>
    </Box>
  )
}

export default StudentStatusGuard
