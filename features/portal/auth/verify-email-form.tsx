import {
  Button,
  HStack,
  PinInput,
  PinInputField,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react'
import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { portalAuth } from '../../../portalFirebaseConfig'
import { usePortalAuth } from '../../../hooks/usePortalAuth'
import { useEmailVerification } from '../../../hooks/useEmailVerification'
// import { AuthDebugInfo } from '../../../components/AuthDebugInfo'

export const VerifyEmailForm = () => {
  const [otp, setOtp] = useState('')
  const [isResending, setIsResending] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const toast = useToast()
  const { user, portalUser } = usePortalAuth()
  const { verifyEmail, isLoading } = useEmailVerification()

  // Get email from URL params first, then fall back to authenticated user
  const urlEmail = searchParams.get('email') || ''
  const userEmail = user?.email || portalUser?.email || ''
  const email = urlEmail || userEmail

  useEffect(() => {
    // Check if user is authenticated first
    const currentUser = portalAuth.currentUser
    if (!currentUser) {
      console.warn('No authenticated user found during verification')
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to verify your email.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      })
      router.push('/portal/signup')
      return
    }

    // If no email is available (neither from URL nor from authenticated user)
    if (!email) {
      toast({
        title: 'Error',
        description: 'Email not found. Please try signing up again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      router.push('/portal/signup')
      return
    }
  }, [email, router, toast])

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast({
        title: 'Error',
        description: 'Please enter a 6-digit verification code',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    // Check if user is still authenticated
    const currentUser = portalAuth.currentUser
    if (!currentUser) {
      toast({
        title: 'Authentication Error',
        description: 'You have been logged out. Please sign in again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      router.push('/portal/signup')
      return
    }

    try {
      // Use the client-side email verification hook
      const result = await verifyEmail({
        email,
        otp,
        uid: currentUser.uid,
      })

      if (result.success) {
        // Refresh the user's token to get updated emailVerified status
        await currentUser.reload()

        toast({
          title: 'Email Verified! ✅',
          description: 'Your email has been successfully verified.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        })

        // Redirect to school fee info
        router.push('/portal/school-fee-info')
      } else {
        throw new Error(result.error || 'Verification failed')
      }
    } catch (error) {
      console.error('Verification error:', error)
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Verification failed',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const handleResendCode = async () => {
    setIsResending(true)

    try {
      // Check if user is still authenticated
      const currentUser = portalAuth.currentUser
      if (!currentUser) {
        toast({
          title: 'Authentication Error',
          description: 'You have been logged out. Please sign in again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
        router.push('/portal/signup')
        return
      }

      // Resend OTP for existing account using dedicated API route
      const response = await fetch('/api/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to resend code')
      }

      toast({
        title: 'New code sent! 📧',
        description: 'Please check your email for the new verification code',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    } catch (error) {
      console.error('Resend error:', error)
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to resend code',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsResending(false)
    }
  }

  return (
    <VStack alignItems="flex-start" mt={10}>
      {/* <AuthDebugInfo /> */}
      <Text fontSize="md" color="gray.600" mb={4}>
        Enter the 6-digit verification code
      </Text>

      <HStack gap={[5, 12]}>
        <PinInput
          size="lg"
          otp
          type="number"
          autoFocus
          value={otp}
          onChange={setOtp}
        >
          <PinInputField
            h={["2.5rem", "5rem"]}
            w={["2.5rem", "5rem"]}
            fontSize="2xl"
            fontWeight="bold"
            color="brand.dark.100"
            border="none"
            borderBottom="solid"
            borderBottomWidth={4}
            rounded="none"
            borderBottomColor="gray.500"
            _focus={{
              borderColor: 'none',
              outline: 'none',
              borderBottomColor: 'yellow.400',
            }}
            _hover={{
              borderColor: 'none',
              outline: 'none',
              borderBottomColor: 'yellow.400',
            }}
            _focusVisible={{
              outline: 'none',
            }}
            _active={{
              outline: 'none',
            }}
          />
          <PinInputField
            h={["2.5rem", "5rem"]}
            w={["2.5rem", "5rem"]}
            fontSize="2xl"
            fontWeight="bold"
            color="brand.dark.100"
            border="none"
            borderBottom="solid"
            borderBottomWidth={4}
            rounded="none"
            borderBottomColor="gray.500"
            _focus={{
              borderColor: 'none',
              outline: 'none',
              borderBottomColor: 'yellow.400',
            }}
            _hover={{
              borderColor: 'none',
              outline: 'none',
              borderBottomColor: 'yellow.400',
            }}
            _focusVisible={{
              outline: 'none',
            }}
            _active={{
              outline: 'none',
            }}
          />
          <PinInputField
            h={["2.5rem", "5rem"]}
            w={["2.5rem", "5rem"]}
            fontSize="2xl"
            fontWeight="bold"
            color="brand.dark.100"
            border="none"
            borderBottom="solid"
            borderBottomWidth={4}
            rounded="none"
            borderBottomColor="gray.500"
            _focus={{
              borderColor: 'none',
              outline: 'none',
              borderBottomColor: 'yellow.400',
            }}
            _hover={{
              borderColor: 'none',
              outline: 'none',
              borderBottomColor: 'yellow.400',
            }}
            _focusVisible={{
              outline: 'none',
            }}
            _active={{
              outline: 'none',
            }}
          />
          <PinInputField
            h={["2.5rem", "5rem"]}
            w={["2.5rem", "5rem"]}
            fontSize="2xl"
            fontWeight="bold"
            color="brand.dark.100"
            border="none"
            borderBottom="solid"
            borderBottomWidth={4}
            rounded="none"
            borderBottomColor="gray.500"
            _focus={{
              borderColor: 'none',
              outline: 'none',
              borderBottomColor: 'yellow.400',
            }}
            _hover={{
              borderColor: 'none',
              outline: 'none',
              borderBottomColor: 'yellow.400',
            }}
            _focusVisible={{
              outline: 'none',
            }}
            _active={{
              outline: 'none',
            }}
          />
          <PinInputField
            h={["2.5rem", "5rem"]}
            w={["2.5rem", "5rem"]}
            fontSize="2xl"
            fontWeight="bold"
            color="brand.dark.100"
            border="none"
            borderBottom="solid"
            borderBottomWidth={4}
            rounded="none"
            borderBottomColor="gray.500"
            _focus={{
              borderColor: 'none',
              outline: 'none',
              borderBottomColor: 'yellow.400',
            }}
            _hover={{
              borderColor: 'none',
              outline: 'none',
              borderBottomColor: 'yellow.400',
            }}
            _focusVisible={{
              outline: 'none',
            }}
            _active={{
              outline: 'none',
            }}
          />
          <PinInputField
            h={["2.5rem", "5rem"]}
            w={["2.5rem", "5rem"]}
            fontSize="2xl"
            fontWeight="bold"
            color="brand.dark.100"
            border="none"
            borderBottom="solid"
            borderBottomWidth={4}
            rounded="none"
            borderBottomColor="gray.500"
            _focus={{
              borderColor: 'none',
              outline: 'none',
              borderBottomColor: 'yellow.400',
            }}
            _hover={{
              borderColor: 'none',
              outline: 'none',
              borderBottomColor: 'yellow.400',
            }}
            _focusVisible={{
              outline: 'none',
            }}
            _active={{
              outline: 'none',
            }}
          />
        </PinInput>
      </HStack>

      <Text fontSize="lg" color="brand.dark.100" py={12}>
        Didn&apos;t receive the code?{' '}
        <Text
          as="button"
          onClick={handleResendCode}
          color="brand.dark.100"
          fontWeight="bold"
          textDecoration="underline"
          disabled={isResending}
          cursor={isResending ? 'not-allowed' : 'pointer'}
          opacity={isResending ? 0.6 : 1}
        >
          {isResending ? 'Resending...' : 'Resend code'}
        </Text>
      </Text>

      <HStack justifyContent="flex-end" w="full" mt={10}>
        <Button
          h="3.5rem"
          type="button"
          disabled={otp.length !== 6 || isLoading}
          isLoading={isLoading}
          loadingText="Verifying..."
          onClick={handleVerifyOTP}
          px={16}
          colorScheme="yellow"
        >
          {isLoading ? 'Verifying...' : 'Verify Email'}
        </Button>
      </HStack>
    </VStack>
  )
}
