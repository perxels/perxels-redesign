import React, { Fragment, useEffect, useState } from 'react'
import { MarketNav } from '../../../features/marketplace/MarketNav'
import { MainContainer } from '../../../layouts'
import {
  Badge,
  Box,
  Button,
  HStack,
  Img,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react'
import { RiArrowLeftSFill, RiArrowRightSFill } from 'react-icons/ri'
import { useRouter } from 'next/router'
import {
  MarketPlaceProductsProps,
  marketPlaceProducts,
} from '../../../constant'

function MarketProduct() {
  const router = useRouter()
  const { productId } = router.query
  const [quantity, setQuantity] = useState(1)
  const [activeSize, setActiveSize] = useState(0)
  const [activeColor, setActiveColor] = useState('')
  const [singleProduct, setSingleProduct] =
    useState<MarketPlaceProductsProps | null>(null)
  const [activeProductData, setActiveProductData] = useState({})
  let productHold: any = {}

  function findObjectById(
    array: MarketPlaceProductsProps[],
    id: number,
  ): MarketPlaceProductsProps | null {
    for (let obj of array) {
      if (obj.id === id) {
        return obj
      }
    }
    return null // Return null if ID doesn't belong to any object
  }

  useEffect(() => {
    if (typeof productId === 'string') {
      const id = parseInt(productId) // Convert string to number
      if (!isNaN(id)) {
        const product = findObjectById(marketPlaceProducts, id)
        if (product) {
          // Handle the found product
          setActiveColor(product.colors[0])
          setActiveSize(product.size[0])
          setSingleProduct(product)
        } else {
          alert(`Product with ID ${id} not found`)
        }
      } else {
        alert(`Invalid product ID: ${productId}`)
      }
    }
  }, [productId])

  useEffect(() => {
    productHold = {
      id: singleProduct?.id,
      title: singleProduct?.title,
      price: singleProduct?.price,
      price_th: singleProduct?.price_th,
      imgUrl: singleProduct?.imgUrl,
      quantity,
      size: activeSize,
      color: activeColor,
    }
  }, [quantity, activeSize, activeColor])

  return (
    <Fragment>
      <MarketNav productData={activeProductData} />
      <MainContainer>
        <HStack
          gap={5}
          justifyContent="space-between"
          flexDirection={['column', 'column', 'row', 'row']}
          margin={'50px 0px'}
          w="full"
        >
          <Stack
            justifyContent="center"
            alignItems="center"
            width={['100%', '100%', '50%', '50%']}
            h={['435px', '500px', '600px', '600px']}
            bg="#F5F6F7"
          >
            <Img
              width="80%"
              objectPosition="center"
              objectFit="contain"
              src={singleProduct?.imgUrl}
            />
          </Stack>
          <VStack w={['100%', '100%', '50%', '40%']} alignItems="flex-start">
            <Text
              as="h2"
              fontFamily="Proxima Nova"
              fontWeight="700"
              fontSize={['24px', '40px']}
            >
              {singleProduct?.title}
            </Text>
            <Text
              as="h2"
              fontFamily="Proxima Nova"
              fontWeight="600"
              fontSize={['18px', '28px']}
            >
              N{singleProduct?.price}
            </Text>
            <Text
              as="p"
              fontFamily="Proxima Nova"
              fontWeight="400"
              fontSize={['16px', '18px']}
              color="#414141"
              margin="30px 0px"
            >
              {singleProduct?.desc}
            </Text>
            <HStack marginBottom={['10px', '0px']}>
              <Text
                as="span"
                color="#818181"
                fontSize={['14px', '18px']}
                fontWeight="400"
              >
                Colors:
              </Text>
              <HStack>
                {singleProduct?.colors.map((color, i) => {
                  return (
                    <Box
                      bg="white"
                      padding="2px"
                      border={`1px solid ${
                        activeColor === color ? activeColor : 'white'
                      }`}
                      width="14px"
                      h="14px"
                      borderRadius="50%"
                      cursor="pointer"
                      key={i}
                      onClick={() => setActiveColor(color)}
                    >
                      <Box
                        w="full"
                        h="full"
                        bg={color}
                        borderRadius="50%"
                      ></Box>
                    </Box>
                  )
                })}
              </HStack>
            </HStack>
            <HStack
              flexDirection={['column', 'row']}
              alignItems={['flex-start', 'center']}
              gap={5}
            >
              <HStack gap={4}>
                <Text
                  as="span"
                  color="#818181"
                  fontSize={['14px', '18px']}
                  fontWeight="400"
                >
                  Sizes:
                </Text>
                {singleProduct?.size.map((size, i) => {
                  return (
                    <Badge
                      bg={size === activeSize ? '#34296B' : '#F2F2F2'}
                      w="27px"
                      h="27px"
                      borderRadius="50%"
                      fontSize="12px"
                      fontWeight="400"
                      fontFamily="Proxima Nova"
                      pt="4px"
                      pl="7px"
                      color={size === activeSize ? 'white' : '#414141'}
                      alignItems="center"
                      cursor="pointer"
                      justifyContent="center"
                      key={i}
                      onClick={() => setActiveSize(size)}
                    >
                      {size}
                    </Badge>
                  )
                })}
              </HStack>
              <HStack>
                <Text
                  as="span"
                  color="#818181"
                  fontSize={['14px', '18px']}
                  fontWeight="400"
                >
                  Quantity:
                </Text>
                <HStack>
                  <RiArrowLeftSFill
                    size="25px"
                    cursor="pointer"
                    onClick={() => {
                      if (quantity === 1) {
                        return
                      } else {
                        setQuantity((q) => q - 1)
                      }
                    }}
                  />
                  <Text as="span">{quantity}</Text>
                  <RiArrowRightSFill
                    size="25px"
                    cursor="pointer"
                    onClick={() => setQuantity((q) => q + 1)}
                  />
                </HStack>
              </HStack>
            </HStack>

            <Button
              onClick={() => {
                setActiveProductData(productHold)
              }}
              mt="30px"
              w="full"
              size="md"
              rounded="8px"
            >
              Add to cart
            </Button>
          </VStack>
        </HStack>
      </MainContainer>
    </Fragment>
  )
}

export default MarketProduct
