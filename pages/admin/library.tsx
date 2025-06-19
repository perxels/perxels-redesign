import React from 'react'
import AdminLayout from '../../features/admin/layout/AdminLayout'
import {
  Box,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react'
import AdminVideoPage from '../../components/AdminVideoPage'
import AdminPdfPage from '../../components/AdminPDFPage'
import AdminTestimonialPage from '../../components/AdminTestimonialPage'
import AdminBlogPage from '../../components/AdminBlogPage'
import AdminAdvertisementPage from '../../components/AdminAdvertisementPage'
import AdminUsersPage from '../../components/AdminUsersPage'
import AdminMasterclassPage from '../../components/AdminMasterclassPage'

const AdminMasterClasses = () => {
  return (
    <AdminLayout title="Library">
      <Tabs
        variant="soft-rounded"
        colorScheme="purple"
        //   index={changeState}
        //   onChange={(index) => setChangeState(index)}
      >
        <TabList
          overflowX="auto" // Enable horizontal scrolling
          whiteSpace="nowrap"
        >
          <Tab>Videos</Tab>
          <Tab>PDF</Tab>
          <Tab>Testimonial</Tab>
          <Tab>Blogs</Tab>
          <Tab>Advertisements</Tab>
          <Tab>Users</Tab>
          <Tab>Masterclasses</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Box w="full" mt="10px">
              <AdminVideoPage />
            </Box>
          </TabPanel>
          <TabPanel>
            <Box w="full" mt="10px">
              <AdminPdfPage />
            </Box>
          </TabPanel>
          <TabPanel>
            <AdminTestimonialPage />
          </TabPanel>
          <TabPanel>
           <AdminBlogPage/>
          </TabPanel>
          <TabPanel>
           <AdminAdvertisementPage />
          </TabPanel>
          <TabPanel>
           <AdminUsersPage />
          </TabPanel>
          <TabPanel>
            <AdminMasterclassPage />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </AdminLayout>
  )
}

export default AdminMasterClasses
