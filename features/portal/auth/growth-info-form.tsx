import * as Yup from 'yup'
import React from 'react'
import { Box, Button, FormControl, HStack, Select, SimpleGrid, VStack } from '@chakra-ui/react'
import { Formik } from 'formik'
import { AuthInput } from './auth-input'

const formSchema = Yup.object().shape({
  profession: Yup.string().required('Profession is required'),
  whyClass: Yup.string().required('Why UI/UX is required'),
  classOutcome: Yup.string().required('Class outcome is required'),
  gender: Yup.string()
    .required('Gender is required')
    .oneOf(['male', 'female'], 'Please select a valid gender'),
  picture: Yup.mixed()
    .required('Picture is required')
    .test('fileSize', 'File size is too large', (value) => {
      if (!value) return true
      return value.size <= 5000000 // 5MB
    })
    .test('fileType', 'Unsupported file type', (value) => {
      if (!value) return true
      return ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type)
    }),
})

export const GrowthInfoForm = () => {
  return (
    <Formik
      initialValues={{
        profession: '',
        whyClass: '',
        classOutcome: '',
        gender: '',
        picture: null,
      }}
      validationSchema={formSchema}
      onSubmit={async (values, actions) => {
        console.log(values)
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        isSubmitting,
        isValid,
      }) => (
        <VStack w="full" alignItems="flex-start">
          <SimpleGrid columns={2} spacing={10} w="full" maxW={'750px'}>
            <AuthInput name="profession" placeholder="Current Profession" />

            <AuthInput
              name="whyClass"
              label="Why UI/UX"
              placeholder="Why UIUX Design"
            />

            <AuthInput
              name="classOutcome"
              placeholder="What are you looking foeward to?"
            />

            <Box w="full">
              <Select
                h="3.5rem"
                w="full"
                placeholder="What class plan*"
                name="classPlan"
                borderWidth={1}
                borderColor={
                  touched.gender && errors.gender
                    ? 'red.500'
                    : 'yellow.300'
                }
                bgColor="yellow.50"
                value={values.gender}
                onChange={handleChange}
                onBlur={handleBlur}
                _focus={{
                  borderColor:
                    touched.gender && errors.gender
                      ? 'red.500'
                      : 'yellow.400',
                  bgColor: 'yellow.50',
                }}
                _focusVisible={{
                  outline: 'none',
                }}
                _active={{
                  borderColor:
                    touched.gender && errors.gender
                      ? 'red.500'
                      : 'yellow.400',
                  bgColor: 'yellow.50',
                }}
                _hover={{
                  borderColor:
                    touched.gender && errors.gender
                      ? 'red.500'
                      : 'yellow.400',
                  bgColor: 'yellow.50',
                }}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </Select>
            </Box>

            <AuthInput
              name="picture"
              placeholder="Upload your picture"
              type="file"
              accept="image/*"
              onChange={(e) => {
                handleChange(e)
                handleBlur(e)
              }}
            />
          </SimpleGrid>

          <HStack justifyContent="flex-end" w="full" mt={10}>
            <Button h="3.5rem" type="submit" disabled={isSubmitting || !isValid} isLoading={isSubmitting} px={16}>Next</Button>
          </HStack>
        </VStack>
      )}
    </Formik>
  )
}
