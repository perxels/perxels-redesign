import React, { useEffect, useState } from 'react'
import { StudentAuthGuard } from '../../../../components/PortalAuthGuard'
import { DashboardLayout } from '../../../../features/portal/dashboard/dashboard-layout'
import { VStack, Box, Button, Text, HStack, Spinner, Badge } from '@chakra-ui/react'
import { HeaderInfo } from '../../../../features/portal/dashboard/messages/header-info'
import { useRouter } from 'next/router'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { portalDb } from '../../../../portalFirebaseConfig'
import { usePortalAuth } from '../../../../hooks/usePortalAuth'

interface StudentNotification {
  id: string
  title: string
  htmlContent?: string
  read: boolean
  createdAt: any
  data?: {
    cohort?: string
    hasAttachment?: boolean
    attachmentName?: string
    attachments?: Array<{
      name: string
      filename: string
      description: string
    }>
  }
}

const Messages = () => {
  const { user } = usePortalAuth()
  const [messages, setMessages] = useState<StudentNotification[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchMessages = async () => {
      if (!user?.uid) return
      setLoading(true)
      try {
        const q = query(
          collection(portalDb, 'notifications'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        )
        const snapshot = await getDocs(q)
        const msgs: StudentNotification[] = snapshot.docs
          .map(doc => {
            const data = doc.data()
            return {
              id: doc.id,
              title: data.title || '',
              htmlContent: data.htmlContent || '',
              read: data.read, // treat missing as false
              createdAt: data.createdAt,
              data: data.data || {},
            }
          })
          // .filter(msg => !msg.read)
        setMessages(msgs)
      } catch (err) {
        setMessages([])
      } finally {
        setLoading(false)
      }
    }
    fetchMessages()
  }, [user?.uid])

  return (
    <StudentAuthGuard>
      <DashboardLayout>
        <VStack w="full" gap={6}>
          <HeaderInfo />
          {loading ? (
            <Spinner size="lg" />
          ) : messages.length === 0 ? (
            <Text color="gray.500">No unread messages</Text>
          ) : (
            <VStack w="full" gap={4}>
              {messages.map((msg) => (
                <HStack
                  key={msg.id}
                  w="full"
                  bg={msg.read ? "#E9E8F9" : "#D1D0F0"} // Different background for unread
                  borderRadius="md"
                  px={8}
                  py={6}
                  justifyContent="space-between"
                  alignItems="center"
                  position="relative"
                  borderLeft={msg.read ? "none" : "4px solid #3B3678"} // Left border for unread
                >
                  <VStack align="start" spacing={2} flex={1}>
                    <HStack spacing={2} align="center">
                      <Text 
                        fontWeight={msg.read ? "bold" : "extrabold"} 
                        fontSize="lg" 
                        color="#222" 
                        textAlign="left"
                      >
                        {msg.title}
                      </Text>
                      {!msg.read && (
                        <Badge colorScheme="purple" variant="solid" fontSize="xs">
                          NEW
                        </Badge>
                      )}
                    </HStack>
                    {msg.data?.hasAttachment && (
                      <HStack spacing={2}>
                        <Badge colorScheme="green" variant="subtle" fontSize="xs">
                          📎 {msg.data.attachments ? `${msg.data.attachments.length} Attachments` : 'Attachment'}
                        </Badge>
                        <Text fontSize="sm" color="gray.600">
                          {msg.data.attachments 
                            ? msg.data.attachments.map(a => a.name).join(', ')
                            : msg.data.attachmentName
                          }
                        </Text>
                      </HStack>
                    )}
                  </VStack>
                  <Button
                    bg="#3B3678"
                    color="white"
                    _hover={{ bg: '#28235c' }}
                    px={8}
                    onClick={() => router.push(`/portal/dashboard/messages/${msg.id}`)}
                  >
                    Open
                  </Button>
                </HStack>
              ))}
            </VStack>
          )}
        </VStack>
      </DashboardLayout>
    </StudentAuthGuard>
  )
}

export default Messages