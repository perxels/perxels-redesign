import React, { useEffect, useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  HStack,
  Text,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Box,
  Alert,
  AlertIcon,
  IconButton,
  Tooltip,
  useToast,
} from '@chakra-ui/react'
import { FiUserX, FiEye, FiClock } from 'react-icons/fi'
import { PortalVideo, VideoAccess } from '../../../../types/video.types'
import { getVideoAccessList, revokeVideoAccess } from '../../../../lib/utils/video.utils'

interface VideoAccessModalProps {
  isOpen: boolean
  onClose: () => void
  video: PortalVideo
}

export const VideoAccessModal: React.FC<VideoAccessModalProps> = ({
  isOpen,
  onClose,
  video,
}) => {
  const [accessList, setAccessList] = useState<VideoAccess[]>([])
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  const fetchAccessList = async () => {
    try {
      setLoading(true)
      const list = await getVideoAccessList(video.id)
      setAccessList(list)
    } catch (error) {
      console.error('Error fetching access list:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch access list',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen && video.id) {
      fetchAccessList()
    }
  }, [isOpen, video.id])

  const handleRevokeAccess = async (studentId: string, studentName: string) => {
    try {
      await revokeVideoAccess(video.id, studentId)
      toast({
        title: 'Access Revoked',
        description: `${studentName}'s access has been revoked`,
        status: 'success',
        duration: 3000,
      })
      fetchAccessList() // Refresh the list
    } catch (error) {
      console.error('Error revoking access:', error)
      toast({
        title: 'Error',
        description: 'Failed to revoke access',
        status: 'error',
        duration: 3000,
      })
    }
  }

  const formatDate = (date: any) => {
    if (!date) return 'Never'
    const dateObj = date.toDate ? date.toDate() : new Date(date)
    return dateObj.toLocaleDateString() + ' at ' + dateObj.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const getProgressColor = (progress?: number) => {
    if (!progress) return 'gray'
    if (progress < 25) return 'red'
    if (progress < 75) return 'yellow'
    return 'green'
  }

  const activeAccessList = accessList.filter(access => !access.isRevoked)
  const revokedAccessList = accessList.filter(access => access.isRevoked)

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <VStack align="start" spacing={2}>
            <Text>Video Access: {video.title}</Text>
            <HStack spacing={4}>
              <Badge colorScheme="purple" variant="subtle">
                Code: {video.accessCode}
              </Badge>
              <Badge colorScheme={video.isActive ? 'green' : 'red'} variant="subtle">
                {video.isActive ? 'Active' : 'Inactive'}
              </Badge>
              {video.maxAccess && (
                <Badge colorScheme="blue" variant="subtle">
                  Limit: {activeAccessList.length}/{video.maxAccess}
                </Badge>
              )}
            </HStack>
          </VStack>
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <VStack spacing={6} align="stretch">
            {/* Stats */}
            <HStack spacing={6}>
              <Box bg="gray.50" p={4} borderRadius="lg" minW="150px">
                <Text fontSize="sm" color="gray.500">Total Access</Text>
                <Text fontSize="2xl" fontWeight="bold" color="purple.600">
                  {activeAccessList.length}
                </Text>
              </Box>
              <Box bg="gray.50" p={4} borderRadius="lg" minW="150px">
                <Text fontSize="sm" color="gray.500">Total Views</Text>
                <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                  {video.viewCount}
                </Text>
              </Box>
              <Box bg="gray.50" p={4} borderRadius="lg" minW="150px">
                <Text fontSize="sm" color="gray.500">Avg. Watches</Text>
                <Text fontSize="2xl" fontWeight="bold" color="green.600">
                  {activeAccessList.length > 0 
                    ? Math.round(activeAccessList.reduce((sum, access) => sum + access.watchCount, 0) / activeAccessList.length)
                    : 0
                  }
                </Text>
              </Box>
            </HStack>

            {loading ? (
              <Box textAlign="center" py={8}>
                <Spinner size="lg" color="purple.500" />
                <Text mt={2} color="gray.500">Loading access list...</Text>
              </Box>
            ) : activeAccessList.length === 0 ? (
                             <Alert status="info" borderRadius="md">
                 <AlertIcon />
                 No students have accessed &ldquo;{video.title}&rdquo; yet. Share the access code <strong>{video.accessCode}</strong> with your students.
               </Alert>
            ) : (
              <Box>
                <Text fontSize="lg" fontWeight="semibold" mb={4}>
                  Students with Access ({activeAccessList.length})
                </Text>
                <Box borderRadius="lg" border="1px" borderColor="gray.200" overflow="hidden">
                  <Table variant="simple" size="sm">
                    <Thead bg="gray.50">
                      <Tr>
                        <Th>Student</Th>
                        <Th>Access Granted</Th>
                        <Th>Last Watched</Th>
                        <Th>Watch Count</Th>
                        <Th>Progress</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {activeAccessList.map((access) => (
                        <Tr key={access.id}>
                          <Td>
                            <VStack align="start" spacing={1}>
                              <Text fontWeight="medium" fontSize="sm">
                                {access.studentName}
                              </Text>
                              <Text fontSize="xs" color="gray.500">
                                {access.studentEmail}
                              </Text>
                            </VStack>
                          </Td>
                          <Td>
                            <Text fontSize="sm">
                              {formatDate(access.accessGrantedAt)}
                            </Text>
                          </Td>
                          <Td>
                            <Text fontSize="sm">
                              {formatDate(access.lastWatchedAt)}
                            </Text>
                          </Td>
                          <Td>
                            <HStack spacing={2}>
                              <FiEye />
                              <Text fontWeight="medium">
                                {access.watchCount}
                              </Text>
                            </HStack>
                          </Td>
                          <Td>
                            {access.progressPercentage ? (
                              <Badge
                                colorScheme={getProgressColor(access.progressPercentage)}
                                variant="subtle"
                              >
                                {Math.round(access.progressPercentage)}%
                              </Badge>
                            ) : (
                              <Text fontSize="sm" color="gray.400">
                                Not started
                              </Text>
                            )}
                          </Td>
                          <Td>
                            <Tooltip label="Revoke Access">
                              <IconButton
                                aria-label="Revoke access"
                                icon={<FiUserX />}
                                size="sm"
                                variant="ghost"
                                colorScheme="red"
                                onClick={() => handleRevokeAccess(access.studentId, access.studentName)}
                              />
                            </Tooltip>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              </Box>
            )}

            {/* Revoked Access Section */}
            {revokedAccessList.length > 0 && (
              <Box>
                <Text fontSize="lg" fontWeight="semibold" mb={4} color="red.600">
                  Revoked Access ({revokedAccessList.length})
                </Text>
                <Box borderRadius="lg" border="1px" borderColor="red.200" overflow="hidden">
                  <Table variant="simple" size="sm">
                    <Thead bg="red.50">
                      <Tr>
                        <Th>Student</Th>
                        <Th>Access Granted</Th>
                        <Th>Last Watched</Th>
                        <Th>Watch Count</Th>
                        <Th>Status</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {revokedAccessList.map((access) => (
                        <Tr key={access.id}>
                          <Td>
                            <VStack align="start" spacing={1}>
                              <Text fontWeight="medium" fontSize="sm" color="gray.600">
                                {access.studentName}
                              </Text>
                              <Text fontSize="xs" color="gray.500">
                                {access.studentEmail}
                              </Text>
                            </VStack>
                          </Td>
                          <Td>
                            <Text fontSize="sm" color="gray.600">
                              {formatDate(access.accessGrantedAt)}
                            </Text>
                          </Td>
                          <Td>
                            <Text fontSize="sm" color="gray.600">
                              {formatDate(access.lastWatchedAt)}
                            </Text>
                          </Td>
                          <Td>
                            <Text color="gray.600">{access.watchCount}</Text>
                          </Td>
                          <Td>
                            <Badge colorScheme="red" variant="subtle">
                              Revoked
                            </Badge>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              </Box>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
} 