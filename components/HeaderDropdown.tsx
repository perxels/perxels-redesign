import { Box, Button, Center, Flex, Text } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'

const HeaderDropdown = ({ setShowDropdown }: { setShowDropdown: any }) => {
  return (
    <Center w="full" h="calc(100vh - 4rem)" bg="brand.white">
      <Flex alignItems="center" gap="3rem" flexDir="column">
        <Link onClick={() => setShowDropdown(false)} href="/">
          <Text fontSize="xl">Home</Text>
        </Link>
        <Link onClick={() => setShowDropdown(false)} href="/testimonials">
          <Text fontSize="xl">Testimonials</Text>
        </Link>
        <Link onClick={() => setShowDropdown(false)} href="/studentprojects">
          <Text fontSize="xl">Student Projects</Text>
        </Link>
        <Link onClick={() => setShowDropdown(false)} href="/event">
          <Text fontSize="xl">Events</Text>
        </Link>
        <Link onClick={() => setShowDropdown(false)} href="/partners">
          <Text fontSize="xl">Be a Partner</Text>
        </Link>
        <Link onClick={() => setShowDropdown(false)} href="/hub">
          <Text fontSize="xl">Hub</Text>
        </Link>
        {/* change button content */}
        <Link onClick={() => setShowDropdown(false)} href="/enrol">
          <Button>View Class Plans</Button>
        </Link>
      </Flex>
    </Center>
  )
}

export default HeaderDropdown
