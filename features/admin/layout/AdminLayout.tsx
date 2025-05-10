import { Box, HStack, VStack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import withAuth from '../utils/withAuth'
import Topbar from '../navigation/Topbar'
import AdminSidebar from '../navigation/Sidebar'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../../../firebaseConfig'
import { useRouter } from 'next/router'

const AdminLayout = ({ children, user, title }: any) => {
  const [navState, setNavState] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/admin'); // redirect to login if not authenticated
      }
    });
  
    return () => unsubscribe(); // cleanup
  }, []);

  return (
    <HStack overflow="" spacing={0} alignItems="flex-start">
      <AdminSidebar navState={navState} setNavState={setNavState} />
      <VStack overflow="hidden" w="full">
        <Topbar user={user} setNavState={setNavState} title={title} />
        <Box p="20px" overflowY="scroll" w="full" maxH="87vh">
          {children}
        </Box>
      </VStack>
    </HStack>
  )
}

export default withAuth(AdminLayout)
