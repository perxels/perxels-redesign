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
        <Link onClick={() => setShowDropdown(false)} href="#">
          <Text fontSize="xl">Testimonies</Text>
        </Link>
        <Link onClick={() => setShowDropdown(false)} href="#">
          <Text fontSize="xl">Student Works</Text>
        </Link>
        <Link onClick={() => setShowDropdown(false)} href="#">
          <Text fontSize="xl">Events</Text>
        </Link>
        <Link onClick={() => setShowDropdown(false)} href="#">
          <Text fontSize="xl">Hire</Text>
        </Link>

        <Button onClick={() => setShowDropdown(false)}>View Class Plans</Button>
      </Flex>
    </Center>
  )
}

export default HeaderDropdown
