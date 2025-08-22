import * as Yup from 'yup'
import React, { useState } from 'react'
import { Formik } from 'formik'
import {
  Box,
  Button,
  FormLabel,
  HStack,
  Select,
  SimpleGrid,
  VStack,
  useToast,
  Text
} from '@chakra-ui/react'
import { CurrencyInput } from '../../../components/CurrencyInput'
import { AuthInput } from './auth-input'
import { portalDb } from '../../../portalFirebaseConfig'
import { useRouter } from 'next/navigation'
import { usePortalAuth } from '../../../hooks/usePortalAuth'
import { classPlans } from '../../../constant/adminConstants'
import { EnhancedImageUpload } from '../../../components/EnhancedImageUpload'
import { doc, updateDoc, getDoc } from 'firebase/firestore'
import { SchoolFeeInfo } from '../../../types/school-fee.types'
import { usePaymentNotifications } from '../../../hooks/usePaymentNotifications'
import { useActiveClasses } from '../../../hooks/useClasses'

// Currency formatting functions for Naira
export const formatNaira = (val: string) => {
  if (!val) return ''
  // Remove any existing commas and format with new ones
  const cleanValue = val.toString().replace(/,/g, '')
  const numberValue = parseInt(cleanValue)
  if (isNaN(numberValue)) return ''

  // Format with comma separators
  const formattedValue = numberValue.toLocaleString('en-NG')
  return `₦${formattedValue}`
}

export const parseNaira = (val: string) => {
  // Remove ₦ symbol and commas, return clean number string
  return val.replace(/^₦/, '').replace(/,/g, '')
}

interface SchoolFeeFormValues {
  cohort: string
  classPlan: string
  schoolFee: string
  amountPaid: string
  paymentReceipt: File | null
}

interface SchoolFeeInfoData {
  cohort: string
  classPlan: string
  schoolFee: number
  amountPaid: number
  paymentReceiptUrl: string
}

// Create dynamic validation schema that depends on existing classes
const createFormSchema = (existingClasses: any[]) => Yup.object().shape({
  cohort: Yup.string()
    .required('Cohort is required')
    .test('valid-cohort', 'Please enter a valid cohort as provided by your manager', (value) => {
      if (!value) return false
      const normalizedValue = value.toUpperCase().trim()
      return existingClasses.some(cls => 
        cls.cohortName.toUpperCase() === normalizedValue
      )
    }),
  classPlan: Yup.string()
    .required('Class plan is required')
    .oneOf(classPlans, 'Please select a valid class plan'),
  schoolFee: Yup.string()
    .required('School fee is required')
    .test('valid-number', 'School fee must be a valid number', (value) => {
      if (!value) return false
      // Remove any non-digit characters (₦, commas, spaces, etc.)
      const cleanValue = value.toString().replace(/[^\d]/g, '')
      const numValue = parseInt(cleanValue)
      return !isNaN(numValue) && numValue > 0
    }),
  amountPaid: Yup.string()
    .required('Amount paid is required')
    .test('valid-number', 'Amount paid must be a valid number', (value) => {
      if (!value) return false
      // Remove any non-digit characters (₦, commas, spaces, etc.)
      const cleanValue = value.toString().replace(/[^\d]/g, '')
      const numValue = parseInt(cleanValue)
      return !isNaN(numValue) && numValue > 0
    }),
  paymentReceipt: Yup.mixed()
    .required('Payment receipt is required')
    .test('file-required', 'Payment receipt is required', (value) => {
      return value !== null && value !== undefined
    }),
})

export const SchoolFeeInfoForm = () => {
  const [paymentReceiptFile, setPaymentReceiptFile] = useState<File | null>(
    null,
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const toast = useToast()
  const router = useRouter()
  const { user } = usePortalAuth()
  const { sendPaymentNotification } = usePaymentNotifications()
  const { classes: existingClasses, loading: loadingClasses, error: classesError } = useActiveClasses()

  // Create dynamic validation schema based on existing classes
  const formSchema = createFormSchema(existingClasses)

  async function handleSchoolFeeInfoSubmit(values: SchoolFeeFormValues) {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to submit school fee information.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      return
    }

    setIsSubmitting(true)

    try {
      const uid = user.uid

      // Handle payment receipt upload to Cloudinary
      if (!paymentReceiptFile) {
        throw new Error('Payment receipt is required')
      }

      const reader = new FileReader()
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const base64 = reader.result as string
          resolve(base64.split(',')[1]) // Remove data:image/jpeg;base64, prefix
        }
        reader.onerror = reject
      })
      reader.readAsDataURL(paymentReceiptFile)

      const base64File = await base64Promise

      const uploadResponse = await fetch('/api/upload-payment-receipt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid,
          file: base64File,
          fileName: paymentReceiptFile.name,
          fileType: paymentReceiptFile.type,
        }),
      })

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload payment receipt')
      }

      const uploadResult = await uploadResponse.json()
      if (!uploadResult.success) {
        throw new Error(uploadResult.error || 'Upload failed')
      }

      const paymentReceiptUrl = uploadResult.url

      // Handle first payment creation (client-side Firebase operations)
      const userDoc = await getDoc(doc(portalDb, 'users', uid))
      if (!userDoc.exists()) {
        throw new Error('User data not found')
      }

      const userData = userDoc.data()
      const existingSchoolFeeInfo = userData?.schoolFeeInfo

      // Check if user already has school fee info
      if (
        existingSchoolFeeInfo &&
        existingSchoolFeeInfo.payments &&
        existingSchoolFeeInfo.payments.length > 0
      ) {
        throw new Error(
          'School fee information already exists. Use the installment payment to add additional payments.',
        )
      }

      // Convert formatted values to clean numbers for database storage
      const cleanSchoolFee = values.schoolFee.toString().replace(/[^\d]/g, '')
      const cleanAmountPaid = values.amountPaid.toString().replace(/[^\d]/g, '')

      const newSchoolFeeInfo: SchoolFeeInfo = {
        cohort: values.cohort.toUpperCase(),
        classPlan: values.classPlan,
        totalSchoolFee: parseInt(cleanSchoolFee),
        payments: [
          {
            installmentNumber: 1,
            amount: parseInt(cleanAmountPaid),
            paymentReceiptUrl: paymentReceiptUrl,
            submittedAt: new Date(),
            status: 'pending',
          },
        ],
        totalSubmitted: parseInt(cleanAmountPaid),
        totalApproved: 0,
        overallStatus: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      // Update user document with new school fee information structure
      await updateDoc(doc(portalDb, 'users', uid), {
        schoolFeeInfo: newSchoolFeeInfo,
        schoolFeeInfoUpdatedAt: new Date(),
      })

      // Send notification to admins about the first payment using client-side hook
      try {
        const notificationData = {
          studentId: uid,
          studentName: userData?.fullName || 'Unknown Student',
          studentEmail: userData?.email || '',
          amount: parseInt(cleanAmountPaid),
          installmentNumber: 1,
          paymentReceiptUrl: paymentReceiptUrl,
          cohort: values.cohort.toUpperCase(),
          classPlan: values.classPlan,
        }

        const result = await sendPaymentNotification(notificationData)
        
        if (!result.success) {
          console.warn('Payment notification failed:', result.error)
          // Don't fail the main request if notification fails
        } else {
          console.log('Payment notification sent successfully')
        }
      } catch (notificationError) {
        console.error('Payment notification error:', notificationError)
        // Don't fail the main request if notification fails
      }

      toast({
        title: 'School Fee Information Updated! 🎉',
        description: 'Your payment information and receipt have been saved successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top',
      })

      // Redirect to growth info page
      router.push('/portal/growth-info')
    } catch (error: any) {
      console.error('School fee info update error:', error)

      let errorMessage =
        'Failed to update school fee information. Please try again.'

      if (error.message) {
        errorMessage = error.message
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
    <Formik<SchoolFeeFormValues>
      initialValues={{
        cohort: '',
        classPlan: '',
        schoolFee: '',
        amountPaid: '',
        paymentReceipt: null,
      }}
      validationSchema={formSchema}
      onSubmit={handleSchoolFeeInfoSubmit}
      validateOnMount={false}
      validateOnChange={true}
      validateOnBlur={true}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting: formikIsSubmitting,
        isValid,
        setFieldValue,
      }) => {
        return (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmit(e)
            }}
          >
            <VStack w="full" alignItems="flex-start">
              <SimpleGrid
                columns={[1, 2]}
                spacing={[5, 10]}
                w="full"
                maxW={'750px'}
              >
                <VStack w="full" alignItems="flex-start" gap="8">
                  <AuthInput
                    name="cohort"
                    placeholder="What’s your cohort (Ask manager) e.g. Cohort 5"
                    isRequired
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

                  <CurrencyInput
                    name="schoolFee"
                    value={values.schoolFee}
                    onChange={(value) => setFieldValue('schoolFee', value)}
                    onBlur={() => handleBlur('schoolFee')}
                    placeholder="How much is your school fee*"
                    isInvalid={touched.schoolFee && !!errors.schoolFee}
                    errorMessage={touched.schoolFee && errors.schoolFee}
                    variant="yellow"
                    isRequired
                  />

                  <CurrencyInput
                    name="amountPaid"
                    value={values.amountPaid}
                    onChange={(value) => setFieldValue('amountPaid', value)}
                    onBlur={() => handleBlur('amountPaid')}
                    placeholder="How much have you paid*"
                    isInvalid={touched.amountPaid && !!errors.amountPaid}
                    errorMessage={touched.amountPaid && errors.amountPaid}
                    variant="yellow"
                    isRequired
                  />
                </VStack>

                <VStack w="full" alignItems="flex-start" gap="8">
                  <FormLabel>Payment Receipt*</FormLabel>
                  <EnhancedImageUpload
                    value={
                      paymentReceiptFile
                        ? URL.createObjectURL(paymentReceiptFile)
                        : undefined
                    }
                    onChange={(file) => {
                      setPaymentReceiptFile(file)
                      setFieldValue('paymentReceipt', file)
                    }}
                    onError={(error) => {
                      // Only clear the file if there's an actual error (not empty string for clearing)
                      if (error && error.trim() !== '') {
                        setFieldValue('paymentReceipt', null)
                        setPaymentReceiptFile(null)
                      }
                    }}
                    maxSize={12}
                    acceptedTypes={['image/jpeg', 'image/png', 'image/jpg']}
                    minDimensions={{ width: 100, height: 100 }} // More lenient for receipts
                    uploadText="Upload your payment receipt"
                    previewText="RECEIPT"
                    showPreviewModal={true}
                  />
                  {touched.paymentReceipt && errors.paymentReceipt && (
                    <Box color="red.500" fontSize="sm" mt={1}>
                      {errors.paymentReceipt}
                    </Box>
                  )}
                </VStack>
              </SimpleGrid>

              <HStack justifyContent="flex-end" w="full" mt={10}>
                <Button
                  h="3.5rem"
                  type="submit"
                  disabled={
                    isSubmitting ||
                    !values.cohort ||
                    !values.classPlan ||
                    !values.schoolFee ||
                    !values.amountPaid ||
                    !paymentReceiptFile ||
                    !isValid
                  }
                  isLoading={isSubmitting}
                  px={16}
                  _disabled={{
                    bg: 'gray.300',
                    cursor: 'not-allowed',
                  }}
                >
                  Next
                </Button>
              </HStack>
            </VStack>
          </form>
        )
      }}
    </Formik>
  )
}
