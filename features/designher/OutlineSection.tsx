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
      'The fundamental principles of UI design: Typography, colours, layout, hierarchy, whitespace, icons, balance and alignment.',
      'How to create your own wireframes (low and high fidelity wireframes)',
      'Introduction to style guides',
      'Learn the tips and tricks to design a dashboard screen, landing page and mobile apps',
      'Opportunity to work on case studies and create a sellable design portfolio.',
    ],
  },
  {
    title: 'Pre-requisite',
    description: [
      'A working Laptop',
      'Focused/ready mindset',
      'Writing materials',
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
            href="/iwd#register" h="full" fontSize={["40px","97px"]} bgColor="#E3719C" rounded="24px" fontWeight="800" color="#FFF" rightIcon={<FiArrowUpRight/>}>
        Register here 
        </Button>
        </Flex>
      </MainContainer>
    </Box>
  )
}
