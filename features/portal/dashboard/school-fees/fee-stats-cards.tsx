import { HStack, Spinner, Alert, AlertIcon } from '@chakra-ui/react'
import React from 'react'
import { StatsCard } from './stats-card'
import { usePaymentData } from '../../../../hooks/usePaymentData'

export const FeeStatsCards = () => {
  const { paymentStats, loading, error } = usePaymentData()

  const formatAmount = (amount: number) => {
    return amount.toLocaleString()
  }

  if (loading) {
    return (
      <HStack w="100%" gap={6} justifyContent="center" py={4}>
        <Spinner size="lg" color="blue.500" />
      </HStack>
    )
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error}
      </Alert>
    )
  }

  return (
    <HStack w="100%" gap={6} flexWrap="wrap">
      <StatsCard 
        title="Amount Paid"
        amount={`₦${formatAmount(paymentStats.amountPaid)}`}
        color="brand.purple.100"
        w={['100%', '300px']}
      />
      <StatsCard 
        title="Amount Owing"
        amount={`₦${formatAmount(paymentStats.amountOwing)}`}
        color="orange.100"
        w={['100%', '300px']}
      />
      <StatsCard 
        title="0775531140"
        amount="GTBANK"
        desc="The Perxels Service Limited"
        color="pink.100"
        isTitleBig
        w={['100%', '300px']}
      />
    </HStack>
  )
}
