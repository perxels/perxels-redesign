import React from 'react'
import { Box, Heading, Text, Button, Flex } from '@chakra-ui/react'
import { AiOutlineRightCircle } from 'react-icons/ai'

export const ClassHire = () => {
  return (
    <Box
      px={{ base: 4, md: 32 }}
      py={{ base: 20, md: 32 }}
      bgColor={'#FDE85C'}
    >
      <Flex
        alignItems={{ base: 'flex-start', md: 'center' }}
        flexDirection={{ base: 'column', md: 'row' }}
        justifyContent="space-between"
        gap={{ base: '2.5rem', md: 0 }}
      >
        <Box>
          <Heading
            as="h2"
            fontSize={{ base: '2.5rem', md: '4.5rem' }}
            maxWidth={{ base: '100%', md: '75%' }}
            textTransform="uppercase"
            color="#121212"
          >
            Get Access to high-performing design talents.
          </Heading>
        </Box>
        <Box>
          <Button
            color="brand.white"
            bgColor="brand.dark.200"
            fontSize={{ base: '1.125rem', md: '1.25rem' }}
            p={{ base: '1.5rem 2.5rem', md: '2.25rem 2.5rem' }}
            _hover={{ bgColor: 'brand.dark.300' }}
          >
            Hire our Grads
            <Text fontSize={'1.5rem'} ml="1.1875rem">
              <AiOutlineRightCircle />
            </Text>
          </Button>
        </Box>
      </Flex>
    </Box>
  )
}
