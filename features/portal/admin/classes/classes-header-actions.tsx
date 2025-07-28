import { HStack } from '@chakra-ui/react'
import React from 'react'
import { ClassSearchInput } from './class-search-input'
import { CreateClass } from './create-class'

export const ClassesHeaderActions = () => {
  return (
    <HStack w="full" justifyContent="space-between" alignItems="center">
      <ClassSearchInput />
      <CreateClass />
    </HStack>
  )
}
