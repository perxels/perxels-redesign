import { Box, HStack, Img, Text, useDisclosure } from '@chakra-ui/react'
import { Fragment, useState } from 'react'
import { MainContainer } from '../../layouts'
import { MarketDrawer } from './MarketDrawer'
import Link from 'next/link'

export const MarketNav = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [state, setState] = useState(0)
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
              fontSize={['16px', '22px']}
              fontWeight="700"
              lineHeight={['19.49px', '26.82px']}
              textAlign="left"
              cursor="pointer"
              as={Link}
              href="/market-place"
              fontFamily="Montserrat"
            >
              PERXELS STORE
            </Text>
            <Img
              cursor="pointer"
              src="/assets/icons/cart_icon.svg"
              alt="cart icon"
              onClick={onOpen}
              width="30px"
            />
          </HStack>
        </MainContainer>
      </Box>
      <MarketDrawer onClose={onClose} isOpen={isOpen} state={state} />
    </Fragment>
  )
}
