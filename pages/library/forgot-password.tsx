import React from 'react'
import { Box } from '@chakra-ui/react'
import { LoginWrapper } from '../../features/library/login/LoginWrapper'
import { LibraryForgotPasswordWrapper } from '../../features/library/forgot-password/LibraryForgotPasswordWrapper'

const LibraryForgotPassword = () => {
  return (
    <Box w="100%" h="100vh">
      <LibraryForgotPasswordWrapper />
    </Box>
  )
}

export default LibraryForgotPassword