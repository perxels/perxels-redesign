import { Box, Link, SimpleGrid } from '@chakra-ui/react'
import React from 'react'
import { Logo } from '../../components'
import EnrolForm from './EnrolForm'
import SideImage from './SideImage'

export const EnrolWrapper = () => {
  return (
    <SimpleGrid columns={[1, 1, 1, 2]} h="100vh">
      <Box as={Link} href="/" px="1rem" py="1rem" display={['block', 'block', 'block', 'none']}>
        <Logo />
      </Box>
      <SideImage />
      <EnrolForm />
    </SimpleGrid>
  )
}
