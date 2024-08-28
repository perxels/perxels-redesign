import { Box, HStack, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import withAuth from '../utils/withAuth'
import Topbar from '../navigation/Topbar'
import AdminSidebar from '../navigation/Sidebar'

const AdminLayout = ({ children, user }: any) => {
  const [navState, setNavState] = useState(false)
  return (
    <HStack overflow="" spacing={0} alignItems="flex-start">
      <AdminSidebar navState={navState} setNavState={setNavState} />
      <VStack overflow="hidden" w="full">
        <Topbar user={user} setNavState={setNavState} />
        <Box p="20px" overflowY="scroll" w="full" maxH="87vh">
          {children}
        </Box>
      </VStack>
    </HStack>
  )
}

export default withAuth(AdminLayout)
