import {
  Box,
  Button,
  Heading,
  Input,
  Select,
  Text,
  Textarea,
  VStack,
  useDisclosure,
  useClipboard,
  Icon,
  SimpleGrid,
  Flex
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { SuccessModal } from '../../components'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { IoCopyOutline, IoLogoTwitter, IoLogoWhatsapp } from 'react-icons/io5'
import { TwitterShareButton, WhatsappShareButton } from 'next-share'



const EnrolForm = () => {
  // const scriptUrl =
  //   'https://script.google.com/macros/s/AKfycbwAZGaK5T6mfK1wOv99PwLlUdcM_Jli58wtDbX8zn8BFsdxQSYSRuLuDP4TtKATdmj0/exec'
  //const scriptUrl = "https://script.google.com/macros/s/AKfycbyqxYzmTBDjpvDZpXLpnJiqX5nB8ynWeJ3bLNmgRzz-ZTjzBmxvNIa_yN55RbLo7VC1DA/exec"
   cont scruptUrl = "https://script.google.com/macros/s/AKfycbycyswCqp2LVH3oZ66FzAx5Gp6rGTl_FpK18Wp2cN1sorU7YfdtTxT3UTgzHiJVLXpC/exec"
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [errorBorder, setErrorBorder] = useState()
  const [loading, setLoading] = useState(false)
  const [classVal, setClassValue] = useState<string> ("")
  const { onCopy, value, setValue } = useClipboard("https://perxels.com/exam");
  const [formSection, setFormSection] = useState<string>("formSect")
  return (
    <>
      <SuccessModal
        isOpen={isOpen}
        onClose={onClose}
        title={`Thank you for your submission!`}
        description="Our representative will call you within the next 24 hours."
        buttonTitle="Join retreat whatsapp group"
        buttonHref="https://chat.whatsapp.com/ERIkLJUSXfuK5YRlGEI4C4"
      />
     

   
        {
          formSection === "formSect" ? (
            <Box
            className="enrol-form"
            // overflowY="scroll"
            px={['1rem', '1rem', '3rem']}
            backgroundColor="#F2EFFF"
            py="2rem"
            display="flex"
            flexDir="column"
            alignItems={["flex-start","center"]}
            justifyContent="center"
            pt="8rem"
            pos={"relative"}
          >
            <Heading
              fontSize="6xl"
              maxW="full"
              textAlign="left"
              color="brand.dark.100"
            >
              The retreat cost: ₦10,000
            </Heading>
            <Text textAlign="left">Fill the form, pay and join the whatsapp group
            </Text>
    
            <Formik
              initialValues={{
                name: '',
                phone: '',
                email: '',
                location: '',
                job: '',
              
                // category: '',
              }}
              validationSchema={Yup.object({
                name: Yup.string().required('Name is required'),
                phone: Yup.string().required('Phone number is required'),
                email: Yup.string()
                  .email('Invalid email address')
                  .required('Email is required'),
                location: Yup.string().required('Location is required'),
                // howdidyouknow: Yup.string().required(
                //   'How did you know is required',
                // ),
                // reason: Yup.string().required('Reason is required'),
                job: Yup.string().required("Have you gotten any job is required")
               
                // category: Yup.string().required('Category is required'),
              })}
              onSubmit={(values, action) => {
                setLoading(true)
            
              
                const formData = new FormData()
    
                formData.append('name', values.name as string)
                formData.append('phone', values.phone as string)
                formData.append('email', values.email as string)
                formData.append('location', values.location as string)
               
                formData.append('job', values.job as string)
            
                //current date and time
                formData.append('created_at', new Date().toLocaleString())
    
                //continue form submission
                fetch(scriptUrl, {
                  method: 'POST',
                  body: formData,
                }).then((response) => {
                  if (response.status === 201 || 200) {
                    action.resetForm()
                    setFormSection("paymentSect")
                    // onOpen()
                  } else {
                    alert('Something went wrong, please try again')
                  }
                })
              }}
            >
              {(formik) => (
                <VStack
                  spacing="1.5rem"
                  mt="2rem"
                  maxW="440px"
                  w="full"
                  alignItems="flex-start"
                  as="form"
                  onSubmit={(event) => {
                    event.preventDefault()
                    formik.handleSubmit()
                  }}
                >
                  
                  <Input
                    h="3.5rem"
                    placeholder="Name*"
                    _placeholder={{ color: 'brand.dark.200' }}
                    name="name"
                    border="1px solid #000"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    borderColor={
                      formik.touched.name && formik.errors.name
                        ? 'red.500'
                        : 'brand.dark.200'
                    }
                    _focusVisible={{
                      outline: 'none',
                    }}
                    background="#FCFCFC"
                  />
                  {formik.touched.name && formik.errors.name ? (
                    <Text color="red.500" fontSize="sm">
                      {formik.errors.name}
                    </Text>
                  ) : null}
    
                  <Input
                    h="3.5rem"
                    type="tel"
                    placeholder="Phone Number*"
                    _placeholder={{ color: 'brand.dcark.200' }}
                    name="phone"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    borderColor={
                      formik.touched.phone && formik.errors.phone
                        ? 'red.500'
                        : 'brand.dark.200'
                    }
                    _focusVisible={{
                      outline: 'none',
                    }}
                    background="#FCFCFC"
                  />
                  {formik.touched.phone && formik.errors.phone ? (
                    <Text color="red.500" fontSize="sm">
                      {formik.errors.phone}
                    </Text>
                  ) : null}
    
                  <Input
                    h="3.5rem"
                    type="email"
                    placeholder="Email Address*"
                    _placeholder={{ color: 'brand.dark.200' }}
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    borderColor={
                      formik.touched.email && formik.errors.email
                        ? 'red.500'
                        : 'brand.dark.200'
                    }
                    _focusVisible={{
                      outline: 'none',
                    }}
                    background="#FCFCFC"
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <Text color="red.500" fontSize="sm">
                      {formik.errors.email}
                    </Text>
                  ) : null}
         
                  <Input
                    h="3.5rem"
                    type="text"
                    placeholder="Location*"
                    _placeholder={{ color: 'brand.dark.200' }}
                    name="location"
                    value={formik.values.location}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    borderColor={
                      formik.touched.location && formik.errors.location
                        ? 'red.500'
                        : 'brand.dark.200'
                    }
                    _focusVisible={{
                      outline: 'none',
                    }}
                    background="#FCFCFC"
                  />
                  {formik.touched.location && formik.errors.location ? (
                    <Text color="red.500" fontSize="sm">
                      {formik.errors.location}
                    </Text>
                  ) : null}
    
    
    
    
    <Input
                    h="3.5rem"
                    type="text"
                    placeholder="Have you gotten job/gig after your training at Perxels"
                    _placeholder={{ color: 'brand.dark.200' }}
                    name="job"
                    value={formik.values.job}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    borderColor={
                      formik.touched.job && formik.errors.job
                        ? 'red.500'
                        : 'brand.dark.200'
                    }
                    _focusVisible={{
                      outline: 'none',
                    }}
                    background="#FCFCFC"
                  />
                  {formik.touched.job && formik.errors.job ? (
                    <Text color="red.500" fontSize="sm">
                      {formik.errors.job}
                    </Text>
                  ) : null}
    
    
                  <Button
                    h="3.688rem"
                    w="full"
                    type="submit"
                    isLoading={formik.isSubmitting}
                  >
              Submit and join the whatsapp group
                  </Button>
                </VStack>
              )}
            </Formik>
        
          </Box>

          ): (

            <Box
            className="enrol-form"
            // overflowY="scroll"
            // px={['1rem', '1rem', '3rem']}
            backgroundColor="#F2EFFF"
            mt={["0","15%"]}
            mr={["0","15%"]}
            mb={["0, 15%"]}
            // py="2rem"
           p="10%"
            display="flex"
            flexDir="column"
            // alignItems="center"
            justifyContent="center"
            // pt="8rem"
            pos={"relative"}
          >
    
              <Box backgroundColor="#FFF"  padding={["41px 44px", ""]} rounded="67px">
                <Text fontSize={["8px","16px"]} color="#000" background="#FFBE0024">
                NB: Screenshot this if you’re not paying immediately
                </Text>
    
                <Heading fontSize="16px" color="#121212" fontWeight="400" >
                Pay to this account number
                </Heading>
                <Heading fontSize="40px" color="#34296B" fontWeight="700" 
                
                >
                0775531140
                </Heading>
                <Heading fontSize="38px" color="#000" fontWeight="700" 
                >
               GTBANK
                </Heading>
                <Heading fontSize="1.3625rem" color="#000" fontWeight="700">
                ThePerxels Service
                </Heading>
              </Box>
              <Button
              mt="3.5625rem"
                    h="3.688rem"
                    w="full"
                    type="submit"
                    as='a'
                    href='https://chat.whatsapp.com/ERIkLJUSXfuK5YRlGEI4C4'
                  >
                  Click to join the whatsapp group
                </Button>
            </Box>
          )
        }
    </>
  )
}

export default EnrolForm
