import {
    Box,
    Button,
    Heading,
    HStack,
    Input,
    Select,
    SimpleGrid,
    Text,
    Textarea,
    VStack,
    useDisclosure
  } from '@chakra-ui/react'
  import React, { useState } from 'react'
  import { SectionHeader } from '../../components'
  import { InputWrapper } from '../../components/InputWrapper'
  import { MainContainer } from '../../layouts'
  import {Formik} from 'formik'
import * as Yup from 'yup'
import { SuccessModal } from '../../components'
  export const ChallengeForm = () => {
    const [loading, setLoading] = useState(false)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const scriptUrl =
      'https://script.google.com/macros/s/AKfycbyTgCCNaNzXBPqBNP3HsSEfhYHNsx2BIwv8zkusfn6Ha9yjbb8mlU7GAJwVMNB8Qtd2/exec'
    // const handleSubmit = (e: any) => {
    //   e.preventDefault()
    //   setLoading(true)
    //   const inputData = e.target as typeof e.target & {
    //     fullname: { value: string }
    //     projectdescription: { value: string }
    //     email: { value: string }
    //     phone: { value: string }
    //     twitterHandle: { value: string }
    //     reason: { value: string }
       
    //     // hiretype: { value: string }
    //   }
    //   const formData = new FormData()
    //   formData.append('fullname', inputData.fullname.value as string)
    //   formData.append('email', inputData.email.value as string)
    //   formData.append('phone', inputData.phone.value as string)
    //   formData.append('twitterHandle', inputData.twitterHandle.value as string)
    
    //   //current date and time
    //   formData.append('created_at', new Date().toLocaleString())
  
    //   fetch(scriptUrl, {
    //     method: 'POST',
    //     body: formData,
    //   }).then((response) => {
    //     if (response.status === 201 || 200) {
    //       setLoading(false)
    //       alert('Your message has been sent successfully')
    //     } else {
    //       setLoading(false)
    //       alert('Something went wrong, please try again')
    //     }
    //   })
    // }
  
    return (
      <Box py="3.75rem" id="join">
        <SuccessModal
        isOpen={isOpen}
        onClose={onClose}
        title="Click on the button to download the PRD of the challenge."
        description=""
        buttonTitle="Download the PRD"
        buttonHref="/assets/files/PRD_OF_PERXELS_CHALLENGE.pdf"
      />
        <MainContainer>
          <Box py="3.75rem">
          <Heading
        color={"#121212"}
        textAlign="center"
        fontSize={['2rem', '2rem', '7xl']}
        maxW={'auto'}
        m="0 auto"
        mb="3.75rem"
        mt="1.25rem"
      >
       Complete the form to Register.
      </Heading>
          <Formik
            initialValues={{ 
              fullname: '',
              email: '',
              phone: '',
              twitterHandle: '',
              location: '',
              reason: '',
            }}
            validationSchema={Yup.object({
              fullname: Yup.string().required('Required'),
              email: Yup.string().email('Invalid email address').required('Required'),
              phone: Yup.string().required('Required'),
              twitterHandle: Yup.string().required('Required'),
              location: Yup.string().required('Required'),
              reason: Yup.string().required('Required'),
            })}
            onSubmit={(values, action) => {
              setLoading(true)
              const formData = new FormData()
              formData.append('fullname', values.fullname)
              formData.append('email', values.email)
              formData.append('phone', values.phone)
              formData.append('twitterHandle', values.twitterHandle)
              formData.append('location', values.location)
              formData.append('reason', values.reason)
              //current date and time
              formData.append('created_at', new Date().toLocaleString())
              fetch(scriptUrl, {
                method: 'POST',
                body: formData,
              }).then((response) => {
                
                if (response.status === 201 || 200) {
                  setLoading(false)
                 onOpen()
                } else {
                  setLoading(false)
                  alert('Something went wrong, please try again')
                }
              })
            }}
          >
            {(formik) =>(
                <VStack
                spacing={['1rem', '1rem', '1rem', '3.125rem']}
                as="form"
                maxW="1030px"
                m="0 auto"
                onSubmit={(event) =>{
                  event.preventDefault()
                  formik.handleSubmit()
                }}
              >
                {/* name */}
                <SimpleGrid
                  columns={[1, 1, 1, 2]}
                  w="full"
                  spacing={['1rem', '1rem', '1rem', '2rem']}
                >
                  <InputWrapper label="FULL NAME">
                    <Input
                      type="text"
                      placeholder="Enter your full name"
                      w="full"
                      h={['3rem', '3rem', '3rem', '5rem']}
                      name="fullname"
                      value={formik.values.fullname}
                       onChange = {formik.handleChange}
                  onBlur = {formik.handleBlur}
                  borderColor = {formik.touched.fullname && formik.errors.fullname ? 'red.500' : '#B4B4B4'}
                      required
                    />
                  </InputWrapper>
                  <InputWrapper label="PHONE NUMBER">
                    <Input
                      type="tel"
                      placeholder="Enter your Phone Number"
                      w="full"
                      h={['3rem', '3rem', '3rem', '5rem']}
                      name="phone"
                      value={formik.values.phone}
                       onChange = {formik.handleChange}
                  onBlur = {formik.handleBlur}
                  borderColor = {formik.touched.phone && formik.errors.phone ? 'red.500' : '#B4B4B4'}
                      required
                    />
                  </InputWrapper>
                  {/**/}
                </SimpleGrid>
                <SimpleGrid
                  columns={[1, 1, 1, 2]}
                  w="full"
                  spacing={['1rem', '1rem', '1rem', '2rem']}
                >
                   <InputWrapper label="TWITTER HANDLE">
                    <Input
                      type="text"
                      placeholder="Enter Twitter Handle"
                      w="full"
                      h={['3rem', '3rem', '3rem', '5rem']}
                      name="twitterHandle"
                      value={formik.values.twitterHandle}
                       onChange = {formik.handleChange}
                  onBlur = {formik.handleBlur}
                  borderColor = {formik.touched.twitterHandle && formik.errors.twitterHandle ? 'red.500' : '#B4B4B4'}
                      required
                    />
                  </InputWrapper> 
                 
                  <InputWrapper label="EMAIL ADDRESS">
                    <Input
                      type="email"
                      placeholder="Enter Email Address"
                      w="full"
                      h={['3rem', '3rem', '3rem', '5rem']}
                      name="email"
                      value={formik.values.email}
                       onChange = {formik.handleChange}
                  onBlur = {formik.handleBlur}
                  borderColor = {formik.touched.email && formik.errors.email ? 'red.500' : '#B4B4B4'}
                      required
                    />
                  </InputWrapper>
                </SimpleGrid>
                {/* Description */}
                <SimpleGrid
                  columns={[1, 1, 1, 2]}
                  w="full"
                  spacing={['1rem', '1rem', '1rem', '2rem']}
                >
                   <InputWrapper label="LOCATION">
                    <Input
                      type="text"
                      placeholder="Enter Location"
                      w="full"
                      h={['3rem', '3rem', '3rem', '5rem']}
                      name="location"
                      value={formik.values.location}
                       onChange = {formik.handleChange}
                  onBlur = {formik.handleBlur}
                  borderColor = {formik.touched.location && formik.errors.location ? 'red.500' : '#B4B4B4'}
                      required
                    />
                  </InputWrapper>

                  <InputWrapper label="Reason for joining the challenge">
                    <Textarea
                      // placeholder="Tell Us a little about your Project..."
                      w="full"
                      h="8.75rem"
                      py="1.5rem"
                      name="reason"
                      required
                      value={formik.values.reason}
                       onChange = {formik.handleChange}
                  onBlur = {formik.handleBlur}
                  borderColor = {formik.touched.reason && formik.errors.reason ? 'red.500' : '#B4B4B4'}
                    />
                  </InputWrapper>
                </SimpleGrid>
                {/* contact */}
         
    
             
                {/* contact */}
              
    
                <Button
                  h={['3rem', '3rem', '3rem', '5rem']}
                  w="full"
                  maxW="437px"
                  type="submit"
                  isLoading={ loading ? formik.isSubmitting : false}
                >
                  Submit
                </Button>
              </VStack>
            )}
          </Formik>
          </Box>
        </MainContainer>
      </Box>
    )
  }
  