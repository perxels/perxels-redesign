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
  const scriptUrl =
    'https://script.google.com/macros/s/AKfycbzciVlSwFDhddIieTMxkNfEr-5J8e9gjgNlAMDde6DyfbBlv4H1o4zki1NhYyxUfoKs/exec'
  const handleSubmit = (e: any) => {
    e.preventDefault()
    const inputData = e.target as typeof e.target & {
      fullname: { value: string }
      email: { value: string }
      amount: { value: string }
      aboutdonor: { value: string }
    }
    const formData = new FormData()
    formData.append('fullname', inputData.fullname.value as string)
    formData.append('email', inputData.email.value as string)
    formData.append('amount', inputData.amount.value as string)
    formData.append('aboutdonor', inputData.aboutdonor.value as string)
    //current date and time
    formData.append('created_at', new Date().toLocaleString())
    fetch(scriptUrl, {
      method: 'POST',
      body: formData,
    }).then((response) => {
      if (response.status === 201 || 200) {
        alert('Your message has been sent successfully')
      } else {
        alert('Something went wrong, please try again')
      }
    })
  }
  return (
    <MainContainer>
      <Grid
        templateColumns={['1fr', '1fr', '1fr', '1fr 528px']}
        gap="3rem"
        pb="8rem"
      >
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

          <Heading
            fontSize={['5xl', '5xl', '5xl', '7xl']}
            color="brand.dark.200"
            mt="2rem"
            maxW="533px"
          >
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
          <VStack
            as="form"
            spacing="1.5rem"
            bg="brand.gray.300"
            rounded="10px"
            py="3.125rem"
            px={['1rem', '1rem', '1rem', '2.5rem']}
            onSubmit={handleSubmit}
          >
            <Input
              placeholder="Full Name*"
              bg="brand.white"
              h="3.5rem"
              required
              name="fullname"
            />
            <Input
              placeholder="Email Address*"
              bg="brand.white"
              h="3.5rem"
              type="email"
              required
              name="email"
            />
            <Input
              placeholder="Amount to donate"
              bg="brand.white"
              h="3.5rem"
              name="amount"
            />

            <Textarea
              placeholder="Tell us a little about yourself"
              h="10.25rem"
              bg="brand.white"
              pt="1rem"
              name="aboutdonor"
            />

            <Center w="full">
              <Button
                mt="0.75rem"
                w="full"
                h="3.5rem"
                display="block"
                type="submit"
                maxW="313px"
              >
                Donate
              </Button>
            </Center>
          </VStack>
        </GridItem>
      </Grid>
    </MainContainer>
  )
}
