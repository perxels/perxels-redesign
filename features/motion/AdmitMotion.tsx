import { Box, Center, Img, SimpleGrid, Text } from '@chakra-ui/react'
import React from 'react'
import { SectionHeader } from '../../components'
import { process } from '../../constant/teensContent'
import { MainContainer } from '../../layouts'

export const AdmitMotion = () => {
  return (
    <Box bg="brand.gray.900" pb={['3rem', '3rem', '3rem', '6.75rem']} pt={['60%', '60%', '60%', '40%']}>
      <MainContainer bg="brand.gray.900">
        <SectionHeader
          title="Get started in four easy steps"
          subTitle="Our Admission Process"
          headingColor={"brand.dark.200"}
        />
        <SimpleGrid columns={[1, 1, 2, 4]} spacing="1.875rem">
          {process.map(({ id, step, icon, desc }) => (
            <Center
                bg="#FFFF"
              rounded="5px"
              pt="3.5rem"
              pb="1.75rem"
              px="1.3rem"
              key={id}
              flexDir="column"
            >
              <Img src={icon} alt={step} w="3rem" h="3rem" mb="2.5rem" />

              <Center>
                <Box
                  bg={ 'brand.yellow.300'}
                  color="brand.dark.200"
                  fontSize="md"
                  px="0.875rem"
                  py="5px"
                  as="span"
                  rounded="64px"
                  fontWeight={600}
                  textTransform="capitalize"
                >
                  {step}
                </Box>
              </Center>

              <Text
                textAlign="center"
                color="brand.dark.200"
                fontSize="lg"
                mt="1.125rem"
              >
                {desc}
              </Text>
            </Center>
          ))}
        </SimpleGrid>
      </MainContainer>
    </Box>
  )
}
