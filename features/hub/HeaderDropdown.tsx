import { Box, Button, Center, Flex, Text } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'

const HeaderDropdown = ({ setShowDropdown }: { setShowDropdown: any }) => {
  return (
    <Center w="full" h="calc(100vh - 4rem)" bg="brand.white">
      <Flex alignItems="center" gap="3rem" flexDir="column">
        <Link onClick={() => setShowDropdown(false)} href="/hub#workspace">
          <Text fontSize="xl">Workspace</Text>
        </Link>
        <Link onClick={() => setShowDropdown(false)} href="/hub#location">
          <Text fontSize="xl">Location</Text>
        </Link>
        <Link onClick={() => setShowDropdown(false)} href="/hub#location">
          <Text fontSize="xl">Contact</Text>
        </Link>
        <Link onClick={() => setShowDropdown(false)} href="/partners">
          <Text fontSize="xl">Be a Partner</Text>
        </Link>
        {/* change button content */}
        <Link onClick={() => setShowDropdown(false)} href="/hub#bookspace">
          <Button>Book a Space</Button>
        </Link>
      </Flex>
    </Center>
  )
}

export default HeaderDropdown
