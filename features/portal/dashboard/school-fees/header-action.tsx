import { Badge, Button, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { MakePayment } from './make-payment'
import { usePaymentData } from '../../../../hooks/usePaymentData'

export const HeaderAction = () => {
  const { schoolFeeInfo } = usePaymentData()

  const isPending =
    schoolFeeInfo?.payments?.some((pay) => pay.status === 'pending') || false

  return (
    <VStack w="100%" alignItems="flex-start" gap={6}>
      <HStack w="100%" justifyContent="space-between">
        <Heading
          size={['2xl', '3xl', '4xl']}
          fontWeight="bold"
          color="brand.dark.100"
        >
          School Fees
        </Heading>
        <MakePayment />
      </HStack>

      {isPending && (
        <Badge
          fontSize="40px"
          color="red.700"
          colorScheme="red"
          fontWeight={700}
          variant={'subtle'}
          my={2}
        >
          Payment pending... Confirmation in progress...
        </Badge>
      )}
      {!isPending && (
        <Text fontSize="28px" color="brand.dark.600" fontWeight={800}>
          💡 Note: Installment payment is due by the 7th day of a new month
        </Text>
      )}
    </VStack>
  )
}
