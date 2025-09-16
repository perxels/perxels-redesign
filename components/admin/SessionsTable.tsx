import React, { useState, useRef } from 'react'
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Checkbox,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Spinner,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  VStack,
  HStack,
  Divider,
} from '@chakra-ui/react'
import { Session } from '../../types/attendance-v2.types'
import { formatTime, getStatusColor, formatDate } from '../../lib/utils/attendance-formatters'
import { deleteSession } from '../../lib/utils/attendance-v2.utils'

interface SessionsTableProps {
  sessions: Session[]
  loading: boolean
  selectedItems: string[]
  onSelectAll: (isSelected: boolean) => void
  onItemSelect: (itemId: string, isSelected: boolean) => void
  onRefresh: () => void
}

export function SessionsTable({ 
  sessions, 
  loading, 
  selectedItems, 
  onSelectAll, 
  onItemSelect,
  onRefresh 
}: SessionsTableProps) {
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)
  const toast = useToast()
  
  // For delete confirmation dialog
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()
  const deleteCancelRef = useRef<HTMLButtonElement>(null)
  
  // For view details modal
  const { isOpen: isDetailsOpen, onOpen: onDetailsOpen, onClose: onDetailsClose } = useDisclosure()

  const handleDeleteSession = async (sessionId: string) => {
    setActionLoading(sessionId)
    try {
      await deleteSession(sessionId)
      toast({
        title: 'Session deleted successfully',
        description: 'The session has been permanently deleted',
        status: 'success',
        duration: 3000,
      })
      onRefresh()
    } catch (error) {
      toast({
        title: 'Error deleting session',
        description: 'Failed to delete the session. Please try again.',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setActionLoading(null)
    }
  }

  const confirmDelete = (session: Session) => {
    setSelectedSession(session)
    onDeleteOpen()
  }

  const executeDelete = async () => {
    if (selectedSession) {
      await handleDeleteSession(selectedSession.sessionId)
      onDeleteClose()
      setSelectedSession(null)
    }
  }

  const viewDetails = (session: Session) => {
    setSelectedSession(session)
    onDetailsOpen()
  }

  if (loading) {
    return <Spinner size="lg" />
  }

  return (
    <Box bg="white" borderRadius="lg" boxShadow="sm" overflow="hidden">
      <Table variant="simple">
        <Thead bg="gray.50">
          <Tr>
            <Th>
              <Checkbox
                isChecked={selectedItems.length === sessions.length && sessions.length > 0}
                onChange={(e) => onSelectAll(e.target.checked)}
              />
            </Th>
            <Th>Date</Th>
            <Th>Cohort</Th>
            <Th>Plan</Th>
            <Th>Time</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {sessions.length === 0 ? (
            <Tr>
              <Td colSpan={7} textAlign="center" py={8}>
                <Text color="gray.500">No sessions found</Text>
              </Td>
            </Tr>
          ) : (
            sessions.map(session => (
              <Tr key={session.sessionId}>
                <Td>
                  <Checkbox
                    isChecked={selectedItems.includes(session.sessionId)}
                    onChange={(e) => onItemSelect(session.sessionId, e.target.checked)}
                  />
                </Td>
                <Td fontWeight="medium">{session.date}</Td>
                <Td>{session.cohortId}</Td>
                <Td>{session.planId}</Td>
                <Td>
                  {formatTime(session.startsAt)} - {formatTime(session.endsAt)}
                </Td>
                <Td>
                  <Badge colorScheme={getStatusColor(session.status)}>
                    {session.status}
                  </Badge>
                </Td>
                <Td>
                  <Menu>
                    <MenuButton 
                      as={IconButton} 
                      variant="outline" 
                      size="sm"
                      isDisabled={actionLoading === session.sessionId}
                    >
                      {actionLoading === session.sessionId ? <Spinner size="xs" /> : '▼'}
                    </MenuButton>
                    <MenuList>
                      <MenuItem onClick={() => viewDetails(session)}>
                        View Details
                      </MenuItem>
                      <MenuItem 
                        color="red.500" 
                        onClick={() => confirmDelete(session)}
                        isDisabled={actionLoading === session.sessionId}
                      >
                        Delete Session
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>

      {/* Session Details Modal */}
      <Modal isOpen={isDetailsOpen} onClose={onDetailsClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Session Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedSession && (
              <VStack spacing={4} align="stretch">
                <HStack justify="space-between">
                  <Text fontWeight="bold">Date:</Text>
                  <Text>{selectedSession.date}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontWeight="bold">Cohort:</Text>
                  <Text>{selectedSession.cohortId}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontWeight="bold">Plan:</Text>
                  <Text>{selectedSession.planId}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontWeight="bold">Time:</Text>
                  <Text>{formatTime(selectedSession.startsAt)} - {formatTime(selectedSession.endsAt)}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontWeight="bold">Status:</Text>
                  <Badge colorScheme={getStatusColor(selectedSession.status)}>
                    {selectedSession.status}
                  </Badge>
                </HStack>
                <HStack justify="space-between">
                  <Text fontWeight="bold">Created:</Text>
                  <Text>{formatDate(selectedSession.createdAt)}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontWeight="bold">Created By:</Text>
                  <Text>{selectedSession.createdBy}</Text>
                </HStack>
                <Divider />
                <HStack justify="space-between">
                  <Text fontWeight="bold">Daily Code ID:</Text>
                  <Text fontSize="sm" color="gray.600">{selectedSession.dailyCodeId}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontWeight="bold">Session ID:</Text>
                  <Text fontSize="sm" color="gray.600">{selectedSession.sessionId}</Text>
                </HStack>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <AlertDialog isOpen={isDeleteOpen} onClose={onDeleteClose} leastDestructiveRef={deleteCancelRef}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Session
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this session?
              <br />
              <br />
              <Text color="red.500" fontWeight="bold">
                This action will:
              </Text>
              <ul style={{ marginLeft: '20px', marginTop: '8px', color: 'red' }}>
                <li>Permanently delete the session</li>
                <li>Remove all attendance data for this session</li>
                <li>This action cannot be undone</li>
              </ul>
              {selectedSession && (
                <Box mt={4} p={3} bg="gray.50" borderRadius="md">
                  <Text fontSize="sm" fontWeight="bold">Session Details:</Text>
                  <Text fontSize="sm">{selectedSession.date} - {selectedSession.cohortId} ({selectedSession.planId})</Text>
                  <Text fontSize="sm">{formatTime(selectedSession.startsAt)} - {formatTime(selectedSession.endsAt)}</Text>
                </Box>
              )}
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button variant="outline" ref={deleteCancelRef} onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button 
                colorScheme="red" 
                onClick={executeDelete}
                ml={3}
                isLoading={actionLoading === selectedSession?.sessionId}
              >
                Delete Session
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  )
}
