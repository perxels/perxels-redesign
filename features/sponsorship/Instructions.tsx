import { Box, GridItem, Heading, Img, SimpleGrid, Text } from '@chakra-ui/react'
import React from 'react'
import { SectionHeader } from '../../components'
import { instructions } from '../../constant'
import { MainContainer } from '../../layouts'

export const Instructions = () => {
  return (
    <Box
      bg="brand.purple.500"
      backgroundImage={"url('/assets/images/hire/bgPatternPurple.png')"}
      backgroundRepeat="repeat"
      backgroundSize={'cover'}
    >
      <MainContainer bg="none">
          <Box py={["3rem", "3rem", "3rem", "4.875rem"]}>
              <SectionHeader
                  title="Read the following information before applying."
                  subTitle="Instructions"
                  isWhite
                  maxW="936px"
              />

              <SimpleGrid alignItems="center" columns={[1, 1, 1, 2]} gap="4rem">
                <GridItem>
                  <Img 
                    src="./assets/images/sponsorship/instruction.png"
                    alt="Instructions"
                    w="full"
                    h="auto"
                  />
                </GridItem>

                <GridItem>
                  <SimpleGrid columns={2} gap="2rem">
                    {
                      instructions.map(({ id, title, description, image }) => (
                        <GridItem key={id}>
                          <Img 
                            src={image}
                            alt={title}
                            w={["3.5rem", "3.5rem", "3.5rem", "4.688rem"]}
                            h={["3.5rem", "3.5rem", "3.5rem", "4.688rem"]}
                          />

                          <Heading color="brand.white" fontSize={["lg", "lg", "lg", "xl"]} mt="2rem">{title}</Heading>
                          <Text maxW="230px" color="brand.white" fontSize={["sm", "sm", "sm", "lg"]} mt="0.75rem">{description}</Text>
                        </GridItem>
                      ))
                    }
                  </SimpleGrid>
                </GridItem>
              </SimpleGrid>
          </Box>
      </MainContainer>
    </Box>
  )
}