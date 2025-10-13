import React from 'react'
import {
  Box,
  VStack,
  Heading,
  Text,
  Card,
  CardBody,
  HStack,
  Avatar,
  Badge,
  Button,
  useDisclosure,
} from '@chakra-ui/react'
import { useCurrentSOTW } from '../../../../hooks/useSOTW'
import { usePortalAuth } from '../../../../hooks/usePortalAuth'
import Link from 'next/link'
import ConfettiWrapper from '../../../../components/student/ConfettiWrapper'

export const SOTWDashboardCard = () => {
  const { currentSOTW, loading } = useCurrentSOTW()
  const { portalUser } = usePortalAuth()

  // Only show if there's an active SOTW
  if (!currentSOTW || !currentSOTW.isActive) {
    return null
  }

  if (loading) {
    return (
      <Card>
        <CardBody>
          <Text>Loading Student of the Week...</Text>
        </CardBody>
      </Card>
    )
  }

  const isCurrentUser = portalUser?.uid === currentSOTW.studentId

  return (
    <>
      {isCurrentUser && <ConfettiWrapper />}
      <Card
        bg="pink.100"
        shadow="md"
        _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
        transition="all 0.2s"
        width={'70%'}
      >
        <CardBody>
          <VStack spacing={2} align="stretch">
            {/* Header */}
            <HStack justify="space-between" align="flex-start">
              <VStack align="start" spacing={1}>
                <Heading size="lg" color="brand.purple.600">
                  🌟 Student of the Week
                </Heading>
              </VStack>
              <Badge colorScheme="purple" fontSize="sm">
                {currentSOTW.weekStart.toLocaleDateString()} -{' '}
                {currentSOTW.weekEnd.toLocaleDateString()}
              </Badge>
            </HStack>

            {/* Student Info */}
            <HStack spacing={2} align="flex-start">
              {!isCurrentUser && (
                <Avatar
                  size="lg"
                  name={currentSOTW.studentName}
                  src={currentSOTW.studentAvatar}
                  border="4px solid"
                  borderColor="brand.purple.300"
                />
              )}

              <VStack align="start" spacing={2} flex={1}>
                {/* Personalized Banner */}
                {isCurrentUser ? (
                  <Box
                    bg="linear-gradient(135deg, #a8201662, #6f159c3f)"
                    color="white"
                    borderRadius="md"
                    p={2}
                    textAlign="center"
                    fontWeight="bold"
                    fontSize="xl"
                    shadow="sm"
                  >
                    🎉 Congratulations - You are the Student of the Week!
                  </Box>
                ) : (
                  <Box>
                    <Heading size="md" color="gray.800">
                      {currentSOTW.studentName}
                    </Heading>
                    <HStack spacing={3} mt={1}>
                      <Badge colorScheme="blue" fontSize="xs">
                        {currentSOTW.cohort}
                      </Badge>
                      <Badge colorScheme="green" fontSize="xs">
                        {currentSOTW.classPlan}
                      </Badge>
                    </HStack>
                  </Box>
                )}

                {/* Quick Stats */}
                <HStack spacing={4} fontSize="sm" color="gray.600">
                  <Text>❤️ {currentSOTW.likes.length} likes</Text>
                  <Text>💬 {currentSOTW.comments.length} comments</Text>
                </HStack>
              </VStack>
              <Link href={'/portal/dashboard/sotw'}>
                <Button variant="outline" colorScheme="purple" size="sm">
                  View Details
                </Button>
              </Link>
            </HStack>
          </VStack>
        </CardBody>
      </Card>
    </>
  )
}
