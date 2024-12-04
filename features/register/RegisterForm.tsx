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

interface registerInt{
  isApply?: boolean
}

const RegisterForm = ({isApply}: registerInt) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [loading, setLoading] = useState(false)

  const { onCopy, value, setValue } = useClipboard("https://perxels.com/sponorship");

  // const scriptUrlApply="https://script.google.com/macros/s/AKfycbxUIlH3eoxZ_8iY2BQp4VxSd_JvaNJkmtjTtCwTAB9UDrAiY9l93ymcOSuxQljwK50dNg/exec"
  const scriptUrl =
    'https://script.google.com/macros/s/AKfycbwoSKtp0rqkYGNtJD7F4OUSKO31FM9mxAHkJfPkYifG62-uNMg4EvblwA5v_AFPeuBb/exec'

    // const actualUrl =  isApply ? scriptUrlApply : scriptUrl
    

  return (
    <>
      <SuccessModal
        isOpen={isOpen}
        onClose={onClose}
        title="Your Application Have Been Received"
        description="You will get an email soon"
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
          Become a Beneficiary
        </Heading>

        <Text mt="1rem">Fill the form correctly</Text>

        <Formik
          initialValues={{
            firstname: '',
            lastname: '',
            phone: '',
            email: '',
            class: '',
            question: '',
            howdidyouknow: '',
            // gender: '',
            laptop: '',
            discount: '',
            socials: '',
            location: '',
            why: '',
            
          }}
          validationSchema={Yup.object({
            firstname: Yup.string().required('First Name is required'),
            lastname: Yup.string().required('Last Name is required'),
            phone: Yup.string().required('Phone number is required'),
            email: Yup.string()
              .email('Invalid email address')
              .required('Email is required'),
            class: Yup.string().required('Class is required'),
            question: Yup.string().required('question is required'),
            howdidyouknow: Yup.string().required(
              'How did you know is required',
            ),
            // gender: Yup.string().required('Gender is required'),
            laptop: Yup.string().required('Laptop Field is required'),
            discount: Yup.string().required('Discount field is required'),
            socials: Yup.string().required('Socials is required'),
            location: Yup.string().required('Location is required'),
            why: Yup.string().required('why is required'),
          })}
          onSubmit={(values, action) => {
            setLoading(true)

            console.log(values)

            const formData = new FormData()

            formData.append('firstname', values.firstname as string)
            formData.append('lastname', values.lastname as string)
            formData.append('phone', values.phone as string)
            formData.append('email', values.email as string)
            formData.append('class', values.class as string)
            formData.append('question', values.question as string)
            formData.append('howdidyouknow', values.howdidyouknow as string)
            // formData.append('gender', values.gender as string)
            formData.append('location', values.location as string)
            formData.append('laptop', values.laptop as string)
            formData.append('discount', values.discount as string)
            formData.append('socials', values.socials as string)
            formData.append('why', values.why as string)
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
                placeholder="First Name*"
                _placeholder={{ color: 'brand.dark.200' }}
                name="firstname"
                border="1px solid #000"
                value={formik.values.firstname}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                borderColor={
                  formik.touched.firstname && formik.errors.firstname
                    ? 'red.500'
                    : 'brand.dark.200'
                }
                _focusVisible={{
                  outline: 'none',
                }}
              />
              {formik.touched.firstname && formik.errors.firstname ? (
                <Text color="red.500" fontSize="sm">
                  {formik.errors.firstname}
                </Text>
              ) : null}
               <Input
                h="3.5rem"
                placeholder="Last Name*"
                _placeholder={{ color: 'brand.dark.200' }}
                name="lastname"
                border="1px solid #000"
                value={formik.values.lastname}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                borderColor={
                  formik.touched.lastname && formik.errors.lastname
                    ? 'red.500'
                    : 'brand.dark.200'
                }
                _focusVisible={{
                  outline: 'none',
                }}
              />
              {formik.touched.lastname && formik.errors.lastname ? (
                <Text color="red.500" fontSize="sm">
                  {formik.errors.lastname}
                </Text>
              ) : null}

                {/* <Select
                h="3.5rem"
                placeholder="Gender"
                _placeholder={{ color: 'brand.dark.200' }}
                color="brand.dark.200"
                name="gender"
                value={formik.values.gender}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                borderColor={
                  formik.touched.gender && formik.errors.gender
                    ? 'red.500'
                    : 'brand.dark.200'
                }
                _focusVisible={{
                  outline: 'none',
                }}
              >
                <option
                  value="Male"
                >
                 Male
                </option>
                <option
                  value="Female"
                >
                 Female
                </option>
                
              </Select>
              {formik.touched.gender && formik.errors.gender ? (
                <Text color="red.500" fontSize="sm">
                  {formik.errors.gender}
                </Text>
              ) : null} */}

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
                 <option value="Premium Virtual Class">
                 Premium Virtual Class
                </option>
                <option value="Physical Class (Lekki)">
                  Physical Class (Lekki)
                </option>
                <option value="Physical Class (YABA)">
                  Physical Class (YABA)
                </option>
                <option value="Physical Class (Ibadan)">
                  Physical Class (Ibadan)
                </option>
                <option value="Physical Class (Abuja)">
                  Physical Class (Abuja)
                </option>
                {/* <option
                  value="Basic Class to learn the FUNDAMENTALS of UIUX design in 7
                  weeks"
                >
                  Basic Class to learn the FUNDAMENTALS of UIUX design in 7
                  weeks 
                </option> */}
                {/* <option
                  value="Premium class for beginners to learn everything in UIUX design
                  from basic to PROFESSIONAL level in 3 months"
                >
                  Premium Class to expand your DESIGN THINKING and PROBLEM
                  SOLVING skills in 3 months
                </option>
                <option
                  value=" Physical Class for beginners to learn everything in UIUX design
                  from basic to PROFESSIONAL level for 3 months in our Lekki, Ibadan, Abuja Workspace"
                >
                  Physical Class for beginners to learn UIUX design
                  from basic to PROFESSIONAL level for 3 months in our Lekki, Ibadan, Abuja Workspace
                </option> */}
              </Select>
              {formik.touched.class && formik.errors.class ? (
                <Text color="red.500" fontSize="sm">
                  {formik.errors.class}
                </Text>
              ) : null}

              <Input
                h="3.5rem"
                type="text"
                placeholder="Location"
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
              />
              {formik.touched.location && formik.errors.location ? (
                <Text color="red.500" fontSize="sm">
                  {formik.errors.location}
                </Text>
              ) : null}

                <Box>
                  <Text mb="1rem">
                  *This scholarship offers a 30% discount on tuition, would you be able to pay the remaining 70%?
                  </Text>
                  <Select
                h="3.5rem"
                placeholder="This scholarship offers ..."
                _placeholder={{ color: 'brand.dark.200' }}
                color="brand.dark.200"
                name="discount"
                value={formik.values.discount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                borderColor={
                  formik.touched.discount && formik.errors.discount
                    ? 'red.500'
                    : 'brand.dark.200'
                }
                _focusVisible={{
                  outline: 'none',
                }}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </Select>
              {formik.touched.discount && formik.errors.discount ? (
                <Text color="red.500" fontSize="sm">
                  {formik.errors.discount}
                </Text>
              ) : null}
                </Box>
           

                <Select
                h="3.5rem"
                placeholder="Do you own a laptop?"
                _placeholder={{ color: 'brand.dark.200' }}
                color="brand.dark.200"
                name="laptop"
                value={formik.values.laptop}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                borderColor={
                  formik.touched.laptop && formik.errors.laptop
                    ? 'red.500'
                    : 'brand.dark.200'
                }
                _focusVisible={{
                  outline: 'none',
                }}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </Select>
              {formik.touched.laptop && formik.errors.laptop ? (
                <Text color="red.500" fontSize="sm">
                  {formik.errors.laptop}
                </Text>
              ) : null}


               
                {/* <Textarea
                h="3.5rem"
                placeholder="The training is Sundays, 2pm to 5pm for 7 weeks. Would you make yourself available??"
                _placeholder={{ color: 'brand.dark.200' }}
                name="available"
                value={formik.values.available}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                borderColor={
                  formik.touched.available && formik.errors.available
                    ? 'red.500'
                    : 'brand.dark.200'
                }
                _focusVisible={{
                  outline: 'none',
                }}
              />
              {formik.touched.available && formik.errors.available ? (
                <Text color="red.500" fontSize="sm">
                  {formik.errors.available}
                </Text>
              ) : null} */}
              
               <Textarea
                h="3.5rem"
                placeholder="Why do you want to learn UIUX design"
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



              <Textarea
                h="3.5rem"
                placeholder="Drop any question you have"
                _placeholder={{ color: 'brand.dark.200' }}
                name="question"
                value={formik.values.question}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                borderColor={
                  formik.touched.question && formik.errors.question
                    ? 'red.500'
                    : 'brand.dark.200'
                }
                _focusVisible={{
                  outline: 'none',
                }}
              />
              {formik.touched.question && formik.errors.question ? (
                <Text color="red.500" fontSize="sm">
                  {formik.errors.question}
                </Text>
              ) : null}

              <Select
                h="3.5rem"
                placeholder="Where did you hear about this Scholarship?"
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
                <option value="Roadtrip community">Roadtrip community</option>

              </Select>
              {formik.touched.howdidyouknow && formik.errors.howdidyouknow ? (
                <Text color="red.500" fontSize="sm">
                  {formik.errors.howdidyouknow}
                </Text>
              ) : null}

            <Input
                h="3.5rem"
                type="text"
                placeholder="Drop your social media handle"
                _placeholder={{ color: 'brand.dark.200' }}
                name="socials"
                value={formik.values.socials}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                borderColor={
                  formik.touched.socials && formik.errors.socials
                    ? 'red.500'
                    : 'brand.dark.200'
                }
                _focusVisible={{
                  outline: 'none',
                }}
              />
              {formik.touched.socials && formik.errors.socials ? (
                <Text color="red.500" fontSize="sm">
                  {formik.errors.socials}
                </Text>
              ) : null}

              <Button
                h="3.688rem"
                w="full"
                type="submit"
                isLoading={formik.isSubmitting}
              >
                Apply Now
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
