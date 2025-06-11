import {
  Button,
  HStack,
  PinInput,
  PinInputField,
  Text,
  VStack,
} from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'

export const VerifyEmailForm = () => {
  return (
    <VStack alignItems="flex-start" mt={10}>
      <HStack gap={12}>
        <PinInput size="lg" otp type="number" autoFocus>
          <PinInputField
            h="5rem"
            w="5rem"
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
            h="5rem"
            w="5rem"
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
            h="5rem"
            w="5rem"
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
            h="5rem"
            w="5rem"
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
          as={Link}
          href="/portal/verify"
          color="brand.dark.100"
          fontWeight="bold"
        >
          Resend code
        </Text>
      </Text>

      <HStack justifyContent="flex-end" w="full" mt={10}>
        <Button
          h="3.5rem"
          type="button"
          //   disabled={formik.isSubmitting || !formik.isValid}
          //   isLoading={formik.isSubmitting}
          px={16}
        >
          Next
        </Button>
      </HStack>
    </VStack>
  )
}
