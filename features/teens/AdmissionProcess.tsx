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
        <Box px={["2%","14%"]} py="5%">
        {/* <Box
        >
          <SimpleGrid columns={[1, 1, 2, 2]} spacing="3.125rem">
            <Box   backgroundColor={"#FDE85C"} display="flex" alignItems="center" flexDir="column" rowGap={["2rem","2.125rem"]}   rounded=".3125rem"
        padding={["2.5rem 5%"]}>
              <Center background="#34296B" rounded=".625rem" w="11.25rem" h="45px">
              <HStack>
              <Icon color="#FFF" as={IoCalendarOutline} fontSize="1.5625rem" />
              <Text textAlign="center" color="#FFF" fontSize="1.25rem">Start Date</Text>
              </HStack>
              </Center>
              <Text color="#121212" textAlign="center" fontSize="2.5rem" fontWeight="700">August 1, 2023</Text>
            </Box>
            <Box  backgroundColor={"#FDE85C"} display="flex" alignItems="center" flexDir="column" rowGap={["2rem","2.187rem"]}   rounded=".3125rem"
        padding={["2.5rem 3rem","2.5rem 5.5rem"]}>
            <Center background="#34296B" rounded=".625rem" w="11.25rem" h="45px">
            <HStack>
              <Icon color="#FFF" as={IoLocationOutline} fontSize="1.5625rem" />
              <Text textAlign="center" color="#FFF" fontSize="1.25rem">Locations</Text>
              </HStack>
            </Center>
              <HStack flexDir={["column", "row"]} width={["100%","90%"]}>
              <Text color="#121212" textAlign="center" fontSize="2.5rem" fontWeight="700" lineHeight="2.7rem">
               Lekki, Ajah  and Berger
              </Text>
              </HStack>
            </Box>
            </SimpleGrid>
        </Box> */}
        </Box>
      </MainContainer>
    </Box>
  )
}
