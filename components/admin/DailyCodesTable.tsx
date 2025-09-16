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
} from '@chakra-ui/react'
import { DailyCode } from '../../types/attendance-v2.types'
import { formatDate, getStatusColor } from '../../lib/utils/attendance-formatters'
import { expireDailyCode, deleteDailyCode } from '../../lib/utils/attendance-v2.utils'

interface DailyCodesTableProps {
  dailyCodes: DailyCode[]
  loading: boolean
  selectedItems: string[]
  onSelectAll: (isSelected: boolean) => void
  onItemSelect: (itemId: string, isSelected: boolean) => void
  onRefresh: () => void
}

export function DailyCodesTable({ 
  dailyCodes, 
  loading, 
  selectedItems, 
  onSelectAll, 
  onItemSelect,
  onRefresh 
}: DailyCodesTableProps) {
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [actionType, setActionType] = useState<'expire' | 'delete' | null>(null)
  const [targetDate, setTargetDate] = useState<string | null>(null)
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef<HTMLButtonElement>(null)

  const handleExpireCode = async (date: string) => {
    setActionLoading(date)
    try {
      await expireDailyCode(date)
      toast({
        title: 'Code expired successfully',
        description: `Daily code for ${date} has been expired and all associated sessions have been closed`,
        status: 'success',
        duration: 4000,
      })
      onRefresh()
    } catch (error) {
      toast({
        title: 'Error expiring code',
        description: 'Failed to expire the daily code. Please try again.',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setActionLoading(null)
    }
  }

  const handleDeleteCode = async (date: string) => {
    setActionLoading(date)
    try {
      await deleteDailyCode(date)
      toast({
        title: 'Code deleted successfully',
        description: `Daily code for ${date} has been deleted and all associated sessions have been cancelled`,
        status: 'success',
        duration: 4000,
      })
      onRefresh()
    } catch (error) {
      toast({
        title: 'Error deleting code',
        description: 'Failed to delete the daily code. Please try again.',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setActionLoading(null)
    }
  }

  const confirmAction = (action: 'expire' | 'delete', date: string) => {
    setActionType(action)
    setTargetDate(date)
    onOpen()
  }

  const executeAction = async () => {
    if (!targetDate || !actionType) return
    
    if (actionType === 'expire') {
      await handleExpireCode(targetDate)
    } else if (actionType === 'delete') {
      await handleDeleteCode(targetDate)
    }
    
    onClose()
    setActionType(null)
    setTargetDate(null)
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
                isChecked={selectedItems.length === dailyCodes.length && dailyCodes.length > 0}
                onChange={(e) => onSelectAll(e.target.checked)}
              />
            </Th>
            <Th>Date</Th>
            <Th>Code</Th>
            <Th>Status</Th>
            <Th>Created</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {dailyCodes.length === 0 ? (
            <Tr>
              <Td colSpan={6} textAlign="center" py={8}>
                <Text color="gray.500">No daily codes found</Text>
              </Td>
            </Tr>
          ) : (
            dailyCodes.map(code => (
              <Tr key={code.date}>
                <Td>
                  <Checkbox
                    isChecked={selectedItems.includes(code.date)}
                    onChange={(e) => onItemSelect(code.date, e.target.checked)}
                  />
                </Td>
                <Td fontWeight="medium">{code.date}</Td>
                <Td>
                  <Badge colorScheme="purple" fontSize="sm" px={2} py={1}>
                    {code.code}
                  </Badge>
                </Td>
                <Td>
                  <Badge colorScheme={getStatusColor(code.status)}>
                    {code.status}
                  </Badge>
                </Td>
                <Td>{formatDate(code.createdAt)}</Td>
                <Td>
                  <Menu>
                    <MenuButton 
                      as={IconButton} 
                      variant="outline" 
                      size="sm"
                      isDisabled={actionLoading === code.date}
                    >
                      {actionLoading === code.date ? <Spinner size="xs" /> : '▼'}
                    </MenuButton>
                    <MenuList>
                      <MenuItem 
                        onClick={() => confirmAction('expire', code.date)}
                        isDisabled={actionLoading === code.date || code.status === 'expired'}
                        color={code.status === 'expired' ? 'gray.400' : undefined}
                      >
                        {code.status === 'expired' ? 'Already Expired' : 'Expire Code'}
                      </MenuItem>
                      <MenuItem 
                        color="red.500" 
                        onClick={() => confirmAction('delete', code.date)}
                        isDisabled={actionLoading === code.date}
                      >
                        Delete Code
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>

      {/* Confirmation Dialog */}
      <AlertDialog isOpen={isOpen} onClose={onClose} leastDestructiveRef={cancelRef}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {actionType === 'expire' ? 'Expire Daily Code' : 'Delete Daily Code'}
            </AlertDialogHeader>
            <AlertDialogBody>
              {actionType === 'expire' ? (
                <>
                  Are you sure you want to expire the daily code for <strong>{targetDate}</strong>?
                  <br />
                  <br />
                  This will:
                  <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
                    <li>Prevent students from using this code to check in</li>
                    <li>Close all associated class sessions for this date</li>
                    <li>Keep the code visible in the system for reference</li>
                  </ul>
                </>
              ) : (
                <>
                  Are you sure you want to delete the daily code for <strong>{targetDate}</strong>?
                  <br />
                  <br />
                  <Text color="red.500" fontWeight="bold">
                    This action will:
                  </Text>
                  <ul style={{ marginLeft: '20px', marginTop: '8px', color: 'red' }}>
                    <li>Permanently delete the daily code</li>
                    <li>Cancel all associated class sessions for this date</li>
                    <li>Remove all attendance data for this date</li>
                    <li>This action cannot be undone</li>
                  </ul>
                </>
              )}
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button variant="outline" ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button 
                colorScheme={actionType === 'delete' ? 'red' : 'orange'} 
                onClick={executeAction}
                ml={3}
                isLoading={actionLoading === targetDate}
              >
                {actionType === 'expire' ? 'Expire Code' : 'Delete Code'}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  )
}
