import { Box, Text } from '@chakra-ui/react'
import React from 'react'

interface InputWrapperProps extends React.PropsWithChildren {
  label: string
}

export const InputWrapper = ({ label, children }: InputWrapperProps) => {
  return (
    <Box w="full">
      <Text
        as="label"
        fontSize="lg"
        fontWeight="700"
        color="brand.gray.600"
        textTransform="uppercase"
        pb="0.75rem"
      >
        {label}
      </Text>
      {children}
    </Box>
  )
}
