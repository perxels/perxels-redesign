import { SimpleGrid } from '@chakra-ui/react'
import React from 'react'
import RegisterForm from './RegisterForm'
import SideImage from './SideImage'

export const RegisterWrapper = () => {
  return (
    <SimpleGrid columns={2} h="100vh">
      <SideImage />
      <RegisterForm />
    </SimpleGrid>
  )
}
