import React from 'react'
import { Input, FormControl, FormLabel, FormErrorMessage, Box } from '@chakra-ui/react'
import { format, parseISO } from 'date-fns'

interface SimpleDatePickerProps {
  name: string
  value: string | Date | null
  onChange: (date: Date | null) => void
  onBlur?: () => void
  label?: string
  placeholder?: string
  isInvalid?: boolean
  errorMessage?: string
  isDisabled?: boolean
  isRequired?: boolean
  minDate?: Date
  maxDate?: Date
  size?: 'sm' | 'md' | 'lg'
  width?: string
  height?: string
}

function SimpleDatePicker({
  name,
  value,
  onChange,
  onBlur,
  label,
  placeholder = 'Select date',
  isInvalid = false,
  errorMessage,
  isDisabled = false,
  isRequired = false,
  minDate,
  maxDate,
  size = 'md',
  width = 'full',
  height = '3.5rem'
}: SimpleDatePickerProps) {
  // Convert value to string format for input
  const dateValue = React.useMemo(() => {
    if (!value) return ''
    if (value instanceof Date) return format(value, 'yyyy-MM-dd')
    if (typeof value === 'string') {
      try {
        const parsed = parseISO(value)
        return format(parsed, 'yyyy-MM-dd')
      } catch {
        return value
      }
    }
    return ''
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateString = e.target.value
    if (dateString) {
      try {
        const date = parseISO(dateString)
        onChange(date)
      } catch {
        onChange(null)
      }
    } else {
      onChange(null)
    }
  }

  const getInputHeight = () => {
    switch (size) {
      case 'sm': return '2.5rem'
      case 'lg': return '4rem'
      default: return height
    }
  }

  const getMinDate = () => {
    if (!minDate) return undefined
    return format(minDate, 'yyyy-MM-dd')
  }

  const getMaxDate = () => {
    if (!maxDate) return undefined
    return format(maxDate, 'yyyy-MM-dd')
  }

  return (
    <FormControl isInvalid={isInvalid} isRequired={isRequired}>
      {label && (
        <FormLabel fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
          {label}
        </FormLabel>
      )}
      <Box position="relative" w={width}>
        <Input
          type="date"
          name={name}
          value={dateValue}
          onChange={handleChange}
          onBlur={onBlur}
          disabled={isDisabled}
          min={getMinDate()}
          max={getMaxDate()}
          placeholder={placeholder}
          h={getInputHeight()}
          bg="gray.50"
          border="1px solid"
          borderColor={isInvalid ? 'red.500' : 'yellow.300'}
          borderRadius="md"
          _focus={{
            borderColor: isInvalid ? 'red.500' : 'yellow.400',
            bg: 'white',
            boxShadow: 'none'
          }}
          _hover={{
            borderColor: isInvalid ? 'red.500' : 'yellow.400',
          }}
          _disabled={{
            opacity: 0.6,
            cursor: 'not-allowed'
          }}
          // Safari-specific styles
          sx={{
            '&::-webkit-calendar-picker-indicator': {
              filter: 'invert(0.5)',
              cursor: 'pointer'
            },
            '&::-webkit-datetime-edit': {
              color: dateValue ? 'inherit' : '#a0aec0'
            },
            '&::-webkit-datetime-edit-fields-wrapper': {
              padding: '0'
            },
            '&::-webkit-datetime-edit-text': {
              padding: '0 0.2em'
            },
            '&::-webkit-datetime-edit-month-field': {
              padding: '0 0.2em'
            },
            '&::-webkit-datetime-edit-day-field': {
              padding: '0 0.2em'
            },
            '&::-webkit-datetime-edit-year-field': {
              padding: '0 0.2em'
            }
          }}
        />
      </Box>
      {errorMessage && <FormErrorMessage>{errorMessage}</FormErrorMessage>}
    </FormControl>
  )
}

export default SimpleDatePicker
