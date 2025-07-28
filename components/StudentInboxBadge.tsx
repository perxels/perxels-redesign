import { Box, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { portalDb } from '../portalFirebaseConfig'
import { usePortalAuth } from '../hooks/usePortalAuth'

const useStudentUnreadMessages = () => {
  const { user } = usePortalAuth()
  const [hasUnread, setHasUnread] = useState(false)

  useEffect(() => {
    const fetchUnread = async () => {
      if (!user?.uid) return setHasUnread(false)
      try {
        const q = query(
          collection(portalDb, 'notifications'),
          where('userId', '==', user.uid),
          where('read', '==', false)
        )
        const snapshot = await getDocs(q)
        setHasUnread(snapshot.size > 0)
      } catch (err) {
        setHasUnread(false)
      }
    }
    fetchUnread()
  }, [user?.uid])

  return hasUnread
}

const StudentInboxBadge: React.FC = () => {
  const hasUnread = useStudentUnreadMessages()

  if (!hasUnread) return null

  return (
    <Box
      w="full"
      bg="#FFD600"
      py="2rem"
      textAlign="center"
      borderRadius="0"
      mb={4}
    >
      <Text
        color="#363576"
        fontWeight="bold"
        fontSize="1.5rem"
        letterSpacing="0.02em"
        textTransform="uppercase"
      >
        YOU HAVE A MESSAGE IN YOUR INBOX
      </Text>
    </Box>
  )
}

export default StudentInboxBadge 