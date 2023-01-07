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
  useDisclosure,
} from '@chakra-ui/react'
import React from 'react'
import {Formik} from 'formik'
import * as Yup from 'yup'
import { MainContainer } from '../../layouts'
import { SuccessModal } from '../../components'
export const OurGoal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const scriptUrl =
    'https://script.google.com/macros/s/AKfycbzciVlSwFDhddIieTMxkNfEr-5J8e9gjgNlAMDde6DyfbBlv4H1o4zki1NhYyxUfoKs/exec'
  // const handleSubmit = (e: any) => {
  //   e.preventDefault()
  //   const inputData = e.target as typeof e.target & {
  //     fullname: { value: string }
  //     email: { value: string }
  //     amount: { value: string }
  //     aboutdonor: { value: string }
  //   }
  //   const formData = new FormData()
  //   formData.append('fullname', inputData.fullname.value as string)
  //   formData.append('email', inputData.email.value as string)
  //   formData.append('amount', inputData.amount.value as string)
  //   formData.append('aboutdonor', inputData.aboutdonor.value as string)
  //   //current date and time
  //   formData.append('created_at', new Date().toLocaleString())
   
  // }
  return (
    <MainContainer>
       <SuccessModal
        isOpen={isOpen}
        onClose={onClose}
        title="Thank you for reaching out"
        description="We will get back to you shortly"
      />
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
          <Formik 
          initialValues={{fullname: '', email: '', amount: '', aboutdonor: ''}}
          validationSchema={Yup.object({
            fullname: Yup.string().required('Required'),
            email: Yup.string().email('Invalid email address').required('Required'),
            amount: Yup.string().required('Required'),
            aboutdonor: Yup.string().required('Required'),
          })}
          onSubmit={(values, action) => {
            const formData = new FormData()
            formData.append('fullname', values.fullname as string)
            formData.append('email', values.email as string)
            formData.append('amount', values.amount as string)
            formData.append('aboutdonor', values.aboutdonor as string)
            //current date and time
            formData.append('created_at', new Date().toLocaleString())
            fetch(scriptUrl, {
              method: 'POST',
              body: formData,
            }).then((response) => {
              if (response.status === 201 || 200) {
                action.resetForm()
                onOpen()
              } else {
                alert('Something went wrong, please try again')
              }
            })
          }}
          >
            {(formik)=> (
               <VStack
               as="form"
               spacing="1.5rem"
               bg="brand.gray.300"
               rounded="10px"
               py="3.125rem"
               px={['1rem', '1rem', '1rem', '2.5rem']}
               onSubmit={(event) => {
                 event.preventDefault()
                 formik.handleSubmit()
               }}
             >
               <Input
                 placeholder="Full Name*"
                 bg="brand.white"
                 h="3.5rem"
                 name="fullname"
                 value = {formik.values.fullname}
                  onChange = {formik.handleChange}
                  onBlur = {formik.handleBlur}
                  borderColor = {formik.touched.fullname && formik.errors.fullname ? 'red.500' : '#B4B4B4'}
                  _focusVisible={{
                    outline: 'none',
                  }}
               />
               
               <Input
                 placeholder="Email Address*"
                 bg="brand.white"
                 h="3.5rem"
                 type="email"
                
                 name="email"
                  value = {formik.values.email}
                  onChange = {formik.handleChange}
                  onBlur = {formik.handleBlur}
                  borderColor = {formik.touched.email && formik.errors.email ? 'red.500' : '#B4B4B4'}
                  _focusVisible={{
                    outline: 'none',
                  }}
               />
              
               <Input
                 placeholder="Amount to donate"
                 bg="brand.white"
                 h="3.5rem"
                 name="amount"
                  value = {formik.values.amount}
                  onChange = {formik.handleChange}
                  onBlur = {formik.handleBlur}
                  borderColor = {formik.touched.amount && formik.errors.amount ? 'red.500' : '#B4B4B4'}
                  _focusVisible={{
                    outline: 'none',
                  }}
               />
                
               <Textarea
                 placeholder="Tell us a little about yourself"
                 h="10.25rem"
                 bg="brand.white"
                 pt="1rem"
                 name="aboutdonor"
                value={formik.values.aboutdonor}
                onChange= {formik.handleChange}
                onBlur={formik.handleBlur}
                borderColor={
                  formik.touched.aboutdonor && formik.errors.aboutdonor
                  ? 'red.500' :
                  '#B4B4B4'
                }
                _focusVisible={{
                  outline: 'none',
                }}
               />
            
               <Center w="full">
                 <Button
                   mt="0.75rem"
                   w="full"
                   h="3.5rem"
                   display="block"
                   type="submit"
                   maxW="313px"
                   isLoading={formik.isSubmitting}
                 >
                   Donate
                 </Button>
               </Center>
             </VStack>
            )}
         
          </Formik>
        </GridItem>
      </Grid>
    </MainContainer>
  )
}
