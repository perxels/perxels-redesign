import * as Yup from 'yup'
import React, { useState } from 'react'
import { Formik } from 'formik'
import {
  Box,
  SimpleGrid,
  Select,
  VStack,
  HStack,
  Button,
  useToast,
  Text,
  Alert,
  AlertIcon,
  AlertDescription,
} from '@chakra-ui/react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { portalAuth } from '../../../portalFirebaseConfig'
import { AuthInput } from './auth-input'
import { FiMail } from 'react-icons/fi'
import { useRouter } from 'next/navigation'
import { branchOptions } from '../../../constant/adminConstants'

// Types
interface SignUpFormValues {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  branch: string
}

// Enhanced validation schema with better error messages
const formSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(25, 'First name must not exceed 25 characters')
    .matches(/^[a-zA-Z\s]*$/, 'First name can only contain letters and spaces')
    .trim(),

  lastName: Yup.string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(25, 'Last name must not exceed 25 characters')
    .matches(/^[a-zA-Z\s]*$/, 'Last name can only contain letters and spaces')
    .trim(),

  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required')
    .matches(
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      'Please enter a valid email format',
    )
    .lowercase()
    .trim(),

  phone: Yup.string()
    .required('Phone number is required')
    .matches(
      /^(\+?[1-9]\d{1,14}|0[789][01]\d{8})$/,
      'Enter a valid phone number (e.g., +1234567890, +2348012345678, or 08012345678)',
    )
    .test('phone-format', 'Phone number must be in international or Nigerian format', (value) => {
      if (!value) return false
      
      // Nigerian format: +234 or 0 followed by 7,8,9,0,1 and 8 digits
      const nigerianFormat = /^(\+234|0)[789][01]\d{8}$/
      
      // International format: + followed by 1-15 digits
      const internationalFormat = /^\+[1-9]\d{1,14}$/
      
      return nigerianFormat.test(value) || internationalFormat.test(value)
    })
    .trim(),

  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/,
      'Password must contain: uppercase letter, lowercase letter, number, and special character',
    ),

  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords must match'),

  branch: Yup.string()
    .required('Please select your preferred branch')
    .oneOf(
      ['Ibadan', 'Lekki, Lagos', 'Yaba, Lagos', 'Abuja'],
      'Please select a valid branch',
    ),
})



export function SignUpForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const toast = useToast()
  const router = useRouter()

  const handleSignUp = async (values: SignUpFormValues) => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // Sanitize form data and merge names
      const sanitizedData = {
        email: values.email.toLowerCase().trim(),
        password: values.password,
        fullName: `${values.firstName.trim()} ${values.lastName.trim()}`.trim(),
        phone: values.phone.trim(),
        branch: values.branch,
      }

      // Create account, store user data, and send OTP all in one API call
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sanitizedData),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        // Use the user-friendly error message from the API
        throw new Error(result.error || 'Failed to create account')
      }

      // Sign in the user after successful account creation
      try {
        const userCredential = await signInWithEmailAndPassword(
          portalAuth,
          sanitizedData.email,
          sanitizedData.password,
        )

        // Show success message
        toast({
          title: 'Account created successfully! 🎉',
          description:
            result.message || 'Please check your email for the verification code',
          status: 'success',
          duration: 8000,
          isClosable: true,
          position: 'top',
        })
  
        // Redirect to OTP verification page
        router.push(
          `/portal/verify?email=${encodeURIComponent(sanitizedData.email)}`,
        )

      } catch (signInError) {
        console.error('Failed to sign in after account creation:', signInError)
        // Don't throw here as account was created successfully
        // User can still proceed to verification
      }

    } catch (error: unknown) {
      console.error('Sign up error:', error)

      let errorMessage = 'Failed to create account. Please try again.'

      if (error instanceof Error) {
        // Check if it's a network error
        if (error.message.includes('fetch') || error.message.includes('Network')) {
          errorMessage = 'Network error. Please check your connection and try again.'
        } else {
          // Use the error message from the API (which is already user-friendly)
          errorMessage = error.message
        }
      }

      setSubmitError(errorMessage)

      toast({
        title: 'Account Creation Failed',
        description: errorMessage,
        status: 'error',
        duration: 8000,
        isClosable: true,
        position: 'top',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Box w="full">
      {submitError && (
        <Alert status="error" mb={6} borderRadius="md">
          <AlertIcon />
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}

      <Formik<SignUpFormValues>
        initialValues={{
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          branch: '',
        }}
        validationSchema={formSchema}
        onSubmit={handleSignUp}
        validateOnChange={true}
        validateOnBlur={true}
      >
        {(formik) => (
          <form onSubmit={formik.handleSubmit} style={{ width: '100%' }}>
            <VStack w="full" alignItems="flex-start" spacing={6}>
              <SimpleGrid columns={2} spacing={[5, 10]} w="full" maxW="750px">
                <AuthInput
                  name="firstName"
                  placeholder="First name*"
                  isDisabled={isSubmitting}
                />

                <AuthInput
                  name="lastName"
                  placeholder="Last name*"
                  isDisabled={isSubmitting}
                />

                <AuthInput
                  name="email"
                  type="email"
                  placeholder="Email Address*"
                  rightElement={<FiMail />}
                  isDisabled={isSubmitting}
                />

                <AuthInput
                  name="phone"
                  placeholder="Phone Number*"
                  isDisabled={isSubmitting}
                />

                <AuthInput
                  name="password"
                  type="password"
                  placeholder="Password*"
                  isDisabled={isSubmitting}
                />

                <AuthInput
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password*"
                  isDisabled={isSubmitting}
                />

                <Box>
                  <Select
                    h="3.5rem"
                    placeholder="Select Branch*"
                    name="branch"
                    borderWidth={1}
                    borderColor={
                      formik.touched.branch && formik.errors.branch
                        ? 'red.500'
                        : 'yellow.300'
                    }
                    bgColor="yellow.50"
                    value={formik.values.branch}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isDisabled={isSubmitting}
                    _focus={{
                      borderColor:
                        formik.touched.branch && formik.errors.branch
                          ? 'red.500'
                          : 'yellow.400',
                      bgColor: 'yellow.50',
                    }}
                    _focusVisible={{
                      outline: 'none',
                    }}
                    _active={{
                      borderColor:
                        formik.touched.branch && formik.errors.branch
                          ? 'red.500'
                          : 'yellow.400',
                      bgColor: 'yellow.50',
                    }}
                    _hover={{
                      borderColor:
                        formik.touched.branch && formik.errors.branch
                          ? 'red.500'
                          : 'yellow.400',
                      bgColor: 'yellow.50',
                    }}
                  >
                    {branchOptions
                      .filter((option) => option.value !== 'all')
                      .map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                  </Select>
                  {formik.touched.branch && formik.errors.branch && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {formik.errors.branch}
                    </Text>
                  )}
                </Box>
              </SimpleGrid>

              {/* Password strength indicator */}
              {formik.values.password && (
                <Box w="full" maxW="750px">
                  <Text fontSize="sm" color="gray.600" mb={2}>
                    Password Requirements:
                  </Text>
                  <VStack align="start" spacing={1}>
                    <Text
                      fontSize="xs"
                      color={
                        formik.values.password.length >= 8
                          ? 'green.500'
                          : 'gray.400'
                      }
                    >
                      ✓ At least 8 characters
                    </Text>
                    <Text
                      fontSize="xs"
                      color={
                        /[a-z]/.test(formik.values.password)
                          ? 'green.500'
                          : 'gray.400'
                      }
                    >
                      ✓ One lowercase letter
                    </Text>
                    <Text
                      fontSize="xs"
                      color={
                        /[A-Z]/.test(formik.values.password)
                          ? 'green.500'
                          : 'gray.400'
                      }
                    >
                      ✓ One uppercase letter
                    </Text>
                    <Text
                      fontSize="xs"
                      color={
                        /\d/.test(formik.values.password)
                          ? 'green.500'
                          : 'gray.400'
                      }
                    >
                      ✓ One number
                    </Text>
                    <Text
                      fontSize="xs"
                      color={
                        /[@$!%*?&.]/.test(formik.values.password)
                          ? 'green.500'
                          : 'gray.400'
                      }
                    >
                      ✓ One special character (@$!%*?&.)
                    </Text>
                  </VStack>
                </Box>
              )}

              <HStack justifyContent="flex-end" w="full" mt={8}>
                <Button
                  h="3.5rem"
                  type="submit"
                  disabled={isSubmitting || !formik.isValid || !formik.dirty}
                  isLoading={isSubmitting}
                  loadingText="Creating your account..."
                  px={16}
                  colorScheme="yellow"
                  size="lg"
                  _hover={{
                    transform: 'translateY(-1px)',
                    boxShadow: 'lg',
                  }}
                  transition="all 0.2s"
                >
                  {isSubmitting ? 'Creating Account...' : 'Create Account'}
                </Button>
              </HStack>

              {/* Form validation summary */}
              {formik.submitCount > 0 && !formik.isValid && (
                <Alert status="warning" borderRadius="md" w="full">
                  <AlertIcon />
                  <AlertDescription>
                    Please correct the errors above before continuing.
                  </AlertDescription>
                </Alert>
              )}
            </VStack>
          </form>
        )}
      </Formik>
    </Box>
  )
}
