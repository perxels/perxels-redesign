import React from 'react'
import { Box, Flex, VStack, HStack, Text, Image, Icon } from '@chakra-ui/react'
import { MdOutlineTimer } from 'react-icons/md'
import { IoCalendarClearOutline } from 'react-icons/io5'
export const InstructionBox = () => {
  return (
    <Box display="flex" flexDir={["row", "column"]} background="#FDE85C" p={['35px 49px 33px 30px','17px 34px 18px 33px']} maxWidth={["510px"]} mt="3rem" columnGap="12px">
      <Box mt={["0.5rem","0rem"]} ml={["0rem","2.875rem"]} mb="1rem">
        <Image src="/assets/icons/sponsorLine.svg" alt="" 
        display={["none", "block"]}
        />
         <Image src="/assets/icons/sponsorLineMobile.svg" alt="" 
        display={["block", "none"]}
        />
      </Box>
      <Flex columnGap="41px" flexDir={["column", "row"]} rowGap="1rem">
        <VStack alignItems="flex-start" rowGap="0rem">
          <Text color="#383084" fontSize=".875rem">
            Application opens
          </Text>
          <HStack mt={["-0.5rem","0px"]}>
            <Icon as={MdOutlineTimer}  fontSize="1rem" />
            <Text fontSize="1.125rem" fontWeight="700" color="#383084">
              12pm
            </Text>
          </HStack>
          <HStack  mt={["-0.5rem","0px"]}>
            <Icon as={IoCalendarClearOutline}  fontSize="1rem" />
            <Text fontSize="1.125rem" fontWeight="700" color="#383084">
              December 2, 2023
            </Text>
          </HStack>
        </VStack>
        <Box
          height={["0.1px","70px;"]}
          width={["70px","0.01px"]}
          border="0.0001px solid #383084"
          borderLeft="none"
          mt={["0rem","1rem"]}
        />
        <VStack alignItems="flex-start">
          <Text color="#383084" fontSize=".875rem">
            Application closes
          </Text>
          <HStack mt={["-0.5rem","0px"]}>
            <Icon as={MdOutlineTimer} fontSize="1rem" />
            <Text fontSize="1.125rem" fontWeight="700" color="#383084">
              6pm
            </Text>
          </HStack>
          <HStack  mt={["-0.5rem","0px"]}>
            <Icon as={IoCalendarClearOutline}  fontSize="1rem"/>
            <Text fontSize="1.125rem" fontWeight="700" color="#383084">
              December 10, 2023
            </Text>
          </HStack>
        </VStack>
      </Flex>
    </Box>
  )
}
