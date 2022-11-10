import { Box, Container } from '@chakra-ui/react'
import React from 'react'

interface MainContainerProps extends React.PropsWithChildren {
    bg?: string
}

export const MainContainer = ({ children, bg }: MainContainerProps) => {
  return (
    <Box bg={bg || "brand.white"}>
      <Container maxW="container.xl">{children}</Container>
    </Box>
  )
}