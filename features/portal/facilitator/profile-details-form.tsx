import React from 'react'
import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Text,
  useToast,
  FormErrorMessage,
  Grid,
  GridItem,
  Alert,
  AlertIcon,
} from '@chakra-ui/react'
import { Formik, Form, Field, FieldProps } from 'formik'
import * as Yup from 'yup'
import { usePortalAuth } from '../../../hooks/usePortalAuth'
import { useFacilitator } from '../../../hooks/useFacilitator'
import { FacilitatorFormData } from '../../../types/facilitator'

const validationSchema = Yup.object({
  fullName: Yup.string()
    .required('Full name is required')
    .min(2, 'Full name must be at least 2 characters')
    .max(50, 'Full name must not exceed 50 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Full name can only contain letters and spaces'),

  phone: Yup.string()
    .required('Phone number is required')
    .matches(
      /^(\+234|0)[789][01]\d{8}$/,
      'Enter a valid Nigerian phone number',
    ),

  gender: Yup.string()
    .required('Gender is required')
    .oneOf(['male', 'female'], 'Please select a valid gender'),

  profession: Yup.string()
    .required('Profession is required')
    .min(2, 'Profession must be at least 2 characters')
    .max(100, 'Profession must not exceed 100 characters'),

  dateOfBirth: Yup.date()
    .max(new Date(), 'Date of birth cannot be in the future')
    .nullable(),

  address: Yup.string()
    .required('Address is required')
    .min(10, 'Address must be at least 10 characters')
    .max(200, 'Address must not exceed 200 characters'),
})

export const ProfileDetailsForm: React.FC = () => {
  const { portalUser } = usePortalAuth()
  const { updateFacilitatorProfile, loading } = useFacilitator()
  const toast = useToast()

  const initialValues: FacilitatorFormData = {
    fullName: portalUser?.fullName || '',
    phone: portalUser?.phone || '',
    gender: portalUser?.gender || '',
    profession: portalUser?.profession || '',
    dateOfBirth: portalUser?.dateOfBirth || '',
    address: portalUser?.address || '',
  }

  const handleSubmit = async (
    values: FacilitatorFormData,
    { resetForm }: any,
  ) => {
    if (!portalUser?.uid) {
      toast({
        title: 'Error',
        description: 'User not found. Please try logging in again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    const result = await updateFacilitatorProfile(portalUser.uid, values)

    if (result?.success) {
      toast({
        title: 'Success',
        description: 'Profile updated successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      // Reset form with new values to clear dirty state
      resetForm({ values })
    } else {
      // Show error toast if update failed
      toast({
        title: 'Error',
        description:
          result?.error || 'Failed to update profile. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  // Show loading state while portalUser is being fetched
  if (!portalUser) {
    return (
      <Box maxW="600px" w="full" textAlign="center" py={8}>
        <Text>Loading user data...</Text>
      </Box>
    )
  }

  return (
    <Box maxW="600px" w="full">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ errors, touched, isValid, dirty, resetForm }) => (
          <Form>
            <VStack spacing={6}>
              <Grid templateColumns="repeat(1, 1fr)" gap={4} w="full">
                {/* Full Name */}
                <Field name="fullName">
                  {({ field }: FieldProps) => (
                    <FormControl
                      isInvalid={!!errors.fullName && touched.fullName}
                    >
                      <FormLabel
                        fontSize="sm"
                        fontWeight="medium"
                        color="gray.700"
                      >
                        Full Name *
                      </FormLabel>
                      <Input
                        {...field}
                        placeholder="Enter your full name"
                        bg="white"
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="md"
                        h="3rem"
                        _focus={{
                          borderColor: 'brand.purple.500',
                          bg: 'white',
                          boxShadow:
                            '0 0 0 1px var(--chakra-colors-brand-purple-500)',
                        }}
                      />
                      <FormErrorMessage>{errors.fullName}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                {/* Phone Number */}
                <Field name="phone">
                  {({ field }: FieldProps) => (
                    <FormControl isInvalid={!!errors.phone && touched.phone}>
                      <FormLabel
                        fontSize="sm"
                        fontWeight="medium"
                        color="gray.700"
                      >
                        Phone Number *
                      </FormLabel>
                      <Input
                        {...field}
                        placeholder="e.g., 08012345678 or +2348012345678"
                        bg="white"
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="md"
                        h="3rem"
                        _focus={{
                          borderColor: 'brand.purple.500',
                          bg: 'white',
                        }}
                      />
                      <FormErrorMessage>{errors.phone}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                {/* Gender */}
                <Field name="gender">
                  {({ field }: FieldProps) => (
                    <FormControl isInvalid={!!errors.gender && touched.gender}>
                      <FormLabel
                        fontSize="sm"
                        fontWeight="medium"
                        color="gray.700"
                      >
                        Gender *
                      </FormLabel>
                      <Select
                        {...field}
                        placeholder="Select gender"
                        bg="white"
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="md"
                        h="3rem"
                        _focus={{
                          borderColor: 'brand.purple.500',
                          bg: 'white',
                        }}
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </Select>
                      <FormErrorMessage>{errors.gender}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                {/* Profession */}
                <Field name="profession">
                  {({ field }: FieldProps) => (
                    <FormControl
                      isInvalid={!!errors.profession && touched.profession}
                    >
                      <FormLabel
                        fontSize="sm"
                        fontWeight="medium"
                        color="gray.700"
                      >
                        Profession *
                      </FormLabel>
                      <Input
                        {...field}
                        placeholder="Your profession or occupation"
                        bg="white"
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="md"
                        h="3rem"
                        _focus={{
                          borderColor: 'brand.purple.500',
                          bg: 'white',
                        }}
                      />
                      <FormErrorMessage>{errors.profession}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                {/* Date of Birth */}
                <Field name="dateOfBirth">
                  {({ field }: FieldProps) => (
                    <FormControl
                      isInvalid={!!errors.dateOfBirth && touched.dateOfBirth}
                    >
                      <FormLabel
                        fontSize="sm"
                        fontWeight="medium"
                        color="gray.700"
                      >
                        Date of Birth
                      </FormLabel>
                      <Input
                        {...field}
                        type="date"
                        bg="white"
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="md"
                        h="3rem"
                        _focus={{
                          borderColor: 'brand.purple.500',
                          bg: 'white',
                        }}
                      />
                      <FormErrorMessage>{errors.dateOfBirth}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>

                {/* Address */}
                <Field name="address">
                  {({ field }: FieldProps) => (
                    <FormControl
                      isInvalid={!!errors.address && touched.address}
                    >
                      <FormLabel
                        fontSize="sm"
                        fontWeight="medium"
                        color="gray.700"
                      >
                        Address *
                      </FormLabel>
                      <Input
                        {...field}
                        placeholder="Your complete residential address"
                        bg="white"
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="md"
                        h="3rem"
                        _focus={{
                          borderColor: 'brand.purple.500',
                          bg: 'white',
                        }}
                      />
                      <FormErrorMessage>{errors.address}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
              </Grid>

              {/* Action Buttons */}
              <VStack w="full" spacing={3}>
                <Button
                  type="submit"
                  isLoading={loading}
                  loadingText="Saving Changes..."
                  isDisabled={!isValid || !dirty || loading}
                  bg="brand.purple.500"
                  color="white"
                  size="lg"
                  w="full"
                  h="3rem"
                  borderRadius="md"
                  fontWeight="medium"
                  _hover={{
                    bg: 'brand.purple.600',
                    transform: 'translateY(-1px)',
                    boxShadow: 'lg',
                  }}
                  _active={{
                    transform: 'translateY(0)',
                  }}
                  transition="all 0.2s"
                >
                  Save Changes
                </Button>

                {dirty && (
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    w="full"
                    h="2.5rem"
                    onClick={() => resetForm()}
                    isDisabled={loading}
                  >
                    Discard Changes
                  </Button>
                )}
              </VStack>
            </VStack>
          </Form>
        )}
      </Formik>
    </Box>
  )
}
