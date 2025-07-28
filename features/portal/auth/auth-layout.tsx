import { Box, Container, HStack, Icon } from '@chakra-ui/react'
import React from 'react'
import { IoIosArrowBack, IoIosClose } from 'react-icons/io'
import { Logo } from '../../../components'

export const PortalAuthLayout = ({ children, onBack, onClose }: { children: React.ReactNode, onBack: VoidFunction, onClose: VoidFunction }) => {
  return (
    <Box w="100vw" h="100vh">
        <Container maxW="container.xl" py={16}>
            <HStack alignItems="center" justifyContent="space-between">
                <Icon as={IoIosArrowBack} fontSize="5xl" color="brand.dark.100" cursor="pointer" onClick={onBack} />

                <Logo />

                <Icon as={IoIosClose} fontSize="6xl" color="brand.dark.100" cursor="pointer" onClick={onClose} />
            </HStack>

            <Box mt={16} w="100%">
                {children}
            </Box>
        </Container>
    </Box>
  )
}
