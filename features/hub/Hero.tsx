import React from 'react'
import {
  Box,
  Image,
  Text,
  Heading,
  Center,
  Icon,
  Flex,
  Input,
  Button,
  VStack,
  InputGroup,
  InputRightElement,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useDisclosure,
} from '@chakra-ui/react'
import { css } from '@emotion/react'
import { RiRouterFill } from 'react-icons/ri'
import { TiLocation } from 'react-icons/ti'
import { FaPhoneAlt } from 'react-icons/fa'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { SuccessModal } from '../../components'


export const Hero = () => {
  const scriptUrl =
    'https://script.google.com/macros/s/AKfycbxXWHyW58PmCmQKETOyzDfRLL-udfjCpXHUyylGf28E2oV1yfQ-r8gxCyW53uHLICkkuw/exec'
    const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <Box
      w={["100vw","99vw"]}
      minHeight={'100vh'}
      background="url(/assets/images/hub/hubImageBg.png) no-repeat center center"
      backgroundSize={'cover'}
      position="relative"
      pb="5%"
    >
         <SuccessModal
        isOpen={isOpen}
        onClose={onClose}
        title="Thank you for Booking a Space!"
        description="Our representative will call you within the next 24 hours."
      />
      {/* top right logo with absolute position */}
      <Box position="absolute" top="0" left="0" p={["20px 0px 0px 20px","20px 0px 0px 100px"]}>
        <Image src={"/assets/images/hub/hubLogoDesktop.svg" }alt="hub logo" />
        {/* <Image display={["block", "none"]} src={"/assets/images/hub/hubLogoMobile.svg" } alt="hub logo" /> */}
      </Box>
      <Box px={["5%",'32%']} position="relative" pt={["25%","5%"]}>
        <Box display="flex" justifyContent="center">
          <Center
            display="inline-flex"
            backgroundColor="#E3719C"
            alignItems="center"
            p=".625rem"
            columnGap=".3513rem"
            rounded=".375rem"
          >
            <Icon as={RiRouterFill} color="white" fontSize="15px" />
            <Text
              fontSize="15px"
              lineHeight="1.1419rem"
              color="#FFF"
              fontWeight="700"
            >
              Free Wi-Fi
            </Text>
          </Center>
        </Box>
        <Box
          mt="1.0625rem"
          rounded="10px"
          p={["2.0625rem 1.375rem","34px 33px"]}
          backgroundColor="#FEFEFE"
        >
          <Heading
            fontSize={["1.875rem","2.5rem"]}
            w={["100%","80%"]}
            color="#121212"
            lineHeight={["1.875rem","3.0169rem"]}
          >
            Book a space in{' '}
            <Heading as="span" fontSize={["1.875rem","2.5rem"]}color="#34296B"   lineHeight={["1.875rem","3.0169rem"]}>
              {' '}
              Perxels Hub{' '}
            </Heading>{' '}
            today!
          </Heading>
          <Flex mt=".7813rem" alignItems="center" columnGap={'.6875rem'}>
            <Icon as={TiLocation} color="#555555" fontSize="23px" />
            <Text fontSize="16px" lineHeight="1.2181rem" color="#121212">
              Triangle Business Mall, Osapa London
            </Text>
          </Flex>
          <Flex alignItems="center" columnGap={'.9875rem'} mt=".7813rem">
            <Icon as={FaPhoneAlt} color="#555555" fontSize="18px" />
            <Text color="#121212" fontSize="16px" lineHeight="1.2181rem">
              08135369680
            </Text>
          </Flex>

          <Formik
            initialValues={{
              name: '',
              email: '',
              datetime: '2023-08-18T03:35',
              hours: '0',
            }}
            validationSchema={Yup.object({
              name: Yup.string().required('Name is Required'),
              email: Yup.string()
                .email('Invalid email address')
                .required('Email is Required'),
              datetime: Yup.string().required('Datetime is Required'),
              hours: Yup.number().required('Hours are Required'),
            })}

            onSubmit={(values, action) => {
              
              const formData = new FormData()
             console.log(values, "values")
              formData.append('name', values.name as string)
              formData.append('email', values.email as string)
              formData.append('datetime', values.datetime as string)
              formData.append('hours', values.hours as string)
              formData.append('created_at', new Date().toLocaleString())

              console.log(formData, "formData")
                
              fetch(scriptUrl, 
                { method: 'POST', 
                body: formData })
                .then((response) => {
                    console.log(formData, "formData")
                  if (response.status === 201 || 200) {
                    onOpen()
                    action.resetForm()
                  } else {
                    alert('Form submission failed!')
                  }
                })
                .catch((error) => {
                  console.error('Error!', error.message)
                })
            }}
          >
            {(formik) => (
              <VStack
               
                spacing={["1.5625rem","1.875rem"]}
                mt="1.875rem"
                w="full"
                alignItems="flex-start"
                as="form"
                onSubmit={(event) => {
                  event.preventDefault()
                  formik.handleSubmit()
                }}
              >
                <Input
                  h={["3.125rem","3.75rem"]}
                  placeholder="Full Name (e.g. John Doe)"
                  _placeholder={{ color: '#555555', fontSize: '.9375rem' }}
                  name="name"
                  border="none"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  backgroundColor={'#F2F2F2'}
                  borderColor={
                    formik.touched.name && formik.errors.name ? 'red' : ''
                  }
                  _focusVisible={{
                    outline: 'none',
                  }}
                  borderRadius="6.25rem"
                />
                {formik.touched.name && formik.errors.name ? (
                  <Text color="red" fontSize="12px">
                    {formik.errors.name}
                  </Text>
                ) : null}
    
                <Input
                   h={["3.125rem","3.75rem"]}
                  placeholder="Email address (e.g name@example.com)"
                  _placeholder={{ color: '#555555', fontSize: '.9375rem' }}
                  name="email"
                  type="email"
                  border="none"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  backgroundColor={'#F2F2F2'}
                  borderColor={
                    formik.touched.email && formik.errors.email ? 'red' : ''
                  }
                  _focusVisible={{
                    outline: 'none',
                  }}
                  borderRadius="6.25rem"
                />
                {formik.touched.email && formik.errors.email ? (
                  <Text color="red" fontSize="12px">
                    {formik.errors.email}
                  </Text>
                ) : null
                }

                <InputGroup>
                  <Input
                      h={["3.125rem","3.75rem"]}
                    placeholder="10-08-2023 11:00AM"
                    _placeholder={{ color: '#555555', fontSize: '.9375rem' }}
                    name="datetime"
                    type="datetime-local"
                    border="none"
                    value={formik.values.datetime}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    backgroundColor={'#F2F2F2'}
                    borderColor={
                      formik.touched.datetime && formik.errors.datetime
                        ? 'red'
                        : ''
                    }
                    _focusVisible={{
                      outline: 'none',
                    }}
                    borderRadius="6.25rem"
                    css={css`
                      ::-webkit-calendar-picker-indicator {
                        background: url(/assets/images/hub/calenderIcon.svg)
                          center/100% no-repeat;
                        color: black;
                        margin-right: 27px;
                      }
                    `}
                  />
                
                </InputGroup>
                {formik.touched.datetime && formik.errors.datetime ? (
                    <Text color="red" fontSize="12px">
                      {formik.errors.datetime}
                    </Text>
                  ) : null}
                <NumberInput
                  defaultValue={0}
                  step={1}
                  border="none"
                  min={0}
                  max={24}
                 name="hours"
                  w="full"
                  
                >
                  <NumberInputField
                    name="hours"
                    backgroundColor={'#F2F2F2'}
                    _focusVisible={{
                      outline: 'none',
                    }}
                    w="full"
                    borderRadius="6.25rem"
                    h={["3.125rem","3.75rem"]}
                    placeholder="Number of hours"
                    _placeholder={{ color: '#555555', fontSize: '.9375rem' }}
                    value={formik.values.hours}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    borderColor={
                        formik.touched.hours && formik.errors.hours ? 'red' : 'none'
                      }
                  />
                  <NumberInputStepper mr="1.875rem">
                    <NumberIncrementStepper color="#000" />
                    <NumberDecrementStepper color="#000" />
                  </NumberInputStepper>
                </NumberInput>
                {formik.touched.hours && formik.errors.hours ? (
                  <Text color="red" fontSize="12px">
                    {formik.errors.hours}
                  </Text>
                ) : null}

                <Button
                   h={["3.125rem","3.75rem"]}
                  w="full"
                  type="submit"
                  rounded="6.25rem"
                  isLoading={formik.isSubmitting}
                >
                  Book Space
                </Button>
              </VStack>
            )}
          </Formik>
        </Box>
      </Box>
    </Box>
  )
}
