import { Center, Heading, VStack } from '@chakra-ui/react'
import { VscLibrary } from "react-icons/vsc";

import React from 'react'

export const EmptyAdvertisement = () => {
  return (
    <VStack py={32}>
        <Center w={24} h={24} rounded="full" bg="#e2e2e2">
            <VscLibrary size={40} />
        </Center>

        <Heading textAlign="center" mt={2} fontSize="x-large">No Advertisement to show</Heading>
    </VStack>
  )
}
