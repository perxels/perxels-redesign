import { Box } from '@chakra-ui/react'
import React from 'react'

interface MainContainerProps extends React.PropsWithChildren {
    bg?: string,
    color?: string,
}

const BgHeader = ({ bg="brand.purple.500", color="brand.white", children }: MainContainerProps) => {
  return (
    <Box>
      <Box
        as="span"
        bg={bg}
        color={color}
        fontSize="2xl"
        fontWeight="bold"
        textTransform="uppercase"
        p="0.75rem"
        rounded="10px"
      >
        {children}
      </Box>
    </Box>
  )
}

export default BgHeader
