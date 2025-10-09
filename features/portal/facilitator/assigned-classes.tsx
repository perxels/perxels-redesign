import React, { useState, useEffect } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Card,
  CardBody,
  Badge,
  Heading,
  Spinner,
  Alert,
  AlertIcon,
  SimpleGrid,
  Button,
  useToast,
} from '@chakra-ui/react'
import { usePortalAuth } from '../../../hooks/usePortalAuth'
import { Assignment } from '../../../types/user'
import { doc, onSnapshot } from 'firebase/firestore'
import { portalDb } from '../../../portalFirebaseConfig'
import Link from 'next/link'

export const AssignedClasses: React.FC = () => {
  const { portalUser } = usePortalAuth()
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  useEffect(() => {
    if (!portalUser?.uid) return

    const unsubscribe = onSnapshot(
      doc(portalDb, 'users', portalUser.uid),
      (doc) => {
        try {
          const data = doc.data()
          const userAssignments = data?.assignments || []
          setAssignments(userAssignments)

          // Show toast for new assignments
          if (
            userAssignments.length > assignments.length &&
            assignments.length > 0
          ) {
            const newAssignments = userAssignments.length - assignments.length
            toast({
              title: 'New Assignment!',
              description: `You have been assigned to ${newAssignments} new cohort${
                newAssignments > 1 ? 's' : ''
              }`,
              status: 'info',
              duration: 5000,
              isClosable: true,
            })
          }
        } catch (error) {
          console.error('Error fetching assignments:', error)
        } finally {
          setLoading(false)
        }
      },
      (error) => {
        console.error('Error in assignments snapshot:', error)
        setLoading(false)
      },
    )

    return () => unsubscribe()
  }, [portalUser?.uid, assignments.length, toast])

  const formatDate = (date: any): string => {
    if (!date) return 'N/A'

    try {
      const dateObj = date.toDate ? date.toDate() : new Date(date)
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return 'N/A'
    }
  }

  if (loading) {
    return (
      <Box textAlign="center" py={8}>
        <Spinner size="lg" color="brand.purple.500" />
        <Text mt={4}>Loading your assignments...</Text>
      </Box>
    )
  }

  return (
    <VStack spacing={6} align="stretch" w="full">
      {/* Header */}
      <Box>
        <Heading size="lg" mb={2}>
          Assigned Classes
        </Heading>

        {/* View all cohorts and class plans you&apos;re assigned to take */}
        <Text color="gray.600">
          All cohorts and class plans you&apos;re assigned to take
        </Text>
      </Box>

      {/* Assignment Alert */}
      {assignments.length === 0 ? (
        <Alert status="info" borderRadius="lg">
          <AlertIcon />
          <Box>
            <Text fontWeight="bold">No assignments yet</Text>
            <Text fontSize="sm">
              You haven&apos;t been assigned to any cohorts yet. Admin will
              assign you to classes here.
            </Text>
          </Box>
        </Alert>
      ) : (
        <Alert status="success" borderRadius="lg" w={'60%'}>
          <AlertIcon />
          <Text fontWeight="bold">
            You are assigned to {assignments.length} cohort
            {assignments.length > 1 ? 's' : ''}
          </Text>
        </Alert>
      )}

      {/* Assignments Grid */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        {assignments.map((assignment, index) => (
          <Card
            key={assignment.assignmentId || index}
            border="2px solid"
            borderColor="brand.purple.100"
            _hover={{
              borderColor: 'brand.purple.300',
              transform: 'translateY(-2px)',
              boxShadow: 'lg',
            }}
            transition="all 0.2s"
          >
            <CardBody>
              <VStack spacing={4} align="stretch">
                {/* Cohort and Class Plan */}
                <Box>
                  <Badge colorScheme="blue" fontSize="sm" mb={2}>
                    COHORT
                  </Badge>
                  <Heading size="md" color="brand.purple.600">
                    {assignment.cohort}
                  </Heading>
                  <Text fontSize="sm" color="gray.600" mt={1}>
                    {assignment.classPlan}
                  </Text>
                </Box>

                {/* Assignment Details */}
                <VStack spacing={2} align="stretch">
                  <HStack justify="space-between">
                    <Text fontSize="sm" fontWeight="medium">
                      Assigned By:
                    </Text>
                    <Text fontSize="sm">{assignment.assignedByName}</Text>
                  </HStack>

                  <HStack justify="space-between">
                    <Text fontSize="sm" fontWeight="medium">
                      Assigned On:
                    </Text>
                    <Text fontSize="sm">
                      {formatDate(assignment.assignedAt)}
                    </Text>
                  </HStack>

                  {assignment.updatedAt && (
                    <HStack justify="space-between">
                      <Text fontSize="sm" fontWeight="medium">
                        Last Updated:
                      </Text>
                      <Text fontSize="sm">
                        {formatDate(assignment.updatedAt)}
                      </Text>
                    </HStack>
                  )}
                </VStack>

                {/* Action Buttons */}
                <HStack
                  spacing={2}
                  display={'flex'}
                  justifyContent={'space-between'}
                >
                  <Link href={'/portal/facilitator/students'}>
                    <Button
                      size="sm"
                      colorScheme="blue"
                      variant="outline"
                      flex="1"
                    >
                      View Students
                    </Button>
                  </Link>

                  <Link href={'/portal/facilitator/attendance'}>
                    <Button size="sm" colorScheme="purple" flex="1">
                      Attendance
                    </Button>
                  </Link>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>

      {/* Stats Summary */}
      {assignments.length > 0 && (
        <Card bg="gray.50" mt={4}>
          <CardBody>
            <HStack justify="space-around" textAlign="center">
              <Box>
                <Text fontSize="2xl" fontWeight="bold" color="brand.purple.600">
                  {assignments.length}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Total Assignments
                </Text>
              </Box>

              <Box>
                <Text fontSize="2xl" fontWeight="bold" color="green.600">
                  {new Set(assignments.map((a) => a.cohort)).size}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Unique Cohorts
                </Text>
              </Box>

              <Box>
                <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                  {new Set(assignments.map((a) => a.classPlan)).size}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Class Plans
                </Text>
              </Box>
            </HStack>
          </CardBody>
        </Card>
      )}
    </VStack>
  )
}
