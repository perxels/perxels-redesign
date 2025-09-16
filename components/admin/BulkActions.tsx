import React from 'react'
import {
  Box,
  HStack,
  Text,
  Button,
} from '@chakra-ui/react'

interface BulkActionsProps {
  selectedItems: string[]
  activeTab: number
  onBulkDelete: () => void
  onBulkExpire: () => void
}

export function BulkActionsComponent({ 
  selectedItems, 
  activeTab, 
  onBulkDelete, 
  onBulkExpire 
}: BulkActionsProps) {
  if (selectedItems.length === 0) return null

  return (
    <Box bg="blue.50" p={4} borderRadius="lg" mb={6}>
      <HStack spacing={4}>
        <Text fontWeight="medium" color="blue.700">
          {selectedItems.length} item(s) selected
        </Text>
        <Button size="sm" colorScheme="red" onClick={onBulkDelete}>
          🗑️ Delete Selected
        </Button>
        {activeTab === 0 && (
          <Button size="sm" colorScheme="orange" onClick={onBulkExpire}>
            Expire Selected
          </Button>
        )}
        <Button size="sm" variant="outline">
          📥 Export Selected
        </Button>
      </HStack>
    </Box>
  )
}
