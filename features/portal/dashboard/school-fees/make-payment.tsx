import * as Yup from 'yup'
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalOverlay,
  useDisclosure,
  Text,
  Heading,
  VStack,
  Box,
  Input,
  FormLabel,
  HStack,
  Badge,
  Wrap,
  WrapItem,
} from '@chakra-ui/react'
import { Formik } from 'formik'
import React, { useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { CurrencyInput } from '../../../../components/CurrencyInput'
import { usePortalAuth } from '../../../../hooks/usePortalAuth'
import { useToast } from '@chakra-ui/react'
import { getPaymentSuggestions } from '../../../../types/school-fee.types'
import { addPaymentInstallment } from '../../../../lib/utils/payment.utils'
import { usePaymentNotifications } from '../../../../hooks/usePaymentNotifications'
import { EnhancedImageUpload } from '../../../../components/EnhancedImageUpload'

interface PaymentDetailsProps {
  setStep: (step: number) => void
}

interface PaymentConfirmationFormValues {
  amountPaid: number
  amountOwed: number
  paymentReceipt: File | null
}

const formSchema = Yup.object().shape({
  amountPaid: Yup.number().required('Amount paid is required'),
  amountOwed: Yup.number().required('Amount owed is required'),
  paymentReceipt: Yup.mixed()
    .required('Payment receipt is required')
    .test('fileSize', 'File size is too large', (value: any) => {
      if (!value) return true
      if (!(value instanceof File)) return false
      return value.size <= 5000000 // 5MB
    })
    .test('fileType', 'Unsupported file type', (value: any) => {
      if (!value) return true
      if (!(value instanceof File)) return false
      return ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type)
    }),
})

export const MakePayment = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [step, setStep] = useState<number>(1)

  return (
    <>
      <Button h={[12, 20]} onClick={onOpen} bg="brand.purple.500" color="white">
        Make Payment
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent p={6} borderRadius="xl">
          <ModalHeader
            fontSize="md"
            color="gray.600"
          >{`${step}/2 Step`}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {step === 1 && <PaymentDetails setStep={setStep} />}
            {step === 2 && (
              <PaymentConfirmation setStep={setStep} onClose={onClose} />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

const PaymentDetails = ({ setStep }: PaymentDetailsProps) => {
  return (
    <>
      <Text fontSize="2xl" color="brand.dark.100" mb={8}>
        Make a transfer to
      </Text>

      <Heading fontSize="6xl" fontWeight={600} color="brand.dark.100">
        0775531140
      </Heading>
      <Heading fontSize="6xl" fontWeight={600} color="brand.dark.100">
        GTBANK
      </Heading>
      <Text fontSize="lg" mt={2} mb={6} color="brand.dark.100">
        The Perxels Service Limited
      </Text>

      <VStack
        display="inline-flex"
        flexDirection="column"
        gap={6}
        justifyContent="center"
        alignItems="flex-start"
      >
        <Button
          px={12}
          py={10}
          mt={4}
          bg="brand.purple.500"
          color="white"
          onClick={() => setStep(2)}
        >
          I have made payment
        </Button>

        <Text
          cursor="pointer"
          onClick={() => setStep(2)}
          fontSize="lg"
          textAlign="center"
          w="full"
          color="brand.dark.100"
        >
          Next
        </Text>
      </VStack>
    </>
  )
}

const PaymentConfirmation = ({
  setStep,
  onClose,
}: {
  setStep?: (step: number) => void
  onClose?: () => void
}) => {
  const [paymentReceiptFile, setPaymentReceiptFile] = useState<File | null>(
    null,
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user, portalUser } = usePortalAuth()
  const toast = useToast()
  const router = useRouter()
  const { sendPaymentNotification } = usePaymentNotifications()

  const initialAmountOwed = useMemo(() => 
    (portalUser?.schoolFeeInfo?.totalSchoolFee || 0) -
    (portalUser?.schoolFeeInfo?.totalApproved || 0), 
    [portalUser?.schoolFeeInfo?.totalSchoolFee, portalUser?.schoolFeeInfo?.totalApproved]
  )

  async function handlePaymentConfirmationSubmit(
    values: PaymentConfirmationFormValues,
  ) {
    setIsSubmitting(true)
    try {
      // Check user
      if (!user || !portalUser?.uid) throw new Error('User not authenticated')
      await user.reload()
      const uid = user.uid

      // Upload payment receipt to our API endpoint
      let paymentReceiptUrl = ''
      if (!paymentReceiptFile) {
        throw new Error('Payment receipt is required.')
      }

      try {
        const formData = new FormData()
        formData.append('file', paymentReceiptFile)
        formData.append('uid', uid)
        formData.append('type', 'payment_receipt')
        
        const uploadResponse = await fetch('/api/upload-receipt', {
          method: 'POST',
          body: formData,
          // Prevent Next.js from auto-transforming the request
          headers: {
            accept: 'application/json',
          },
        })
        
        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json().catch(() => null)
          console.error('Upload error:', errorData || uploadResponse.statusText)
          throw new Error(
            errorData?.error || 
            'Failed to upload receipt. Please try again.'
          )
        }
        
        const uploadResult = await uploadResponse.json()
        if (!uploadResult.success || !uploadResult.url) {
          throw new Error(uploadResult.error || 'Invalid upload response')
        }
        
        paymentReceiptUrl = uploadResult.url
      } catch (uploadError: any) {
        console.error('Receipt upload error:', uploadError)
        throw new Error('Failed to upload receipt. Please try again.')
      }

      // Prepare payment data (match school-fee-info-form.tsx)
      const isFirstPayment =
        !portalUser?.schoolFeeInfo?.payments ||
        portalUser.schoolFeeInfo.payments.length === 0
      let response, result
      if (isFirstPayment) {
        // First payment: send full info
        const paymentData = {
          cohort: portalUser?.schoolFeeInfo?.cohort || '',
          classPlan: portalUser?.schoolFeeInfo?.classPlan || '',
          schoolFee: portalUser?.schoolFeeInfo?.totalSchoolFee || 0,
          amountPaid: values.amountPaid,
          paymentReceiptUrl,
        }
        response = await fetch('/api/update-school-fee-info', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid, schoolFeeInfo: paymentData }),
        })
      } else {
        // Subsequent payment: add installment using client-side function
        result = await addPaymentInstallment({
          uid,
          amount: Number(values.amountPaid),
          paymentReceiptUrl,
        })

        if (!result.success) {
          throw new Error(result.error || 'Failed to add payment installment')
        }

        // Send notifications using client-side hook
        if (result.notificationData) {
          try {
            const notificationResult = await sendPaymentNotification({
              ...result.notificationData,
              studentId: uid, // Add the student ID
            })

            if (!notificationResult.success) {
              console.warn(
                'Payment notification failed:',
                notificationResult.error,
              )
              // Don't fail the main request if notification fails
            } else {
              console.log('Payment notification sent successfully')
            }
          } catch (notificationError) {
            console.error('Payment notification error:', notificationError)
            // Don't fail the main request if notification fails
          }
        }
      }

      toast({
        title: 'Payment Submitted!',
        description: 'Your payment has been recorded.',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top',
      })

      setPaymentReceiptFile(null)
      if (setStep) setStep(1)
      if (onClose) onClose()

      // Update UI without full page reload
      router.refresh()
    } catch (error: any) {
      toast({
        title: 'Payment Failed',
        description: error.message || 'An error occurred',
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
    <Formik<PaymentConfirmationFormValues>
      initialValues={{
        amountPaid: 0,
        amountOwed: initialAmountOwed,
        paymentReceipt: null,
      }}
      enableReinitialize
      validationSchema={formSchema}
      onSubmit={handlePaymentConfirmationSubmit}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        setFieldValue,
        isValid,
        handleSubmit,
        resetForm,
      }) => {
        // Success handler to reset form, clear file, and close modal
        // const handleSuccess = (resetFormFn: () => void) => {
        //   setPaymentReceiptFile(null)
        //   if (setStep) setStep(1)
        //   resetFormFn()
        //   if (onClose) onClose()
        // }
        return (
          <form
            onSubmit={async (e) => {
              e.preventDefault()
              await handleSubmit(e)
            }}
          >
            <VStack>
              <CurrencyInput
                name="amountPaid"
                value={values.amountPaid}
                onChange={(value) => setFieldValue('amountPaid', value)}
                onBlur={() => handleBlur('amountPaid')}
                placeholder="How much have you paid?"
                label="Amount Paid"
                isInvalid={touched.amountPaid && !!errors.amountPaid}
                errorMessage={touched.amountPaid && errors.amountPaid}
                variant="yellow"
                isRequired
              />

              <CurrencyInput
                name="amountOwed"
                value={values.amountOwed}
                onChange={(value) => {
                  return
                }}
                onBlur={() => handleBlur('amountOwed')}
                placeholder="How much are you owing?"
                label="Amount Owed"
                isInvalid={touched.amountOwed && !!errors.amountOwed}
                errorMessage={touched.amountOwed && errors.amountOwed}
                variant="yellow"
                isRequired
                isDisabled={true}
              />

              <VStack w="full" alignItems="flex-start" gap="4">
                <Box w="full">
                  <EnhancedImageUpload
                    onChange={(file) => {
                      setPaymentReceiptFile(file)
                      setFieldValue('paymentReceipt', file)
                    }}
                    onError={(error) => {
                      // Handle validation errors
                      console.error('Image upload error:', error)
                    }}
                    maxSize={5}
                    acceptedTypes={['image/jpeg', 'image/png', 'image/jpg']}
                    showPreviewModal={true}
                    uploadText="Upload your payment receipt (as screenshot)"
                    previewText="RECEIPT PREVIEW"
                    isRequired={true}
                  />
                </Box>
                {touched.paymentReceipt && errors.paymentReceipt && (
                  <Text fontSize="sm" color="red.500">
                    {errors.paymentReceipt}
                  </Text>
                )}
              </VStack>

              {/* Date and Time Display */}
              <Box w="full" textAlign="right" mt={4}>
                <HStack gap={4} align="end" justifyContent="flex-end">
                  <Text fontSize="sm" color="gray.500" fontWeight="medium">
                    Date:{' '}
                    {new Date().toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Text>
                  <Text fontSize="sm" color="gray.500" fontWeight="medium">
                    |
                  </Text>
                  <Text fontSize="sm" color="gray.500" fontWeight="medium">
                    Time:{' '}
                    {new Date().toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </Text>
                </HStack>
              </Box>

              <HStack justifyContent="flex-start" w="full" mt={6}>
                <Button
                  h="3.5rem"
                  type="submit"
                  disabled={isSubmitting || !isValid}
                  isLoading={isSubmitting}
                  px={16}
                >
                  Submit
                </Button>
              </HStack>
            </VStack>
          </form>
        )
      }}
    </Formik>
  )
}
