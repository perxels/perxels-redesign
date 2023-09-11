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
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { SuccessModal } from '../../components'
import { Formik } from 'formik'
import * as Yup from 'yup'
const EnrolForm = () => {
  // const scriptUrl =
  //   'https://script.google.com/macros/s/AKfycbwAZGaK5T6mfK1wOv99PwLlUdcM_Jli58wtDbX8zn8BFsdxQSYSRuLuDP4TtKATdmj0/exec'
  const scriptUrl = "https://script.google.com/macros/s/AKfycbwftTI2bqcYNfUCIHBtiY8r_5nwL-VEsz4lR9pv97ORO-h6YLo7vQ0ksKEm7Oc1ZVA/exec"
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [errorBorder, setErrorBorder] = useState()
  const [loading, setLoading] = useState(false)
  const [classVal, setClassValue] = useState<string> ("")
  return (
    <>
      <SuccessModal
        isOpen={isOpen}
        onClose={onClose}
        title={`Thank you for your registering for the ${classVal} Masterclass!`}
        description="Join the Class by clicking on the button."
        buttonTitle="Join Class"
        buttonHref={'https://chat.whatsapp.com/BQljkHzw5nKKsVGVyAzKaO'}
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
        Please kindly input your information in the boxes below.
        </Heading>

        <Formik
          initialValues={{
            name: '',
            phone: '',
            email: '',
            // class: '',
            location: '',
            reason: '',
            howdidyouknow: '',
            category: '',
            laptop: '',
          }}
          validationSchema={Yup.object({
            name: Yup.string().required('Name is required'),
            phone: Yup.string().required('Phone number is required'),
            email: Yup.string()
              .email('Invalid email address')
              .required('Email is required'),
            // class: Yup.string().required('Class is required'),
            location: Yup.string().required('Location is required'),
            howdidyouknow: Yup.string().required(
              'How did you know is required',
            ),
            reason: Yup.string().required('Reason is required'),
            category: Yup.string().required('Category is required'),
            laptop: Yup.string().required('Laptop is Required')
          })}
          onSubmit={(values, action) => {
            setLoading(true)
            // setClassValue(values.class)
            console.log(values)
          
            const formData = new FormData()

            formData.append('name', values.name as string)
            formData.append('phone', values.phone as string)
            formData.append('email', values.email as string)
            // formData.append('class', values.class as string)
            formData.append('location', values.location as string)
            formData.append('howdidyouknow', values.howdidyouknow as string)
            formData.append('category', values.category as string)
            formData.append('reason', values.reason as string)
            formData.append('laptop', values.laptop as string)
          
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

              {/* <Select
                h="3.5rem"
                placeholder="What class do you want to apply for?"
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
                <option value="Basic">Basic Program</option>
                <option value="Intermediate">Intermediate Program</option>
              </Select>
              {formik.touched.class && formik.errors.class ? (
                <Text color="red.500" fontSize="sm">
                  {formik.errors.class}
                </Text>
              ) : null} */}
              <Select
                h="3.5rem"
                placeholder="Do you own a laptop"
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


              <Input
                h="3.5rem"
                type="text"
                placeholder="Where are you located? E.g Bodija, Iwo road..."
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
                <Input
                h="3.5rem"
                type="text"
                placeholder="Why do you want to join the session? *"
                _placeholder={{ color: 'brand.dark.200' }}
                name="reason"
                value={formik.values.reason}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                borderColor={
                  formik.touched.reason && formik.errors.reason
                    ? 'red.500'
                    : 'brand.dark.200'
                }
                _focusVisible={{
                  outline: 'none',
                }}
              />
              {formik.touched.reason && formik.errors.reason ? (
                <Text color="red.500" fontSize="sm">
                  {formik.errors.reason}
                </Text>
              ) : null}
              <Input
                h="3.5rem"
                type="text"
                placeholder="What do you currently do? (Eg Graphics Designer, Banker etc)"
                _placeholder={{ color: 'brand.dark.200' }}
                name="category"
                value={formik.values.category}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                borderColor={
                  formik.touched.category && formik.errors.category
                    ? 'red.500'
                    : 'brand.dark.200'
                }
                _focusVisible={{
                  outline: 'none',
                }}
              />
              {formik.touched.category && formik.errors.category ? (
                <Text color="red.500" fontSize="sm">
                  {formik.errors.category}
                </Text>
              ) : null}
              <Select
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
      </Box>
    </>
  )
}

export default EnrolForm
