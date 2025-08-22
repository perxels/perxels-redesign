import React, { useEffect, useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
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
  Button,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  IconButton,
  Tooltip,
} from '@chakra-ui/react'
import { FiTrash2, FiDownload } from 'react-icons/fi'
import { EbookAccess, PortalEbook } from '../../../../types/ebook.types'
import { getEbookAccessList, revokeEbookAccess } from '../../../../lib/utils/ebook.utils'
  // import { PortalEbook, EbookAccess } from '../../../types/ebook.types'
  // import { getEbookAccessList, revokeEbookAccess } from '../../../lib/utils/ebook.utils'

interface EbookAccessModalProps {
  isOpen: boolean
  onClose: () => void
  ebook: PortalEbook
}

export const EbookAccessModal: React.FC<EbookAccessModalProps> = ({
  isOpen,
  onClose,
  ebook,
}) => {
  const [accessList, setAccessList] = useState<EbookAccess[]>([])
  const [loading, setLoading] = useState(true)
  const [revokingAccess, setRevokingAccess] = useState<string | null>(null)
  const toast = useToast()

  const fetchAccessList = async () => {
    try {
      setLoading(true)
      const accessData = await getEbookAccessList(ebook.id)
      setAccessList(accessData)
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
    if (isOpen && ebook) {
      fetchAccessList()
    }
  }, [isOpen, ebook])

  const handleRevokeAccess = async (studentId: string) => {
    try {
      setRevokingAccess(studentId)
      await revokeEbookAccess(ebook.id, studentId)
      toast({
        title: 'Access Revoked',
        description: 'Student access has been revoked successfully',
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
    } finally {
      setRevokingAccess(null)
    }
  }

  const formatDate = (date: any) => {
    if (!date) return 'N/A'
    const dateObj = date.toDate ? date.toDate() : new Date(date)
    return dateObj.toLocaleDateString()
  }

  const activeAccess = accessList.filter(access => !access.isRevoked)
  const revokedAccess = accessList.filter(access => access.isRevoked)

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <VStack align="start" spacing={1}>
            <Text>Ebook Access Management</Text>
            <Text fontSize="sm" color="gray.600" fontWeight="normal">
              {ebook.title}
            </Text>
          </VStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4} align="stretch">
            {/* Ebook Info */}
            <Alert status="info">
              <AlertIcon />
              <VStack align="start" spacing={1}>
                <Text fontWeight="semibold">Access Code: {ebook.accessCode}</Text>
                <Text fontSize="sm">
                  {activeAccess.length} active access • {revokedAccess.length} revoked access
                </Text>
                {ebook.maxAccess && (
                  <Text fontSize="sm">
                    Limit: {activeAccess.length}/{ebook.maxAccess} students
                  </Text>
                )}
              </VStack>
            </Alert>

            {loading ? (
              <VStack spacing={4} py={8}>
                <Spinner size="lg" />
                <Text>Loading access list...</Text>
              </VStack>
            ) : (
              <>
                {/* Active Access */}
                <VStack align="start" spacing={2}>
                  <Text fontWeight="semibold" color="green.600">
                    Active Access ({activeAccess.length})
                  </Text>
                  {activeAccess.length > 0 ? (
                    <Table variant="simple" size="sm">
                      <Thead>
                        <Tr>
                          <Th>Student</Th>
                          <Th>Email</Th>
                          <Th>Access Date</Th>
                          <Th>Downloads</Th>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {activeAccess.map((access) => (
                          <Tr key={access.id}>
                            <Td>
                              <Text fontWeight="medium">{access.studentName}</Text>
                            </Td>
                            <Td>
                              <Text fontSize="sm" color="gray.600">
                                {access.studentEmail}
                              </Text>
                            </Td>
                            <Td>
                              <Text fontSize="sm">{formatDate(access.accessGrantedAt)}</Text>
                            </Td>
                            <Td>
                              <HStack spacing={1}>
                                <FiDownload />
                                <Text fontSize="sm">{access.downloadCount}</Text>
                              </HStack>
                            </Td>
                            <Td>
                              <Tooltip label="Revoke Access">
                                <IconButton
                                  aria-label="Revoke access"
                                  icon={<FiTrash2 />}
                                  size="sm"
                                  variant="ghost"
                                  colorScheme="red"
                                  isLoading={revokingAccess === access.studentId}
                                  onClick={() => handleRevokeAccess(access.studentId)}
                                />
                              </Tooltip>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  ) : (
                    <Text color="gray.500" fontSize="sm">
                      No active access found.
                    </Text>
                  )}
                </VStack>

                {/* Revoked Access */}
                {revokedAccess.length > 0 && (
                  <VStack align="start" spacing={2}>
                    <Text fontWeight="semibold" color="red.600">
                      Revoked Access ({revokedAccess.length})
                    </Text>
                    <Table variant="simple" size="sm">
                      <Thead>
                        <Tr>
                          <Th>Student</Th>
                          <Th>Email</Th>
                          <Th>Access Date</Th>
                          <Th>Downloads</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {revokedAccess.map((access) => (
                          <Tr key={access.id} opacity={0.6}>
                            <Td>
                              <Text fontWeight="medium">{access.studentName}</Text>
                            </Td>
                            <Td>
                              <Text fontSize="sm" color="gray.600">
                                {access.studentEmail}
                              </Text>
                            </Td>
                            <Td>
                              <Text fontSize="sm">{formatDate(access.accessGrantedAt)}</Text>
                            </Td>
                            <Td>
                              <HStack spacing={1}>
                                <FiDownload />
                                <Text fontSize="sm">{access.downloadCount}</Text>
                              </HStack>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </VStack>
                )}
              </>
            )}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
