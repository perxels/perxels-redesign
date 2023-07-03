import { Box, SimpleGrid } from '@chakra-ui/react'
import React from 'react'
import { Logo } from '../../components'
import {OnboardForm }from './OnboardForm'
import SideImage from './SideImage'

export const RegisterWrapper = () => {
  return (
    <SimpleGrid columns={[1, 1, 1, 2]} h="100vh">
      <Box px="1rem" py="1rem" display={['block', 'block', 'block', 'none']}>
        <Logo />
      </Box>
      <OnboardForm />
      <SideImage />
    </SimpleGrid>
  )
}
