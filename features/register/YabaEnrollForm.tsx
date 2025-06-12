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

const YabaEnrollForm = () => {
  // const scriptUrl = "https://script.google.com/macros/s/AKfycbx8MZaxF-1MRSZ7eW_R897bLiAnJcYs7lpY29IKBCuNMsQvc7h9VEDXJ3wJ43p3m_Oz/exec"
  const scriptUrl = "https://script.google.com/macros/s/AKfycbwF27uln-IFrpGnjBGsTJJwijDOvpUlUVan5NQfHor49SspTXQoAJRP-_O40oxzvDid/exec"
  const { isOpen, onOpen, onClose } = useDisclosure()
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
          You&apos;re one step ahead to achieving your goal
        </Heading>

        <Formik
          initialValues={{
            name: '',
            phone: '',
            email: '',
            class: '',
            location: '',
            howdidyouknow: '',
            otherSource: '',
            isPaidAware: '',
            hasLaptop: '',
            canPayTuition: '',
            motivation: '',
            canCommit: ''
          }}
          validationSchema={Yup.object({
            name: Yup.string().required('Name is required'),
            phone: Yup.string().required('Phone number is required'),
            email: Yup.string()
              .email('Invalid email address')
              .required('Email is required'),
            class: Yup.string().required('Class is required'),
            location: Yup.string().required('Location is required'),
            howdidyouknow: Yup.string().required('How did you know is required'),
            isPaidAware: Yup.string().required('This field is required'),
            hasLaptop: Yup.string().required('This field is required'),
            canPayTuition: Yup.string().required('This field is required'),
            motivation: Yup.string().required('This field is required'),
            canCommit: Yup.string().required('This field is required')
          })}
          onSubmit={(values, action) => {
            setLoading(true)
            const formData = new FormData()
            formData.append('name', values.name as string)
            formData.append('phone', values.phone as string)
            formData.append('email', values.email as string)
            formData.append('class', values.class as string)
            formData.append('location', values.location as string)
            formData.append('howdidyouknow', values.howdidyouknow as string)
            formData.append('otherSource', values.otherSource as string)
            formData.append('isPaidAware', values.isPaidAware as string)
            formData.append('hasLaptop', values.hasLaptop as string)
            formData.append('canPayTuition', values.canPayTuition as string)
            formData.append('motivation', values.motivation as string)
            formData.append('canCommit', values.canCommit as string)
            formData.append('created_at', new Date().toLocaleString())

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
                <option value="Yaba (Weekend)">Yaba Weekend</option>
                <option value="Yaba (Weekday)">Yaba Weekday</option>
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

              <Select
                h="3.5rem"
                placeholder="Are you aware that this is a paid training program?"
                _placeholder={{ color: 'brand.dark.200' }}
                color="brand.dark.200"
                name="isPaidAware"
                value={formik.values.isPaidAware}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                borderColor={
                  formik.touched.isPaidAware && formik.errors.isPaidAware
                    ? 'red.500'
                    : 'brand.dark.200'
                }
                _focusVisible={{
                  outline: 'none',
                }}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </Select>
              {formik.touched.isPaidAware && formik.errors.isPaidAware ? (
                <Text color="red.500" fontSize="sm">
                  {formik.errors.isPaidAware}
                </Text>
              ) : null}

              <Select
                h="3.5rem"
                placeholder="Do you have access to a laptop or personal computer?"
                _placeholder={{ color: 'brand.dark.200' }}
                color="brand.dark.200"
                name="hasLaptop"
                value={formik.values.hasLaptop}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                borderColor={
                  formik.touched.hasLaptop && formik.errors.hasLaptop
                    ? 'red.500'
                    : 'brand.dark.200'
                }
                _focusVisible={{
                  outline: 'none',
                }}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </Select>
              {formik.touched.hasLaptop && formik.errors.hasLaptop ? (
                <Text color="red.500" fontSize="sm">
                  {formik.errors.hasLaptop}
                </Text>
              ) : null}

              <Select
                h="3.5rem"
                placeholder="Are you prepared to pay the tuition fee of ₦200,000?"
                _placeholder={{ color: 'brand.dark.200' }}
                color="brand.dark.200"
                name="canPayTuition"
                value={formik.values.canPayTuition}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                borderColor={
                  formik.touched.canPayTuition && formik.errors.canPayTuition
                    ? 'red.500'
                    : 'brand.dark.200'
                }
                _focusVisible={{
                  outline: 'none',
                }}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </Select>
              {formik.touched.canPayTuition && formik.errors.canPayTuition ? (
                <Text color="red.500" fontSize="sm">
                  {formik.errors.canPayTuition}
                </Text>
              ) : null}

              <Textarea
                placeholder="What motivates you to enroll in this UI/UX design course?"
                _placeholder={{ color: 'brand.dark.200' }}
                name="motivation"
                value={formik.values.motivation}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                borderColor={
                  formik.touched.motivation && formik.errors.motivation
                    ? 'red.500'
                    : 'brand.dark.200'
                }
                _focusVisible={{
                  outline: 'none',
                }}
              />
              {formik.touched.motivation && formik.errors.motivation ? (
                <Text color="red.500" fontSize="sm">
                  {formik.errors.motivation}
                </Text>
              ) : null}

              <Select
                h="3.5rem"
                placeholder="Can you commit to attending all classes and completing assignments?"
                _placeholder={{ color: 'brand.dark.200' }}
                color="brand.dark.200"
                name="canCommit"
                value={formik.values.canCommit}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                borderColor={
                  formik.touched.canCommit && formik.errors.canCommit
                    ? 'red.500'
                    : 'brand.dark.200'
                }
                _focusVisible={{
                  outline: 'none',
                }}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </Select>
              {formik.touched.canCommit && formik.errors.canCommit ? (
                <Text color="red.500" fontSize="sm">
                  {formik.errors.canCommit}
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
                <option value="Roadtrip community">Roadtrip community</option>
                <option value="other">Other</option>
              </Select>
              {formik.touched.howdidyouknow && formik.errors.howdidyouknow ? (
                <Text color="red.500" fontSize="sm">
                  {formik.errors.howdidyouknow}
                </Text>
              ) : null}

              {formik.values.howdidyouknow === 'other' && (
                <Input
                  h="3.5rem"
                  type="text"
                  placeholder="Please specify"
                  _placeholder={{ color: 'brand.dark.200' }}
                  name="otherSource"
                  value={formik.values.otherSource}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  _focusVisible={{
                    outline: 'none',
                  }}
                />
              )}

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

export default YabaEnrollForm