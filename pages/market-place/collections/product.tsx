import React, { Fragment, useState } from 'react'
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

function MarketProduct() {
  const [quantity, setQuantity] = useState(1)
  return (
    <Fragment>
      <MarketNav />
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
              src="/assets/images/market-place/facecap.png"
            />
          </Stack>
          <VStack w={['100%', '100%', '50%', '40%']} alignItems="flex-start">
            <Text
              as="h2"
              fontFamily="Proxima Nova"
              fontWeight="700"
              fontSize={['24px', '40px']}
            >
              Perxels Face Cap
            </Text>
            <Text
              as="h2"
              fontFamily="Proxima Nova"
              fontWeight="600"
              fontSize={['18px', '28px']}
            >
              N5000
            </Text>
            <Text
              as="p"
              fontFamily="Proxima Nova"
              fontWeight="400"
              fontSize={['16px', '18px']}
              color="#414141"
              margin="30px 0px"
            >
              Introducing our range of stylish and comfortable face caps,
              perfect for any occasion! Made from high-quality materials, our
              face caps are designed to provide excellent sun protection and
              keep you cool and comfortable throughout the day.
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
                <Box
                  bg="white"
                  padding="2px"
                  border="1px solid red"
                  width="14px"
                  h="14px"
                  borderRadius="50%"
                  cursor="pointer"
                >
                  <Box w="full" h="full" bg="red" borderRadius="50%"></Box>
                </Box>
                <Box
                  bg="white"
                  padding="2px"
                  //   border="1px solid blue"
                  width="14px"
                  h="14px"
                  borderRadius="50%"
                  cursor="pointer"
                >
                  <Box w="full" h="full" bg="blue" borderRadius="50%"></Box>
                </Box>
                <Box
                  bg="white"
                  padding="2px"
                  //   border="1px solid yellow"
                  width="14px"
                  h="14px"
                  borderRadius="50%"
                  cursor="pointer"
                >
                  <Box w="full" h="full" bg="yellow" borderRadius="50%"></Box>
                </Box>
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
                <Badge
                  bg="#F2F2F2"
                  w="27px"
                  h="27px"
                  borderRadius="50%"
                  fontSize="12px"
                  fontWeight="400"
                  fontFamily="Proxima Nova"
                  pt="4px"
                  pl="7px"
                  color="#414141"
                  alignItems="center"
                  justifyContent="center"
                >
                  10
                </Badge>
                <Badge
                  bg="#F2F2F2"
                  w="27px"
                  h="27px"
                  borderRadius="50%"
                  fontSize="12px"
                  fontWeight="400"
                  fontFamily="Proxima Nova"
                  pt="4px"
                  pl="7px"
                  color="#414141"
                  alignItems="center"
                  justifyContent="center"
                >
                  20
                </Badge>
                <Badge
                  bg="#F2F2F2"
                  w="27px"
                  h="27px"
                  borderRadius="50%"
                  fontSize="12px"
                  fontWeight="400"
                  fontFamily="Proxima Nova"
                  pt="4px"
                  pl="7px"
                  color="#414141"
                  alignItems="center"
                  justifyContent="center"
                >
                  30
                </Badge>
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
                <HStack cursor="pointer">
                  <RiArrowLeftSFill
                    size="25px"
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
                    onClick={() => setQuantity((q) => q + 1)}
                  />
                </HStack>
              </HStack>
            </HStack>

            <Button mt="30px" w="full" size="md" rounded="8px">
              Add to cart
            </Button>
          </VStack>
        </HStack>
      </MainContainer>
    </Fragment>
  )
}

export default MarketProduct
