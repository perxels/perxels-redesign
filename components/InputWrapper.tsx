import { Box, Text } from '@chakra-ui/react'
import React from 'react'

interface InputWrapperProps extends React.PropsWithChildren {
  label: string
  labelColor?: string
}

export const InputWrapper = ({
  label,
  labelColor,
  children,
}: InputWrapperProps) => {
  return (
    <Box w="full">
      <Text
        as="label"
        fontSize="lg"
        fontWeight={labelColor ? '500' : '700'}
        color={labelColor ? labelColor : 'brand.gray.600'}
        textTransform="uppercase"
        pb="0.75rem"
      >
        {label}
      </Text>
      {children}
    </Box>
  )
}
