import React from 'react'
import {
  Input,
  FormControl,
  FormErrorMessage,
  FormLabel,
} from '@chakra-ui/react'
import { formatNaira, parseNaira } from '../features/portal/auth/school-fee-info-form'

interface CurrencyInputProps {
  name: string
  value: string | number
  onChange: (value: string) => void
  onBlur?: () => void
  placeholder?: string
  label?: string
  isInvalid?: boolean
  errorMessage?: string | false | undefined
  isRequired?: boolean
  isDisabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'yellow' | 'purple'
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  name,
  value,
  onChange,
  onBlur,
  placeholder = "Enter amount",
  label,
  isInvalid = false,
  errorMessage,
  isRequired = false,
  isDisabled = false,
  size = 'md',
  variant = 'default'
}) => {
  // Convert value to string and format for display
  const displayValue = value === 0 || value === '' ? '' : formatNaira(value.toString())
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    
    // Remove any non-digit characters except for the ₦ symbol and commas
    let cleanValue = value.replace(/[^\d₦,]/g, '')
    
    // If it contains ₦ or commas, parse it properly
    if (cleanValue.includes('₦') || cleanValue.includes(',')) {
      cleanValue = parseNaira(cleanValue)
    }
    
    // Ensure we only pass clean digits to the parent
    const finalValue = cleanValue.replace(/[^\d]/g, '')
    onChange(finalValue)
  }

  // Get styling based on variant
  const getVariantStyles = () => {
    switch (variant) {
      case 'yellow':
        return {
          borderColor: isInvalid ? 'red.500' : 'yellow.300',
          bgColor: 'yellow.50',
          _focus: {
            borderColor: isInvalid ? 'red.500' : 'yellow.400',
            bgColor: 'yellow.50',
          },
          _focusVisible: {
            outline: 'none',
          },
          _active: {
            borderColor: isInvalid ? 'red.500' : 'yellow.400',
            bgColor: 'yellow.50',
          },
          _hover: {
            borderColor: isInvalid ? 'red.500' : 'yellow.400',
            bgColor: 'yellow.50',
          },
        }
      case 'purple':
        return {
          borderColor: isInvalid ? 'red.500' : 'purple.300',
          bgColor: 'purple.50',
          _focus: {
            borderColor: isInvalid ? 'red.500' : 'purple.400',
            bgColor: 'purple.50',
          },
          _focusVisible: {
            outline: 'none',
          },
          _active: {
            borderColor: isInvalid ? 'red.500' : 'purple.400',
            bgColor: 'purple.50',
          },
          _hover: {
            borderColor: isInvalid ? 'red.500' : 'purple.400',
            bgColor: 'purple.50',
          },
        }
      default:
        return {
          borderColor: isInvalid ? 'red.500' : 'gray.300',
          bgColor: 'white',
          _focus: {
            borderColor: isInvalid ? 'red.500' : 'blue.400',
            bgColor: 'white',
          },
          _focusVisible: {
            outline: 'none',
          },
          _active: {
            borderColor: isInvalid ? 'red.500' : 'blue.400',
            bgColor: 'white',
          },
          _hover: {
            borderColor: isInvalid ? 'red.500' : 'blue.400',
            bgColor: 'white',
          },
        }
    }
  }

  // Get height based on size
  const getHeight = () => {
    switch (size) {
      case 'sm': return '2.5rem'
      case 'lg': return '4rem'
      default: return '3.5rem'
    }
  }

  return (
    <FormControl isInvalid={isInvalid} isRequired={isRequired}>
      {label && (
        <FormLabel htmlFor={name} fontSize="sm" fontWeight="medium" color="gray.700">
          {label}
        </FormLabel>
      )}
      <Input
        id={name}
        name={name}
        value={displayValue}
        onChange={handleChange}
        onBlur={onBlur}
        placeholder={placeholder}
        h={getHeight()}
        _placeholder={{ color: 'gray.400' }}
        borderWidth={1}
        borderRadius="md"
        fontSize="md"
        isDisabled={isDisabled}
        {...getVariantStyles()}
      />
      {isInvalid && errorMessage && (
        <FormErrorMessage>{errorMessage.toString()}</FormErrorMessage>
      )}
    </FormControl>
  )
}
