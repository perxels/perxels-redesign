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
  const scriptUrl = "https://script.google.com/macros/s/AKfycbwkdIngf-2iAPwhv6I0ap3Vmlg52LvrS_DSUaZ-n8HGBgdUEfMu5BpfHe7pSmfa0aP-AA/exec"
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [errorBorder, setErrorBorder] = useState()
  const [loading, setLoading] = useState(false)
  const [classVal, setClassValue] = useState<string> ("")
  const { onCopy, value, setValue } = useClipboard("https://perxels.com/exam");

  return (
    <>
      <SuccessModal
        isOpen={isOpen}
        onClose={onClose}
        title={`Thank you for your submission!`}
        description="Our representative will send a email to you within the next 24 hours."
        buttonTitle="Go back Home"
      />
      <Box
        className="enrol-form"
        overflowY="scroll"
        px={['1rem', '1rem', '3rem']}
        py="2rem"
        display="flex"
        flexDir="column"
        alignItems="center"
        justifyContent="center"
        pt="8rem"
      >
        <Heading
          fontSize="6xl"
          maxW="full"
          textAlign="center"
          color="brand.dark.100"
        >
      Register now to Claim this Offer
        </Heading>
        <Text>
        Register now to Claim this Offer
        </Text>

        <Formik
          initialValues={{
            name: '',
            phone: '',
            email: '',
            class: '',
            experience: '',
            portfolio: '',
            linkedin: '',
            // category: '',
          }}
          validationSchema={Yup.object({
            name: Yup.string().required('Name is required'),
            phone: Yup.string().required('Phone number is required'),
            email: Yup.string()
              .email('Invalid email address')
              .required('Email is required'),
            //x location: Yup.string().required('Location is required'),
            // howdidyouknow: Yup.string().required(
            //   'How did you know is required',
            // ),
            // reason: Yup.string().required('Reason is required'),
            experience: Yup.string().required('Experience is required'),
            portfolio: Yup.string().matches(
              /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
              'Enter correct url!'
          ).required('Portfolio is required'),
            linkedin: Yup.string().matches(
              /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
              'Enter correct url!'
          ).required('Linkedin is required'),
            // category: Yup.string().required('Category is required'),
          })}
          onSubmit={(values, action) => {
            setLoading(true)
        
          
            const formData = new FormData()

            formData.append('name', values.name as string)
            formData.append('phone', values.phone as string)
            formData.append('email', values.email as string)
            // formData.append('location', values.location as string)
            // formData.append('howdidyouknow', values.howdidyouknow as string)
            // formData.append('category', values.category as string)
            // formData.append('reason', values.reason as string)
            formData.append('experience', values.experience as string)
            formData.append('portfolio', values.portfolio as string)
            formData.append('linkedin', values.linkedin as string)
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
     
              <Input
                h="3.5rem"
                type="text"
                placeholder="How many years of experience in designing"
                _placeholder={{ color: 'brand.dark.200' }}
                name="experience"
                value={formik.values.experience}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                borderColor={
                  formik.touched.experience && formik.errors.experience
                    ? 'red.500'
                    : 'brand.dark.200'
                }
                _focusVisible={{
                  outline: 'none',
                }}
              />
              {formik.touched.experience && formik.errors.experience ? (
                <Text color="red.500" fontSize="sm">
                  {formik.errors.experience}
                </Text>
              ) : null}


              
            
             
              {/* <Select
                h="3.5rem"
                placeholder="How did you get to know about Perxels?"
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
                <option value="Facebook">Faceboo</option>
                <option value="Twitter">Twitter</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Instagram">Instagram</option>
                <option value="WhatsApp">WhatsApp</option>
              </Select> */}
              {/* {formik.touched.howdidyouknow && formik.errors.howdidyouknow ? (
                <Text color="red.500" fontSize="sm">
                  {formik.errors.howdidyouknow}
                </Text>
              ) : null} */}



<Input
                h="3.5rem"
                type="text"
                placeholder="Portfolio Link"
                _placeholder={{ color: 'brand.dark.200' }}
                name="portfolio"
                value={formik.values.portfolio}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                borderColor={
                  formik.touched.portfolio && formik.errors.portfolio
                    ? 'red.500'
                    : 'brand.dark.200'
                }
                _focusVisible={{
                  outline: 'none',
                }}
              />
              {formik.touched.portfolio && formik.errors.portfolio ? (
                <Text color="red.500" fontSize="sm">
                  {formik.errors.portfolio}
                </Text>
              ) : null}

<Input
                h="3.5rem"
                type="text"
                placeholder="Linkedin Profile Link"
                _placeholder={{ color: 'brand.dark.200' }}
                name="linkedin"
                value={formik.values.linkedin}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                borderColor={
                  formik.touched.linkedin && formik.errors.linkedin
                    ? 'red.500'
                    : 'brand.dark.200'
                }
                _focusVisible={{
                  outline: 'none',
                }}
              />
              {formik.touched.linkedin && formik.errors.linkedin? (
                <Text color="red.500" fontSize="sm">
                  {formik.errors.linkedin}
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
                 url={'https://perxels.com/exam'}
                 title={'Get Full Evaluation on your skills'}
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
                  url={'https://perxels.com/exam'}
                  title={'Get Full Evaluation on your skills'}
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

export default EnrolForm
