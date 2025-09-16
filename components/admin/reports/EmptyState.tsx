import React from 'react'
import {
  Card,
  CardBody,
  VStack,
  Text,
  Button,
  Box,
} from '@chakra-ui/react'

interface EmptyStateProps {
  onGenerateReport: () => void
}

export function EmptyState({ onGenerateReport }: EmptyStateProps) {
  return (
    <Card bg="white" shadow="sm" borderRadius="lg">
      <CardBody p={8}>
        <VStack spacing={4}>
          <Box fontSize="4xl">📊</Box>
          <VStack spacing={2}>
            <Text fontSize="lg" fontWeight="medium" color="gray.700">
              Ready to Generate Reports
            </Text>
            <Text fontSize="sm" color="gray.500" textAlign="center" maxW="md">
              Select your filters and click &quot;Generate Report&quot; to view comprehensive attendance analytics and insights.
            </Text>
          </VStack>
          <Button
            colorScheme="blue"
            onClick={onGenerateReport}
            size="md"
            px={6}
          >
            Get Started
          </Button>
        </VStack>
      </CardBody>
    </Card>
  )
}
