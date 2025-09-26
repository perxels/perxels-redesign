import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import {
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
  Card,
  CardBody,
  Badge,
  Icon,
} from '@chakra-ui/react'
import { FiLock, FiBook } from 'react-icons/fi'
import { EbookCard } from './ebook-card'
import { PortalEbook } from '../../../../types/ebook.types'
import { usePortalAuth } from '../../../../hooks/usePortalAuth'
import {
  getAllEbooksWithAccessStatus,
  grantEbookAccess,
  recordEbookDownload,
} from '../../../../lib/utils/ebook.utils'

export const EbookLibrary = () => {
  const router = useRouter()
  const [ebooks, setEbooks] = useState<
    Array<PortalEbook & { hasAccess: boolean }>
  >([])
  const [loading, setLoading] = useState(true)
  const [accessCode, setAccessCode] = useState('')
  const [grantingAccess, setGrantingAccess] = useState(false)
  const [downloadingEbook, setDownloadingEbook] = useState<string | null>(null)
  const [ebookToUnlock, setEbookToUnlock] = useState<PortalEbook | null>(null)

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
    // Old code
    // if (!user?.uid || !accessCode.trim()) {
    //   toast({
    //     title: 'Error',
    //     description: 'Please enter an access code',
    //     status: 'error',
    //     duration: 3000,
    //   })
    //   return
    // }
    if (!user?.uid) {
      toast({
        title: 'Error',
        description: 'Please log in first',
        status: 'error',
        duration: 3000,
      })
      return
    }

    // Enhanced sanitization
    const sanitizedCode = accessCode
      .trim()
      .toUpperCase()
      .replace(/\s/g, '')
      .replace(/[^A-Z0-9]/g, '')

    if (!sanitizedCode) {
      toast({
        title: 'Error',
        description: 'Please enter a valid access code',
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
        accessCode: sanitizedCode,
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

  const handleDownloadEbook = async (ebook: PortalEbook) => {
    if (!user?.uid) return

    setDownloadingEbook(ebook.id)
    try {
      // Record the download
      await recordEbookDownload(ebook.id, user.uid)

      // Create a temporary link and trigger download
      const link = document.createElement('a')
      link.href = ebook.fileUrl
      link.download = ebook.fileName
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: 'Download Started! 📚',
        description: `${ebook.title} is being downloaded`,
        status: 'success',
        duration: 3000,
      })

      // Refresh the ebook list to update download count
      fetchEbooks()
    } catch (error) {
      console.error('Error downloading ebook:', error)
      toast({
        title: 'Download Error',
        description: 'Failed to download ebook. Please try again.',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setDownloadingEbook(null)
    }
  }

  const handleEbookSelect = (ebook: PortalEbook) => {
    router.push(`/portal/dashboard/ebooks/${ebook.id}`)
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

  const getStats = () => {
    const totalEbooks = ebooks.length
    const unlockedEbooks = ebooks.filter((e) => e.hasAccess).length
    const lockedEbooks = totalEbooks - unlockedEbooks
    const categories = new Set(ebooks.map((e) => e.category).filter(Boolean))
      .size

    return { totalEbooks, unlockedEbooks, lockedEbooks, categories }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (loading) {
    return (
      <VStack spacing={4} py={8}>
        <Spinner size="xl" color="purple.500" />
        <Text color="gray.600">Loading your ebook library...</Text>
      </VStack>
    )
  }

  const stats = getStats()

  return (
    <VStack spacing={6} align="stretch">
      {/* Header */}
      <VStack align="start" spacing={2}>
        <HStack spacing={3}>
          <Icon as={FiBook} boxSize={8} color="purple.500" />
          <VStack align="start" spacing={0}>
            <Text fontSize="2xl" fontWeight="bold">
              Ebook Library
            </Text>
            <Text color="gray.600">
              Access and download your assigned ebooks
            </Text>
          </VStack>
        </HStack>
      </VStack>

      {/* Stats */}
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
        <Card>
          <CardBody>
            <VStack spacing={2}>
              <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                {stats.totalEbooks}
              </Text>
              <Text fontSize="sm" color="gray.600">
                Total Ebooks
              </Text>
            </VStack>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <VStack spacing={2}>
              <Text fontSize="2xl" fontWeight="bold" color="green.600">
                {stats.unlockedEbooks}
              </Text>
              <Text fontSize="sm" color="gray.600">
                Unlocked
              </Text>
            </VStack>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <VStack spacing={2}>
              <Text fontSize="2xl" fontWeight="bold" color="orange.600">
                {stats.lockedEbooks}
              </Text>
              <Text fontSize="sm" color="gray.600">
                Locked
              </Text>
            </VStack>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <VStack spacing={2}>
              <Text fontSize="2xl" fontWeight="bold" color="purple.600">
                {stats.categories}
              </Text>
              <Text fontSize="sm" color="gray.600">
                Categories
              </Text>
            </VStack>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Instructions */}
      <Card>
        <CardBody>
          <VStack spacing={3} align="start">
            <HStack spacing={2}>
              <Icon as={FiLock} color="orange.500" />
              <Text fontWeight="semibold">How to Access Ebooks</Text>
            </HStack>
            <Text fontSize="sm" color="gray.600">
              Use the access codes provided by your instructor to unlock ebooks.
              Once unlocked, you can download them to your device for offline
              reading.
            </Text>
          </VStack>
        </CardBody>
      </Card>

      {/* Ebooks Grid */}
      {ebooks.length > 0 ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {ebooks.map((ebook) => (
            <EbookCard
              key={ebook.id}
              ebook={ebook}
              hasAccess={ebook.hasAccess}
              onDownload={() => handleDownloadEbook(ebook)}
              onUnlock={() => handleUnlockEbook(ebook)}
              onSelect={() => handleEbookSelect(ebook)}
              isDownloading={downloadingEbook === ebook.id}
              formatFileSize={formatFileSize}
            />
          ))}
        </SimpleGrid>
      ) : (
        <Card>
          <CardBody>
            <VStack spacing={4} py={8}>
              <Icon as={FiBook} boxSize={12} color="gray.300" />
              <VStack spacing={2}>
                <Text color="gray.500" fontSize="lg">
                  No Ebooks Available
                </Text>
                <Text color="gray.400" fontSize="sm" textAlign="center">
                  Your instructor hasn&apos;t assigned any ebooks yet. Check
                  back later or contact your instructor for access codes.
                </Text>
              </VStack>
            </VStack>
          </CardBody>
        </Card>
      )}

      {/* Access Code Modal */}
      <Modal isOpen={isCodeModalOpen} onClose={onCodeModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <VStack align="start" spacing={1}>
              <Text>Unlock Ebook</Text>
              <Text fontSize="sm" color="gray.600" fontWeight="normal">
                Enter the access code to unlock this ebook
              </Text>
            </VStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              {ebookToUnlock && (
                <Card w="full">
                  <CardBody>
                    <VStack spacing={2} align="start">
                      <Text fontWeight="semibold">{ebookToUnlock.title}</Text>
                      <Text fontSize="sm" color="gray.600" noOfLines={2}>
                        {ebookToUnlock.description}
                      </Text>
                      <HStack spacing={2}>
                        <Badge colorScheme="blue" variant="subtle">
                          {ebookToUnlock.author}
                        </Badge>
                        {ebookToUnlock.category && (
                          <Badge colorScheme="purple" variant="subtle">
                            {ebookToUnlock.category}
                          </Badge>
                        )}
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>
              )}

              <FormControl>
                <FormLabel>Access Code</FormLabel>
                <Input
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                  placeholder="Enter 6-character code"
                  maxLength={6}
                  fontFamily="mono"
                  fontSize="lg"
                  textAlign="center"
                  letterSpacing="0.2em"
                  onKeyPress={handleKeyPress}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onCodeModalClose}>
              Cancel
            </Button>
            <Button
              colorScheme="purple"
              onClick={handleGrantAccess}
              isLoading={grantingAccess}
              loadingText="Unlocking..."
              isDisabled={!accessCode.trim()}
            >
              Unlock Ebook
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  )
}
