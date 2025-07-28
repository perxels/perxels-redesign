import React, { useEffect, useState } from 'react'
import { StudentAuthGuard } from '../../../../../components/PortalAuthGuard'
import { DashboardLayout } from '../../../../../features/portal/dashboard/dashboard-layout'
import {
  VStack,
  Box,
  Spinner,
  Text,
  Button,
  HStack,
  Badge,
} from '@chakra-ui/react'
import { HeaderInfo } from '../../../../../features/portal/dashboard/messages/header-info'
import { useRouter } from 'next/router'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { portalDb } from '../../../../../portalFirebaseConfig'
import { usePortalAuth } from '../../../../../hooks/usePortalAuth'

const Message = () => {
  const { user } = usePortalAuth()
  const router = useRouter()
  const { 'message-id': messageId } = router.query as { 'message-id': string }
  const [message, setMessage] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMessage = async () => {
      if (!user?.uid || !messageId) return
      setLoading(true)
      try {
        const ref = doc(portalDb, 'notifications', messageId)
        const snap = await getDoc(ref)
        if (!snap.exists()) {
          setMessage(null)
        } else {
          const data = snap.data()
          setMessage({ ...data, id: snap.id })
          // Mark as read if not already
          if (!data.read) {
            await updateDoc(ref, { read: true })
          }
        }
      } catch (err) {
        setMessage(null)
      } finally {
        setLoading(false)
      }
    }
    fetchMessage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid, messageId])

  return (
    <StudentAuthGuard>
      <DashboardLayout>
        <VStack w="full" gap={6}>
          <HeaderInfo onBack={() => router.back()} />
          {loading ? (
            <Spinner size="lg" />
          ) : !message ? (
            <Text color="gray.500">Message not found</Text>
          ) : (
            <VStack w="full" gap={6} align="stretch">
              {/* Message Content */}
              <Box
                dangerouslySetInnerHTML={{
                  __html: message.htmlContent || message.message || '',
                }}
              />
              {/* Attachment Section */}
              {message.data?.hasAttachment && (
                <Box
                  bg="purple.50"
                  border="1px solid"
                  borderColor="purple.200"
                  borderRadius="md"
                  p={4}
                >
                  <VStack spacing={3} align="stretch">
                    <HStack spacing={2}>
                      <Badge colorScheme="purple" variant="subtle">
                        📎 Attachment Available
                      </Badge>
                      <Text fontSize="sm" fontWeight="medium">
                        {message.data.attachmentName}
                      </Text>
                    </HStack>
                    <Text fontSize="sm" color="gray.600">
                      This message includes an important document for your
                      onboarding process.
                    </Text>
                    <HStack gap={2} align="stretch">
                      {message.data?.attachments ? (
                        // Multiple attachments
                        message.data.attachments.map(
                          (attachment: any, index: number) => (
                            <Button
                              key={index}
                              colorScheme="purple"
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const link = document.createElement('a')
                                link.href = `/assets/files/${attachment.filename}`
                                link.download = attachment.name
                                document.body.appendChild(link)
                                link.click()
                                document.body.removeChild(link)
                              }}
                            >
                              📥 {attachment.name}
                            </Button>
                          ),
                        )
                      ) : (
                        // Single attachment (backward compatibility)
                        <Button
                          colorScheme="purple"
                          size="sm"
                          onClick={() => {
                            const link = document.createElement('a')
                            link.href =
                              '/assets/files/how_to_onboard_on_slack.pdf'
                            link.download =
                              message.data.attachmentName ||
                              'How_to_Onboard_on_Slack.pdf'
                            document.body.appendChild(link)
                            link.click()
                            document.body.removeChild(link)
                          }}
                        >
                          📥 Download PDF
                        </Button>
                      )}
                    </HStack>
                  </VStack>
                </Box>
              )}
            </VStack>
          )}
        </VStack>
      </DashboardLayout>
    </StudentAuthGuard>
  )
}

export default Message
