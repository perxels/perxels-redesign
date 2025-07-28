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
  FormControl,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  FormErrorMessage,
  Box,
  Input,
  FormLabel,
  HStack,
  Badge,
  Wrap,
  WrapItem,
} from '@chakra-ui/react'
import { Formik } from 'formik'
import React, { useState } from 'react'
import { formatNaira, parseNaira } from '../../auth/school-fee-info-form'
import { usePortalAuth } from '../../../../hooks/usePortalAuth'
import { useToast } from '@chakra-ui/react'
import { getPaymentSuggestions } from '../../../../types/school-fee.types'
import { addPaymentInstallment } from '../../../../lib/utils/payment.utils'

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
            {step === 2 && <PaymentConfirmation setStep={setStep} onClose={onClose} />}
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

const PaymentConfirmation = ({ setStep, onClose }: { setStep?: (step: number) => void; onClose?: () => void }) => {
  const [paymentReceiptFile, setPaymentReceiptFile] = useState<File | null>(
    null,
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user, portalUser } = usePortalAuth()
  const toast = useToast()
  const schoolFeeInfo = portalUser?.schoolFeeInfo

  const initialAmountOwed =
    (portalUser?.schoolFeeInfo?.totalSchoolFee || 0) -
    (portalUser?.schoolFeeInfo?.totalApproved || 0)

  async function handlePaymentConfirmationSubmit(
    values: PaymentConfirmationFormValues,
  ) {
    setIsSubmitting(true)
    try {
      // Check user
      if (!user || !portalUser?.uid) throw new Error('User not authenticated')
      await user.reload()
      const uid = user.uid

      // Upload payment receipt to Cloudinary
      let paymentReceiptUrl = ''
      if (paymentReceiptFile) {
        const formData = new FormData()
        formData.append('file', paymentReceiptFile)
        formData.append(
          'upload_preset',
          process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '',
        )
        formData.append('folder', 'portal/payment-receipts')
        formData.append('public_id', `${uid}_${Date.now()}_payment_receipt`)
        formData.append('context', `user_id=${uid}|upload_type=payment_receipt`)
        const cloudinaryResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          { method: 'POST', body: formData },
        )
        if (!cloudinaryResponse.ok) throw new Error('Cloudinary upload failed')
        const cloudinaryResult = await cloudinaryResponse.json()
        if (cloudinaryResult.error)
          throw new Error(cloudinaryResult.error.message)
        paymentReceiptUrl = cloudinaryResult.secure_url
      } else {
        throw new Error('Payment receipt is required.')
      }

      // Prepare payment data (match school-fee-info-form.tsx)
      const isFirstPayment = !schoolFeeInfo?.payments || schoolFeeInfo.payments.length === 0
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

        // Send notifications via API
        if (result.notificationData) {
          const notificationResponse = await fetch('/api/send-payment-installment-notification', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...result.notificationData,
              studentId: uid, // Add the student ID
            }),
          })

          if (!notificationResponse.ok) {
            console.error('Failed to send notification, but payment was processed')
            // Don't fail the main request if notification fails
          } else {
            const notificationResult = await notificationResponse.json()
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
      {({ values, errors, touched, handleBlur, setFieldValue, isValid, handleSubmit, resetForm }) => {
        // Success handler to reset form, clear file, and close modal
        // const handleSuccess = (resetFormFn: () => void) => {
        //   setPaymentReceiptFile(null)
        //   if (setStep) setStep(1)
        //   resetFormFn()
        //   if (onClose) onClose()
        // }
        return (
          <form onSubmit={async (e) => {
            e.preventDefault();
            await handleSubmit(e);
          }}>
            <VStack>
              <FormControl
                isInvalid={touched.amountPaid && !!errors.amountPaid}
              >
                <NumberInput
                  value={
                    values.amountPaid === 0
                      ? ''
                      : formatNaira(values.amountPaid.toString())
                  }
                  onChange={(valueString) => {
                    const parsedValue = parseNaira(valueString)
                    setFieldValue('amountPaid', parsedValue)
                  }}
                  onBlur={() => handleBlur('amountPaid')}
                  min={0}
                >
                  <NumberInputField
                    h="3.5rem"
                    placeholder="How much have you paid?"
                    _placeholder={{ color: 'brand.dark.200' }}
                    borderWidth={1}
                    borderColor={
                      touched.amountPaid && errors.amountPaid
                        ? 'red.500'
                        : 'yellow.300'
                    }
                    bgColor="yellow.50"
                    _focus={{
                      borderColor:
                        touched.amountPaid && errors.amountPaid
                          ? 'red.500'
                          : 'yellow.400',
                      bgColor: 'yellow.50',
                    }}
                    _focusVisible={{
                      outline: 'none',
                    }}
                    _active={{
                      borderColor:
                        touched.amountPaid && errors.amountPaid
                          ? 'red.500'
                          : 'yellow.400',
                      bgColor: 'yellow.50',
                    }}
                    _hover={{
                      borderColor:
                        touched.amountPaid && errors.amountPaid
                          ? 'red.500'
                          : 'yellow.400',
                      bgColor: 'yellow.50',
                    }}
                  />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                {touched.amountPaid && errors.amountPaid && (
                  <FormErrorMessage>{errors.amountPaid}</FormErrorMessage>
                )}

                {/* Payment suggestions */}
                {schoolFeeInfo?.totalSchoolFee && (
                  <Box mt={2}>
                    <Text fontSize="xs" color="gray.600" mb={1}>
                      Suggested amounts:
                    </Text>
                    <Wrap spacing={1}>
                      {getPaymentSuggestions(
                        schoolFeeInfo.totalSchoolFee || 0,
                        schoolFeeInfo.totalApproved || 0
                      )
                        .slice(0, Math.max(0, 3 - (schoolFeeInfo.payments?.length || 0)))
                        .map((amount) => (
                          <WrapItem key={amount}>
                            <Badge
                              colorScheme="yellow"
                              cursor="pointer"
                              fontSize="xs"
                              px={2}
                              py={1}
                              onClick={() =>
                                setFieldValue('amountPaid', amount.toString())
                              }
                              _hover={{ bg: 'yellow.200' }}
                            >
                              ₦{amount.toLocaleString()}
                            </Badge>
                          </WrapItem>
                        ))}
                    </Wrap>
                  </Box>
                )}
              </FormControl>

              <FormControl
                isInvalid={touched.amountOwed && !!errors.amountOwed}
              >
                <NumberInput
                  value={
                    values.amountOwed === 0
                      ? ''
                      : formatNaira(values.amountOwed.toString())
                  }
                  onChange={(valueString) => {
                    const parsedValue = parseNaira(valueString)
                    setFieldValue('amountOwed', parsedValue)
                  }}
                  onBlur={() => handleBlur('amountOwed')}
                  min={0}
                >
                  <NumberInputField
                    h="3.5rem"
                    placeholder="How much are you owing?"
                    _placeholder={{ color: 'brand.dark.200' }}
                    borderWidth={1}
                    borderColor={
                      touched.amountOwed && errors.amountOwed
                        ? 'red.500'
                        : 'yellow.300'
                    }
                    bgColor="yellow.50"
                    _focus={{
                      borderColor:
                        touched.amountOwed && errors.amountOwed
                          ? 'red.500'
                          : 'yellow.400',
                      bgColor: 'yellow.50',
                    }}
                    _focusVisible={{
                      outline: 'none',
                    }}
                    _active={{
                      borderColor:
                        touched.amountOwed && errors.amountOwed
                          ? 'red.500'
                          : 'yellow.400',
                      bgColor: 'yellow.50',
                    }}
                    _hover={{
                      borderColor:
                        touched.amountOwed && errors.amountOwed
                          ? 'red.500'
                          : 'yellow.400',
                      bgColor: 'yellow.50',
                    }}
                  />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                {touched.amountOwed && errors.amountOwed && (
                  <FormErrorMessage>{errors.amountOwed}</FormErrorMessage>
                )}
              </FormControl>

              <VStack w="full" alignItems="flex-start" gap="8">
                <Input
                  type="file"
                  name="paymentReceipt"
                  onChange={(event) => {
                    const file = event.currentTarget.files?.[0]
                    if (file) {
                      setPaymentReceiptFile(file)
                      setFieldValue('paymentReceipt', file)
                    }
                  }}
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
                  borderColor={
                    touched.paymentReceipt && errors.paymentReceipt
                      ? 'red.500'
                      : paymentReceiptFile
                      ? 'green.300'
                      : 'yellow.300'
                  }
                  rounded="md"
                  htmlFor="paymentReceipt"
                  cursor="pointer"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="md"
                  textAlign="center"
                  color="brand.dark.100"
                  flexDirection="column"
                  gap={2}
                >
                  {paymentReceiptFile ? (
                    <>
                      <Text fontSize="sm" color="green.600" fontWeight="bold">
                        ✓ File Selected
                      </Text>
                      <Text fontSize="xs" color="gray.600">
                        {paymentReceiptFile.name}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        Click to change file
                      </Text>
                    </>
                  ) : (
                    <>
                      Upload your payment receipt <br />
                      (as screenshot)
                    </>
                  )}
                </FormLabel>
                {touched.paymentReceipt && errors.paymentReceipt && (
                  <Text fontSize="sm" color="red.500">
                    {errors.paymentReceipt}
                  </Text>
                )}
              </VStack>

              <HStack justifyContent="flex-start" w="full" mt={10}>
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
