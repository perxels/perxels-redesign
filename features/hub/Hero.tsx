import React, { useEffect, useState } from 'react'
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
  Select,
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

const HeroArray = [
  "/assets/images/hub/imageHub1.png",
  "/assets/images/hub/imageHub2.png",
  "/assets/images/hub/imageHub3.png",
  "/assets/images/hub/imageHub4.png",
  "/assets/images/hub/imageHub5.png"
]

export const Hero = () => {
  const [active, setActive] = useState<number>(0);
  const scriptUrl =
    'https://script.google.com/macros/s/AKfycbxXWHyW58PmCmQKETOyzDfRLL-udfjCpXHUyylGf28E2oV1yfQ-r8gxCyW53uHLICkkuw/exec'
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev === 4 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [])


  return (
    <Box
      w={["100vw", "99vw"]}
      minHeight={'100vh'}
      //   background={`url(${HeroArray[active]}) no-repeat center center`}
      backgroundSize={'cover'}
      position="relative"
      pb="5%"
    >
      {/* image with position absolute as background image */}
      <Image src={HeroArray[active]} alt="hero image" position="absolute" top="0" left="0" w="100%" h="100%" objectFit="cover" />

      <SuccessModal
        isOpen={isOpen}
        onClose={onClose}
        title="Thank you for Booking a Space!"
        description="Our representative will call you within the next 24 hours."
      />
      {/* top right logo with absolute position */}
      <Box position="absolute" top="0" left="0" p={["20px 0px 0px 20px", "20px 0px 0px 100px"]}>
        <Image src={"/assets/images/hub/hubLogoDesktop.svg"} alt="hub logo" />
        {/* <Image display={["block", "none"]} src={"/assets/images/hub/hubLogoMobile.svg" } alt="hub logo" /> */}
      </Box>
      <Box px={["5%", '32%']} position="relative" pt={["25%", "5%"]}>
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
          p={["2.0625rem 1.375rem", "34px 33px"]}
          backgroundColor="#FEFEFE"
        >
          <Heading
            fontSize={["1.875rem", "2.5rem"]}
            w={["100%", "80%"]}
            color="#121212"
            lineHeight={["1.875rem", "3.0169rem"]}
          >
            Book a space in{' '}
            <Heading as="span" fontSize={["1.875rem", "2.5rem"]} color="#34296B" lineHeight={["1.875rem", "3.0169rem"]}>
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
              phone: '',
              datetime: '2023-08-18T03:35',
              spacetype: '',
              hours: '',
            }}
            validationSchema={Yup.object({
              name: Yup.string().required('Name is Required'),
              email: Yup.string()
                .email('Invalid email address')
                .required('Email is Required'),
              spacetype: Yup.string().required('Space Type is required'),
              phone: Yup.string().required('Phone Number is Required'),
              datetime: Yup.string().required('Datetime is Required'),
              hours: Yup.number().required('Hours are Required'),
            })}

            onSubmit={(values, action) => {

              const formData = new FormData()
              formData.append('name', values.name as string)
              formData.append('email', values.email as string)
              formData.append('phone', values.phone as string)
              formData.append('datetime', values.datetime as string)
              formData.append('spacetype', values.spacetype as string)
              formData.append('hours', values.hours as string)
              formData.append('created_at', new Date().toLocaleString())

              fetch(scriptUrl,
                {
                  method: 'POST',
                  body: formData
                })
                .then((response) => {
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

                spacing={["1.5625rem", "1.875rem"]}
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
                  h={["3.125rem", "3.75rem"]}
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
                  h={["3.125rem", "3.75rem"]}
                  placeholder="Phone Number (e.g. 08012345678)"
                  _placeholder={{ color: '#555555', fontSize: '.9375rem' }}
                  name="phone"
                  type="tel"
                  border="none"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  backgroundColor={'#F2F2F2'}
                  borderColor={
                    formik.touched.phone && formik.errors.phone ? 'red' : ''
                  }
                  _focusVisible={{
                    outline: 'none',
                  }}
                  borderRadius="6.25rem"
                />
                {formik.touched.phone && formik.errors.phone ? (
                  <Text color="red" fontSize="12px">
                    {formik.errors.phone}
                  </Text>
                ) : null}

                <Input
                  h={["3.125rem", "3.75rem"]}
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
                    cursor="pointer"
                    h={["3.125rem", "3.75rem"]}
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
                        cursor: pointer;                  
                      }
                      ::-webkit-date-and-time-value{
                        text-align:left;
                      }
                    `}
                  />


                </InputGroup>
                {formik.touched.datetime && formik.errors.datetime ? (
                  <Text color="red" fontSize="12px">
                    {formik.errors.datetime}
                  </Text>
                ) : null}

                <Select
                  h={["3.125rem", "3.75rem"]}
                  // placeholder="What type of space are you reserving ?"
                  _placeholder={{ color: 'brand.dark.200' }}
                  color="brand.dark.200"
                  name="spacetype"
                  value={formik.values.spacetype}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  backgroundColor={'#F2F2F2'}
                  borderColor={
                    formik.touched.spacetype && formik.errors.spacetype ? 'red' : ''
                  }
                  _focusVisible={{
                    outline: 'none',
                  }}
                  borderRadius="6.25rem"
                >
                  <option value="" disabled selected>What type of space are you reserving ?</option>
                  <option value="Workstation(N1500per Hour)">Workstation(N1500per Hour)</option>
                  <option value="Boardroom(N10,000per Hour)"> Boardroom(N10,000per Hour)</option>

                </Select>
                {formik.touched.spacetype && formik.errors.spacetype ? (
                  <Text color="red.500" fontSize="sm">
                    {formik.errors.spacetype}
                  </Text>
                ) : null}

               


                <NumberInput
                  step={1}
                  border="none"
                  min={0}
                  max={24}
                  name="hours"
                  w="full"
                  onChange= {
                    (value) => formik.setFieldValue("hours", value)
                  }
                  value={formik.values.hours}
                >
                  <NumberInputField
                    placeholder="Number of hours"
                    // name="hours"
                    backgroundColor={'#F2F2F2'}
                    _focusVisible={{
                      outline: 'none',
                    }}
                    w="full"
                    borderRadius="6.25rem"
                    h={["3.125rem", "3.75rem"]}
                    
                    onBlur={formik.handleBlur}
                    _placeholder={{ color: '#555555', fontSize: '.9375rem' }}
                  
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
                  h={["3.125rem", "3.75rem"]}
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
