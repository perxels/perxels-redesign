import * as Yup from 'yup'
import React from 'react'
import { Formik } from 'formik'
import {
  Box,
  SimpleGrid,
  Select,
  VStack,
  HStack,
  Button,
  useToast,
} from '@chakra-ui/react'
import { AuthInput } from './auth-input'
import { FiMail } from 'react-icons/fi'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { FirebaseError } from 'firebase/app'
import { doc, setDoc } from 'firebase/firestore'
import { portalAuth, portalDb } from '../../../portalFirebaseConfig'
import { useRouter } from 'next/navigation'
import otpService from '../../../lib/services/otp.service'
import { OTPServiceError } from '../../../lib/services/otp.service'

// Types
interface SignUpFormValues {
  fullName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  branch: string
}

interface UserData {
  uid: string
  fullName: string
  email: string
  phone: string
  branch: string
  role: 'student' | 'admin'
  emailVerified: boolean
  createdAt: Date
}

const formSchema = Yup.object().shape({
  fullName: Yup.string()
    .required('Full name is required')
    .min(2, 'Full name must be at least 2 characters')
    .max(50, 'Full name must not exceed 50 characters')
    .matches(/^[a-zA-Z\s]*$/, 'Full name can only contain letters and spaces'),

  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required')
    .matches(
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      'Invalid email format',
    ),

  phone: Yup.string()
    .required('Phone number is required')
    .matches(
      /^(\+234|0)[789][01]\d{8}$/,
      'Please enter a valid Nigerian phone number (e.g., +2348012345678 or 08012345678)',
    ),

  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    ),

  confirmPassword: Yup.string()
    .required('Confirm password is required')
    .oneOf([Yup.ref('password')], 'Passwords must match'),

  branch: Yup.string()
    .required('Branch is required')
    .oneOf(
      ['Ibadan', 'Lekki, Lagos', 'Yaba, Lagos', 'Abuja'],
      'Please select a valid branch',
    ),
})

export function SignUpForm() {
  const toast = useToast()
  const router = useRouter()

  const handleSignUp = async (values: SignUpFormValues) => {
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        portalAuth,
        values.email,
        values.password,
      )

      // // Update user profile with full name
      // await updateProfile(userCredential.user, {
      //   displayName: values.fullName,
      // })

      // // Save additional user data to Firestore
      // const userData: UserData = {
      //   uid: userCredential.user.uid,
      //   fullName: values.fullName,
      //   email: values.email,
      //   phone: values.phone,
      //   branch: values.branch,
      //   role: 'student', // Default role for new sign-ups
      //   emailVerified: false,
      //   createdAt: new Date(),
      // }

      // await setDoc(doc(portalDb, 'users', userCredential.user.uid), userData)

      // Send OTP for email verification
      await otpService.sendOTP(values.email)

      // Show success message
      toast({
        title: 'Account created successfully',
        description: 'Please check your email for verification code',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      // Redirect to OTP verification page
      router.push(
        `/portal/verify?email=${encodeURIComponent(values.email)}`,
      )
    } catch (error: unknown) {
      console.error('Sign up error:', error)

      let errorMessage = 'Failed to create account'
      if (error instanceof OTPServiceError) {
        errorMessage = error.message
      } else if (error instanceof FirebaseError) {
        // Handle Firebase auth errors
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'Email is already registered'
            break
          case 'auth/invalid-email':
            errorMessage = 'Invalid email address'
            break
          case 'auth/weak-password':
            errorMessage = 'Password is too weak'
            break
          default:
            errorMessage = error.message
        }
      }

      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  return (
    <Formik<SignUpFormValues>
      initialValues={{
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        branch: '',
      }}
      validationSchema={formSchema}
      onSubmit={handleSignUp}
    >
      {(formik) => (
        <form onSubmit={formik.handleSubmit} style={{ width: '100%' }}>
          <VStack w="full" alignItems="flex-start">
            <SimpleGrid columns={2} spacing={10} w="full" maxW="750px">
              <AuthInput name="fullName" placeholder="Full name*" />

              <AuthInput
                name="email"
                placeholder="Email Address*"
                rightElement={<FiMail />}
              />

              <AuthInput name="phone" placeholder="Phone Number*" />

              <AuthInput
                name="password"
                type="password"
                placeholder="Password*"
              />

              <AuthInput
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password*"
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
                  <option value="Ibadan">Ibadan</option>
                  <option value="Lekki, Lagos">Lekki, Lagos</option>
                  <option value="Yaba, Lagos">Yaba, Lagos</option>
                  <option value="Abuja">Abuja</option>
                </Select>
              </Box>
            </SimpleGrid>

            <HStack justifyContent="flex-end" w="full" mt={10}>
              <Button
                h="3.5rem"
                type="submit"
                disabled={formik.isSubmitting || !formik.isValid}
                isLoading={formik.isSubmitting}
                px={16}
              >
                Next
              </Button>
            </HStack>
          </VStack>
        </form>
      )}
    </Formik>
  )
}
