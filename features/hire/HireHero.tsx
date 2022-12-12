import { Box, Button, Center, Flex, Heading, Text, Image } from '@chakra-ui/react'
import React from 'react'

import { IoChevronForwardCircleOutline } from 'react-icons/io5'

import { MainContainer } from '../../layouts'

export const HireHero = () => {
  return (
    <Box
      backgroundImage={"url('/assets/images/hire/hero.jpg')"}
      backgroundRepeat="no-repeat"
      backgroundSize={'cover'}
    >
      <MainContainer h="full" bg="none">
        <Flex flexDir="column" alignItems="center" pt="4rem">
          <Heading
            textAlign="center"
            fontSize={["3xl", "3xl", "4xl", "9xl"]}
            maxW="820px"
            lineHeight="1.1"
          >
            Onboard employees without opening an entity
          </Heading>

          <Text fontSize={['md', 'md', 'lg']} maxW="400px" mt="1.25rem" textAlign="center">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. At
            adipiscing proin facilisis nulla ut suspendisse sit tempor.
          </Text>

          <Flex alignItems="center" gap="2.5rem" mt="1.25rem">
            <Button h={["3rem", "3.875rem"]}>Hire Us</Button>
            <Button
              h="3.875rem"
              variant="link"
              rightIcon={<IoChevronForwardCircleOutline />}
            >
              Learn More
            </Button>
          </Flex>
        </Flex>
        <Center w="full" mt="2rem" pos="relative">
            {/* left images */}
          <Image w="39rem" h="auto" src="/assets/images/hire/screen.png" alt="Hire Hero" />
          <Image display={['none', 'none', 'none', 'none', 'block']} pos="absolute" top="-7rem" left="4rem" w="17.5rem" h="auto" src="/assets/images/hire/innovation.png" alt="Hire Hero" />
          <Image display={['none', 'none', 'none', 'none', 'block']} pos="absolute" top="6rem" left="4rem" w="17.5rem" h="auto" src="/assets/images/hire/revenue.png" alt="Hire Hero" />
          <Image display={['none', 'none', 'none', 'none', 'block']} pos="absolute" top="14rem" left="0" w="20.5rem" h="auto" src="/assets/images/hire/critical-thinking.png" alt="Hire Hero" />

          {/* right images */}
          <Image display={['none', 'none', 'none', 'none', 'block']} pos="absolute" top="-7rem" right="4rem" w="20.5rem" h="auto" src="/assets/images/hire/execution.png" alt="Hire Hero" />
          <Image display={['none', 'none', 'none', 'none', 'block']} pos="absolute" top="6rem" right="6rem" w="15.375rem" h="auto" src="/assets/images/hire/ux.png" alt="Hire Hero" />
          <Image display={['none', 'none', 'none', 'none', 'block']} pos="absolute" top="14rem" right="2rem" w="19.175rem" h="auto" src="/assets/images/hire/product-breakdown.png" alt="Hire Hero" />
        </Center>
      </MainContainer>
    </Box>
  )
}
