import React from 'react'
import { Box, Text, Heading, Center, Image } from '@chakra-ui/react'

export const Prizes = () => {
  return (
    <Box py="6.25rem">
      <Box>
        <Center>
          <Box
            bg="#E3719C"
            borderRadius={'30px'}
            padding={'1rem 1.5625rem'}
            display="flex"
            columnGap={'1rem'}
          >
            <Image src="/assets/icons/trophy.svg" alt="" />
            <Text fontSize={'18px'} fontWeight="700" color="#FFF">
              THE TASK
            </Text>
          </Box>
        </Center>
        <Heading
          textAlign="center"
          fontSize="50px"
          lineHeight={'60.9px'}
          color="#000"
          mt="20px"
        >
          Lots of amazing prizes to be won!
        </Heading>

        <Box px="20%" mt="3.0625rem">
          <Box
            position="relative"
            bgColor="#E3719C"
            py="3.75rem"
            px="1.875rem"
            rounded=".9375rem"
            mb="1.875rem"
          >
            <Box position="absolute" top="0" right="0" height="18.625rem">
              <Image
                src="/assets/images/designChallenge/prizeBg.png"
                alt="designChallenge"
              />
            </Box>
            <Box>
              <Image
                src="/assets/images/designChallenge/gold1.svg"
                alt="designChallenge"
              />
            </Box>
            <Box>
              <Heading
                fontSize="1.875rem"
                fontWeight="700"
                lineHeight="2.2837rem"
                color="brand.white"
                mt="4.625rem"
              >
                First Place - Winner 🎉
              </Heading>
              <Text
                fontSize="1.875rem"
                fontWeight="500"
                lineHeight="2.7844rem"
                color="brand.white"
                mt="1.25rem"
              >
                Gets 30, 000 Naira Cash Price! and a feature on Perxels
                spotlight.
              </Text>
            </Box>
          </Box>
          <Box display="flex" columnGap="1.875rem">
            <Box
              border="1px solid #D2D2D2"
              rounded=".9375rem"
              px="2.125rem"
              py="2.5rem"
              width={['100%', '50%']}
            >
              <Box>
                <Image
                  src="/assets/images/designChallenge/gold2.svg"
                  alt="designChallenge"
                />
              </Box>
              <Heading
                fontSize="1.875rem"
                fontWeight="700"
                lineHeight="2.6812rem"
                color="#000"
                mt="4.625rem"
              >
                Second Place
              </Heading>
              <Text
                fontSize="1.875rem"
                fontWeight="500"
                lineHeight="2.7844rem"
                color="#555555"
                mt="1.25rem"
              >
                Gets 30, 000 Naira Cash Price! and a feature on Perxels
                spotlight.
              </Text>
            </Box>

            <Box
              border="1px solid #D2D2D2"
              rounded=".9375rem"
              px="2.125rem"
              py="2.5rem"
              width={['100%', '50%']}
            >
              <Box>
                <Image
                  src="/assets/images/designChallenge/gold3.svg"
                  alt="designChallenge"
                />
              </Box>
              <Heading
                fontSize="1.875rem"
                fontWeight="700"
                lineHeight="2.6812rem"
                color="#000"
                mt="4.625rem"
              >
                Third Place
              </Heading>
              <Text
                fontSize="1.875rem"
                fontWeight="500"
                lineHeight="2.7844rem"
                color="#555555"
                mt="1.25rem"
              >
                Gets our exclusive Perxels Swags.
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
