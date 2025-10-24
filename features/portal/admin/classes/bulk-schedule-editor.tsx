// features/portal/admin/classes/bulk-schedule-editor.tsx
import React, { useState } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Card,
  CardBody,
  Alert,
  AlertIcon,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
} from '@chakra-ui/react'
import { doc, updateDoc, getDoc } from 'firebase/firestore'
import { portalDb } from '../../../../portalFirebaseConfig'

interface BulkScheduleEditorProps {
  classPlanSyllabusId: string
  isOpen: boolean
  onClose: () => void
  onUpdate: () => void
}

export const BulkScheduleEditor: React.FC<BulkScheduleEditorProps> = ({
  classPlanSyllabusId,
  isOpen,
  onClose,
  onUpdate,
}) => {
  const [loading, setLoading] = useState(false)
  const [shiftDays, setShiftDays] = useState(0)
  const [markCompleted, setMarkCompleted] = useState(false)
  const toast = useToast()

  const handleBulkUpdate = async () => {
    try {
      setLoading(true)
      const syllabusRef = doc(portalDb, 'classPlanSyllabi', classPlanSyllabusId)
      const syllabusSnap = await getDoc(syllabusRef)

      if (syllabusSnap.exists()) {
        const data = syllabusSnap.data()
        const scheduledDays = { ...data.scheduledDays }

        // Apply bulk operations
        Object.keys(scheduledDays).forEach((dayId) => {
          const day = scheduledDays[dayId]

          // Shift dates if requested
          if (shiftDays !== 0) {
            const newDate = new Date(day.scheduledDate)
            newDate.setDate(newDate.getDate() + shiftDays)
            day.scheduledDate = newDate
          }

          // Mark as completed if requested
          if (markCompleted && !day.isCompleted) {
            day.isCompleted = true
          }
        })

        await updateDoc(syllabusRef, {
          scheduledDays,
          updatedAt: new Date(),
        })

        toast({
          title: 'Bulk update successful!',
          status: 'success',
          duration: 3000,
        })

        onUpdate()
        onClose()
      }
    } catch (error) {
      console.error('Error in bulk update:', error)
      toast({
        title: 'Error',
        description: 'Failed to perform bulk update',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Bulk Schedule Operations</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <Alert status="info">
              <AlertIcon />
              Apply changes to all scheduled days in this class plan.
            </Alert>

            <FormControl>
              <FormLabel>Shift All Dates (days)</FormLabel>
              <Input
                type="number"
                value={shiftDays}
                onChange={(e) => setShiftDays(parseInt(e.target.value) || 0)}
                placeholder="e.g., 7 to move forward one week"
              />
            </FormControl>

            <FormControl>
              <Checkbox
                isChecked={markCompleted}
                onChange={(e) => setMarkCompleted(e.target.checked)}
              >
                Mark all sessions as completed
              </Checkbox>
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleBulkUpdate}
            isLoading={loading}
          >
            Apply Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
