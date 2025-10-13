import React from 'react'
import {
  Box,
  VStack,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  HStack,
  Avatar,
  Badge,
} from '@chakra-ui/react'
import { useSOTWHistory } from '../../../../hooks/useSOTW'

export const SOTWHistory = () => {
  const { history, loading } = useSOTWHistory()

  if (loading) {
    return <Text>Loading history...</Text>
  }

  if (history.length === 0) {
    return (
      <Box>
        <Heading size="md" mt={7} mb={2}>
          Previous Students of the Week
        </Heading>
        <Text color="gray.500">No history available yet.</Text>
      </Box>
    )
  }

  return (
    <Box>
      <Heading size="md" mt={6} mb={2}>
        Previous Students of the Week
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        {history.map((item) => (
          <Card key={item.id} variant="outline">
            <CardBody>
              <HStack spacing={3}>
                <Avatar
                  size="md"
                  name={item.studentName}
                  src={item.studentAvatar}
                />
                <VStack align="start" spacing={1} flex={1}>
                  <Text fontWeight="bold" fontSize="sm">
                    {item.studentName}
                  </Text>
                  <Text fontSize="xs" color="gray.600" noOfLines={1}>
                    {item.citation}
                  </Text>
                  <Badge colorScheme="gray" fontSize="xs">
                    {item.weekStart.toLocaleDateString()}
                  </Badge>
                </VStack>
              </HStack>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  )
}
