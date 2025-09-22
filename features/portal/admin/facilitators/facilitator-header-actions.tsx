import {
  Box,
  Button,
  Flex,
  Input,
  useDisclosure,
  VStack,
} from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { MdOutlineAdd } from 'react-icons/md'
import { CreateFacilitatorModal } from './create-facilitator-modal'
import { useState } from 'react'
import { useRouter } from 'next/router'

export const FacilitatorHeaderActions = () => {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    setSearchTerm((router.query.search as string) || '')
  }, [router.query.search])
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)

    // Update URL with search query
    const updatedQuery = { ...router.query }
    if (value.trim()) {
      updatedQuery.search = value.trim()
    } else {
      delete updatedQuery.search
    }

    router.push({ pathname: router.pathname, query: updatedQuery }, undefined, {
      shallow: true,
    })
  }

  return (
    <>
      <VStack spacing={6} align="stretch">
        <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
          <Box flex={1} w="300px">
            <Input
              colorScheme="purple"
              w="300px"
              height={['40px', '64px']}
              bgColor="gray.100"
              _placeholder={{ color: 'gray.600' }}
              fontSize="1rem"
              placeholder="Search by name, email..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </Box>
          <Button
            leftIcon={<MdOutlineAdd />}
            colorScheme="blue"
            onClick={onOpen}
            size="lg"
          >
            Add Facilitator
          </Button>
        </Flex>
      </VStack>

      {/* Modals */}
      <CreateFacilitatorModal
        isOpen={isOpen}
        onClose={onClose}
        // onFacilitatorCreated={loadFacilitators}
      />
    </>
  )
}
