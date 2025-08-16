import React, { useState } from 'react'
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Text,
  HStack,
  Badge,
  VStack,
} from '@chakra-ui/react'
import { FiVideo, FiBook } from 'react-icons/fi'
import { VideoManagementSimple } from '../videos/video-management-simple'
import { EbookManagement } from '../ebooks/ebook-management'

export const LibraryManagement = () => {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <VStack align="start" spacing={1}>
          <Text fontSize="3xl" fontWeight="bold" color="gray.800">
            Library Management
          </Text>
          <Text color="gray.600" fontSize="lg">
            Manage videos and ebooks for student access
          </Text>
        </VStack>

        {/* Tabs */}
        <Tabs
          index={activeTab}
          onChange={setActiveTab}
          variant="enclosed"
          colorScheme="purple"
          size="lg"
        >
          <TabList>
            <Tab>
              <HStack spacing={3}>
                <FiVideo size={20} />
                <Text fontWeight="medium">Videos</Text>
                <Badge colorScheme="blue" variant="subtle" fontSize="xs">
                  Learning
                </Badge>
              </HStack>
            </Tab>
            <Tab>
              <HStack spacing={3}>
                <FiBook size={20} />
                <Text fontWeight="medium">Ebooks</Text>
                <Badge colorScheme="green" variant="subtle" fontSize="xs">
                  Resources
                </Badge>
              </HStack>
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel p={6}>
              <VideoManagementSimple />
            </TabPanel>
            <TabPanel p={6}>
              <EbookManagement />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Box>
  )
}
