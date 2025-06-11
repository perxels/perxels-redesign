import * as Yup from 'yup'
import React from 'react'
import { Formik } from 'formik'
import {
  Box,
  Button,
  FormLabel,
  HStack,
  Input,
  Select,
  SimpleGrid,
  VStack,
} from '@chakra-ui/react'
import { AuthInput } from './auth-input'

const classPlans = [
  'Lagos Lekki Weekdays Physical Class',
  'Lagos Lekki Weekend Physical Class',
  'Abuja Physical Class',
  'FULLY ONLINE CLASS',
  'Lagos Yaba Weekend Class',
  'Lagos Yaba Weekday Class',
  'Ibadan Weekday Physical Class',
  'Ibadan Weekend Physical Class',
]

const formSchema = Yup.object().shape({
  cohort: Yup.string().required('Cohort is required'),
  classPlan: Yup.string()
    .required('Class plan is required')
    .oneOf(classPlans, 'Please select a valid class plan'),
  schoolFee: Yup.number()
    .required('School fee is required')
    .min(0, 'School fee must be greater than 0'),
  amountPaid: Yup.number()
    .required('Amount paid is required')
    .min(0, 'Amount paid must be greater than 0'),
  paymentReceipt: Yup.mixed()
    .required('Payment receipt is required')
    .test('fileSize', 'File size is too large', (value) => {
      if (!value) return true
      return value.size <= 5000000 // 5MB
    })
    .test('fileType', 'Unsupported file type', (value) => {
      if (!value) return true
      return ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type)
    }),
})

export const SchoolFeeInfoForm = () => {
  return (
    <Formik
      initialValues={{
        cohort: '',
        classPlan: '',
        schoolFee: 0,
        amountPaid: 0,
        paymentReceipt: null,
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
            <VStack w="full" alignItems="flex-start" gap="8">
              <AuthInput
                name="cohort"
                placeholder="What’s your cohort (Ask manager)"
              />

              <Box w="full">
                <Select
                  h="3.5rem"
                  w="full"
                  placeholder="What class plan*"
                  name="classPlan"
                  borderWidth={1}
                  borderColor={
                    touched.classPlan && errors.classPlan
                      ? 'red.500'
                      : 'yellow.300'
                  }
                  bgColor="yellow.50"
                  value={values.classPlan}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  _focus={{
                    borderColor:
                      touched.classPlan && errors.classPlan
                        ? 'red.500'
                        : 'yellow.400',
                    bgColor: 'yellow.50',
                  }}
                  _focusVisible={{
                    outline: 'none',
                  }}
                  _active={{
                    borderColor:
                      touched.classPlan && errors.classPlan
                        ? 'red.500'
                        : 'yellow.400',
                    bgColor: 'yellow.50',
                  }}
                  _hover={{
                    borderColor:
                      touched.classPlan && errors.classPlan
                        ? 'red.500'
                        : 'yellow.400',
                    bgColor: 'yellow.50',
                  }}
                >
                  {classPlans.map((plan) => (
                    <option key={plan} value={plan}>
                      {plan}
                    </option>
                  ))}
                </Select>
              </Box>

              <AuthInput
                name="schoolFee"
                placeholder="How much is your school fee*"
              />

              <AuthInput
                name="amountPaid"
                placeholder="How much have you paid*"
              />
            </VStack>

            <VStack w="full" alignItems="flex-start" gap="8">
              <Input
                type="file"
                name="paymentReceipt"
                onChange={handleChange}
                onBlur={handleBlur}
                accept="image/*"
                hidden
                id="paymentReceipt"
              />

              <FormLabel
                w="full"
                h="14.5rem"
                bg="yellow.50"
                borderWidth={1}
                borderColor="yellow.300"
                rounded="md"
                htmlFor="paymentReceipt"
                cursor="pointer"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="md"
                textAlign="center"
                color="brand.dark.100"
              >
                Upload your payment receipt <br />
                (as screenshot)
              </FormLabel>
            </VStack>
          </SimpleGrid>


          <HStack justifyContent="flex-end" w="full" mt={10}>
            <Button
              h="3.5rem"
              type="submit"
              disabled={isSubmitting || !isValid}
              isLoading={isSubmitting}
              px={16}
            >
              Next
            </Button>
          </HStack>
        </VStack>
      )}
    </Formik>
  )
}
