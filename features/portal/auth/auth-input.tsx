import { Input, InputProps, FormControl, FormErrorMessage, Box, IconButton } from '@chakra-ui/react'
import { useField } from 'formik'
import { ReactNode, useState } from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'

interface AuthInputProps extends Omit<InputProps, 'name'> {
  name: string
  label?: string
  helperText?: string
  leftElement?: ReactNode
  rightElement?: ReactNode
}

export function AuthInput({
  name,
  label,
  helperText,
  leftElement,
  rightElement,
  type,
  ...props
}: AuthInputProps) {
  const [field, meta] = useField(name)
  const isError = Boolean(meta.touched && meta.error)
  const [showPassword, setShowPassword] = useState(false)

  const isPassword = type === 'password'
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

  const togglePasswordVisibility = () => setShowPassword(!showPassword)

  const passwordToggle = isPassword ? (
    <IconButton
      aria-label={showPassword ? 'Hide password' : 'Show password'}
      icon={showPassword ? <FiEyeOff /> : <FiEye />}
      variant="ghost"
      size="sm"
      onClick={togglePasswordVisibility}
      bg="transparent"
    />
  ) : null

  return (
    <FormControl isInvalid={isError}>
      <Box position="relative">
        {leftElement && (
          <Box
            position="absolute"
            left="1rem"
            top="50%"
            transform="translateY(-50%)"
            zIndex={1}
          >
            {leftElement}
          </Box>
        )}
        <Input
          h="3.5rem"
          _placeholder={{ color: 'brand.dark.200' }}
          borderWidth={1}
          borderColor={isError ? 'red.500' : 'yellow.300'}
          bgColor="yellow.50"
          pl={leftElement ? '3rem' : '1rem'}
          pr={(rightElement || isPassword) ? '3rem' : '1rem'}
          _focus={{
            borderColor: isError ? 'red.500' : 'yellow.400',
            bgColor: 'yellow.50',
          }}
          _focusVisible={{
            outline: 'none',
          }}
          _active={{
            borderColor: isError ? 'red.500' : 'yellow.400',
            bgColor: 'yellow.50',
          }}
          _hover={{
            borderColor: isError ? 'red.500' : 'yellow.400',
            bgColor: 'yellow.50',
          }}
          type={inputType}
          {...field}
          {...props}
        />
        {(rightElement || isPassword) && (
          <Box
            position="absolute"
            right="1rem"
            top="50%"
            transform="translateY(-50%)"
            zIndex={1}
          >
            {isPassword ? passwordToggle : rightElement}
          </Box>
        )}
      </Box>
      {isError && <FormErrorMessage>{meta.error}</FormErrorMessage>}
      {helperText && !isError && (
        <Box mt={1} fontSize="sm" color="gray.500">
          {helperText}
        </Box>
      )}
    </FormControl>
  )
}
