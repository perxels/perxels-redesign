import React, { useState, useEffect } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  Text,
  Box,
  Badge,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Flex,
} from '@chakra-ui/react'
import {
  ImagePreviewModal,
  useImagePreview,
} from '../../../../components/ImagePreviewModal'
import { FacilitatorData } from '../../../../types/user'

interface FacilitatorDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  facilitator: FacilitatorData
}

export const FacilitatorDetailsModal: React.FC<
  FacilitatorDetailsModalProps
> = ({ isOpen, onClose, facilitator }) => {
  const [activeTab, setActiveTab] = useState(0)
  const {
    isOpen: isImageOpen,
    onClose: onImageClose,
    imageUrl,
    title,
    openImagePreview,
  } = useImagePreview()

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent maxH="90vh">
        <ModalHeader>
          <VStack align="start" spacing={2}>
            <Text fontSize="2xl" fontWeight="bold">
              {facilitator.fullName}
            </Text>
            <Text fontSize="sm" color="gray.600">
              Facilitator ID: {facilitator.uid}
            </Text>
          </VStack>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Tabs index={activeTab} onChange={setActiveTab} variant="enclosed">
            <TabList>
              <Tab>Overview</Tab>
              <Tab>Assigned Cohort</Tab>
              {/* <Tab>Attendance</Tab> */}
            </TabList>

            <TabPanels>
              {/* Overview Tab */}
              <TabPanel>
                <VStack spacing={6} align="stretch">
                  {/* Facilitator Profile */}
                  <Box bg="gray.50" p={4} borderRadius="lg">
                    <Text fontSize="lg" fontWeight="bold" mb={4}>
                      Facilitator Information
                    </Text>
                    <Flex gap={8} wrap="wrap">
                      <Box flex="1" minW="200px">
                        <VStack align="start" spacing={3}>
                          <Box>
                            <Text fontSize="sm" color="gray.600">
                              Full Name
                            </Text>
                            <Text fontWeight="medium">
                              {facilitator.fullName}
                            </Text>
                          </Box>
                          <Box>
                            <Text fontSize="sm" color="gray.600">
                              Email
                            </Text>
                            <Text fontWeight="medium">{facilitator.email}</Text>
                          </Box>
                          <Box>
                            <Text fontSize="sm" color="gray.600">
                              Phone
                            </Text>
                            <Text fontWeight="medium">{facilitator.phone}</Text>
                          </Box>
                          <Box>
                            <Text fontSize="sm" color="gray.600">
                              Gender
                            </Text>
                            <Text fontWeight="medium">
                              {facilitator.gender || 'Not specified'}
                            </Text>
                          </Box>
                          <Box>
                            <Text fontSize="sm" color="gray.600">
                              Address
                            </Text>
                            <Text fontWeight="medium">
                              {facilitator.address || 'Not specified'}
                            </Text>
                          </Box>
                        </VStack>
                      </Box>
                      <Box flex="1" minW="200px">
                        <VStack align="start" spacing={3}>
                          <Box>
                            <Text fontSize="sm" color="gray.600">
                              Occupation
                            </Text>
                            <Text fontWeight="medium">
                              {facilitator.profession || 'Not specified'}
                            </Text>
                          </Box>

                          <Box>
                            <Text fontSize="sm" color="gray.600">
                              Assigned Cohort
                            </Text>
                            <Text
                              fontSize="md"
                              fontWeight="medium"
                              color="gray.500"
                              noOfLines={1}
                              flex="1"
                            >
                              {facilitator.assignments.length > 0 ? (
                                <Box display={'flex'} flexWrap="wrap" gap={1}>
                                  {facilitator.assignments.map((assignment) => (
                                    <Badge
                                      key={assignment?.assignmentId}
                                      colorScheme="blue"
                                      mr={1}
                                      mb={1}
                                    >
                                      {assignment.cohort} :{' '}
                                      {assignment.classPlan}
                                    </Badge>
                                  ))}
                                </Box>
                              ) : (
                                <Badge colorScheme="yellow">Not assigned</Badge>
                              )}
                            </Text>
                          </Box>

                          <Box>
                            <Text fontSize="sm" color="gray.600">
                              Status
                            </Text>
                            <Badge
                              colorScheme={
                                facilitator.isActive ? 'green' : 'red'
                              }
                              variant="subtle"
                              fontSize="sm"
                            >
                              {facilitator.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </Box>
                        </VStack>
                      </Box>
                    </Flex>
                  </Box>

                  {/* Performance Overview */}

                  {/* Account Status */}
                  <Box bg="gray.50" p={4} borderRadius="lg">
                    <Text fontSize="lg" fontWeight="bold" mb={4}>
                      Account Status
                    </Text>
                    <Flex gap={4} wrap="wrap">
                      <Badge
                        colorScheme={
                          facilitator.emailVerified ? 'green' : 'red'
                        }
                        p={2}
                      >
                        Email:{' '}
                        {facilitator.emailVerified ? 'Verified' : 'Pending'}
                      </Badge>
                      <Badge
                        colorScheme={facilitator.termsAgreed ? 'green' : 'red'}
                        p={2}
                      >
                        Terms: {facilitator.termsAgreed ? 'Agreed' : 'Pending'}
                      </Badge>
                    </Flex>
                  </Box>
                </VStack>
              </TabPanel>

              {/* Assigned Tab */}
              <TabPanel>
                <VStack spacing={4} align="stretch">
                  <Box>
                    <Text fontSize="lg" fontWeight="bold" mb={4}>
                      Assigned Cohort & Class Plans
                    </Text>
                    <Flex mb={4} fontWeight="bold" gap={1}>
                      <Text fontSize="md">Cohorts</Text>
                      <Text fontSize="md">:</Text>
                      <Text fontSize="md">ClassPlans</Text>
                    </Flex>

                    {facilitator.assignments.length > 0 ? (
                      <Box display={'flex'} flexWrap="wrap" gap={2}>
                        {facilitator.assignments.map((assignment) => (
                          <Badge
                            key={assignment.assignmentId}
                            colorScheme="blue"
                          >
                            {assignment?.cohort} : {assignment?.classPlan}
                          </Badge>
                        ))}
                      </Box>
                    ) : (
                      <Badge colorScheme="yellow">Not assigned</Badge>
                    )}
                  </Box>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>

      <ImagePreviewModal
        isOpen={isImageOpen}
        onClose={onImageClose}
        imageUrl={imageUrl}
        title={title}
      />
    </Modal>
  )
}
