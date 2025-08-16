import React from 'react'
import {
  Card,
  CardBody,
  CardHeader,
  VStack,
  HStack,
  Text,
  Button,
  Badge,
  Icon,
  Image,
  Box,
  Spinner,
  Tooltip,
} from '@chakra-ui/react'
import { FiLock, FiDownload, FiFile, FiBook, FiEye } from 'react-icons/fi'
import { PortalEbook } from '../../../types/ebook.types'

interface EbookCardProps {
  ebook: PortalEbook
  hasAccess: boolean
  onDownload: () => void
  onUnlock: () => void
  onSelect: () => void
  isDownloading: boolean
  formatFileSize: (bytes: number) => string
}

export const EbookCard: React.FC<EbookCardProps> = ({
  ebook,
  hasAccess,
  onDownload,
  onUnlock,
  onSelect,
  isDownloading,
  formatFileSize,
}) => {
  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'application/pdf':
        return '📄'
      case 'application/epub+zip':
        return '📖'
      case 'text/plain':
        return '📝'
      default:
        return '📚'
    }
  }

  const getFileTypeLabel = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'application/pdf':
        return 'PDF'
      case 'application/epub+zip':
        return 'EPUB'
      case 'text/plain':
        return 'TXT'
      default:
        return fileType.split('/')[1]?.toUpperCase() || 'FILE'
    }
  }

  return (
    <Card
      variant="outline"
      cursor="pointer"
      transition="all 0.2s"
      _hover={{
        transform: 'translateY(-2px)',
        boxShadow: 'lg',
        borderColor: hasAccess ? 'green.300' : 'orange.300',
      }}
      onClick={onSelect}
    >
      <CardHeader pb={2}>
        <VStack spacing={3} align="stretch">
          {/* Cover Image or Placeholder */}
          <Box
            bg={hasAccess ? 'green.50' : 'orange.50'}
            borderRadius="md"
            p={4}
            textAlign="center"
            minH="120px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            position="relative"
          >
            {ebook.thumbnailUrl ? (
              <Image
                src={ebook.thumbnailUrl}
                alt={ebook.title}
                borderRadius="md"
                maxH="100px"
                objectFit="contain"
              />
            ) : (
              <VStack spacing={2}>
                <Text fontSize="4xl">{getFileIcon(ebook.fileType)}</Text>
                <Badge colorScheme={hasAccess ? 'green' : 'orange'} variant="subtle">
                  {getFileTypeLabel(ebook.fileType)}
                </Badge>
              </VStack>
            )}
            
            {/* Access Status Overlay */}
            {!hasAccess && (
              <Box
                position="absolute"
                top={2}
                right={2}
                bg="orange.500"
                color="white"
                borderRadius="full"
                p={1}
              >
                <Icon as={FiLock} boxSize={3} />
              </Box>
            )}
          </Box>

          {/* Title and Author */}
          <VStack align="start" spacing={1}>
            <Text fontWeight="bold" fontSize="lg" noOfLines={2}>
              {ebook.title}
            </Text>
            <Text fontSize="sm" color="gray.600" noOfLines={1}>
              by {ebook.author}
            </Text>
          </VStack>
        </VStack>
      </CardHeader>

      <CardBody pt={0}>
        <VStack spacing={3} align="stretch">
          {/* Description */}
          <Text fontSize="sm" color="gray.600" noOfLines={3}>
            {ebook.description}
          </Text>

          {/* File Info */}
          <HStack spacing={2} fontSize="sm" color="gray.500">
            <Icon as={FiFile} />
            <Text>{formatFileSize(ebook.fileSize)}</Text>
            <Text>•</Text>
            <Text>{getFileTypeLabel(ebook.fileType)}</Text>
            {ebook.pageCount && (
              <>
                <Text>•</Text>
                <Text>{ebook.pageCount} pages</Text>
              </>
            )}
          </HStack>

          {/* Badges */}
          <HStack spacing={2} flexWrap="wrap">
            {ebook.category && (
              <Badge colorScheme="blue" variant="subtle" size="sm">
                {ebook.category}
              </Badge>
            )}
            {ebook.language && (
              <Badge colorScheme="purple" variant="subtle" size="sm">
                {ebook.language}
              </Badge>
            )}
            <Badge colorScheme="gray" variant="subtle" size="sm">
              {ebook.downloadCount} downloads
            </Badge>
          </HStack>

          {/* Action Buttons */}
          <HStack spacing={2} pt={2}>
            {hasAccess ? (
              <>
                <Button
                  size="sm"
                  colorScheme="purple"
                  leftIcon={isDownloading ? <Spinner size="xs" /> : <FiDownload />}
                  onClick={(e) => {
                    e.stopPropagation()
                    onDownload()
                  }}
                  isLoading={isDownloading}
                  loadingText="Downloading..."
                  flex={1}
                >
                  Download
                </Button>
                <Tooltip label="View Details">
                  <Button
                    size="sm"
                    variant="outline"
                    leftIcon={<FiEye />}
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelect()
                    }}
                  >
                    View
                  </Button>
                </Tooltip>
              </>
            ) : (
              <Button
                size="sm"
                colorScheme="orange"
                leftIcon={<FiLock />}
                onClick={(e) => {
                  e.stopPropagation()
                  onUnlock()
                }}
                flex={1}
              >
                Unlock with Code
              </Button>
            )}
          </HStack>

          {/* Access Code Display (for unlocked ebooks) */}
          {hasAccess && (
            <Box
              bg="green.50"
              p={2}
              borderRadius="md"
              border="1px solid"
              borderColor="green.200"
            >
              <HStack spacing={2} justify="center">
                <Icon as={FiBook} color="green.600" />
                <Text fontSize="xs" color="green.700" fontWeight="medium">
                  Access Code: {ebook.accessCode}
                </Text>
              </HStack>
            </Box>
          )}
        </VStack>
      </CardBody>
    </Card>
  )
}
