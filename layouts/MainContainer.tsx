import { Box, Container } from '@chakra-ui/react'
import React from 'react'

interface MainContainerProps extends React.PropsWithChildren {
    bg?: string | string[],
    h?: string,
    noMobilePadding?: boolean
}

export const MainContainer = ({ children, bg, h, noMobilePadding }: MainContainerProps) => {
  return (
    <Box bg={bg || "brand.white"} h={h || "auto"}>
      <Container px={noMobilePadding ? ["0", "0", "0", "1rem"] : "1rem"} maxW={noMobilePadding ? ["100%", "100%", "100%", "container.xl"] : "container.xl"}>{children}</Container>
    </Box>
  )
}