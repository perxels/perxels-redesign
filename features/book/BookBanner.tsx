import React from 'react'
import {Center, Box, Text, Image, Flex, SimpleGrid} from '@chakra-ui/react'
import {AiOutlineInfoCircle} from 'react-icons/ai'
import {BsMouseFill} from 'react-icons/bs'
import {MainContainer} from '../../layouts/'
import Link from 'next/link'
export const BookBanner = () => {
  return (
    <Box
    >
        <MainContainer bg="#E3719C">
        <Flex
         backgroundColor="#E3719C"
         py="1.375rem"
         alignItems="center"
         columnGap="25%"
        > 
       <Text color="#34296B" display={["none", "block"]}>
            <AiOutlineInfoCircle />
       </Text>
       <Box display="flex" flexDirection={["column", "row"]} justifyContent={["flex-start", "flex-start"]} alignItems={["flex-start","center"]} columnGap="1.3125rem" color="#FFFFFF" textTransform="uppercase" fontWeight="800">
       <Text>
            Our new E-book is now availble!!
       </Text>
       <Text display={["none", "block"]}>
            <BsMouseFill/>
       </Text>
       <Link  href="/enrol/#book">
       <Text display={"flex"} color="#FFFFFF" >
       <Text as={"span"} display={["block", "none"]}>
            <BsMouseFill/>
       </Text> {" "}
        Scroll Down to see more.
       </Text>
       </Link>
       </Box>
       </Flex>
       </MainContainer>
        
    </Box>
  )
}
