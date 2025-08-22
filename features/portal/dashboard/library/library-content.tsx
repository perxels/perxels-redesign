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
        variant="soft-rounded"
        colorScheme="purple"
      >
        <TabList mb={6}>
          <Tab px={8} _selected={{
            bg: 'purple.800',
            color: 'white',
          }}>
            <HStack spacing={2}>
              <Text>Videos</Text>
            </HStack>
          </Tab>
          <Tab px={8} _selected={{
            bg: 'purple.800',
            color: 'white',
          }}>
            <HStack spacing={2}>
              <Text>Ebooks</Text>
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
