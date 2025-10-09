import {
  Box,
  Button,
  HStack,
  SimpleGrid,
  VStack,
  useToast,
  Text,
  Alert,
  AlertIcon,
  AlertDescription,
} from '@chakra-ui/react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import React, { useState } from 'react'
import { FiLock, FiMail } from 'react-icons/fi'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { useRouter } from 'next/router'
import { portalAuth, portalDb } from '../../../portalFirebaseConfig'
import { auth, db } from '../../../firebaseConfig'
import { getRedirectPath } from '../../../lib/utils/portal-auth.utils'
import { handleFirebaseAuthError } from '../../../lib/utils/auth.utils'
import { AuthInput } from './auth-input'

interface LoginFormValues {
  email: string
  password: string
}

const formSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required')
    .matches(
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      'Please enter a valid email format',
    )
    .lowercase()
    .trim(),

  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(50, 'Password must not exceed 50 characters')
    .trim(),
})

export const LoginForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)
  const router = useRouter()
  const toast = useToast()

  const handleLogin = async (values: LoginFormValues) => {
    setIsSubmitting(true)
    setLoginError(null)

    try {
      // Sanitize email
      const email = values.email.toLowerCase().trim()

      // First, try portal authentication (primary use case)
      try {
        const portalCredential = await signInWithEmailAndPassword(
          portalAuth,
          email,
          values.password,
        )

        // Get user data from portal database
        const portalUserDoc = await getDoc(
          doc(portalDb, 'users', portalCredential.user.uid),
        )

        if (portalUserDoc.exists()) {
          const portalUserData = portalUserDoc.data()

          // Handle portal student user
          if (portalUserData?.role === 'student') {
            toast({
              title: 'Login successful! 🎉',
              description: 'Welcome back to your portal',
              status: 'success',
              duration: 5000,
              isClosable: true,
              position: 'top',
            })

            // Determine next step in onboarding process
            const redirectPath = getRedirectPath(portalUserData as any, email)
            router.push(redirectPath)
            return
          }

          // Handle admin user
          if (portalUserData?.role === 'admin') {
            router.push('/portal/admin/overview')
            return
          }

          // Handle facilitator user - NEW
          if (portalUserData?.role === 'facilitator') {
            toast({
              title: 'Login successful! 🎉',
              description: 'Welcome to facilitator dashboard',
              status: 'success',
              duration: 5000,
              isClosable: true,
              position: 'top',
            })
            router.push('/portal/facilitator/dashboard')
            return
          }
        }
      } catch (portalError: any) {
        // Portal auth failed, try regular auth for admin/library users
        // Silently continue to regular auth
      }
    } catch (error: any) {
      console.error('Login error:', error)

      const { message } = handleFirebaseAuthError(error)
      setLoginError(message)

      toast({
        title: 'Login Failed',
        description: message,
        status: 'error',
        duration: 6000,
        isClosable: true,
        position: 'top',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Box w="100%" h="full" minH="calc(100vh - 24rem)">
      {loginError && (
        <Alert status="error" mb={6} borderRadius="md">
          <AlertIcon />
          <AlertDescription>{loginError}</AlertDescription>
        </Alert>
      )}

      <Formik<LoginFormValues>
        initialValues={{
          email: '',
          password: '',
        }}
        validationSchema={formSchema}
        onSubmit={handleLogin}
        validateOnChange={true}
        validateOnBlur={true}
      >
        {(formik) => (
          <form
            onSubmit={formik.handleSubmit}
            style={{
              width: '100%',
              height: '100%',
              minHeight: 'calc(100vh - 24rem)',
            }}
          >
            <VStack
              w="full"
              h="100%"
              minH="calc(100vh - 24rem)"
              alignItems="flex-start"
              justifyContent="space-between"
              spacing={6}
            >
              <Box w="100%" />

              <SimpleGrid
                columns={[1, 1, 1, 3]}
                spacing={10}
                w="full"
                // maxW="750px"
              >
                <AuthInput
                  name="email"
                  placeholder="Email Address*"
                  rightElement={<FiMail />}
                  isDisabled={isSubmitting}
                />

                <AuthInput
                  name="password"
                  type="password"
                  placeholder="Password*"
                  rightElement={<FiLock />}
                  isDisabled={isSubmitting}
                />
              </SimpleGrid>

              <HStack
                w="full"
                justifyContent="space-between"
                alignItems="center"
              >
                <Text
                  fontSize="sm"
                  color="yellow.600"
                  cursor="pointer"
                  onClick={() => router.push('/portal/forgot-password')}
                >
                  Forgot password?
                </Text>
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  loadingText="Signing in..."
                  w="full"
                  h="48px"
                  maxW="300px"
                  disabled={!formik.isValid || !formik.dirty || isSubmitting}
                  colorScheme="yellow"
                  _hover={{
                    transform: 'translateY(-1px)',
                    boxShadow: 'lg',
                  }}
                  transition="all 0.2s"
                >
                  {isSubmitting ? 'Signing in...' : 'Login'}
                </Button>
              </HStack>

              {/* Quick help text */}
              <VStack w="full" spacing={2} mt={4}>
                <Text fontSize="sm" color="gray.600" textAlign="center">
                  Don&apos;t have an account?{' '}
                  <Text
                    as="span"
                    color="yellow.600"
                    cursor="pointer"
                    onClick={() => router.push('/portal/signup')}
                  >
                    Sign up here
                  </Text>
                </Text>
              </VStack>
            </VStack>
          </form>
        )}
      </Formik>
    </Box>
  )
}
