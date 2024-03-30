import React from 'react'
import {
  Box,
  Text,
  Heading,
  List,
  UnorderedList,
  ListItem,
  Button,
  Center,
  Flex,
} from '@chakra-ui/react'
import {MainContainer} from '../../layouts'
import { FiArrowUpRight } from "react-icons/fi";

const OutlineData = [
  {
    title: 'Course Outline',
    description: [
      "Registration: Register on the landing page perxels.com/competition with accurate details.",
      "Join the WhatsApp Group: Upon registration, you'll receive an immediate link to join the WhatsApp group.",
      "Participation in Daily Tasks: Stay engaged in the WhatsApp group discussions and follow all daily tasks provided.",
      "Portfolio Enhancement: Continuously improve your portfolio until your assigned submission day.",
      "Engagement with Friends: Encourage your friends to engage with your posts using the correct hashtag, as this will contribute to your points."
    ],
  },
]



export const OutlineSection = () => {
  return (
    <Box bgColor="#34296B" pb="5%" borderRadius="0 0% 10% 10%">
        <MainContainer bg="transparent">
      {OutlineData.map((data, index) => (
        <Box key={index} pb={["20px","80px"]} borderBottom={"1px solid #645BAF"} pt={["5%","5%"]}>
          <Heading
            as="h1"
            fontSize={["24px","48px"]}
            fontWeight="600"
            color="#FEDA00"
            mb={["16px","40px"]}
          >
            {data.title}
          </Heading>
          <UnorderedList>
            {data.description.map((desc, index) => (
              <ListItem
                key={index}
                fontSize={["16px","20px"]}
                color="#FFFFFF"
                lineHeight="150%"
                mb="1rem"
                width={["100%","50%"]}
              >
                {desc}
              </ListItem>
            ))}
          </UnorderedList>
        </Box>
      ))}
  
        <Flex mt={["2.5rem","3rem"]} justifyContent="center" >
        <Button  as={'a'}
            href={`/competition#register`} h="full" fontSize={["40px","97px"]} bgColor="#E3719C" rounded="24px" fontWeight="800" color="#FFF" rightIcon={<FiArrowUpRight/>}>
        Register here 
        </Button>
        </Flex>
      </MainContainer>
    </Box>
  )
}
