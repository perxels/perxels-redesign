import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Img,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { Logo } from '../../components'
import { Fragment, PropsWithChildren } from 'react'
import { MainContainer } from '../../layouts'

export const MarketNav = () => {
 
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
      <Drawer onClose={onClose} isOpen={isOpen} size="md">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{`md drawer contents`}</DrawerHeader>
          <DrawerBody>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Consequat nisl vel pretium lectus quam id. Semper quis lectus
              nulla at volutpat diam ut venenatis. Dolor morbi non arcu risus
              quis varius quam quisque. Massa ultricies mi quis hendrerit dolor
              magna eget est lorem. Erat imperdiet sed euismod nisi porta.
              Lectus vestibulum mattis ullamcorper velit.
            </p>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Fragment>
  )
}
