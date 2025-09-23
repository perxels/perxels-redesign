import React, { useState, useEffect, useMemo } from 'react'
import {
  Box,
  VStack,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  AlertDescription,
  Badge,
  Button,
  Flex,
  useDisclosure,
  HStack,
  Avatar,
  useToast,
} from '@chakra-ui/react'

import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import { MdDelete, MdOutlineRemoveRedEye } from 'react-icons/md'
import { useRouter } from 'next/router'
import { portalDb } from '../../../../portalFirebaseConfig'
import { usePortalAuth } from '../../../../hooks/usePortalAuth'
import { FacilitatorDetailsModal } from './facilitator-details-modal'
import { DeleteFacilitatorModal } from './delete-facilitator-modal'
import { AssignToCohortModal } from './assign-to-cohort-modal'
import { Assignment, FacilitatorData } from '../../../../types/user'

function trimUrl(url: string, maxLength = 25): string {
  if (!url) return ''
  if (url.length <= maxLength) return url
  return url.slice(0, maxLength) + '...'
}

export const FacilitatorList = () => {
  const [facilitator, setFacilitator] = useState<FacilitatorData[]>([])
  const [loading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const toast = useToast()
  const [selectedFacilitator, setSelectedFacilitator] =
    useState<FacilitatorData | null>(null)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(20) // Show 20 Facilitator per page
  const [totalPages, setTotalPages] = useState(1)

  const { portalUser } = usePortalAuth()
  const router = useRouter()
  const isAdmin = portalUser?.role === 'admin'

  const {
    isOpen: isAssignOpen,
    onOpen: onAssignOpen,
    onClose: onAssignClose,
  } = useDisclosure() // For Assign Cohort Modal
  const {
    isOpen: isDetailsOpen,
    onOpen: onDetailsOpen,
    onClose: onDetailsClose,
  } = useDisclosure()
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure()

  // Get filters from query string
  const filters = useMemo(() => {
    return {
      search: (router.query.search as string) || '',
      class: (router.query.class as string) || '',
      classPlan: (router.query.classPlan as string) || '',
      activeStatus: (router.query.activeStatus as string) || 'all',
      status: (router.query.status as string) || 'all',
    }
  }, [router.query])

  // Apply filters to Facilitator
  const filteredFacilitator = useMemo(() => {
    let filtered = [...facilitator]

    // Filter by search term (name, email, phone)
    if (filters.search) {
      filtered = filtered.filter(
        (facilitator) =>
          facilitator.fullName
            .toLowerCase()
            .includes(filters.search.toLowerCase()) ||
          facilitator.email
            .toLowerCase()
            .includes(filters.search.toLowerCase()) ||
          facilitator.phone.includes(filters.search),
      )
    }

    // Filter by class (cohort) - UPDATED
    // if (filters.class) {
    //   filtered = filtered.filter((facilitator) => {
    //     return (
    //       facilitator.assignments?.some((a: Assignment) =>
    //         a.cohort.toLowerCase().includes(filters.class.toLowerCase()),
    //       ) || false
    //     )
    //   })
    // }

    // Filter by class plan - UPDATED
    // if (filters.classPlan) {
    //   filtered = filtered.filter((facilitator) => {
    //     return (
    //       facilitator.assignments?.some((a: Assignment) =>
    //         a.classPlan.toLowerCase().includes(filters.classPlan.toLowerCase()),
    //       ) || false
    //     )
    //   })
    // }

    // Filter by status
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter((facilitator) => {
        const status = getFacilitatortatusKey(facilitator)
        return status === filters.status
      })
    }

    return filtered
  }, [facilitator, filters])

  // Calculate total pages based on filtered facilitator
  useEffect(() => {
    const total = Math.ceil(filteredFacilitator.length / pageSize)
    setTotalPages(total)

    // Reset to first page if current page exceeds total pages
    if (currentPage > total && total > 0) {
      setCurrentPage(1)
    }
  }, [filteredFacilitator.length, pageSize, currentPage])

  // Get paginated facilitator for current page
  const paginatedFacilitator = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    return filteredFacilitator.slice(startIndex, endIndex)
  }, [filteredFacilitator, currentPage, pageSize])

  // Pagination handlers
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [filters])

  // Fetch facilitator from Firebase
  const fetchFacilitator = async () => {
    if (!isAdmin) {
      setError('Only administrators can view student list')
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const facilitatorQuery = query(
        collection(portalDb, 'users'),
        where('role', '==', 'facilitator'),
      )

      const querySnapshot = await getDocs(facilitatorQuery)
      const facilitatorData: FacilitatorData[] = []

      querySnapshot.forEach((doc) => {
        const data = doc.data()
        facilitatorData.push({
          id: data.uid,
          uid: doc.id,
          createdAt: data.createdAt,
          createdBy: data.createdBy || '',
          fullName: data.fullName || 'N/A',
          email: data.email || '',
          emailVerified: data.emailVerified || false,
          gender: data.gender || '',
          profession: data.profession || 'Not Specified',
          pictureUrl: data.pictureUrl || '',
          phone: data.phone || 'N/A',
          address: data.address || 'Not specified',
          role: data.role || 'facilitator',
          isActive: data.isActive !== false,
          termsAgreed: data.termsAgreed || false,
          termsAgreedAt: data.createdAt,
          assignments: (data.assignments as Assignment[]) || [],
        })
      })

      // Sort by creation date (newest first) on client side
      const sortedFacilitator = facilitatorData.sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0
        const dateA = a.createdAt.toDate
          ? a.createdAt.toDate()
          : new Date(a.createdAt)
        const dateB = b.createdAt.toDate
          ? b.createdAt.toDate()
          : new Date(b.createdAt)
        return dateB.getTime() - dateA.getTime()
      })

      setFacilitator(sortedFacilitator)
    } catch (err: any) {
      console.error('Error fetching facilitator:', err)
      setError('Failed to load facilitator. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Load facilitator on component mount
  useEffect(() => {
    fetchFacilitator()
  }, [isAdmin])

  // Get facilitator status key for filtering
  const getFacilitatortatusKey = (facilitator: FacilitatorData) => {
    if (!facilitator.emailVerified) return 'email-pending'
    if (!facilitator.registrationComplete) return 'registration-incomplete'
    return 'active'
  }

  const handleStatusToggle = async (facilitator: FacilitatorData) => {
    try {
      await updateDoc(doc(portalDb, 'users', facilitator.uid), {
        isActive: !facilitator.isActive,
        updatedAt: new Date(),
      })

      // Update using uid to be consistent
      setFacilitator((prev) =>
        prev.map((f) =>
          f.uid === facilitator.uid ? { ...f, isActive: !f.isActive } : f,
        ),
      )

      toast({
        title: 'Status updated',
        description: `${facilitator.fullName} has been ${
          !facilitator.isActive ? 'activated' : 'deactivated'
        }`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (err: any) {
      console.error('Error updating facilitator status:', err)
      toast({
        title: 'Update failed',
        description: 'Failed to update facilitator status. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleViewDetails = (facilitator: FacilitatorData) => {
    setSelectedFacilitator(facilitator)
    onDetailsOpen()
  }

  const handleDeleteFacilitator = (facilitator: FacilitatorData) => {
    setSelectedFacilitator(facilitator)
    onDeleteOpen()
  }

  const handleOpenAssignModal = (facilitator: FacilitatorData) => {
    setSelectedFacilitator(facilitator)
    onAssignOpen() // Now this function exists
  }

  const handleFacilitatorDeleted = () => {
    // Refresh the facilitator list
    fetchFacilitator()
  }

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    return pages
  }

  return (
    <VStack w="full" spacing={6} align="stretch">
      {/* Header with Stats and Actions */}
      <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color="gray.800">
            Facilitator Management
          </Text>
          <Text fontSize="sm" color="gray.600">
            {loading
              ? 'Loading...'
              : `${filteredFacilitator.length} Facilitator found`}
          </Text>
        </Box>

        {!loading && filteredFacilitator.length > 0 && (
          <Button
            variant="outline"
            colorScheme="blue"
            size="sm"
            onClick={fetchFacilitator}
          >
            Refresh
          </Button>
        )}
      </Flex>

      {/* Loading State */}
      {loading ? (
        <Box textAlign="center" py={12}>
          <Spinner size="lg" color="purple.500" />
          <Text mt={4} color="gray.600">
            Loading Facilitator...
          </Text>
        </Box>
      ) : error ? (
        /* Error State */
        <Alert status="error">
          <AlertIcon />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : filteredFacilitator.length === 0 ? (
        /* Empty State */
        <Alert status="info">
          <AlertIcon />
          <AlertDescription>
            {facilitator.length === 0
              ? 'No facilitator found. Facilitator will appear here once they register.'
              : 'No facilitator match your current filters. Try adjusting your search criteria.'}
          </AlertDescription>
        </Alert>
      ) : (
        /* Facilitator Grid */
        <VStack spacing={4} align="stretch">
          {paginatedFacilitator.map((facilitator) => (
            <Box
              key={facilitator.uid}
              bg="gray.100"
              borderRadius="lg"
              px={{ base: 3, md: 4 }}
              py={{ base: 4, md: 3 }}
              boxShadow="sm"
            >
              {/* Mobile Layout */}
              <Box display={{ base: 'block', md: 'none' }}>
                <Flex justify="space-between" align="center" mb={4}>
                  <Box flex="1">
                    <Text fontWeight="bold" fontSize="md" mb={1} noOfLines={1}>
                      {facilitator.fullName}
                    </Text>
                    <Text fontSize="sm" color="gray.700" noOfLines={1}>
                      {facilitator.phone}
                    </Text>
                  </Box>
                  <HStack spacing={2}>
                    <Button
                      size="xs"
                      bg="gray.700"
                      color="white"
                      borderRadius="sm"
                      px={3}
                      py={1}
                      _hover={{ bg: 'gray.800' }}
                      fontSize="xs"
                      fontWeight="normal"
                      minW="70px"
                      onClick={() => handleViewDetails(facilitator)}
                    >
                      Details
                    </Button>
                    <Button
                      size="xs"
                      bg="red.500"
                      color="white"
                      borderRadius="sm"
                      px={3}
                      py={1}
                      _hover={{ bg: 'red.600' }}
                      fontSize="xs"
                      fontWeight="normal"
                      minW="70px"
                      onClick={() => handleDeleteFacilitator(facilitator)}
                    >
                      <MdDelete size={14} />
                    </Button>
                  </HStack>
                </Flex>

                <VStack spacing={2} align="stretch">
                  <Flex justify="space-between" align="center">
                    <Text fontSize="sm" color="gray.700" noOfLines={1} flex="1">
                      {facilitator.email}
                    </Text>
                    <Badge colorScheme="purple" variant="subtle" fontSize="xs">
                      {facilitator.gender || 'Female'}
                    </Badge>
                  </Flex>

                  <Flex justify="space-between" align="center">
                    <Text fontSize="sm" color="gray.500" noOfLines={1} flex="1">
                      {facilitator.assignments.length > 0 ? (
                        <Box>
                          {facilitator.assignments
                            .slice(0, 1)
                            .map((assignedCohort) => (
                              <Badge
                                key={assignedCohort?.assignmentId}
                                colorScheme="blue"
                                mr={1}
                                mb={1}
                              >
                                {assignedCohort?.cohort}
                              </Badge>
                            ))}
                          {facilitator.assignments.length > 1 && (
                            <Badge colorScheme="gray">
                              +{facilitator.assignments.length - 1} more
                            </Badge>
                          )}
                        </Box>
                      ) : (
                        <Badge colorScheme="yellow">Not assigned</Badge>
                      )}
                    </Text>

                    <Button
                      size="sm"
                      colorScheme="blue"
                      onClick={() => handleOpenAssignModal(facilitator)}
                    >
                      Assign
                    </Button>
                  </Flex>
                  <Flex justify="space-between" align="center">
                    <Flex justify="start" align="center">
                      <Text fontSize="sm" color="gray.600" mr={1}>
                        Status:
                      </Text>
                      <Badge
                        colorScheme={facilitator.isActive ? 'green' : 'red'}
                        variant="subtle"
                        fontSize="xs"
                      >
                        {facilitator.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </Flex>
                    <Button
                      size="sm"
                      colorScheme={facilitator.isActive ? 'orange' : 'green'}
                      variant="outline"
                      onClick={() => handleStatusToggle(facilitator)}
                    >
                      {facilitator.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                  </Flex>
                </VStack>
              </Box>

              {/* Desktop Layout */}
              <Flex
                display={{ base: 'none', md: 'flex' }}
                alignItems="center"
                justifyContent="space-between"
                gap={4}
              >
                {/* Name and Phone */}
                <HStack spacing={2}>
                  <Avatar
                    name={facilitator.fullName}
                    src={facilitator.pictureUrl}
                  />
                  <Box minW="180px">
                    <Text fontWeight="bold" fontSize="md" mb={1} noOfLines={1}>
                      {facilitator.fullName}
                    </Text>
                    <Text fontSize="sm" color="gray.700" noOfLines={1}>
                      {facilitator.phone}
                    </Text>
                  </Box>
                </HStack>

                {/* Email and Status */}
                <Box minW="220px">
                  <Text fontSize="sm" color="gray.700" noOfLines={1}>
                    {facilitator.email}
                  </Text>

                  <Badge
                    colorScheme={facilitator.isActive ? 'green' : 'red'}
                    variant="subtle"
                    fontSize="xs"
                  >
                    {facilitator.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </Box>

                {/* Gender */}
                <Badge colorScheme="purple" variant="subtle" fontSize="sm">
                  {facilitator.gender || 'Female'}
                </Badge>

                {/* Assigned Cohort*/}
                <Text fontSize="sm" color="gray.500" noOfLines={1} flex="1">
                  {facilitator.assignments.length > 0 ? (
                    <Box>
                      {facilitator.assignments
                        .slice(0, 2)
                        .map((assignedCohort) => (
                          <Badge
                            key={assignedCohort.assignmentId}
                            colorScheme="blue"
                            mr={1}
                            mb={1}
                          >
                            {assignedCohort.cohort}
                          </Badge>
                        ))}
                      {facilitator.assignments.length > 2 && (
                        <Badge colorScheme="gray">
                          +{facilitator.assignments.length - 2} more
                        </Badge>
                      )}
                    </Box>
                  ) : (
                    <Badge colorScheme="yellow">Not assigned</Badge>
                  )}
                </Text>

                {/* Action Buttons */}
                <HStack spacing={2}>
                  <Button
                    size="xs"
                    px={3}
                    colorScheme="blue"
                    leftIcon={<MdOutlineRemoveRedEye />}
                    onClick={() => handleViewDetails(facilitator)}
                  >
                    Details
                  </Button>
                  <Button
                    size="sm"
                    px={4}
                    colorScheme="blue"
                    onClick={() => handleOpenAssignModal(facilitator)}
                  >
                    Assign to cohort
                  </Button>
                  <Button
                    size="sm"
                    colorScheme={facilitator.isActive ? 'orange' : 'green'}
                    variant="outline"
                    onClick={() => handleStatusToggle(facilitator)}
                  >
                    {facilitator.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    size="xs"
                    bg="red.500"
                    color="white"
                    borderRadius="sm"
                    px={3}
                    py={1}
                    _hover={{ bg: 'red.600' }}
                    fontSize="xs"
                    fontWeight="normal"
                    minW="70px"
                    onClick={() => handleDeleteFacilitator(facilitator)}
                  >
                    <MdDelete size={14} />
                  </Button>
                </HStack>
              </Flex>
            </Box>
          ))}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <Flex justify="center" align="center" pt={6} gap={2} wrap="wrap">
              {/* Previous Button */}
              <Button
                onClick={handlePrevPage}
                isDisabled={currentPage === 1}
                variant="outline"
                size="sm"
                colorScheme="blue"
              >
                Previous
              </Button>

              {/* Page Numbers */}
              <HStack spacing={1}>
                {getPageNumbers().map((page) => (
                  <Button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    variant={currentPage === page ? 'solid' : 'outline'}
                    size="sm"
                    colorScheme="blue"
                    minW="40px"
                  >
                    {page}
                  </Button>
                ))}
              </HStack>

              {/* Next Button */}
              <Button
                onClick={handleNextPage}
                isDisabled={currentPage === totalPages}
                variant="outline"
                size="sm"
                colorScheme="blue"
              >
                Next
              </Button>
            </Flex>
          )}

          {/* Pagination Info */}
          {filteredFacilitator.length > 0 && (
            <Flex justify="center" pt={2}>
              <Text fontSize="sm" color="gray.500">
                Showing {(currentPage - 1) * pageSize + 1} to{' '}
                {Math.min(currentPage * pageSize, filteredFacilitator.length)}{' '}
                of {filteredFacilitator.length} Facilitator
                {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
              </Text>
            </Flex>
          )}
        </VStack>
      )}

      {/* Assign Cohort Modal - You need to create this component */}
      {selectedFacilitator && (
        <AssignToCohortModal
          isOpen={isAssignOpen}
          onClose={onAssignClose}
          facilitator={selectedFacilitator}
          onAssignmentUpdated={fetchFacilitator}
        />
      )}

      {/* Facilitator Details Modal */}
      {selectedFacilitator && (
        <FacilitatorDetailsModal
          isOpen={isDetailsOpen}
          onClose={onDetailsClose}
          facilitator={selectedFacilitator}
        />
      )}

      {/* Delete Facilitator Modal */}
      {selectedFacilitator && (
        <DeleteFacilitatorModal
          isOpen={isDeleteOpen}
          onClose={onDeleteClose}
          facilitator={selectedFacilitator}
          onFacilitatorDeleted={handleFacilitatorDeleted}
          adminUser={portalUser}
        />
      )}
    </VStack>
  )
}
