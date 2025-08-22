import React from 'react'
import DatePicker from 'react-datepicker'
import { Input, FormControl, FormLabel, FormErrorMessage, Box } from '@chakra-ui/react'
import { format, parseISO } from 'date-fns'
import 'react-datepicker/dist/react-datepicker.css'

// Add type declaration for react-datepicker
declare module 'react-datepicker' {
  interface ReactDatePickerProps {
    customInput?: React.ReactElement
    popperClassName?: string
    popperPlacement?: string
  }
}

interface DatePickerProps {
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

function CustomDatePicker({
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
}: DatePickerProps) {
  // Convert string value to Date object for react-datepicker
  const dateValue = React.useMemo(() => {
    if (!value) return null
    if (value instanceof Date) return value
    if (typeof value === 'string') {
      try {
        return parseISO(value)
      } catch {
        return null
      }
    }
    return null
  }, [value])

  // Convert Date back to string format for form compatibility
  const handleDateChange = (date: Date | null) => {
    if (date) {
      const formattedDate = format(date, 'yyyy-MM-dd')
      // Create a synthetic event to maintain compatibility with form libraries
      const syntheticEvent = {
        target: {
          name,
          value: formattedDate
        }
      }
      // Call onChange with the formatted string
      onChange(date)
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

  return (
    <FormControl isInvalid={isInvalid} isRequired={isRequired}>
      {label && (
        <FormLabel fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
          {label}
        </FormLabel>
      )}
      <Box position="relative" w={width}>
        <DatePicker
          selected={dateValue}
          onChange={handleDateChange}
          onBlur={onBlur}
          disabled={isDisabled}
          minDate={minDate}
          maxDate={maxDate}
          placeholderText={placeholder}
          dateFormat="yyyy-MM-dd"
          showYearDropdown
          showMonthDropdown
          dropdownMode="select"
          customInput={
            <Input
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
            />
          }
        />
      </Box>
      {errorMessage && <FormErrorMessage>{errorMessage}</FormErrorMessage>}
    </FormControl>
  )
}

export default CustomDatePicker
