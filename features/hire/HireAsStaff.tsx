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

export const HireAsStaff = () => {
  return (
    <Box
      bg="brand.purple.500"
      backgroundImage={"url('/assets/images/hire/bgPatternPurple.png')"}
      backgroundRepeat="no-repeat"
      backgroundSize={'cover'}
    >
      <MainContainer bg="none">
        <SimpleGrid
          columns={[1, 1, 1, 2]}
          spacing={['3rem', '3rem', '3rem', '3.125rem']}
          py="5rem"
          px={["0", "0", "0", "1rem"]}
        >
          <Flex
            h="full"
            w="full"
            flexDir="column"
            alignItems={['flex-start']}
            justifyContent="center"
          >
            <BgHeader bg="brand.yellow.500" color="brand.purple.500">
              Hire a talent
            </BgHeader>

            <Heading
              textAlign={['center', 'center', 'center', 'left']}
              fontSize={['4xl', '4xl', '4xl', '7xl']}
              color="brand.white"
              py="1.875rem"
            >
              Why Hire our talents?
            </Heading>

            <ListWrapper
              lists={[
                'Opportunity to hire the most skilled talents',
                'Save time, energy & money trying to source talents yourself',
                'Access to a large pool of vetted talents',
                'Achieve your goals & objectives with the best talents',
              ]}
              bg="brand.yellow.500"
              color="brand.white"
            />

            <Button
              variant="outline"
              rightIcon={
                <Icon fontSize="1.25rem" as={IoChevronForwardCircleOutline} />
              }
              h="4rem"
              w="180px"
              mt="1.875rem"
              color="brand.white"
              borderColor="brand.white"
              _hover={{ bg: 'brand.white', color: 'brand.purple.500' }}
            >
              Hire a Graduate
            </Button>
          </Flex>
          <Img
            src="./assets/images/hire/hireCard2.jpg"
            alt="Hire as a staff"
            w="full"
            h="auto"
            rounded="10px"
          />
        </SimpleGrid>
      </MainContainer>
    </Box>
  )
}
