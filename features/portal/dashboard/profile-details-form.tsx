import React, { useState } from 'react'
import {
  VStack,
  HStack,
  Input,
  Select,
  Button,
  Text,
  useToast,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Box,
} from '@chakra-ui/react'
import { CustomDatePicker } from '../../../components'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { format } from 'date-fns'
import { usePortalAuth } from '../../../hooks/usePortalAuth'
import { useProfileOperations } from '../../../hooks/useProfileOperations'
import { portalAuth } from '../../../portalFirebaseConfig'
import { classPlans } from '../../../constant/adminConstants'

interface ProfileDetailsFormValues {
  fullName: string
  phone: string
  gender: string
  dateOfBirth: string
  dateOfEnrollment: string
  classCohort: string
}

const validationSchema = Yup.object().shape({
  fullName: Yup.string()
    .required('Full name is required')
    .min(2, 'Full name must be at least 2 characters')
    .max(50, 'Full name must not exceed 50 characters')
    .matches(/^[a-zA-Z\s]*$/, 'Full name can only contain letters and spaces')
    .trim(),

  phone: Yup.string()
    .required('Phone number is required')
    .matches(
      /^(\+234|0)[789][01]\d{8}$/,
      'Enter a valid Nigerian phone number (e.g., +2348012345678 or 08012345678)',
    )
    .trim(),

  gender: Yup.string()
    .required('Gender is required')
    .oneOf(['male', 'female'], 'Please select a valid gender'),

  dateOfEnrollment: Yup.date()
    .required('Date of enrollment is required')
    .max(new Date(), 'Date of enrollment cannot be in the future'),

  classCohort: Yup.string()
    .required('Class cohort is required')
    .oneOf(classPlans, 'Please select a valid class plan'),
})

export const ProfileDetailsForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const toast = useToast()
  const { portalUser } = usePortalAuth()
  const { updateProfileDetails, isLoading: isProfileLoading } = useProfileOperations()

  // Helper function to safely convert Firestore timestamp to date string
  const formatDateForInput = (dateValue: any): string => {
    if (!dateValue) return ''
    
    try {
      // Handle Firestore Timestamp objects
      if (dateValue && typeof dateValue === 'object' && dateValue.seconds) {
        return new Date(dateValue.seconds * 1000).toISOString().split('T')[0]
      }
      
      // Handle regular Date objects or date strings
      const date = new Date(dateValue)
      if (isNaN(date.getTime())) return ''
      
      return date.toISOString().split('T')[0]
    } catch (error) {
      console.error('Error formatting date:', error)
      return ''
    }
  }

  // Extract existing data from portalUser
  const initialValues: ProfileDetailsFormValues = {
    fullName: portalUser?.fullName || '',
    phone: portalUser?.phone || '',
    gender: portalUser?.growthInfo?.gender || '',
    dateOfBirth: portalUser?.growthInfo?.dateOfBirth || '',
    dateOfEnrollment: portalUser?.growthInfo?.dateOfEnrollment || formatDateForInput(portalUser?.createdAt),
    classCohort: portalUser?.schoolFeeInfo?.classPlan || '',
  }

  const handleSubmit = async (values: ProfileDetailsFormValues) => {
    setIsSubmitting(true)

    try {
      // Verify user authentication
      const currentUser = portalAuth.currentUser
      if (!currentUser || !portalUser?.uid) {
        throw new Error('User not authenticated. Please log in again.')
      }

      await currentUser.reload()
      const uid = currentUser.uid

      // Update user profile using client-side hook
      const result = await updateProfileDetails(uid, {
        fullName: values.fullName.trim(),
        phone: values.phone.trim(),
        schoolFeeInfo: {
          ...portalUser?.schoolFeeInfo,
          classPlan: values.classCohort,
        },
        growthInfo: {
          ...portalUser?.growthInfo,
          gender: values.gender,
          dateOfEnrollment: values.dateOfEnrollment,
        },
      })

      if (!result.success) {
        throw new Error(result.error || 'Failed to update profile details')
      }

      // Refresh page to show updated data
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (error: any) {
      console.error('Profile update error:', error)

      let errorMessage = 'Failed to update profile details. Please try again.'
      if (error.message.includes('authentication')) {
        errorMessage = 'Please log in again to update your profile.'
      } else if (error.message.includes('Network')) {
        errorMessage =
          'Network error. Please check your connection and try again.'
      }

      toast({
        title: 'Update Failed',
        description: errorMessage,
        status: 'error',
        duration: 8000,
        isClosable: true,
        position: 'top',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Box maxW="500px" w="full">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isValid,
        }) => {
          return (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSubmit(e)
              }}
            >
              <VStack spacing={6} align="stretch">
                {/* Full Name */}
                <FormControl isInvalid={touched.fullName && !!errors.fullName}>
                  <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
                    Full Name
                  </FormLabel>
                  <Input
                    name="fullName"
                    value={values.fullName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter your full name"
                    bg="gray.50"
                    border="1px solid"
                    borderColor="yellow.300"
                    borderRadius="md"
                    h="3.5rem"
                    _focus={{
                      borderColor: errors.fullName ? 'red.500' : 'yellow.400',
                      bg: 'white',
                    }}
                    _hover={{
                      borderColor: errors.fullName ? 'red.500' : 'yellow.400',
                    }}
                  />
                  <FormErrorMessage>{errors.fullName}</FormErrorMessage>
                </FormControl>

                {/* Phone Number */}
                <FormControl isInvalid={touched.phone && !!errors.phone}>
                  <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
                    Phone Number
                  </FormLabel>
                  <Input
                    name="phone"
                    value={values.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter your phone number"
                    bg="gray.50"
                    border="1px solid"
                    borderColor="yellow.300"
                    borderRadius="md"
                    h="3.5rem"
                    _focus={{
                      borderColor: errors.phone ? 'red.500' : 'yellow.400',
                      bg: 'white',
                    }}
                    _hover={{
                      borderColor: errors.phone ? 'red.500' : 'yellow.400',
                    }}
                  />
                  <FormErrorMessage>{errors.phone}</FormErrorMessage>
                </FormControl>

                {/* Gender */}
                <FormControl isInvalid={touched.gender && !!errors.gender}>
                  <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
                    Gender
                  </FormLabel>
                  <Select
                    name="gender"
                    value={values.gender}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Select your gender"
                    bg="gray.50"
                    border="1px solid"
                    borderColor="yellow.300"
                    borderRadius="md"
                    h="3.5rem"
                    _focus={{
                      borderColor: errors.gender ? 'red.500' : 'yellow.400',
                      bg: 'white',
                    }}
                    _hover={{
                      borderColor: errors.gender ? 'red.500' : 'yellow.400',
                    }}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </Select>
                  <FormErrorMessage>{errors.gender}</FormErrorMessage>
                </FormControl>

                {/* Date of Enrollment */}
                <FormControl
                  isInvalid={
                    touched.dateOfEnrollment && !!errors.dateOfEnrollment
                  }
                >
                  <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
                    Date of Enrollment
                  </FormLabel>
                  <CustomDatePicker
                    name="dateOfEnrollment"
                    value={values.dateOfEnrollment}
                    onChange={(date) => {
                      return;
                    }}
                    onBlur={() => handleBlur('dateOfEnrollment')}
                    isInvalid={!!(touched.dateOfEnrollment && errors.dateOfEnrollment)}
                    errorMessage={errors.dateOfEnrollment}
                    maxDate={new Date()}
                    isDisabled={true}
                  />
                </FormControl>

                {/* Class Cohort */}
                <FormControl
                  isInvalid={touched.classCohort && !!errors.classCohort}
                >
                  <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
                    Class Cohort
                  </FormLabel>
                  <Select
                    name="classCohort"
                    value={values.classCohort}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Select your class cohort"
                    bg="gray.50"
                    border="1px solid"
                    borderColor="yellow.300"
                    borderRadius="md"
                    h="3.5rem"
                    _focus={{
                      borderColor: errors.classCohort
                        ? 'red.500'
                        : 'yellow.400',
                      bg: 'white',
                    }}
                    _hover={{
                      borderColor: errors.classCohort
                        ? 'red.500'
                        : 'yellow.400',
                    }}
                  >
                    {classPlans.map((plan) => (
                      <option key={plan} value={plan}>
                        {plan}
                      </option>
                    ))}
                  </Select>
                  <FormErrorMessage>{errors.classCohort}</FormErrorMessage>
                </FormControl>

                {/* Save Button */}
                <Button
                  type="submit"
                  isLoading={isSubmitting || isProfileLoading}
                  loadingText="Saving Changes..."
                  isDisabled={!isValid || isSubmitting || isProfileLoading}
                  bg="brand.purple.500"
                  color="white"
                  h="3.5rem"
                  borderRadius="md"
                  fontWeight="medium"
                  _hover={{
                    bg: 'brand.purple.600',
                    transform: 'translateY(-1px)',
                  }}
                  _active={{
                    transform: 'translateY(0)',
                  }}
                  transition="all 0.2s"
                >
                  Save Changes
                </Button>
              </VStack>
            </form>
          )
        }}
      </Formik>
    </Box>
  )
}
