import { Box, Button, Center, Flex, Text } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'

const HeaderDropdown = ({ setShowDropdown }: { setShowDropdown: any }) => {
  return (
    <Center w="full" h="calc(100vh - 4rem)" bg="brand.white">
      <Flex alignItems="center" gap="4.375rem" flexDir="column">
        <Link onClick={() => setShowDropdown(false)} href="/">
          <Text fontSize="xl">Home</Text>
        </Link>
        <Link onClick={() => setShowDropdown(false)} href="/design-challenge">
          <Text fontSize="xl">About</Text>
        </Link>
        <Link onClick={() => setShowDropdown(false)} href="/design-challenge/#instructions">
          <Text fontSize="xl">How It Works</Text>
        </Link>
        <Link onClick={() => setShowDropdown(false)} href="/design-challenge/#prizes">
          <Text fontSize="xl">Prizes</Text>
        </Link>
        <Link onClick={() => setShowDropdown(false)} href="/design-challenge/#submission">
          <Text fontSize="xl">Submission</Text>
        </Link>
        {/* change button content */}
        <Link onClick={() => setShowDropdown(false)} href="/design-challenge/#join">
          <Button>Join the Challenge</Button>
        </Link>
      </Flex>
    </Center>
  )
}

export default HeaderDropdown
