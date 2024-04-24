import { Box, HStack, Img, Text, useDisclosure } from '@chakra-ui/react'
import { Fragment } from 'react'
import { MainContainer } from '../../layouts'
import { MarketDrawer } from './MarketDrawer'

export const MarketNav = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <Fragment>
      <Box
        mt="30px"
        borderTop="0.4px solid #34296B"
        borderBottom="0.4px solid #34296B"
        w="100%"
      >
        <MainContainer>
          <HStack padding={'20px 0px'} justifyContent="space-between">
            <Text
              fontSize="22px"
              fontWeight="700"
              lineHeight="26.82px"
              textAlign="left"
              cursor="pointer"
              as="h1"
              fontFamily="Montserrat"
            >
              PERXELS STORE
            </Text>
            <Img
              cursor="pointer"
              src="/assets/icons/cart_icon.svg"
              alt="cart icon"
              onClick={onOpen}
            />
          </HStack>
        </MainContainer>
      </Box>
      <MarketDrawer onClose={onClose} isOpen={isOpen} />
    </Fragment>
  )
}
