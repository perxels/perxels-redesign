import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import {
  Box,
  Button,
  Input,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Spinner,
  FormControl,
  FormLabel,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react'
import { FiLock, FiBook } from 'react-icons/fi'
import { PortalEbook } from '../../../../types/ebook.types'

import { usePortalAuth } from '../../../../hooks/usePortalAuth'
import { EbookCard } from './ebook-card'
import {
  getAllEbooksWithAccessStatus,
  grantEbookAccess,
} from '../../../../lib/utils/ebook.utils'

export const EbookLibrary = () => {
  const router = useRouter()
  const [ebooks, setEbooks] = useState<
    Array<PortalEbook & { hasAccess: boolean }>
  >([])
  const [loading, setLoading] = useState(true)
  const [accessCode, setAccessCode] = useState('')
  const [grantingAccess, setGrantingAccess] = useState(false)
  const [ebookToUnlock, setEbookToUnlock] = useState<PortalEbook | null>(null)
  const [activeTab, setActiveTab] = useState(0)

  const {
    isOpen: isCodeModalOpen,
    onOpen: onCodeModalOpen,
    onClose: onCodeModalClose,
  } = useDisclosure()

  const { user } = usePortalAuth()
  const toast = useToast()

  const fetchEbooks = async () => {
    if (!user?.uid) return

    try {
      setLoading(true)
      const ebookData = await getAllEbooksWithAccessStatus(user.uid)
      setEbooks(ebookData)
    } catch (error) {
      console.error('Error fetching ebooks:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch ebooks',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEbooks()
  }, [user?.uid])

  const handleGrantAccess = async () => {
    if (!user?.uid || !accessCode.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter an access code',
        status: 'error',
        duration: 3000,
      })
      return
    }

    setGrantingAccess(true)
    try {
      const result = await grantEbookAccess({
        ebookId: '', // Will be determined by access code
        studentId: user.uid,
        accessCode: accessCode.trim().toUpperCase(),
      })

      if (result.success) {
        toast({
          title: 'Success! 🎉',
          description: result.message,
          status: 'success',
          duration: 5000,
        })
        setAccessCode('')
        onCodeModalClose()
        fetchEbooks() // Refresh the ebook list
      } else {
        toast({
          title: 'Access Denied',
          description: result.error,
          status: 'error',
          duration: 5000,
        })
      }
    } catch (error) {
      console.error('Error granting access:', error)
      toast({
        title: 'Error',
        description: 'An error occurred. Please try again.',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setGrantingAccess(false)
    }
  }

  const handleUnlockEbook = (ebook: PortalEbook) => {
    setEbookToUnlock(ebook)
    onCodeModalOpen()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGrantAccess()
    }
  }

  const unlockedEbooks = ebooks.filter((e) => e.hasAccess)
  const lockedEbooks = ebooks.filter((e) => !e.hasAccess)
  const getStats = () => {
    const totalEbooks = ebooks.length
    const unlockedEbooks = ebooks.filter((e) => e.hasAccess).length
    const lockedEbooks = totalEbooks - unlockedEbooks
    const categories = new Set(ebooks.map((e) => e.category).filter(Boolean))
      .size

    return { totalEbooks, unlockedEbooks, lockedEbooks, categories }
  }

  if (loading) {
    return (
      <VStack spacing={4} py={8}>
        <Spinner size="xl" color="purple.500" />
        <Text color="gray.500">Loading ebook library...</Text>
      </VStack>
    )
  }

  const stats = getStats()

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        {/* Stats */}
        {ebooks.length > 0 && (
          <Tabs
            index={activeTab}
            onChange={setActiveTab}
            variant="soft-rounded"
            colorScheme="purple"
          >
            <TabList mb={6}>
              <Tab
                opacity={0.76}
                _selected={{
                  opacity: '100%',
                }}
              >
                <Box
                  bg="white"
                  p={4}
                  borderRadius="lg"
                  shadow="sm"
                  minW="150px"
                >
                  <Text fontSize="sm" color="gray.500">
                    Total Ebooks
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold" color="purple.600">
                    {stats.totalEbooks}
                  </Text>
                </Box>
              </Tab>
              <Tab
                opacity={0.76}
                _selected={{
                  opacity: '100%',
                }}
              >
                <Box
                  bg="white"
                  p={4}
                  borderRadius="lg"
                  shadow="sm"
                  minW="150px"
                >
                  <Text fontSize="sm" color="gray.500">
                    Unlocked
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold" color="green.600">
                    {stats.unlockedEbooks}
                  </Text>
                </Box>
              </Tab>
              <Tab
                opacity={0.76}
                _selected={{
                  opacity: '100%',
                }}
              >
                <Box
                  bg="white"
                  p={4}
                  borderRadius="lg"
                  shadow="sm"
                  minW="150px"
                >
                  <Text fontSize="sm" color="gray.500">
                    Locked
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold" color="orange.600">
                    {stats.lockedEbooks}
                  </Text>
                </Box>
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel p={0}>
                {/* EBook Grid */}
                {ebooks.length === 0 ? (
                  <Box textAlign="center" py={12}>
                    <FiBook size={48} color="#E2E8F0" />
                    <Text fontSize="xl" color="gray.500" mt={4} mb={2}>
                      No ebooks available yet
                    </Text>
                    <Text color="gray.400" mb={6}>
                      Ebooks will appear here once they are added by your
                      instructors
                    </Text>
                    <Button
                      colorScheme="purple"
                      onClick={onCodeModalOpen}
                      leftIcon={<FiLock />}
                    >
                      Unlock with Access Code
                    </Button>
                  </Box>
                ) : (
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {ebooks.map((ebook) => (
                      <EbookCard
                        key={ebook.id}
                        ebook={ebook}
                        onDownload={() => {}} // Download is handled directly in the card
                        onUnlock={() => handleUnlockEbook(ebook)}
                        userId={user?.uid}
                      />
                    ))}
                  </SimpleGrid>
                )}
              </TabPanel>
              <TabPanel p={0}>
                {/* EBook Grid */}
                {unlockedEbooks.length === 0 ? (
                  <Box textAlign="center" py={12}>
                    <FiBook size={48} color="#E2E8F0" />
                    <Text fontSize="xl" color="gray.500" mt={4} mb={2}>
                      No unlocked ebooks available yet
                    </Text>
                    <Text color="gray.400" mb={6}>
                      Ebooks will appear here once unlock atleast one.
                    </Text>
                    <Button
                      colorScheme="purple"
                      onClick={onCodeModalOpen}
                      leftIcon={<FiLock />}
                    >
                      Unlock with Access Code
                    </Button>
                  </Box>
                ) : (
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {unlockedEbooks.map((ebook) => (
                      <EbookCard
                        key={ebook.id}
                        ebook={ebook}
                        onDownload={() => {}} // Download is handled directly in the card
                        onUnlock={() => handleUnlockEbook(ebook)}
                        userId={user?.uid}
                      />
                    ))}
                  </SimpleGrid>
                )}
              </TabPanel>
              <TabPanel p={0}>
                {/* EBook Grid */}
                {lockedEbooks.length === 0 ? (
                  <Box textAlign="center" py={12}>
                    <FiBook size={48} color="#E2E8F0" />
                    <Text fontSize="xl" color="gray.500" mt={4} mb={2}>
                      No locked ebooks available yet
                    </Text>
                    {/* <Text color="gray.400" mb={6}>
                      Ebooks will appear here once unlock atleast one.
                    </Text> */}
                    {/* <Button
                      colorScheme="purple"
                      onClick={onCodeModalOpen}
                      leftIcon={<FiLock />}
                    >
                      Unlock with Access Code
                    </Button> */}
                  </Box>
                ) : (
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {lockedEbooks.map((ebook) => (
                      <EbookCard
                        key={ebook.id}
                        ebook={ebook}
                        onDownload={() => {}} // Download is handled directly in the card
                        onUnlock={() => handleUnlockEbook(ebook)}
                        userId={user?.uid}
                      />
                    ))}
                  </SimpleGrid>
                )}
              </TabPanel>{' '}
            </TabPanels>
          </Tabs>
        )}
      </VStack>

      {/* Access Code Modal */}
      <Modal isOpen={isCodeModalOpen} onClose={onCodeModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {ebookToUnlock
              ? `Unlock: ${ebookToUnlock.title}`
              : 'Enter Access Code'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Access Code</FormLabel>
                <Input
                  placeholder="Enter code (e.g., ABC123)"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                  onPaste={(e) => {
                    // Handle paste events
                    e.preventDefault()
                    const pastedText = e.clipboardData.getData('text')
                    const sanitized = pastedText
                      .toUpperCase()
                      .replace(/[^A-Z0-9]/g, '')
                      .slice(0, 10)
                    setAccessCode(sanitized)
                  }}
                  onKeyPress={handleKeyPress}
                  textAlign="center"
                  fontSize="lg"
                  letterSpacing="0.1em"
                  fontFamily="mono"
                  maxLength={6}
                />
                <Text fontSize="xs" color="gray.500" mt={1}>
                  Code should be 6 characters (letters and numbers)
                </Text>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onCodeModalClose}>
              Cancel
            </Button>
            <Button
              colorScheme="purple"
              onClick={handleGrantAccess}
              isLoading={grantingAccess}
              loadingText="Checking code..."
              isDisabled={accessCode.length < 3}
            >
              {ebookToUnlock ? 'Unlock Ebook' : 'Access Ebook'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}
