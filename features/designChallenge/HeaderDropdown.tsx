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
        {/* <Link onClick={() => setShowDropdown(false)} href="/challenge">
          <Text fontSize="xl">About</Text>
        </Link> */}
        <Link onClick={() => setShowDropdown(false)} href="/challenge/#instructions">
          <Text fontSize="xl">How It Works</Text>
        </Link>
        <Link onClick={() => setShowDropdown(false)} href="/challenge/#prizes">
          <Text fontSize="xl">Prizes</Text>
        </Link>
        <Link onClick={() => setShowDropdown(false)} href="/challenge/#winners">
          <Text fontSize="xl">Winners</Text>
        </Link>
        {/* change button content */}
        {/* <Link onClick={() => setShowDropdown(false)} href="/challenge/#join">
          <Button>Join the Challenge</Button>
        </Link> */}
      </Flex>
    </Center>
  )
}

export default HeaderDropdown
