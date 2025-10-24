import { VStack } from '@chakra-ui/react'
import { ClassesHeaderActions } from './classes-header-actions'
import { ClassesList } from './classes-list'

export const ClassesWrapper = () => {
  return (
    <VStack spacing={6} align="stretch">
      <ClassesHeaderActions />
      <ClassesList />
    </VStack>
  )
}
