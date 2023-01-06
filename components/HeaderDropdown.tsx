import { Box, Button, Center, Flex, Text } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'

const HeaderDropdown = ({
  setShowDropdown,
}: {
  setShowDropdown: any
}) => {
  return (
    <Center w="full" h="calc(100vh - 4rem)" bg="brand.white">
      <Flex alignItems="center" gap="4.375rem" flexDir="column">
        <Link onClick={() => setShowDropdown(false)} href="/">
          <Text fontSize="xl">Home</Text>
        </Link>
        <Link onClick={() => setShowDropdown(false)} href="/testimonials">
          <Text fontSize="xl">Testimonials</Text>
        </Link>
        <Link onClick={() => setShowDropdown(false)} href="/student-works">
          <Text fontSize="xl">Student Projects</Text>
        </Link>
        <Link onClick={() => setShowDropdown(false)} href="/events">
          <Text fontSize="xl">Events</Text>
        </Link>
        <Link onClick={() => setShowDropdown(false)} href="/partners">
          <Text fontSize="xl">Be a Partner</Text>
        </Link>
        {/* change button content */}
        <Link onClick={() => setShowDropdown(false)} href="/class-plans">
          <Button>View Class Plans</Button>
        </Link>
      </Flex>
    </Center>
  )
}

export default HeaderDropdown
