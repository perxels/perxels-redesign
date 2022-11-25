import React from 'react'
import {
  Box,
  Text,
  Flex,
  Image,
  Heading,
  VStack,
  HStack,
  Center,
  Button,
} from '@chakra-ui/react'
import { AiOutlineRightCircle } from 'react-icons/ai'
export const EventCommunity = () => {
  return (
    <Box p={{ base: '1.25rem 1.5625rem', md: '5.25rem 6.35rem' }}>
      <Box
        bg={{
          base: `linear-gradient(360deg, #000000 23.68%, rgba(0, 0, 0, 0) 106.41%),url(assets/images/events/communitymobile.png) center/cover no-repeat`,
          lg: `linear-gradient(90deg, rgba(6, 6, 6, 0.88) 0%, rgba(6, 6, 6, 0) 133.43%),url(assets/images/events/eventscommunity.png) center/cover no-repeat`,
        }}
        w="full"
        h={{ base: 'auto', lg: '29.5rem' }}
        position="relative"
        p={{
          base: '10.3125rem 1.25rem 2.1875rem 1.25rem',
          lg: '8.3125rem 5.3125rem',
        }}
        borderRadius="0.625rem"
      >
        <Box>
          <Heading
            color={'brand.white'}
            fontSize={{ base: '1.705rem', md: '3.125rem' }}
            fontWeight="bold"
          >
            Join Our Free Community.
          </Heading>
          <Text
            color={'brand.white'}
            fontSize={{ base: '1.125rem', md: '1.125rem' }}
            lineHeight={{ base: '1.555625rem', md: '1.555625rem' }}
            maxWidth={{ base: '100%', md: '50%' }}
            mt={'1.25rem'}
          >
            Join our free communities made up of designers passionate about
            Design and Tech and leveraging it to solve problems.
          </Text>
          <Button
            background={'transparent'}
            border={'1px solid #FDE85C'}
            color={'brand.yellow.300'}
            mt={'1.25rem'}
          >
            Join Now
            <Text ml="0.6875rem">
              <AiOutlineRightCircle />
            </Text>
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
