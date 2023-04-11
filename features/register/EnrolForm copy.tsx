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
  const scriptUrl = "https://script.google.com/macros/s/AKfycbyl2IyffUE4-yClOGUiS5oLhkQ0xZrvxE5eeLDlCaG27QZTcESt7HIAxybOsj1vI0g5/exec"
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [errorBorder, setErrorBorder] = useState()
  const [loading, setLoading] = useState(false)
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
            location: '',
            howdidyouknow: '',
            occupation: '',
          }}
          validationSchema={Yup.object({
            name: Yup.string().required('Name is required'),
            phone: Yup.string().required('Phone number is required'),
            email: Yup.string()
              .email('Invalid email address')
              .required('Email is required'),
            class: Yup.string().required('Class is required'),
            location: Yup.string().required('Location is required'),
            howdidyouknow: Yup.string().required(
              'How did you know is required',
            ),
            occupation: Yup.string().required('Occupation is required'),
          })}
          onSubmit={(values, action) => {
            setLoading(true)

            console.log(values)

            const formData = new FormData()

            formData.append('name', values.name as string)
            formData.append('phone', values.phone as string)
            formData.append('email', values.email as string)
            formData.append('class', values.class as string)
            formData.append('location', values.location as string)
            formData.append('howdidyouknow', values.howdidyouknow as string)
            formData.append('occupation', values.occupation as string)
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

              <Select
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
                <option value="Basic Program">Basic Program</option>
                <option value="Advanced Program">Advanced Program</option>
                <option value="Premium (Virtual) Program">
                  Premium (Virtual) Program
                </option>
                <option value="Premium (Physical) Program">
                  Premium (Physical) Program
                </option>
                <option value="International Class">International Class</option>
                <option value="Private Class">Private Class</option>
              </Select>
              {formik.touched.class && formik.errors.class ? (
                <Text color="red.500" fontSize="sm">
                  {formik.errors.class}
                </Text>
              ) : null}

              <Input
                h="3.5rem"
                type="text"
                placeholder="Where are you located? E.g Lagos, Nigeria"
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
                placeholder="What do you currently do? (Eg Graphics Designer, Banker etc)"
                _placeholder={{ color: 'brand.dark.200' }}
                name="occupation"
                value={formik.values.occupation}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                borderColor={
                  formik.touched.occupation && formik.errors.occupation
                    ? 'red.500'
                    : 'brand.dark.200'
                }
                _focusVisible={{
                  outline: 'none',
                }}
              />
              {formik.touched.occupation && formik.errors.occupation ? (
                <Text color="red.500" fontSize="sm">
                  {formik.errors.occupation}
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
