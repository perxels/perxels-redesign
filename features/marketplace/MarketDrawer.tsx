import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Img,
  Text,
} from '@chakra-ui/react'
import React from 'react'

interface MarketDrawerProps {
  isOpen: boolean // Required and must be a boolean
  onClose: () => void // Required and must be a function that takes no arguments and returns void
  state: number
}

export const MarketDrawer: React.FC<MarketDrawerProps> = ({
  isOpen,
  onClose,
  state,
}) => {
  return (
    <Drawer onClose={onClose} isOpen={isOpen} size="md">
      <DrawerOverlay />
      {state === 0 && (
        <DrawerContent>
          <DrawerHeader borderBottom="0.4px solid #CFCFCF">
            <HStack p="0px 20px" mt="40px" justifyContent="space-between">
              <Img
                cursor="pointer"
                src="/assets/icons/cart_icon.svg"
                alt="cart icon"
                width="30px"
              />
              <DrawerCloseButton
                top="50px"
                right="20px"
                fontSize="18px"
                variant="ghost"
              />
            </HStack>
          </DrawerHeader>
          <DrawerBody>
            <Text
              as="p"
              fontSize="18px"
              fontWeight="400"
              fontFamily="Proxima Nova"
              mt="60px"
              textAlign="center"
              color="#414141"
            >
              You have no item in your bag.
            </Text>
          </DrawerBody>
          <DrawerFooter padding="40px 20px" borderTop="0.4px solid #CFCFCF">
            <Button
              w="full"
              bg="#FAFAFA"
              rounded="sm"
              border="1px solid #EFEFEF"
              color="#414141"
              fontFamily="Proxima Nova"
              fontWeight="600"
              fontSize="18px"
              onClick={onClose}
            >
              Continue Shopping
            </Button>
          </DrawerFooter>
        </DrawerContent>
      )}
    </Drawer>
  )
}
