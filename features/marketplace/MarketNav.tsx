import { Box, HStack, Img, Text, useDisclosure } from '@chakra-ui/react'
import { Fragment, useEffect, useState } from 'react'
import { MainContainer } from '../../layouts'
import { MarketDrawer } from './MarketDrawer'
import Link from 'next/link'

// Define the type for a product
export interface cartProductProps {
  id: number
  title: string
  price: string
  price_th: number
  quantity: number
  size: number
  color: string
  imgUrl: string
}

export const MarketNav = ({ productData }: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [state, setState] = useState(5)
  // Initialize cart state from localStorage, or an empty array if no cart data exists
  const [cart, setCart] = useState<cartProductProps[]>([])

  // Define a function to check if an object matches the interface
  function isMatchingObject(obj: any): obj is cartProductProps {
    return (
      typeof obj === 'object' &&
      'id' in obj &&
      typeof obj.id === 'number' &&
      'title' in obj &&
      typeof obj.title === 'string' &&
      'price' in obj &&
      typeof obj.price === 'string' &&
      'price_th' in obj &&
      typeof obj.price_th === 'number' &&
      'quantity' in obj &&
      typeof obj.quantity === 'number' &&
      'size' in obj &&
      typeof obj.size === 'number' &&
      'color' in obj &&
      typeof obj.color === 'string' &&
      'imgUrl' in obj &&
      typeof obj.imgUrl === 'string'
    )
  }

  useEffect(() => {
    const savedCart = localStorage.getItem('cart_items')
    setCart(savedCart ? JSON.parse(savedCart) : [])
  }, [])

  useEffect(() => {
    if (isMatchingObject(productData)) {
      addToCart(productData)
    }
    return
  }, [productData])

  // Function to add a product to the cart
  const addToCart = (product: cartProductProps) => {
    const existingProduct = cart.find((item) => item.id === product.id)

    if (existingProduct) {
      const updatedCart = cart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      )
      setCart(updatedCart)
      localStorage.setItem('cart_items', JSON.stringify(updatedCart))
      onOpen()
    } else {
      setCart([...cart, { ...product, quantity: product.quantity }])
      localStorage.setItem(
        'cart_items',
        JSON.stringify([...cart, { ...product, quantity: product.quantity }]),
      )
      onOpen()
    }
  }

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
      <MarketDrawer
        onClose={onClose}
        isOpen={isOpen}
        state={state}
        setState={setState}
        cart={cart}
        setCart={setCart}
      />
    </Fragment>
  )
}
