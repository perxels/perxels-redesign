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
  const scriptUrl = "https://script.google.com/macros/s/AKfycby4V374owr3y1T3V_0vxJKgwaQTw_4XKw4bZpAXQ7lk-Nk8xm8H1MhoL3Txj0nsxYKX4w/exec"
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
        px={['1rem', '1rem', '15%']}
        py="2rem"
      >
        <Heading
          fontSize="6xl"
          maxW="full"
          textAlign="center"
          color="brand.dark.100"
        >
         Register Now
        </Heading>
        <Text color="#121212" fontSize="16px" fontWeight="400" textAlign="center">
          Equip a teen with tech skills today
        </Text>
        <Formik
          initialValues={{
            name: '',
            phone: '',
            email: '',
            age: '',
            parentPhone: '',
          }}
          validationSchema={Yup.object({
            name: Yup.string().required('Name is required'),
            phone: Yup.string().required('Phone number is required'),
            email: Yup.string().email('Invalid email address').required('Email is required'),
            age: Yup.string().required('Age is required'),
            parentPhone: Yup.string().required('Parent Phone number is required'),
          })}
          onSubmit={(values, action) => {
            setLoading(true)

            console.log(values)

            const formData = new FormData()

            formData.append('name', values.name as string)
            formData.append('phone', values.phone as string)
            formData.append('email', values.email as string)
            formData.append('age', values.age as string)
            formData.append('parentPhone', values.parentPhone as string)
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
              maxW="full"
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
                placeholder="Teenager Name*"
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
                placeholder="Teenager Age"
                _placeholder={{ color: 'brand.dark.200' }}
                color="brand.dark.200"
                name="age"
                value={formik.values.age}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                borderColor={
                  formik.touched.age && formik.errors.age
                    ? 'red.500'
                    : 'brand.dark.200'
                }
                _focusVisible={{
                  outline: 'none',
                }}
              >
                <option value="12">12</option>
                <option value="13">13</option>
                <option value="14">14</option>
                <option value="15">15</option>
                <option value="16">16</option>
                <option value="17">17</option>
                <option value="18">18</option> 
              </Select>
              {formik.touched.age && formik.errors.age ? (
                <Text color="red.500" fontSize="sm">
                  {formik.errors.age}
                </Text>
              ) : null}
              
              <Input
                h="3.5rem"
                type="tel"
                placeholder="Parent Phone Number*"
                _placeholder={{ color: 'brand.dark.200' }}
                name="parentPhone"
                value={formik.values.parentPhone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                borderColor={
                  formik.touched.parentPhone && formik.errors.parentPhone
                    ? 'red.500'
                    : 'brand.dark.200'
                }
                _focusVisible={{
                  outline: 'none',
                }}
              />
              {formik.touched.parentPhone && formik.errors.parentPhone ? (
                <Text color="red.500" fontSize="sm">
                  {formik.errors.parentPhone}
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
