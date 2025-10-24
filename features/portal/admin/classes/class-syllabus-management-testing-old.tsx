import React from 'react'
import { Box, VStack, Alert, AlertIcon, Text } from '@chakra-ui/react'
import { Syllabus } from '../../../../types/syllabus.types'
import { ClassSyllabusManagement as BaseSyllabusManagement } from './class-syllabus-management'

interface EnhancedClassSyllabusManagementProps {
  classId: string
  classPlanId: string
  syllabus: Syllabus
  onSyllabusUpdate: (syllabus: Syllabus) => void
  isClassPlanView?: boolean
}

export const ClassSyllabusManagement: React.FC<
  EnhancedClassSyllabusManagementProps
> = ({
  classId,
  classPlanId,
  syllabus,
  onSyllabusUpdate,
  isClassPlanView = false,
}) => {
  return (
    <VStack spacing={4} align="stretch">
      {isClassPlanView && (
        <Alert status="info" size="sm">
          <AlertIcon />
          <Box>
            <Text fontWeight="bold">Class Plan Mode</Text>
            <Text fontSize="sm">
              Changes made here only affect this specific class plan. Other
              class plans in the cohort will maintain their original syllabus.
            </Text>
          </Box>
        </Alert>
      )}

      <BaseSyllabusManagement
        classId={classId}
        currentSyllabusId={syllabus.id}
        classStartDate={new Date()} // This should come from cohort data
        classEndDate={new Date()} // This should come from cohort data
        onSyllabusUpdate={(syllabusId) => {
          // Handle syllabus updates for class plan
          onSyllabusUpdate({
            ...syllabus,
            id: syllabusId,
          })
        }}
        isClassPlanView={isClassPlanView}
      />
    </VStack>
  )
}
