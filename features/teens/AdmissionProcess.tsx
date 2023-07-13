import { Box, Center, Img, SimpleGrid, Text, Heading, Icon, HStack } from '@chakra-ui/react'
import React from 'react'
import { SectionHeader } from '../../components'
import { process } from '../../constant/teensContent'
import { MainContainer } from '../../layouts'
import {IoCalendarOutline, IoLocationOutline} from 'react-icons/io5'
export const AdmissionProcess = () => {
  return (
    <Box py={['3rem', '3rem', '3rem', '6.75rem']}>
      <MainContainer>
        <SectionHeader
          title="Get started in four easy steps"
          subTitle="Our Admission Process"
        />

        <SimpleGrid columns={[1, 1, 2, 4]} spacing="1.875rem">
          {process.map(({ id, step, icon, desc }) => (
            <Center
              bg="brand.gray.900"
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
                  bg={
                    id === 1 || id === 3 ? 'brand.pink.700' : 'brand.purple.500'
                  }
                  color="brand.white"
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
        <Box px={["2%","10%"]} py="5%">
        <Box
        backgroundColor={"#FDE85C"}
        rounded="1.25rem"
        padding={["3% 10%"]}
        >
          <Heading
          textAlign="center"
          fontSize={["30px"]}
          mb="1.75rem"
          >
          Training Information
          </Heading>
          <Box display="flex" flexDir={["column", "row"]}justifyContent="space-between" rowGap="2.5rem">
            <Box display="flex" alignItems="center" flexDir="column" rowGap={["0.5rem","1.25rem"]}>
              <HStack>
              <Icon as={IoCalendarOutline} fontSize="1.5625rem" />
              <Text textAlign="center" fontSize="1.25rem">Start Date</Text>
              </HStack>
              <Text textAlign="center" fontSize="1.25rem" fontWeight="700">August 1, 2023</Text>
            </Box>
            <Box display="flex" alignItems="center" flexDir="column" rowGap={["0.5rem","1.25rem"]}>
            <HStack>
              <Icon as={IoLocationOutline} fontSize="1.5625rem" />
              <Text textAlign="center" fontSize="1.25rem">Location</Text>
              </HStack>
              <HStack flexDir={["column", "row"]}>
              <Text textAlign="center" fontSize="1.25rem" fontWeight="700">
              <Text as="span" fontWeight="500">Island:{" "}</Text>
               Lekki, Ajah
              </Text>
              <Text textAlign="center" fontSize="1.25rem" fontWeight="700">
              <Text as="span" fontWeight="500">Mainland:{" "}</Text>
              Berger
              </Text>
            
              </HStack>
              
            </Box>
          </Box>
        </Box>
        </Box>
      </MainContainer>
    </Box>
  )
}
