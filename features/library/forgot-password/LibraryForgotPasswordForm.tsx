import {
  Box,
  Button,
  Center,
  Input,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { sendPasswordResetEmail } from 'firebase/auth'
import { Formik } from 'formik'
import React, { useState } from 'react'
import * as Yup from 'yup'
import { auth } from '../../../firebaseConfig'
import { useRouter } from 'next/router'
import Link from 'next/link'

const LibraryForgotPasswordForm = () => {
  const [loading, setLoading] = useState(false)

  const toast = useToast()

  const router = useRouter()

  return (
    <>
      <Formik
        initialValues={{
          email: '',
        }}
        validationSchema={Yup.object({
          email: Yup.string()
            .email('Invalid email address')
            .required('Email is required'),
        })}
        onSubmit={async (values, actions) => {
          setLoading(true)

          try {
            // Configure action code settings
            const actionCodeSettings = {
              // URL you want to redirect back to after password reset is complete
              url: window.location.origin + '/library/login',
              // This must be true for mobile apps
              handleCodeInApp: false,
            }
            // Send password reset email with redirect URL
            await sendPasswordResetEmail(auth, values.email, actionCodeSettings)
            toast({
              title: 'Password Reset Email Sent',
              description:
                'Please check your email for instructions to reset your password.',
              status: 'success',
              duration: 5000,
              isClosable: true,
            })
            actions.resetForm()
          } catch (error: any) {
            console.error('Error sending password reset email:', error.message)
            let errorMessage =
              'Failed to send password reset email. Please try again.'
            if (error.code === 'auth/user-not-found') {
              errorMessage = 'No user found with this email address.'
            }
            toast({
              title: 'Error',
              description: errorMessage,
              status: 'error',
              duration: 5000,
              isClosable: true,
            })
          } finally {
            setLoading(false)
          }
        }}
      >
        {(formik) => (
          <VStack
            spacing={'1.5rem'}
            w="full"
            mt={6}
            alignItems="flex-start"
            as="form"
            onSubmit={(event) => {
              event.preventDefault()
              formik.handleSubmit()
            }}
          >
            <Box w="full">
              <Text fontSize="small" color="brand.dark.50">
                EMAIL ADDRESS
              </Text>
              <Input
                h={['3rem', '3.5rem']}
                placeholder="EMAIL ADDRESS"
                _placeholder={{ color: 'brand.dark.50' }}
                name="email"
                border="1px solid #000"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                borderColor={
                  formik.touched.email && formik.errors.email
                    ? 'red.500'
                    : 'brand.yellow.500'
                }
                _focusVisible={{
                  outline: 'none',
                }}
              />
              {formik.touched.email && formik.errors.email ? (
                <Text color="red.500" fontSize="sm">
                  {formik.errors.email}
                </Text>
              ) : null}
            </Box>

            <Button
              h="3.688rem"
              w="full"
              type="submit"
              isLoading={loading || formik.isSubmitting}
              bg="brand.yellow.500"
            >
              Forgot Password
            </Button>

            <Center gap={1}>
              <Text fontSize="">Remember Password? </Text>
              <Link href="/library/login">
                <Text fontWeight={600}>Login</Text>
              </Link>
            </Center>
          </VStack>
        )}
      </Formik>
    </>
  )
}

export default LibraryForgotPasswordForm
