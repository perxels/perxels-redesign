import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  Img,
  Input,
  Select,
  SimpleGrid,
  Text,
  Textarea,
  useClipboard,
  useDisclosure,
  VStack,
} from '@chakra-ui/react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import React, { useState } from 'react'
import { SuccessModal } from '../../components'
import { IoCopyOutline, IoLogoTwitter, IoLogoWhatsapp } from 'react-icons/io5'
import { FaTwitter } from 'react-icons/fa'
import { TwitterShareButton, WhatsappShareButton } from 'next-share'
import { RiWhatsappFill } from 'react-icons/ri'

const RegisterForm = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [loading, setLoading] = useState(false)

  const { onCopy, value, setValue } = useClipboard("https://perxels.com/sponsorship");

  const scriptUrl =
    'https://script.google.com/macros/s/AKfycbzElDzlPDTpufKIge395gGbj68amRNIOy_SPWqm69CZc0ydxc4bVj8nC0jqzVY9RzO9Fg/exec'
  const handleSubmit = (e: any) => {
    e.preventDefault()

    const inputData = e.target as typeof e.target & {
      fullname: { value: string }
      email: { value: string }
      phone: { value: string }
      hearabout: { value: string }
      why: { value: string }
    }
    const formData = new FormData()
    formData.append('fullname', inputData.fullname.value as string)
    formData.append('email', inputData.email.value as string)
    formData.append('phone', inputData.phone.value as string)
    formData.append('hearabout', inputData.hearabout.value as string)
    formData.append('about', inputData.about.value as string)
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
    <>
      <SuccessModal
        isOpen={isOpen}
        onClose={onClose}
        title="Thank you for your submission!"
        description="Our representative will call you within the next 24 hours."
      />
      <Box
        className="enrol-form"
        overflowY="auto"
        px={['1rem', '1rem', '3rem']}
        py="2rem"
      >
        <Heading
          fontSize="6xl"
          maxW="420px"
          textAlign="left"
          color="brand.dark.100"
        >
          You’re one step ahead to achieving your goal
        </Heading>

        <Formik
          initialValues={{
            name: '',
            phone: '',
            email: '',
            class: '',
            why: '',
            howdidyouknow: '',
          }}
          validationSchema={Yup.object({
            name: Yup.string().required('Name is required'),
            phone: Yup.string().required('Phone number is required'),
            email: Yup.string()
              .email('Invalid email address')
              .required('Email is required'),
            class: Yup.string().required('Class is required'),
            why: Yup.string().required('reason is required'),
            howdidyouknow: Yup.string().required(
              'How did you know is required',
            ),
          })}
          onSubmit={(values, action) => {
            setLoading(true)

            console.log(values)

            const formData = new FormData()

            formData.append('name', values.name as string)
            formData.append('phone', values.phone as string)
            formData.append('email', values.email as string)
            formData.append('class', values.class as string)
            formData.append('why', values.why as string)
            formData.append('howdidyouknow', values.howdidyouknow as string)
            //current date and time
            formData.append('created_at', new Date().toLocaleString())

            //continue form submission
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
                placeholder="Full Name*"
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
                _placeholder={{ color: 'brand.dark.200' }}
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
              />
              {formik.touched.email && formik.errors.email ? (
                <Text color="red.500" fontSize="sm">
                  {formik.errors.email}
                </Text>
              ) : null}

              <Select
                h="3.5rem"
                placeholder="Which of the class plan do you want to go for?"
                _placeholder={{ color: 'brand.dark.200' }}
                color="brand.dark.200"
                name="class"
                value={formik.values.class}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                borderColor={
                  formik.touched.class && formik.errors.class
                    ? 'red.500'
                    : 'brand.dark.200'
                }
                _focusVisible={{
                  outline: 'none',
                }}
              >
                <option
                  value="Basic Class to learn the FUNDAMENTALS of UIUX design in 7
                  weeks (Full Scholarship for 3 people)"
                >
                  Basic Class to learn the FUNDAMENTALS of UIUX design in 7
                  weeks (Full Scholarship for 3 people)
                </option>
                <option
                  value="Advance Class to expand your DESIGN THINKING and PROBLEM
                  SOLVING skills in 9 weeks (15% discount)"
                >
                  Advance Class to expand your DESIGN THINKING and PROBLEM
                  SOLVING skills in 9 weeks (15% discount)
                </option>
                <option
                  value="Premium Class for beginners to learn everything in UIUX design
                  from basic to PROFESSIONAL level in 3 months (15% discount)"
                >
                  Premium Class for beginners to learn everything in UIUX design
                  from basic to PROFESSIONAL level in 3 months (15% discount)
                </option>
              </Select>
              {formik.touched.class && formik.errors.class ? (
                <Text color="red.500" fontSize="sm">
                  {formik.errors.class}
                </Text>
              ) : null}

              <Textarea
                h="3.5rem"
                placeholder="Why shouid you be selected for this sponsorship (This will determine our selection?"
                _placeholder={{ color: 'brand.dark.200' }}
                name="why"
                value={formik.values.why}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                borderColor={
                  formik.touched.why && formik.errors.why
                    ? 'red.500'
                    : 'brand.dark.200'
                }
                _focusVisible={{
                  outline: 'none',
                }}
              />
              {formik.touched.why && formik.errors.why ? (
                <Text color="red.500" fontSize="sm">
                  {formik.errors.why}
                </Text>
              ) : null}

              <Select
                h="3.5rem"
                placeholder="Where did you hear about this Sponsorship?"
                _placeholder={{ color: 'brand.dark.200' }}
                color="brand.dark.200"
                name="howdidyouknow"
                value={formik.values.howdidyouknow}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                borderColor={
                  formik.touched.howdidyouknow && formik.errors.howdidyouknow
                    ? 'red.500'
                    : 'brand.dark.200'
                }
                _focusVisible={{
                  outline: 'none',
                }}
              >
                <option value="Facebook">Facebook</option>
                <option value="Twitter">Twitter</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Instagram">Instagram</option>
                <option value="WhatsApp">WhatsApp</option>
              </Select>
              {formik.touched.howdidyouknow && formik.errors.howdidyouknow ? (
                <Text color="red.500" fontSize="sm">
                  {formik.errors.howdidyouknow}
                </Text>
              ) : null}

              <Button
                h="3.688rem"
                w="full"
                type="submit"
                isLoading={formik.isSubmitting}
              >
                Submit
              </Button>
            </VStack>
          )}
        </Formik>
        <VStack w="full" maxW="420px" pt="1.5rem" spacing="1.5rem">
          <Heading color="brand.gray.50" fontSize="xl" textAlign="center">
            Spread the Word:
          </Heading>

          <Flex
            w="full"
            h="3.5rem"
            borderWidth="0.41px"
            borderColor="brand.gray.700"
            rounded="5px"
            alignItems="center"
            justifyContent="space-between"
            px="1.2rem"
          >
            <Input 
              fontSize="md"
              value={value}
              bg="none"
              borderColor="none"
              borderWidth="0"
              _focusVisible={{
                outline: 'none',
              }}
              color="brand.dark.200"
            />

            <Box onClick={onCopy} cursor="pointer">
              <Icon as={IoCopyOutline} fontSize="1.5rem" color="brand.purple.500" />
            </Box>
          </Flex>

          <SimpleGrid w="full" columns={2} gap="0.75rem">
             <Box w="full">
               <WhatsappShareButton
                 url={'https://perxels.com/sponsorship'}
                 title={'Get Full Scholarship into Perxels'}
                 separator=":: "
                 style={{ width: '100%' }}
               >
                 <Button
                   w="100%"
                   h="3.5rem"
                   leftIcon={<Icon as={IoLogoWhatsapp} fontSize="3xl" />}
                   variant="outline"
                 >
                   <Text
                     ml={{ base: '0.35rem', lg: '0.75rem' }}
                     fontSize={{ base: '1rem', lg: '1rem' }}
                   >
                     Share
                   </Text>
                 </Button>
               </WhatsappShareButton>
             </Box>
             <Box w="full">
               <TwitterShareButton
                 url={'https://perxels.com/sponsorship'}
                 title={'Get Full Scholarship into Perxels'}
                 style={{ width: '100%' }}
               >
                 <Button
                   w="full"
                   h="3.5rem"
                   leftIcon={<Icon as={IoLogoTwitter} fontSize="3xl" />}
                   variant="outline"
                 >
                   <Text
                     ml={{ base: '0.35rem', lg: '0.75rem' }}
                     fontSize={{ base: '1rem', lg: '1rem' }}
                   >
                     Tweet
                   </Text>
                 </Button>
               </TwitterShareButton>
             </Box>
           </SimpleGrid>
        </VStack>
      </Box>
    </>
  )
}

export default RegisterForm
