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
    <MainContainer bg="brand.yellow.500">
      <SimpleGrid columns={2} spacing="3.125rem" py="5rem" px="1rem">
        <Img
          src="./assets/images/hire/hireCard1.jpg"
          alt="Hire as a Company"
          w="full"
          h="auto"
          rounded="10px"
        />

        <Flex h="full" w="full" flexDir="column" justifyContent="center">
          <BgHeader>HIRE As a company</BgHeader>

          <Heading fontSize="7xl" color="brand.dark.200" py="1.875rem">
            Why hire Perxels’ Team.
          </Heading>

          <ListWrapper
            lists={[
              'Value 1 we bring to the table',
              'Value 2 we bring to the table',
              'Value 3 we bring to the table',
              'Value 4 we bring to the table',
              'Value 5 we bring to the table',
            ]}
          />

          <Button
            variant="outline"
            rightIcon={<Icon fontSize="1.25rem" as={IoChevronForwardCircleOutline} />}
            h="4rem"
            w="140px"
            mt="1.875rem"
          >
            Hire Us
          </Button>
        </Flex>
      </SimpleGrid>
    </MainContainer>
  )
}
