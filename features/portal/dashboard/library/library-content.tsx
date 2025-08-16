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
  Button,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { VideoLibrary } from '../videos/video-library'
import { EbookLibrary } from './ebook-library'

export const LibraryContent = () => {
  const [activeTab, setActiveTab] = useState(0)
  const router = useRouter()

  return (
    <Box>
      <Tabs 
        index={activeTab} 
        onChange={setActiveTab}
        variant="enclosed"
        colorScheme="purple"
      >
        <TabList mb={6}>
          <Tab>
            <HStack spacing={2}>
              <Text>Videos</Text>
              <Badge colorScheme="blue" variant="subtle" fontSize="xs">
                Learning
              </Badge>
            </HStack>
          </Tab>
          <Tab>
            <HStack spacing={2}>
              <Text>Ebooks</Text>
              <Badge colorScheme="green" variant="subtle" fontSize="xs">
                Resources
              </Badge>
            </HStack>
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel p={0}>
            <VideoLibrary />
          </TabPanel>
          <TabPanel p={0}>
            <EbookLibrary />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}
