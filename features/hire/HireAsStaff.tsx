import { Button, Flex, Heading, Icon, Img, SimpleGrid } from '@chakra-ui/react'
import React from 'react'
import { IoChevronForwardCircleOutline } from 'react-icons/io5'
import { BgHeader, ListWrapper } from '../../components'
import { MainContainer } from '../../layouts'

export const HireAsStaff = () => {
  return (
    <MainContainer bg="brand.purple.500">
      <SimpleGrid columns={2} spacing="3.125rem" py="5rem" px="1rem">
        <Flex h="full" w="full" flexDir="column" justifyContent="center">
          <BgHeader bg="brand.yellow.500" color="brand.purple.500">
            Hire a staff
          </BgHeader>

          <Heading fontSize="7xl" color="brand.white" py="1.875rem">
            Why hire a Perxels’ Graduate.
          </Heading>

          <ListWrapper
            lists={[
              'Value 1 we bring to the table',
              'Value 2 we bring to the table',
              'Value 3 we bring to the table',
              'Value 4 we bring to the table',
              'Value 5 we bring to the table',
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
  )
}
