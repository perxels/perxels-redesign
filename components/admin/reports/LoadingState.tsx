import React from 'react'
import {
  Card,
  CardBody,
  VStack,
  Spinner,
  Text,
} from '@chakra-ui/react'

export function LoadingState() {
  return (
    <Card bg="white" shadow="sm" borderRadius="lg">
      <CardBody p={8}>
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" thickness="4px" />
          <VStack spacing={2}>
            <Text fontSize="lg" fontWeight="medium" color="gray.700">
              Generating Report...
            </Text>
            <Text fontSize="sm" color="gray.500">
              Analyzing attendance data and calculating insights
            </Text>
          </VStack>
        </VStack>
      </CardBody>
    </Card>
  )
}
