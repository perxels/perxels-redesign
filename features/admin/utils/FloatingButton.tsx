import { Button } from '@chakra-ui/react'
import React from 'react'

const FloatingButton = ({ title, icon, onClick, ...props }: any) => {
  return (
    <Button
      maxWidth="200px"
      onClick={onClick}
      rounded="15px"
      px="20px"
      height="50px"
      bg="brand.purple.500"
      color="white"
      position="fixed"
      bottom="20px"
      right="20px"
      leftIcon={icon}
      {...props}
    >
      {title}
    </Button>
  )
}

export default FloatingButton
