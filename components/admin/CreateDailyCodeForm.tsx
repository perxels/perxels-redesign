import React, { useState } from 'react'
import {
  Box,
  Button,
  Input,
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
  Badge,
  Alert,
  AlertIcon,
} from '@chakra-ui/react'
import { CustomDatePicker } from '../../components'
import { createDailyCode, generateAttendanceCode, getTodayDateString } from '../../lib/utils/attendance-v2.utils'
import { DailyCode } from '../../types/attendance-v2.types'
import { format } from 'date-fns'

interface CreateDailyCodeFormProps {
  onCreated?: () => void
  onClose?: () => void
}

export function CreateDailyCodeForm({ onCreated, onClose }: CreateDailyCodeFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    date: getTodayDateString(),
    code: generateAttendanceCode(),
    status: 'active' as 'active' | 'expired'
  })
  const toast = useToast()

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    
    try {
      if (!formData.date) throw new Error('Date is required')
      if (!formData.code.trim()) throw new Error('Code is required')
      
      const dailyCode: Omit<DailyCode, 'createdAt'> = {
        code: formData.code.trim().toUpperCase(),
        date: formData.date,
        status: formData.status,
        createdBy: 'admin', // TODO: Get from auth context
      }
      
      await createDailyCode(dailyCode)
      
      toast({
        title: 'Daily code created successfully!',
        description: `Code ${formData.code} is now active for ${formData.date}`,
        status: 'success',
        duration: 3000,
      })
      
      onCreated?.()
      onClose?.()
    } catch (err: any) {
      setError(err.message || 'Failed to create daily code')
    } finally {
      setLoading(false)
    }
  }

  const generateNewCode = () => {
    setFormData(prev => ({ ...prev, code: generateAttendanceCode() }))
  }

  return (
    <Box p={6} borderWidth={1} borderRadius="xl" bg="white">
      <VStack spacing={6} align="stretch">
        <Text fontWeight="bold" fontSize="lg" color="gray.700">
          Create Daily Attendance Code
        </Text>
        
        <Alert status="info" borderRadius="md">
          <AlertIcon />
          <Text fontSize="sm">
            This code will be used by all students across all class plans for the selected date.
          </Text>
        </Alert>

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
            Attendance Code
          </FormLabel>
          <HStack spacing={3}>
            <Input
              value={formData.code}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                code: e.target.value.toUpperCase() 
              }))}
              placeholder="e.g., COP1234"
              textTransform="uppercase"
              fontSize="lg"
              fontWeight="bold"
              textAlign="center"
              letterSpacing="0.1em"
              bg="gray.50"
              border="2px solid"
              borderColor="purple.300"
              borderRadius="lg"
              h="3rem"
              _focus={{
                borderColor: 'purple.500',
                bg: 'white',
                boxShadow: '0 0 0 1px rgba(128, 90, 213, 0.2)',
              }}
            />
            <Button
              variant="outline"
              colorScheme="purple"
              onClick={generateNewCode}
              size="sm"
              px={4}
            >
              Generate
            </Button>
          </HStack>
        </FormControl>

        <FormControl>
          <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
            Status
          </FormLabel>
          <Select
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              status: e.target.value as 'active' | 'expired' 
            }))}
            bg="white"
            borderColor="gray.300"
          >
            <option value="active">Active</option>
            <option value="expired">Expired</option>
          </Select>
        </FormControl>

        <Divider />

        <HStack spacing={3} justify="flex-end">
          <Button variant="outline" onClick={onClose} isDisabled={loading}>
            Cancel
          </Button>
          <Button
            colorScheme="purple"
            onClick={handleSubmit}
            isLoading={loading}
            isDisabled={!formData.date || !formData.code.trim()}
            px={8}
          >
            Create Daily Code
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
