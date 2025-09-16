import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Text,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Select,
  useToast,
  Checkbox,
  CheckboxGroup,
  Divider,
  Alert,
  AlertIcon,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react'
import { CustomDatePicker } from '../../components'
import { 
  createMultipleSessions, 
  getDailyCode, 
  getTodayDateString,
  getSessionsByDate 
} from '../../lib/utils/attendance-v2.utils'
import { Session } from '../../types/attendance-v2.types'
import { useActiveClasses } from '../../hooks/useClasses'
import { classPlans } from '../../constant/adminConstants'
import { format } from 'date-fns'

interface CreateSessionFormProps {
  onCreated?: () => void
  onClose?: () => void
}

interface SessionFormData {
  date: string
  cohortIds: string[]
  planIds: string[]
  startsAt: string
  endsAt: string
}

export function CreateSessionForm({ onCreated, onClose }: CreateSessionFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [dailyCode, setDailyCode] = useState<string>('')
  const [existingSessions, setExistingSessions] = useState<Session[]>([])
  const [formData, setFormData] = useState<SessionFormData>({
    date: getTodayDateString(),
    cohortIds: [],
    planIds: [],
    startsAt: '09:00',
    endsAt: '17:00',
  })
  
  const { classes, loading: classesLoading } = useActiveClasses()
  const toast = useToast()

  // Check if daily code exists for selected date
  useEffect(() => {
    const checkDailyCode = async () => {
      if (!formData.date) return
      
      try {
        const code = await getDailyCode(formData.date)
        if (code) {
          setDailyCode(code.code)
          // Also check for existing sessions
          const sessions = await getSessionsByDate(formData.date)
          setExistingSessions(sessions)
        } else {
          setDailyCode('')
          setExistingSessions([])
        }
      } catch (err) {
        console.error('Error checking daily code:', err)
        setDailyCode('')
        setExistingSessions([])
      }
    }
    
    checkDailyCode()
  }, [formData.date])

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    
    try {
      if (!formData.date) throw new Error('Date is required')
      if (!dailyCode) throw new Error('No daily code found for this date. Create one first.')
      if (formData.cohortIds.length === 0) throw new Error('Select at least one cohort')
      if (formData.planIds.length === 0) throw new Error('Select at least one class plan')
      
      // Create sessions for each cohort + plan combination
      const sessionsToCreate: Omit<Session, 'sessionId' | 'createdAt'>[] = []
      
      formData.cohortIds.forEach(cohortId => {
        formData.planIds.forEach(planId => {
          // Check if session already exists
          const exists = existingSessions.some(session => 
            session.cohortId === cohortId && session.planId === planId
          )
          
          if (!exists) {
            const startDateTime = new Date(`${formData.date}T${formData.startsAt}:00`)
            const endDateTime = new Date(`${formData.date}T${formData.endsAt}:00`)
            
            sessionsToCreate.push({
              dailyCodeId: formData.date,
              cohortId,
              planId,
              date: formData.date,
              startsAt: startDateTime,
              endsAt: endDateTime,
              status: 'open',
              createdBy: 'admin', // TODO: Get from auth context
            })
          }
        })
      })
      
      if (sessionsToCreate.length === 0) {
        throw new Error('All selected cohort/plan combinations already have sessions for this date')
      }
      
      await createMultipleSessions(sessionsToCreate)
      
      toast({
        title: 'Sessions created successfully!',
        description: `Created ${sessionsToCreate.length} session(s) for ${formData.date}`,
        status: 'success',
        duration: 3000,
      })
      
      onCreated?.()
      onClose?.()
    } catch (err: any) {
      setError(err.message || 'Failed to create sessions')
    } finally {
      setLoading(false)
    }
  }

  const handleCohortChange = (values: string[]) => {
    if (values.includes('ALL_COHORTS')) {
      setFormData(prev => ({ 
        ...prev, 
        cohortIds: classes.map(cls => cls.cohortName) 
      }))
    } else {
      setFormData(prev => ({ ...prev, cohortIds: values }))
    }
  }

  const handlePlanChange = (values: string[]) => {
    if (values.includes('ALL_PLANS')) {
      setFormData(prev => ({ 
        ...prev, 
        planIds: classPlans 
      }))
    } else {
      setFormData(prev => ({ ...prev, planIds: values }))
    }
  }

  const getExistingSessionsText = () => {
    if (existingSessions.length === 0) return ''
    
    const uniqueCombinations = new Set(
      existingSessions.map(s => `${s.cohortId} + ${s.planId}`)
    )
    
    return `(${uniqueCombinations.size} existing session${uniqueCombinations.size > 1 ? 's' : ''})`
  }

  return (
    <Box p={6} borderWidth={1} borderRadius="xl" bg="white">
      <VStack spacing={6} align="stretch">
        <Text fontWeight="bold" fontSize="lg" color="gray.700">
          Create Class Sessions
        </Text>
        
        {dailyCode ? (
          <Alert status="success" borderRadius="md">
            <AlertIcon />
            <Text fontSize="sm">
              Daily code <strong>{dailyCode}</strong> is active for {formData.date}
            </Text>
          </Alert>
        ) : (
          <Alert status="warning" borderRadius="md">
            <AlertIcon />
            <Text fontSize="sm">
              No daily code found for {formData.date}. Create a daily code first.
            </Text>
          </Alert>
        )}

        <FormControl isRequired>
          <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
            Date
          </FormLabel>
          <CustomDatePicker
            name="date"
            value={formData.date ? new Date(formData.date) : null}
            onChange={(date) => setFormData(prev => ({ 
              ...prev, 
              date: date ? format(date, 'yyyy-MM-dd') : '' 
            }))}
            width="100%"
            placeholder="Select date"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
            Cohorts {getExistingSessionsText()}
          </FormLabel>
          <CheckboxGroup value={formData.cohortIds} onChange={handleCohortChange}>
            <VStack align="start" spacing={2} maxH="200px" overflowY="auto">
              <Checkbox value="ALL_COHORTS" colorScheme="purple" fontWeight="medium">
                All Active Cohorts
              </Checkbox>
              {classesLoading ? (
                <Text fontSize="sm" color="gray.500">Loading cohorts...</Text>
              ) : (
                classes.map(cls => (
                  <Checkbox key={cls.cohortName} value={cls.cohortName} colorScheme="purple">
                    {cls.cohortName}
                  </Checkbox>
                ))
              )}
            </VStack>
          </CheckboxGroup>
        </FormControl>

        <FormControl isRequired>
          <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
            Class Plans
          </FormLabel>
          <CheckboxGroup value={formData.planIds} onChange={handlePlanChange}>
            <VStack align="start" spacing={2} maxH="200px" overflowY="auto">
              <Checkbox value="ALL_PLANS" colorScheme="purple" fontWeight="medium">
                All Class Plans
              </Checkbox>
              {classPlans.map(plan => (
                <Checkbox key={plan} value={plan} colorScheme="purple">
                  {plan}
                </Checkbox>
              ))}
            </VStack>
          </CheckboxGroup>
        </FormControl>

        <HStack spacing={4}>
          <FormControl isRequired>
            <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
              Start Time
            </FormLabel>
            <Input
              type="time"
              value={formData.startsAt}
              onChange={(e) => setFormData(prev => ({ ...prev, startsAt: e.target.value }))}
            />
          </FormControl>
          
          <FormControl isRequired>
            <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
              End Time
            </FormLabel>
            <Input
              type="time"
              value={formData.endsAt}
              onChange={(e) => setFormData(prev => ({ ...prev, endsAt: e.target.value }))}
            />
          </FormControl>
        </HStack>

        <Divider />

        <HStack spacing={3} justify="flex-end">
          <Button variant="outline" onClick={onClose} isDisabled={loading}>
            Cancel
          </Button>
          <Button
            colorScheme="purple"
            onClick={handleSubmit}
            isLoading={loading}
            isDisabled={!dailyCode || formData.cohortIds.length === 0 || formData.planIds.length === 0}
            px={8}
          >
            Create Sessions
          </Button>
        </HStack>

        {error && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            <Text fontSize="sm">{error}</Text>
          </Alert>
        )}
      </VStack>
    </Box>
  )
}
