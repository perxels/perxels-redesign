import { Box, Flex, Img, Link } from '@chakra-ui/react'
import React, { useEffect, useRef } from 'react'
import { Logo } from '../../components'

const SideImage = () => {
  return (
    <Flex
      background='url("/assets/images/onboarding/paymentImage.png") center/cover no-repeat'
      w="full"
      h="full"
      alignItems="flex-end"
      position="relative"
      display={['none', 'none', 'none', 'flex']}
    >
      
      {/* <Img
        src="/assets/images/onboarding/onboardform.png"
        alt="Register Hero"
        w="100%"
        maxW="500px"
        mx="auto"
        h="full"
        className="enrol-hero"
      /> */}
    </Flex>
  )
}

export default SideImage
