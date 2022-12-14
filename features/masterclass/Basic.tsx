import {
  Box,
  Button,
  Center,
  Grid,
  Heading,
  HStack,
  Icon,
  Img,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react'
import React from 'react'
import { BsArrowRightCircle, BsFillCheckCircleFill } from 'react-icons/bs'
import { ListWrapper } from '../../components'
import { MainContainer } from '../../layouts'

const lists: string[] = [
  'Beginners and those transitioning into UIUX design.',
  'You have never designed before.',
  'You design but you have issues with alignment, color usage, hierarchy, white space and the basic principles of design',
]

export const Basic = () => {
  return (
    <Box py="3rem" pt="0">
      <MainContainer bg="none">
        <SimpleGrid columns={[1, 1, 1, 2]} gap="2.5rem">
          <Center>
            <Box>
              <Heading fontSize={["6xl", "6xl", "7xl"]} color="brand.dark.200">
                Basic Class
              </Heading>
              <Text fontSize={["2xl", "2xl", "3xl"]} color="brand.gray.500">
                This class is for those with the following criteria:
              </Text>

              <VStack spacing="1.25rem" mt="2.5rem">
                {lists.map((list) => (
                  <Grid
                    w="full"
                    key={list}
                    templateColumns="30px 1fr"
                    gap="1rem"
                    alignItems="center"
                  >
                    <Icon
                      as={BsFillCheckCircleFill}
                      fontSize="2rem"
                      color="brand.purple.500"
                    />

                    <Text fontSize={["xl", "xl", "2xl"]}>{list}</Text>
                  </Grid>
                ))}
              </VStack>

              <Heading fontSize={["xl", "xl", "2xl"]} color="brand.gray.500" mt="3rem">
                IMPORTANT INFORMATION:
              </Heading>

              <Text fontSize={["xl", "xl", "2xl"]} color="brand.gray.500" mt="1rem">
                Anyone who registers for this masterclass automatically have
                access to 25% discount of Perxels paid training
              </Text>

              <HStack mt="1.875rem" spacing="2rem">
                <Button h="3.875rem">Join Basic Class</Button>
                <Button
                  h="3.875rem"
                  variant="link"
                  rightIcon={<BsArrowRightCircle />}
                >
                  Download Project
                </Button>
              </HStack>
            </Box>
          </Center>

          <Img src="/assets/images/masterclass/basic.jpg" />
        </SimpleGrid>
      </MainContainer>
    </Box>
  )
}
