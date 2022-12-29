import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Img,
  SimpleGrid,
} from '@chakra-ui/react'
import React from 'react'
import { IoChevronForwardCircleOutline } from 'react-icons/io5'
import { BgHeader, ListWrapper } from '../../components'
import { MainContainer } from '../../layouts'

export const HireAsCompany = () => {
  return (
    <Box
      bg="brand.yellow.500"
      backgroundImage={"url('/assets/images/hire/bgPatternYellow.png')"}
      backgroundRepeat="no-repeat"
      backgroundSize={'cover'}
    >
      <MainContainer bg="none">
        <SimpleGrid
          columns={[1, 1, 1, 2]}
          spacing={['3rem', '3rem', '3rem', '3.125rem']}
          py={['3rem', '3rem', '5rem']}
          px={["0", "0", "0", "1rem"]}
        >
          <Img
            src="./assets/images/hire/hireCard1.jpg"
            alt="Hire as a Company"
            w="full"
            h="auto"
            rounded="10px"
            display={['none', 'none', 'block']}
          />

          <Flex
            h="full"
            w="full"
            flexDir="column"
            alignItems={['flex-start']}
            justifyContent="center"
          >
            <BgHeader>HIRE Perxels</BgHeader>

            <Heading
              textAlign={['center', 'center', 'left']}
              fontSize={['4xl', '4xl', '7xl']}
              color="brand.dark.200"
              py="1.875rem"
            >
              Why Hire Perxels?
            </Heading>

            <ListWrapper
              lists={[
                'Access to the best talents.',
                '10+ years team management experience.',
                'Industry standard tools & processes.',
                'Faster project delivery.',
                'Achieve your goals & objectives with less effort.',
              ]}
            />

            <Button
              variant="outline"
              rightIcon={
                <Icon fontSize="1.25rem" as={IoChevronForwardCircleOutline} />
              }
              h="4rem"
              w="140px"
              mt="1.875rem"
            >
              Hire Us
            </Button>
          </Flex>

          <Img
            src="./assets/images/hire/hireCard1.jpg"
            alt="Hire as a Company"
            w="full"
            h="auto"
            rounded="10px"
            display={['block', 'block', 'none']}
          />
        </SimpleGrid>
      </MainContainer>
    </Box>
  )
}
