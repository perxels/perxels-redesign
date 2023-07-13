import {
  Box,
  Center,
  Grid,
  GridItem,
  Heading,
  HStack,
  Img,
  Text,
  VStack,
} from '@chakra-ui/react'
import React from 'react'
import { aboutTeenContent } from '../../constant/teensContent'
import { MainContainer } from '../../layouts'

export const AboutTeen = () => {
  const [active, setActive] = React.useState(1)
  return (
    <Box pos="relative" py={['1rem', '1rem', '1rem', '6rem']}>
      <MainContainer>
        <Grid
          pos="relative"
          zIndex="2"
          templateColumns={['1fr', '1fr', '1fr', 'repeat(12, 1fr)']}
          gap={['1.5rem', '1.5rem', '1.5rem', '4.5rem']}
        >
          <GridItem colSpan={[1, 1, 1, 5]}>
            <Text
              maxW={['320px', '320px', '320px', '400px']}
              textAlign={['center', 'center', 'center', 'left']}
              fontSize={['3xl', '3xl', '3xl', '4xl']}
              pt="4rem"
              color="brand.dark.200"
            >
              A Special Design Training for Teenagers between the age of{' '}
              <Box fontWeight="bold" as="span">
                12
              </Box>{' '}
              and
              <Box fontWeight="bold" as="span">
                {' '}
                18
              </Box>
            </Text>

            <Img
              src="./assets/images/teens/learning.jpg"
              alt="Learning"
              mt="2.5rem"
              w="100%"
              h="auto"
              rounded="10px"
              display={['none', 'none', 'none', 'block']}
            />
          </GridItem>
          <GridItem colSpan={[1, 1, 1, 7]}>
            <Box rounded="10px" overflow="hidden">
              {aboutTeenContent.map(({ id, title, description }) => (
                <Grid
                  templateColumns={[
                    '3rem 1fr',
                    '3rem 1fr',
                    '3rem 1fr',
                    '5rem 1fr',
                  ]}
                  onMouseEnter={() => setActive(id)}
                  gap={['0.875rem', '0.875rem', '0.875rem', '1.875rem']}
                  key={id}
                  px={['1rem', '1rem', '1rem', '1.875rem']}
                  py={['1.5rem', '1.5rem', '1.5rem', '2.75rem']}
                  cursor="pointer"
                  bg={active === id ? 'brand.purple.500' : 'brand.white'}
                >
                  <Center>
                    <Box
                      w={['3rem', '3rem', '3rem', '5rem']}
                      h={['3rem', '3rem', '3rem', '5rem']}
                      bg="brand.yellow.700"
                      rounded="50%"
                    />
                  </Center>
                  <VStack>
                    <Heading
                      w="full"
                      fontSize={['2xl', '2xl', '2xl', '3xl']}
                      color={active === id ? 'brand.white' : 'brand.dark.200'}
                    >
                      {title}
                    </Heading>
                    <Text
                      fontSize={['sm', 'sm', 'sm', 'xl']}
                      color={active === id ? 'brand.white' : 'brand.dark.200'}
                    >
                      {description}
                    </Text>
                  </VStack>
                </Grid>
              ))}
            </Box>
          </GridItem>
        </Grid>
      </MainContainer>

      <Box
        pos="absolute"
        bottom="0"
        left="0"
        w="full"
        h={['12rem', '12rem', '12rem', '25rem']}
        bg="brand.purple.500"
        backgroundImage={"url('/assets/images/hire/bgPatternPurple.png')"}
        backgroundRepeat="repeat"
        backgroundSize={'cover'}
      />
    </Box>
  )
}
