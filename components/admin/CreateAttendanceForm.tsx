import React, { useState } from 'react'
import { Box, Button, Checkbox, CheckboxGroup, VStack, Text, HStack, StackDivider, useToast } from '@chakra-ui/react'
import { createAttendance, generateAttendanceCode } from '../../lib/utils/attendance.utils'
import { Attendance } from '../../types/attendance.types'

const today = new Date().toISOString().slice(0, 10)

export function CreateAttendanceForm({ activeClasses, onCreated }: { activeClasses: { id: string, cohortName: string, status: string }[], onCreated?: () => void }) {
  const [selectedCohorts, setSelectedCohorts] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [created, setCreated] = useState<Attendance[]>([])
  const [error, setError] = useState('')
  const toast = useToast()

  function handleSelect(values: string[]) {
    if (values.includes('ALL_CLASSES')) {
      setSelectedCohorts(activeClasses.map(cls => cls.cohortName))
    } else {
      setSelectedCohorts(values)
    }
  }

  async function handleCreate() {
    setLoading(true)
    setError('')
    setCreated([])
    try {
      if (selectedCohorts.length === 0) throw new Error('Select at least one class')
      const code = generateAttendanceCode()
      const attendances: Attendance[] = []
      for (const cohort of selectedCohorts) {
        const attendance: Attendance = {
          attendanceId: `${cohort}_${today}`,
          date: today,
          code,
          classId: cohort.toUpperCase(),
          createdAt: new Date(),
        }
        await createAttendance(attendance)
        attendances.push(attendance)
      }
      setCreated(attendances)
      toast({ title: 'Attendance created!', status: 'success' })
      onCreated?.()
    } catch (err: any) {
      setError(err.message || 'Failed to create attendance')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box p={6} borderWidth={1} borderRadius="xl" bg="white" maxW="420px" w="full">
      <VStack spacing={6} align="stretch">
        <Text fontWeight="bold" fontSize="lg">Select class(es)</Text>
        <CheckboxGroup value={selectedCohorts} onChange={handleSelect}>
          <VStack align="start" spacing={2} divider={<StackDivider />}>
            <Checkbox value="ALL_CLASSES" colorScheme="purple">
              All Active Classes
            </Checkbox>
            {activeClasses.map(cls => (
              <Checkbox key={cls.cohortName} value={cls.cohortName} colorScheme="purple">
                {cls.cohortName}
              </Checkbox>
            ))}
          </VStack>
        </CheckboxGroup>
        <Button
          colorScheme="purple"
          onClick={handleCreate}
          isLoading={loading}
          isDisabled={selectedCohorts.length === 0}
          w="full"
          size="lg"
        >
          Create Attendance for Today
        </Button>
        {created.length > 0 && (
          <Box bg="green.50" p={3} borderRadius="md">
            <Text color="green.700" mb={1}>
              Attendance created for {created.length} class{created.length > 1 ? 'es' : ''}!<br />
              Shared Code: <b>{created[0].code}</b>
            </Text>
            <VStack align="start" spacing={1}>
              {created.map(att => (
                <Text key={att.classId} fontSize="sm" color="gray.700">
                  {activeClasses.find(cls => cls.cohortName === att.classId)?.cohortName || att.classId}
                </Text>
              ))}
            </VStack>
          </Box>
        )}
        {error && <Text color="red.500">{error}</Text>}
      </VStack>
    </Box>
  )
} 