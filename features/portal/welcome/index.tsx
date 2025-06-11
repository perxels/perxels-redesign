import { Button, Center, Heading } from '@chakra-ui/react'
import React from 'react'
import { Logo } from '../../../components'
import Link from 'next/link'

interface WelcomePortalProps {
  type: 'student' | 'admin'
}

export const WelcomePortal = ({ type }: WelcomePortalProps) => {
  return (
    <Center flexDir="column" gap={16} h="100vh" w="100vw">
      <Logo />

      <Heading
        mt={24}
        as="h3"
        fontSize="9xl"
        color="brand.dark.100"
        fontWeight="bold"
      >
        Perxels Portal
      </Heading>

      <Center gap={4}>
        {type === 'student' && (
          <Button as={Link} href="/portal/signup" px={16} rounded="full">
            Sign Up
          </Button>
        )}
        <Button
          as={Link}
          href={type === 'admin' ? '/portal/admin/login' : '/portal/login'}
          variant={type === 'admin' ? 'solid' : 'outline'}
          px={16}
          rounded="full"
        >
          Log in
        </Button>
      </Center>
    </Center>
  )
}
