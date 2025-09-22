import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Input,
  Text,
  VStack,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react'
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth'
import { Formik } from 'formik'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'
import { portalAuth } from '../../../portalFirebaseConfig'
import { FiEye, FiEyeOff } from 'react-icons/fi'

interface ResetValues {
  password: string
  confirmPassword: string
}

const schema = Yup.object({
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Minimum 8 characters'),
  confirmPassword: Yup.string()
    .required('Confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
})

export function ResetPasswordForm() {
  const router = useRouter()
  const toast = useToast()
  const [oobCode, setOobCode] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(true)

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    if (!router.isReady) return

    const queryCode = router.query.oobCode
    const code = typeof queryCode === 'string' ? queryCode : null

    if (!code) {
      setError('Invalid reset link')
      setIsVerifying(false)
      return
    }

    setOobCode(code)
    ;(async () => {
      try {
        const emailAddress = await verifyPasswordResetCode(portalAuth, code)
        setEmail(emailAddress)
      } catch (e: any) {
        setError('Reset link is invalid or expired')
      } finally {
        setIsVerifying(false)
      }
    })()
  }, [router.isReady, router.query.oobCode])

  if (isVerifying) return <Text>Verifying reset link...</Text>

  if (error)
    return (
      <Alert status="error" borderRadius="md">
        <AlertIcon />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )

  return (
    <Formik<ResetValues>
      initialValues={{ password: '', confirmPassword: '' }}
      validationSchema={schema}
      onSubmit={async (values, actions) => {
        if (!oobCode) return
        try {
          await confirmPasswordReset(portalAuth, oobCode, values.password)
          toast({
            title: 'Password updated',
            description: 'You can now log in with your new password.',
            status: 'success',
            duration: 5000,
            isClosable: true,
            position: 'top',
          })
          router.push('/portal/login')
        } catch (e: any) {
          toast({
            title: 'Error',
            description:
              'Could not update password. Try requesting a new link.',
            status: 'error',
            duration: 6000,
            isClosable: true,
            position: 'top',
          })
        } finally {
          actions.setSubmitting(false)
        }
      }}
    >
      {(formik) => (
        <VStack
          as="form"
          mt={12}
          alignItems="flex-start"
          spacing={4}
          w="full"
          onSubmit={(e) => {
            e.preventDefault()
            formik.handleSubmit()
          }}
        >
          <Box w="full">
            <Text fontSize="sm" color="brand.dark.50">
              NEW PASSWORD
            </Text>
            <InputGroup>
              <Input
                w="full"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <InputRightElement>
                <IconButton
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  icon={showPassword ? <FiEyeOff /> : <FiEye />}
                  h="1.75rem"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                  variant="ghost"
                  color="gray.500"
                  bg="transparent"
                />
              </InputRightElement>
            </InputGroup>
            {formik.touched.password && formik.errors.password ? (
              <Text color="red.500" fontSize="sm">
                {formik.errors.password}
              </Text>
            ) : null}
          </Box>
          <Box w="full">
            <Text fontSize="sm" color="brand.dark.50">
              CONFIRM PASSWORD
            </Text>
            <InputGroup>
              <Input
                w="full"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <InputRightElement>
                <IconButton
                  aria-label={
                    showConfirmPassword ? 'Hide password' : 'Show password'
                  }
                  icon={showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                  h="1.75rem"
                  size="sm"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  variant="ghost"
                  color="gray.500"
                  bg="transparent"
                />
              </InputRightElement>
            </InputGroup>
            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
              <Text color="red.500" fontSize="sm">
                {formik.errors.confirmPassword}
              </Text>
            ) : null}
          </Box>
          <Button
            type="submit"
            isLoading={formik.isSubmitting}
            w="full"
            h="3.5rem"
            colorScheme="yellow"
          >
            Update password
          </Button>
        </VStack>
      )}
    </Formik>
  )
}

export default ResetPasswordForm
