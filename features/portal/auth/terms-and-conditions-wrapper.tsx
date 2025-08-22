import {
  Box,
  Button,
  Checkbox,
  Heading,
  HStack,
  Text,
  useToast,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePortalAuth } from '../../../hooks/usePortalAuth'
import { doc, updateDoc, getDoc } from 'firebase/firestore'
import { portalDb } from '../../../portalFirebaseConfig'

export const TermsAndConditionsWrapper = () => {
  const [isAccepted, setIsAccepted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const toast = useToast()
  const { user } = usePortalAuth()

  const handleContinue = async () => {
    if (!isAccepted) return

    setIsSubmitting(true)

    try {
      // Get user UID from Firebase Auth
      const uid = user?.uid
      if (!uid) {
        throw new Error('User not authenticated. Please log in again.')
      }

      // Verify user exists in Firestore
      const userDoc = await getDoc(doc(portalDb, 'users', uid))
      if (!userDoc.exists()) {
        throw new Error('User not found. Please log in again.')
      }

      // Update user document with terms agreement status directly in Firestore
      await updateDoc(doc(portalDb, 'users', uid), {
        termsAgreed: true,
        termsAgreedAt: new Date(),
        // Mark onboarding as fully complete
        onboardingComplete: true,
        onboardingCompletedAt: new Date(),
      })

      // Show success message
      toast({
        title: 'Welcome to Perxels Portal! 🎉',
        description: 'Your registration is now complete.',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top',
      })

      // Clear session storage as registration is complete
      sessionStorage.removeItem('signupEmail')
      sessionStorage.removeItem('signupUID')

      // Redirect to portal dashboard
      router.push('/portal/dashboard')
    } catch (error: any) {
      console.error('Terms agreement error:', error)

      let errorMessage = 'Failed to complete registration. Please try again.'
      if (error.message.includes('session')) {
        errorMessage = error.message
      }

      toast({
        title: 'Registration Failed',
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
    <Box w="100%" h="full">
      <Box maxW="750px">
        <Heading
          as="h1"
          fontSize={['5xl', '7xl']}
          fontFamily="Proxima Nova"
          fontWeight="bold"
          color="brand.dark.100"
        >
          Welcome to Perxels
        </Heading>

        <Text
          fontSize={['lg', 'xl']}
          fontFamily="Proxima Nova"
          fontWeight="normal"
          color="gray.600"
          my={8}
          lineHeight={1.5}
        >
          We&apos;re excited to have you join us on your journey to becoming a
          world-class UI/UX designer. At Perxels, we specialize in training and
          mentoring aspiring designers—whether you&apos;re just starting out or
          have no prior experience, you&apos;re in the right place. <br />
          <br />
          This portal will serve as your personal dashboard. Here, you&apos;ll
          find all your class updates, video lessons, attendance records,
          payment details, and more—everything you need in one place to track
          your learning journey. <br />
          <br />
          <span className="font-bold">Our Promise:</span>
          <br />
          At Perxels, we’re committed to giving our very best to ensure you have
          an impactful and rewarding learning experience. In return, we ask that
          you also give your best—show up, stay curious, and stay consistent.
          Together, we’ll achieve great success.
        </Text>
      </Box>

      <Box mt={16} mb={12}>
        <Checkbox
          isChecked={isAccepted}
          onChange={(e) => setIsAccepted(e.target.checked)}
          size="lg"
          colorScheme="blackAlpha"
          sx={{
            '.chakra-checkbox__control': {
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              borderWidth: '2px',
              borderColor: isAccepted ? 'black' : 'gray.400',
              bg: isAccepted ? 'black' : 'transparent',
              _checked: {
                bg: 'black',
                borderColor: 'black',
                color: 'white',
              },
              _hover: {
                borderColor: 'black',
              },
            },
            '.chakra-checkbox__icon': {
              fontSize: '16px',
              color: 'white',
            },
          }}
        >
          <Text
            fontSize={['lg', '2xl']}
            fontFamily="Proxima Nova"
            fontWeight="normal"
            color="black"
            ml={4}
          >
            I pledge to put my best into the training
          </Text>
        </Checkbox>
      </Box>

      <HStack justifyContent="flex-end" w="full" mt={10}>
        <Button
          h="3.5rem"
          type="button"
          px={16}
          isDisabled={!isAccepted || isSubmitting}
          isLoading={isSubmitting}
          onClick={handleContinue}
          bg={isAccepted && !isSubmitting ? 'brand.purple.500' : 'gray.300'}
          color={isAccepted && !isSubmitting ? 'white' : 'gray.500'}
          _hover={{
            bg: isAccepted && !isSubmitting ? 'brand.purple.600' : 'gray.300',
          }}
          _disabled={{
            bg: 'gray.300',
            color: 'gray.500',
            cursor: 'not-allowed',
          }}
        >
          I understand
        </Button>
      </HStack>
    </Box>
  )
}
