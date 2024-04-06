import React from 'react'
import {
  Box,
  Heading,
  Text,
  Button,
  Image,
  Center,
  Flex,
} from '@chakra-ui/react'
import { MainContainer } from '../../layouts'

export const Hero = () => {
  return (
    <MainContainer>
      <Flex
        flexDir={['column', 'column', 'row']}
        alignItems={['flex-start', 'center']}
        pt="5%"
        // pb="5%"
        rowGap="2.5rem"
        justifyContent="space-between"
      >
        <Box width={['100%', '100%', '60%']}>
          <Center
            p={['8px 7px', '12px 11px']}
            display="inline-flex"
            bg="#FDE85C"
            rounded="10px"
            mb="16px"
          >
            <Text fontSize={['12px', '15px']} fontWeight="700" color="#282828">
              PERXELS PORTFOLIO COMPETITION
            </Text>
          </Center>
          <Heading
            width={['100%', '100%']}
            fontSize={['3.5rem', '80px']}
            lineHeight="100%"
            fontWeight="800"
            mb={['16px', '40px']}
          >
            Perxels Portfolio
            <br />
            Competition
          </Heading>
          <Box borderLeft="5px solid #FEDA00" pl="24px" mb={['24px', '40px']}>
            <Text
              fontSize={['16px', '20px']}
              lineHeight="150%"
              color="#1A1A1A"
              width={['80%', '70%']}
            >
              Perxels is organizing its annual Portfolio Review, and this year,
              in celebration of Portfolio Day, we are excited to announce a
              portfolio competition with a cash prize!
            </Text>
          </Box>
          <Button as={'a'} href={`/competition#register`} fontSize="15px">
            Register
          </Button>
        </Box>
        <Box width={['100%', '70%', '40%']}>
          <Image
            src={'/assets/images/designher/portfolioHero.png'}
            alt="DesignHER"
          />
        </Box>
      </Flex>
    </MainContainer>
  )
}
