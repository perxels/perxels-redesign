import { Grid, GridItem, Heading, Img, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { MainContainer } from '../../layouts'

export const PartnersHero = () => {
  return (
    <MainContainer>
      <Grid templateColumns={['1fr', '1fr 526px']} gap={["2.5rem", "2.5rem", "2.5rem", "1rem"]} py={["4rem", "4rem", "4rem", "8rem"]}>
        <GridItem>
          <VStack h="full" alignItems="flex-start" justifyContent="center">
            <Heading
              w="full"
              color="brand.dark.200"
              maxW={["563px"]}
              fontSize={["6xl", "6xl", "6xl", "2xxl"]}
              pr={["2rem", "2rem", "2rem", "0"]}
            >
              Equipping African Youths with digital skills
            </Heading>
            <Text color="brand.dark.200" maxW="470px" fontSize={["md", "md", "md", "xl"]} mt="1.5rem">
              We are enabling the empowerment of young people in Africa with
              digital skills that would make them more valuable to themselves,
              their community, their nation and the African continent
            </Text>
          </VStack>
        </GridItem>
        <GridItem>
          <Img 
            src="/assets/images/partners/partnersHero.png"
            w="full"
            h="auto"
            alt="Partners Hero"
          />
        </GridItem>
      </Grid>
    </MainContainer>
  )
}
