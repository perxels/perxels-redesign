import React from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Divider,
  Badge,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  List,
  ListItem,
  ListIcon,
  Link,
  Icon,
} from '@chakra-ui/react'
import { MdCheckCircle, MdLink, MdAccessTime, MdComputer, MdSchool } from 'react-icons/md'
import { Syllabus } from '../../../../types/syllabus.types'

interface SyllabusViewerProps {
  syllabus: Syllabus
}

export const SyllabusViewer: React.FC<SyllabusViewerProps> = ({ syllabus }) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const isUrl = (text: string) => {
    try {
      new URL(text)
      return true
    } catch {
      return false
    }
  }

  return (
    <VStack spacing={6} align="stretch">
      {/* Syllabus Header */}
      <Card>
        <CardHeader>
          <VStack align="start" spacing={3}>
            <Heading size="lg">{syllabus.name}</Heading>
            <Text color="gray.600" fontSize="lg">{syllabus.description}</Text>
            <HStack spacing={4}>
              <Badge colorScheme="blue" variant="subtle">
                {syllabus.totalWeeks} Weeks
              </Badge>
              <Badge colorScheme="green" variant="subtle">
                {syllabus.totalDays} Days
              </Badge>
              <Badge colorScheme={syllabus.isActive ? 'green' : 'gray'} variant="subtle">
                {syllabus.isActive ? 'Active' : 'Inactive'}
              </Badge>
              <Badge colorScheme="purple" variant="subtle">
                v{syllabus.version}
              </Badge>
            </HStack>
            <Text fontSize="sm" color="gray.500">
              Created: {formatDate(syllabus.createdAt)} | 
              Updated: {formatDate(syllabus.updatedAt)}
            </Text>
          </VStack>
        </CardHeader>
      </Card>

      {/* Course Structure */}
      <Card>
        <CardHeader>
          <Heading size="md">Course Structure</Heading>
        </CardHeader>
        <CardBody>
          <Accordion allowMultiple>
            {syllabus.weeks.map((week, weekIndex) => (
              <AccordionItem key={week.id || weekIndex}>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <HStack>
                      <Text fontWeight="bold" fontSize="lg">
                        {week.title}
                      </Text>
                      <Badge colorScheme="blue" variant="subtle">
                        {week.days.length} days
                      </Badge>
                    </HStack>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel>
                  <VStack spacing={4} align="stretch">
                    {week.days.map((day, dayIndex) => (
                      <Card key={day.id || dayIndex} variant="outline">
                        <CardHeader pb={2}>
                          <VStack align="start" spacing={2}>
                            <HStack justify="space-between" w="full">
                              <Heading size="md">Day {day.dayNumber}: {day.title}</Heading>
                              <HStack spacing={2}>
                                {day.duration && (
                                  <HStack spacing={1}>
                                    <Icon as={MdAccessTime} color="gray.500" />
                                    <Text fontSize="sm" color="gray.600">
                                      {day.duration}
                                    </Text>
                                  </HStack>
                                )}
                                {day.isOnline && (
                                  <Badge colorScheme="blue" variant="subtle" size="sm">
                                    <HStack spacing={1}>
                                      <Icon as={MdComputer} />
                                      <Text>Online</Text>
                                    </HStack>
                                  </Badge>
                                )}
                                {day.isPhysical && (
                                  <Badge colorScheme="green" variant="subtle" size="sm">
                                    <HStack spacing={1}>
                                      <Icon as={MdSchool} />
                                      <Text>Physical</Text>
                                    </HStack>
                                  </Badge>
                                )}
                              </HStack>
                            </HStack>
                          </VStack>
                        </CardHeader>
                        <CardBody pt={0}>
                          <VStack spacing={4} align="stretch">
                            {/* Content */}
                            <Box>
                              <Text fontWeight="semibold" mb={2}>Content:</Text>
                              <Box
                                bg="gray.50"
                                p={4}
                                borderRadius="md"
                                whiteSpace="pre-line"
                                fontSize="sm"
                                lineHeight="1.6"
                              >
                                {day.content}
                              </Box>
                            </Box>

                            {/* Assignments */}
                            {day.assignments && day.assignments.length > 0 && (
                              <Box>
                                <Text fontWeight="semibold" mb={2}>Assignments:</Text>
                                <List spacing={2}>
                                  {day.assignments.map((assignment, assignmentIndex) => (
                                    <ListItem key={assignmentIndex}>
                                      <ListIcon as={MdCheckCircle} color="green.500" />
                                      <Text fontSize="sm">{assignment}</Text>
                                    </ListItem>
                                  ))}
                                </List>
                              </Box>
                            )}

                            {/* Resources */}
                            {day.resources && day.resources.length > 0 && (
                              <Box>
                                <Text fontWeight="semibold" mb={2}>Resources:</Text>
                                <List spacing={2}>
                                  {day.resources.map((resource, resourceIndex) => (
                                    <ListItem key={resourceIndex}>
                                      <ListIcon as={MdLink} color="blue.500" />
                                      {isUrl(resource) ? (
                                        <Link
                                          href={resource}
                                          isExternal
                                          color="blue.500"
                                          fontSize="sm"
                                          textDecoration="underline"
                                        >
                                          {resource}
                                        </Link>
                                      ) : (
                                        <Text fontSize="sm">{resource}</Text>
                                      )}
                                    </ListItem>
                                  ))}
                                </List>
                              </Box>
                            )}
                          </VStack>
                        </CardBody>
                      </Card>
                    ))}
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </CardBody>
      </Card>

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <Heading size="md">Summary</Heading>
        </CardHeader>
        <CardBody>
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between">
              <Text fontWeight="medium">Total Weeks:</Text>
              <Text>{syllabus.totalWeeks}</Text>
            </HStack>
            <HStack justify="space-between">
              <Text fontWeight="medium">Total Days:</Text>
              <Text>{syllabus.totalDays}</Text>
            </HStack>
            <HStack justify="space-between">
              <Text fontWeight="medium">Online Days:</Text>
              <Text>
                {syllabus.weeks.reduce((acc, week) => 
                  acc + week.days.filter(day => day.isOnline).length, 0
                )}
              </Text>
            </HStack>
            <HStack justify="space-between">
              <Text fontWeight="medium">Physical Days:</Text>
              <Text>
                {syllabus.weeks.reduce((acc, week) => 
                  acc + week.days.filter(day => day.isPhysical).length, 0
                )}
              </Text>
            </HStack>
            <HStack justify="space-between">
              <Text fontWeight="medium">Total Assignments:</Text>
              <Text>
                {syllabus.weeks.reduce((acc, week) => 
                  acc + week.days.reduce((dayAcc, day) => 
                    dayAcc + (day.assignments?.length || 0), 0
                  ), 0
                )}
              </Text>
            </HStack>
            <HStack justify="space-between">
              <Text fontWeight="medium">Total Resources:</Text>
              <Text>
                {syllabus.weeks.reduce((acc, week) => 
                  acc + week.days.reduce((dayAcc, day) => 
                    dayAcc + (day.resources?.length || 0), 0
                  ), 0
                )}
              </Text>
            </HStack>
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  )
}
