import { Box, Container } from '@chakra-ui/react'
import React from 'react'

interface MainContainerProps extends React.PropsWithChildren {
    bg?: string | string[],
    h?: string,
}

export const MainContainer = ({ children, bg, h }: MainContainerProps) => {
  return (
    <Box bg={bg || "brand.white"} h={h || "auto"}>
      <Container maxW="container.xl">{children}</Container>
    </Box>
  )
}