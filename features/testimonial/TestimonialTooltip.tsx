import React, { useState } from 'react'
import {
  Box,
  Center,
  HStack,
  Image,
  Text,
  useMediaQuery,
  SlideFade,
  keyframes
} from '@chakra-ui/react'
import { AiOutlineArrowRight } from 'react-icons/ai'

const pulsate = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
`

const TestimonialTooltip = () => {
  const [active, setActive] = useState<boolean>(false)
  const pulseAnimation = `${pulsate} 1s ease-in-out infinite`
  const showTooltip = () => {
    setActive(true)
  }

  const hideTooltip = () => {
    setActive(false)
  }

  return (
    <Box
      // onMouseEnter={showTooltip}
      // onMouseLeave={hideTooltip}
      // display={['flex', 'flex', 'flex']}
      // flexDirection="column"
      // alignItems="center"
      
    >
      {/* {active && (
        <SlideFade in={active} offsetY="20px" 
        
        >
        <Box
          h="7.421875rem"
          w="14.125rem"
          borderRadius={'0.299375rem'}
          bg="#FFFFFF"
          px="0.625rem"
          py="0.875rem"
          position="absolute"
          top="-8rem"
          left="-6rem"
          transition={'all 0.3s ease-in-out'}
          boxShadow="0px 1.62712px 46.3729px rgba(0, 0, 0, 0.13)"
        >
          <Box pb="0.71875rem">
            <Center>
              <Text fontSize={'1.125rem'}
              color="#121212"
                fontWeight="700"
              >NIGERIA 🇳🇬</Text>
            </Center>
          </Box>

          <Box 
            width={'100%'}
            height={'0.0625rem'}
            bg={'#E5E5E5'}
            mb="0.5rem"
          />

          <Box>
            <HStack>
              <Box boxSize="2.4375rem">
                <Image
                  src="/assets/images/tooltip/tooltip1.png"
                  alt="testimonial image"
                />
              </Box>
              <Box boxSize="2.4375rem">
                <Image
                  src="/assets/images/tooltip/tooltip2.png"
                  alt="testimonial image"
                />
              </Box>
              <Box boxSize="2.4375rem">
                <Image
                  src="/assets/images/tooltip/tooltip3.png"
                  alt="testimonial image"
                />
              </Box>
              <Box boxSize="2.4375rem">
                <Image
                  src="/assets/images/tooltip/tooltip4.png"
                  alt="testimonial image"
                />
              </Box>
              <Box>
                <Text fontSize={"0.634375em"} color="#969696">+100</Text>
              </Box>
            </HStack>
            <Box
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            pt={'0.5rem'}
            >
              <Text fontSize={'0.625em'}
              fontWeight={'700'}
                color="#121212"
              >Read their stories</Text>
              <Text
              fontSize={'1rem'}
              >
                <AiOutlineArrowRight />
              </Text>
            </Box>
          </Box>
        </Box>
        </SlideFade>
      )} */}

      <Box boxSize={[ "1rem","1.875rem","1.875rem"]}
      animation={pulseAnimation}
      >
        <Image
          src="/assets/icons/locationPoint.svg"
          alt="testimonial image"
        
        />
      </Box>
    </Box>
  )
}

export default TestimonialTooltip
