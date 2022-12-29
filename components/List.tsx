import { Box, List, ListItem } from '@chakra-ui/react'
import React from 'react'

interface MainListProps {
  lists: Array<string>
  bg?: string
  color?: string
}

export const ListWrapper = ({
  lists,
  bg = 'brand.purple.500',
  color = 'brand.dark.200',
}: MainListProps) => {
  return (
    <List spacing="1.25rem">
      {lists.map((list) => (
        <ListItem
          key={list}
          alignItems="center"
          gap="1.25rem"
          fontSize="1.25rem"
          fontWeight="light"
          color={color}
          display="grid"
          gridTemplateColumns="1.25rem 1fr"
        >
          <Box w="1.25rem" h="1.25rem" bg={bg} rounded="3px" />{' '}
          {list}
        </ListItem>
      ))}
    </List>
  )
}
