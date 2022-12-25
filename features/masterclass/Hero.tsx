import React from 'react'
import { MainContainer } from '../../layouts'
import { Box, Center, Heading, Icon, Image, Text } from '@chakra-ui/react'

export const Hero = () => {
  return (
    <Box position={'relative'} paddingBottom="3rem">
      <MainContainer>
        <Box position={'relative'}>
          <Box
            display={['flex', 'flex', 'flex', 'flex']}
            alignItems="center"
            justifyContent="center"
            flexDirection={'column'}
          >
            <Heading
              fontSize={['3xl', '2.5rem', '9xl']}
              textAlign="center"
              lineHeight={['1.5', '1.25', '1.25']}
              maxWidth={['100%', '100%', '55.25rem']}
              display={['none', 'none', 'block', 'block']}
            >
              Welcome to <br /> Perxels Free UIUX Design <br /> Masterclass
            </Heading>
            <Heading
              fontSize={['2rem', '2.5rem', '9xl']}
              textAlign="center"
              lineHeight={['1.9rem', '1.25', '1.25']}
              maxWidth={['100%', '100%', '55.25rem']}
              display={['block', 'block', 'none', 'none']}
            >
              Welcome to <br /> Perxels Free UIUX <br /> Design Masterclass
            </Heading>
            <Text
              maxWidth={['100%', '100%', '100%', '34.75rem']}
              mt="1.25rem"
              fontSize={['sm', 'md', 'xl', 'xl']}
              textAlign="center"
            >
              You’ve searched online, watched many videos, read many articles
              and tried doing it yourself but you don’t just get it.Then this is
              the masterclass for you.
            </Text>

            <Box boxSize={['full', '36rem', '36.0625rem']} mt="4.0625rem">
              <Image
                src="/assets/images/masterclass/heroImageCenter.png"
                alt="Hero"
              />
            </Box>
          </Box>
          <Box display={['none', 'none', 'block', 'block']}>
            <Image
              src="/assets/images/masterclass/arrowLeft.svg"
              alt="Hero"
              pos="absolute"
              top={['0%', '15%', '25%']}
              left={['13%']}
            />
            <Image
              src="/assets/images/masterclass/arrowRight.svg"
              alt="Hero"
              pos="absolute"
              top={['0%', '15%', '30%']}
              right={['20%']}
            />

            <Image
              src="/assets/images/masterclass/heroImageLeftTop.png"
              pos="absolute"
              alt="Hero"
              top={['0%', '15%', '15%']}
            />
            <Image
              src="/assets/images/masterclass/heroImageLeftBottom.png"
              pos="absolute"
              alt="Hero"
              top={['0%', '50%', '50%']}
              left={['7%']}
            />
            <Image
              src="/assets/images/masterclass/heroImageRightTop.png"
              pos="absolute"
              alt="Hero"
              top={['0%', '20%', '20%']}
              right={['7%']}
            />
            <Image
              src="/assets/images/masterclass/heroImageRightBottom.png"
              pos="absolute"
              alt="Hero"
              top={['0%', '50%', '55%']}
              right={['6%']}
            />
            <Image
              src="/assets/images/masterclass/stripeLeft.svg"
              alt="Hero"
              pos="absolute"
              top={['0%', '50%', '60%']}
              left={['20%']}
            />
            <Image
              src="/assets/images/masterclass/stripeRight.svg"
              alt="Hero"
              pos="absolute"
              top={['0%', '50%', '65%']}
              right={['18%']}
            />
          </Box>
        </Box>
      </MainContainer>
    </Box>
  )
}
