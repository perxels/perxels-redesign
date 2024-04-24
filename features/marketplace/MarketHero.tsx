import { Box, Text, VStack } from '@chakra-ui/react'

export const MarketHero = () => {
  return (
    <VStack alignItems="center">
      <Text
        fontWeight="600"
        fontSize="60px"
        lineHeight="70px"
        textAlign="center"
        mt="30px"
        as={'h1'}
        maxW="800px"
        fontFamily="Proxima Nova"
      >
        <Text as="span" display={'block'}>
          Perxels Store
        </Text>{' '}
        Where Fans Become Heroes
      </Text>
    </VStack>
  )
}

// import {
//   Box,
//   Button,
//   Heading,
//   Icon,
//   Img,
//   SimpleGrid,
//   Text,
//   VStack,
// } from '@chakra-ui/react'
// import React from 'react'
// import { AiOutlineRightCircle } from 'react-icons/ai'

// export const MarketHero = () => {
//   return (
//     <Box
//       h={['45vh', '45vh', '45vh', 'calc(100vh - 300px)']}
//       backgroundColor="brand.yellow.300"
//       backgroundImage={"url('/assets/images/market-place/marketplaceBg.png')"}
//       w="full"
//       backgroundRepeat="no-repeat"
//       backgroundSize="cover"
//       rounded="20px"
//       overflow="hidden"
//       pos="relative"
//       my="2rem"
//       px={['0', '0', '0', '5rem']}
//     >
//       <Img
//         src="/assets/images/market-place/marketplaceButtonPattern.png"
//         w="100%"
//         h="auto"
//         pos="absolute"
//         bottom="0"
//         left="0"
//       />

//       <SimpleGrid
//         pos={['relative', 'relative', 'relative', 'static']}
//         columns={[1, 1, 1, 2]}
//         w="full"
//         h="full"
//         gap="3rem"
//       >
//         <VStack
//           pos={['absolute', 'absolute', 'absolute', 'static']}
//           top="0"
//           left="0"
//           w="full"
//           h="full"
//           alignItems={['center', 'center', 'center', 'flex-start']}
//           justifyContent="center"
//           bg={[
//             'rgba(0, 0, 0, 0.46)',
//             'rgba(0, 0, 0, 0.46)',
//             'rgba(0, 0, 0, 0.46)',
//             'none',
//           ]}
//           zIndex="8"
//         >
//           <Box>
//             <Box
//               as="span"
//               bg="brand.pink.700"
//               p="0.5rem"
//               rounded="0.4rem"
//               color="brand.white"
//               fontSize="0.65rem"
//               fontWeight="bold"
//               textTransform="uppercase"
//             >
//               New Arrivals
//             </Box>
//           </Box>

//           <Heading
//             fontSize={['6xl', '6xl', '6xl', '8xl']}
//             color={[
//               'brand.white',
//               'brand.white',
//               'brand.white',
//               'brand.dark.200',
//             ]}
//             maxW="462px"
//             lineHeight="1"
//             textAlign={['center', 'center', 'center', 'left']}
//             pt={['0.75rem', '0.75rem', '0.75rem', '0']}
//           >
//             Perxels exclusive Merch.
//           </Heading>

//           <Text
//             textAlign={['center', 'center', 'center', 'left']}
//             pb="1.25rem"
//             fontSize="2xl"
//             color={[
//               'brand.white',
//               'brand.white',
//               'brand.white',
//               'brand.dark.400',
//             ]}
//           >
//             Shop our Hoodies, Bags Shoes, Socks...
//           </Text>

//           <Button h="3.375rem" rightIcon={<Icon as={AiOutlineRightCircle} />}>
//             Shop Now
//           </Button>
//         </VStack>
//         <Box w="full" pos="relative" zIndex="3">
//           <Img
//             src="/assets/images/market-place/hero-hoodie.png"
//             w="full"
//             h="auto"
//             maxW="477px"
//             pos={['absolute', 'absolute', 'absolute', 'static']}
//             bottom="0"
//           />

//           <Img
//             src="/assets/images/market-place/shapeRight.svg"
//             w="2.875rem"
//             h="auto"
//             pos="absolute"
//             right="7.3rem"
//             top="10.5rem"
//             display={['none', 'none', 'none', 'block']}
//           />

//           <Img
//             src="/assets/images/market-place/shapeLeft.svg"
//             w="2.875rem"
//             h="auto"
//             pos="absolute"
//             left="2.3rem"
//             top="10.5rem"
//             display={['none', 'none', 'none', 'block']}
//           />
//         </Box>
//       </SimpleGrid>
//     </Box>
//   )
// }
