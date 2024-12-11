import {
  Box,
  Grid,
  GridItem,
  Heading,
  Icon,
  Img,
  SimpleGrid,
  Text,
} from '@chakra-ui/react'
import React from 'react'
import { BsCheckCircle } from 'react-icons/bs'
import { SectionHeader } from '../../components'
// import { instructions } from '../../constant'
import { MainContainer } from '../../layouts'
import {InstructionBox} from './InstructionBox'
import { ApplicationCriteria } from '../../utils/types'
export const Instructions = ({heroData}:any) => {
  return (
    <Box
      bg="brand.purple.500"
      backgroundImage={"url('/assets/images/hire/bgPatternPurple.png')"}
      backgroundRepeat="repeat"
      backgroundSize={'cover'}
      id='instructions'
      mb="3rem"
    >
      <MainContainer bg="none">
        <Box py={['3rem', '3rem', '3rem', '4.875rem']}>
          <SectionHeader
            title="Read the following information before applying."
            subTitle="Criterias"
            isWhite
            maxW="936px"
            headingSize={['1.75rem', '1.75rem', '1.75rem', '7xl']}
          />

          <SimpleGrid
            mt={['5rem', '3rem', '3rem', '10rem']}
            mb="4rem"
            alignItems="center"
            columns={[1, 1, 1, 2]}
            gap={['0.5rem', '0.5rem', '0.5rem', '4rem']}
          >
            <GridItem pos={['static', 'static', 'static', 'relative']}>
              <Img
                src="./assets/images/sponsorship/instruction.png"
                alt="Instructions"
                w="950px"
                maxW="950px"
                h="auto"
                display={['none', 'none', 'none', 'block']}
                pos={['static', 'static', 'static', 'absolute']}
                left={['auto', 'auto', 'auto', '-20rem']}
                top="50%"
                transform="translateY(-45%)"
              />
              <Img
                src="./assets/images/sponsorship/instruction-mobile.png"
                alt="Instructions"
                display={['block', 'block', 'block', 'none']}
                w="full"
                h="auto"
              />
            </GridItem>

            <GridItem>
              <SimpleGrid columns={[1, 1, 1, 2]} gap="3rem">
                {heroData?.applicationCriteria?.map(({title, paragraph,}:ApplicationCriteria,i:number) => (
                  <GridItem w="full" key={i}>
                    <Grid gap="1rem" templateColumns="1.5rem 1fr">
                      <Icon
                        as={BsCheckCircle}
                        color="brand.white"
                        fontSize="1.5rem"
                      />

                      <Box>
                        <Heading
                          color="brand.white"
                          fontSize={['2xl', '2xl', '2xl', 'xl']}
                        >
                          {title}
                        </Heading>
                        <Text
                          maxW={['full', 'full', 'full', '230px']}
                          color="brand.white"
                          fontSize={['lg']}
                          mt="1rem"
                        >
                          {paragraph}
                        </Text>
                      </Box>
                    </Grid>

                  </GridItem>
                ))}
              </SimpleGrid>
              <Box px={["10%","0"]}>
              <InstructionBox heroData={heroData}/>
              </Box>
            </GridItem>

          </SimpleGrid>
        </Box>
      </MainContainer>
    </Box>
  )
}
