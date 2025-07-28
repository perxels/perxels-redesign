import { Box, Button, Checkbox, Heading, HStack, Text, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePortalAuth } from '../../../hooks/usePortalAuth'

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

      // Update terms agreement status via API
      const response = await fetch('/api/update-terms-agreement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid,
          termsAgreed: true,
        }),
      })

      const result = await response.json()
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to update terms agreement')
      }

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
          fontSize={["5xl", "7xl"]}
          fontFamily="Proxima Nova"
          fontWeight="bold"
          color="brand.dark.100"
        >
          Welcome to Perxels
        </Heading>

        <Text
          fontSize={["lg", "xl"]}
          fontFamily="Proxima Nova"
          fontWeight="normal"
          color="gray.600"
          my={8}
          lineHeight={1.5}
        >
          To safeguard your account and personal information, we require BVN
          verification during registration. Rest assured that your BVN is safe
          with us. We have implemented strict security measures to protect your
          personal and financial information.
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
            fontSize={["lg", "2xl"]}
            fontFamily="Proxima Nova"
            fontWeight="normal"
            color="black"
            ml={4}
          >
            Accept Terms and Condition
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
