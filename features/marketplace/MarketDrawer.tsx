import {
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
  } from '@chakra-ui/react'
  import React from 'react'
  
  interface MarketDrawerProps {
    isOpen: boolean; // Required and must be a boolean
    onClose: () => void; // Required and must be a function that takes no arguments and returns void
  }
  
  export const MarketDrawer: React.FC<MarketDrawerProps> = ({ isOpen, onClose }) => {
    return (
      <Drawer onClose={onClose} isOpen={isOpen} size="md">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{`md drawer contents`}</DrawerHeader>
          <DrawerBody>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Consequat nisl vel pretium lectus quam id. Semper quis lectus nulla
              at volutpat diam ut venenatis. Dolor morbi non arcu risus quis
              varius quam quisque. Massa ultricies mi quis hendrerit dolor magna
              eget est lorem. Erat imperdiet sed euismod nisi porta. Lectus
              vestibulum mattis ullamcorper velit.
            </p>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    )
  }
  