import { Box, HStack, VStack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import withAuth from '../utils/withAuth'
import Topbar from '../navigation/Topbar'
import AdminSidebar from '../navigation/Sidebar'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '../../../firebaseConfig'
import { useRouter } from 'next/router'
import { doc, getDoc } from 'firebase/firestore'

const AdminLayout = ({ children, user, title }: any) => {
  const [navState, setNavState] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/admin'); // redirect to login if not authenticated
      }

      // can you get the user data from the database
      const userDocRef = doc(db, 'users', user?.uid ?? '')
      const userDoc = await getDoc(userDocRef)

      if (!userDoc.exists()) {
        router.push('/admin');
        return
      }

      const userData = userDoc.data()

      if (userData?.role !== "admin") {
        router.push('/admin');
        return
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
