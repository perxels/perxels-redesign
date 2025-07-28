import { Box, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { portalDb } from '../portalFirebaseConfig'
import { useRouter } from 'next/navigation'

export function useUnreadBadge({
  userId,
  collectionName = 'notifications',
  userField = 'userId',
  readField = 'read',
}: {
  userId: string | undefined
  collectionName?: string
  userField?: string
  readField?: string
}) {
  const [hasUnread, setHasUnread] = useState(false)

  useEffect(() => {
    const fetchUnread = async () => {
      if (!userId) return setHasUnread(false)
      try {
        const q = query(
          collection(portalDb, collectionName),
          where(userField, '==', userId),
          where(readField, '==', false)
        )
        const snapshot = await getDocs(q)
        setHasUnread(snapshot.size > 0)
      } catch (err) {
        setHasUnread(false)
      }
    }
    fetchUnread()
  }, [userId, collectionName, userField, readField])

  return hasUnread
}

export const NotificationBadge: React.FC<{
  show: boolean
  text?: string
  bg?: string
  color?: string
  mb?: number | string
  href?: string
}> = ({
  show,
  text = 'YOU HAVE A MESSAGE IN YOUR INBOX',
  bg = '#FFD600',
  color = '#363576',
  mb = 4,
  href,
}) => {
  const router = useRouter()

  if (!show) return null

  return (
    <Box
      w="full"
      bg={bg}
      py="2rem"
      textAlign="center"
      borderRadius="0"
      mb={mb}
      maxW="600px"
      cursor="pointer"
      onClick={() => href ? router.push(href) : router.push('/portal/dashboard/messages')}
    >
      <Text
        color={color}
        fontSize={['1rem', '1.25rem', '1.5rem']}
        letterSpacing="0.02em"
        textTransform="uppercase"
      >
        {text}
      </Text>
    </Box>
  )
} 