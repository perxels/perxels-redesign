import { Button, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { MakePayment } from './make-payment'

export const HeaderAction = () => {
  return (
    <VStack w="100%" alignItems="flex-start" gap={6}>
      <HStack w="100%" justifyContent="space-between">
        <Heading size={['2xl', '3xl', '4xl']} fontWeight="bold" color="brand.dark.100">
          School Fees
        </Heading>

        <MakePayment />
      </HStack>

      <Text fontSize="lg" color="brand.dark.100">
        💡 Note: Installment payment is due by the 7th day of a new month
      </Text>
    </VStack>
  )
}
