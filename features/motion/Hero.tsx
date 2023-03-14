import React from 'react'
import { Heading, Text, Box, Flex, Button, Icon, Image, Link } from '@chakra-ui/react'
import { Logo } from '../../components'
import { Wave } from './Wave'
export const Hero = () => {
  return (
    <Box
    w="relative"
    >
    <Box
      w="full"
      position="relative"
      h="100vh"
      p="1.625rem 5%"
    >
      {/* videoBackground */}
      <Box
      position={'absolute'}
      top={'0'}
      left={'0'}
      right={'0'}
      bottom={'0'}
      width={'100%'}
      h={'100%'}
      zIndex={0}
      objectFit={'cover'}
      overflow={'hidden'}
      >
        <video 
        loop autoPlay muted
        style={{
          position: 'absolute',
          height: '100%',
          width: '100%',
          objectFit: 'cover',
          overflow: 'hidden',
        }} 
        >
          <source src="https://res.cloudinary.com/deudl0ryy/video/upload/v1678752865/0325d00d-33c8-4b48-9ed6-6fdb9fcb2369_vtwoyc.mov" type="video/mp4" />
        </video>
      </Box>

      {/* overlay on background */}
      <Box
        position="absolute"
        w="100%"
        h="100%"
        bg="rgba(0,0,0,0.5)"
        zIndex={1}
        top="0"
        left="0"
      />
       <Box zIndex={2} as={Link} href="/" pos="absolute" top="3.125rem" >
        <Logo color="#fff" />
      </Box>
      <Box position="absolute" zIndex={2} bottom="15%">
        <Heading
          color="brand.white"
          fontSize={["1.25rem","2.5rem"]}
          fontWeight="800"
          textTransform={'uppercase'}
          lineHeight={["1.5225rem","3.045rem"]}
          mb=".625rem"
        >
          Welcome To
        </Heading>
        <Heading
          fontSize={["3.75rem","6.25rem"]}
          fontWeight="800"
          lineHeight={["3.6862rem","98.3px"]}
          textTransform={'uppercase'}
          color="brand.yellow.300"
          maxW={["100%","70%"]}
        >
          Perxels Motion School!
        </Heading>
      </Box>
      <Box position="absolute" zIndex={2} bottom="10%" right="5%">
        <Text fontSize={"20px"} display={["none", "block"]} fontWeight="700" color="#BFBFBF">
          HAVAIANAS &quot;THIS IS HAVAIANAS&quot;;
        </Text>
        <Text display={["none", "block"]} fontSize="20px" fontWeight="700" color="#BFBFBF" textAlign="right">
          -Stash Media.
        </Text>
        {/* <Wave/> */}
      </Box>
    </Box>
    </Box>
  )
}
