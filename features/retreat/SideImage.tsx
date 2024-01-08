import { Box, Flex, Img, Link, Heading, Center } from '@chakra-ui/react'
import React, { useEffect, useRef } from 'react'
import { Logo } from '../../components'

const SideImage = () => {
  return (
    <Flex
      w={["100%","90%"]}
      h="full"
      pl="15%"
      py="10%"
      alignItems="flex-start"
      position="relative"
      display={['flex']}
    >
      {/* <Box as={Link} href="/" pos="absolute" top="3.125rem" left="6.25rem">
        <Logo color="#fff" />
      </Box>
       */}
       <Box display="flex" flexDir="column" rowGap={["2.125rem","3.4375rem"]}>
        <Heading w={["100%","70%"]} color="#000" as="h1" fontSize={["1.375rem","3.4375rem"]} fontWeight="700" lineHeight="normal" >
          Steps to join this retreat
        </Heading>
    <Flex alignItems="center" >
      <Center
      height={["50px","83px"]}
      width={["50px","83px"]}
      borderRadius="50%"
      backgroundColor="#DEDAF1"
      color="#000"
      >
        <Heading as="h1" fontSize={["1.125rem","1.875rem" ]} fontWeight="700" lineHeight="normal" >
        1
        </Heading>
      </Center>
      <Box ml="1.25rem">
        <Heading  fontSize={["1.125rem","1.875rem" ]} fontWeight="400" lineHeight="normal" >
        Fill the form
        </Heading>
       </Box>
    </Flex>

    <Flex alignItems="center">
      <Center
       height={["50px","83px"]}
       width={["50px","83px"]}
      borderRadius="50%"
      backgroundColor="#DEDAF1"
      color="#000"
      fontSize="1.875rem"
      >
        <Heading as="h1"  fontSize={["1.125rem","1.875rem" ]} fontWeight="700" lineHeight="normal" >
        2
        </Heading>
      </Center>
      <Box ml="1.25rem">
        <Heading fontSize={["20px","1.875rem"]} fontWeight="400" lineHeight="normal" >
        Join the WhatsApp group
        </Heading>
       </Box>
    </Flex>

    <Flex alignItems="center">
      <Center
      height={["50px","83px"]}
      width={["50px","83px"]}
      borderRadius="50%"
      backgroundColor="#DEDAF1"
      color="#000"
   
      >
        <Heading as="h1"  fontSize={["1.125rem","1.875rem" ]} fontWeight="700" lineHeight="normal" >
        3
        </Heading>
      </Center>
      <Box ml="1.25rem">
        <Heading  fontSize={["1.125rem","1.875rem" ]} fontWeight="400" lineHeight="normal" >
        Pay
        </Heading>
       </Box>
      </Flex>


    </Box>
    </Flex>
  )
}

export default SideImage
