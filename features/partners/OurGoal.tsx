import {
  Box,
  Button,
  Center,
  Grid,
  GridItem,
  Heading,
  Input,
  ListItem,
  Textarea,
  UnorderedList,
  VStack,
} from '@chakra-ui/react'
import React from 'react'
import { MainContainer } from '../../layouts'

export const OurGoal = () => {
  return (
    <MainContainer>
      <Grid templateColumns={["1fr", "1fr", "1fr", "1fr 528px"]} gap="3rem" pb="8rem">
        <GridItem>
          <Box>
            <Box
              as="span"
              px="1.5rem"
              bg="brand.yellow.500"
              rounded="100px"
              py="0.875rem"
            >
              <Heading
                display="inline-block"
                fontSize="2xl"
                color="brand.purple.500"
              >
                OUR GOAL
              </Heading>
            </Box>
          </Box>

          <Heading fontSize={["5xl", "5xl", "5xl", "7xl"]} color="brand.dark.200" mt="2rem" maxW="533px">
            To train and mentor{' '}
            <Box color="brand.purple.500">100,000 African youths</Box> with tech
            skills
          </Heading>

          <Box mt="2rem">
            <Heading fontSize="xl" color="brand.dark.200" mb="1rem">
              What the trainees would benefit;
            </Heading>

            <UnorderedList>
              <ListItem color="brand.dark.200" fontSize="xl" pb="1rem">
                Tech skills training on uiux design, software development
                (front-end & backend), product management, no-code skills etc
              </ListItem>
              <ListItem color="brand.dark.200" fontSize="xl" pb="1rem">
                In-depth training and mentorship with experienced professionals
              </ListItem>
              <ListItem color="brand.dark.200" fontSize="xl" pb="1rem">
                Interactive live classes with an instructor and other trainees
              </ListItem>
              <ListItem color="brand.dark.200" fontSize="xl" pb="1rem">
                Internship placement to get real-life work experience
              </ListItem>
              <ListItem color="brand.dark.200" fontSize="xl" pb="1rem">
                Job recommendations, CV review & Interview support
              </ListItem>
              <ListItem color="brand.dark.200" fontSize="xl" pb="1rem">
                Access to free resources for life
              </ListItem>
            </UnorderedList>
          </Box>
        </GridItem>

        <GridItem>
          <VStack as="form" spacing="1.5rem" bg="brand.gray.300" rounded="10px" py="3.125rem" px={["1rem", "1rem", "1rem", "2.5rem"]}>
            <Input
              placeholder="Full Name*"
              bg="brand.white"
              h="3.5rem"
              required
            />
            <Input
              placeholder="Email Address*"
              bg="brand.white"
              h="3.5rem"
              type="email"
              required
            />
            <Input placeholder="Amount to donate" bg="brand.white" h="3.5rem" />

            <Textarea
              placeholder="Tell us a little about yourself"
              h="10.25rem"
              bg='brand.white'
              pt="1rem"
            />

          <Center w="full">
            <Button mt="0.75rem" w="full" h="3.5rem" display="block" type="submit" maxW="313px">Donate</Button>
          </Center>
          </VStack>
        </GridItem>
      </Grid>
    </MainContainer>
  )
}
