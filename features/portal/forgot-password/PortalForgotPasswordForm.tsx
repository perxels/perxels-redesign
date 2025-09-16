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
import { portalAuth } from '../../../portalFirebaseConfig'
import { useRouter } from 'next/router'
import Link from 'next/link'

export function PortalForgotPasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
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
            .required('Email is required')
            .trim()
            .lowercase(),
        })}
        onSubmit={async (values, actions) => {
          setIsSubmitting(true)
          try {
            const email = values.email.trim().toLowerCase()

            const actionCodeSettings = {
              url: window.location.origin + '/portal/reset-password',
              handleCodeInApp: true,
            }

            await sendPasswordResetEmail(portalAuth, email, actionCodeSettings as any)

            toast({
              title: 'Password reset email sent',
              description:
                'Open the email on this device to finish resetting in-app.',
              status: 'success',
              duration: 5000,
              isClosable: true,
              position: 'top',
            })
            actions.resetForm()
          } catch (error: any) {
            let description = 'Failed to send reset email. Please try again.'
            if (error?.code === 'auth/user-not-found') description = 'No user found with this email.'
            if (error?.code === 'auth/invalid-email') description = 'Please enter a valid email.'

            toast({
              title: 'Error',
              description,
              status: 'error',
              duration: 6000,
              isClosable: true,
              position: 'top',
            })
          } finally {
            setIsSubmitting(false)
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
              isLoading={isSubmitting || formik.isSubmitting}
            >
              Send reset link
            </Button>

            <Center w="full" gap={1}>
              <Text>Remembered your password?</Text>
              <Link href="/portal/login">
                <Text fontWeight={600}>Login</Text>
              </Link>
            </Center>
          </VStack>
        )}
      </Formik>
    </>
  )
}

export default PortalForgotPasswordForm


