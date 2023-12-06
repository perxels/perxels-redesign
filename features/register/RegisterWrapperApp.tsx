import { Box, SimpleGrid } from '@chakra-ui/react'
import React from 'react'
import { Logo } from '../../components'
import RegisterForm from './RegisterForm'
import SideImage from './SideImage'

export const RegisterWrapperApp = () => {
  return (
    <SimpleGrid columns={[1, 1, 1, 2]} h="100vh">
      <Box px="1rem" py="1rem" display={['block', 'block', 'block', 'none']}>
        <Logo />
      </Box>
      <SideImage />
      <RegisterForm isApply  />
    </SimpleGrid>
  )
}
