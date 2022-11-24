import React from 'react'
import {Box, Flex, Heading, Text, Image, SimpleGrid, Img} from '@chakra-ui/react'
import { workDetails } from '../../constant'
import { ContactStudent } from './'
export const CaseStudy = () => {
  return (
    <Box
    backgroundColor={"#1E1E1E"}
    px={{ base: 4, md: 32 }}
    py={{ base: 20, md: 14 }}
    >
        <Box
        w="full"
        >
            <Image src={"/assets/images/class-work/classwork1.png"} alt="classwork"/>
        </Box>
        <SimpleGrid columns={{base: 1, md: 2}} spacing={20} my={16} py={4}> 
            {
                workDetails[0].content1.map((item, index) => {
                    return (
                        <Box key={index}>
                           <Heading as="h2" fontSize={{base: '2.5rem', md: '2.5rem'}} color="brand.white" lineHeight={'110%'} mb={{base: 4, md: 6}} >
                                 {item.title} 
                            </Heading>
                            <Text color="brand.white" fontSize="xl" fontWeight="normal">{item.description}</Text>
                        </Box>
                    )
                })
            }
        </SimpleGrid>
        <Box>
            <Image src={"/assets/images/class-work/classwork2.png"} alt="classwork"/>
        </Box>
        <SimpleGrid columns={{base: 1, md: 2}} spacing={20} my={16} px={4}>
           {
                workDetails[0].content2.map((item, index) => {
                    return (
                        <Box key={index}>
                           <Heading as="h2" fontSize={{base: '2.5rem', md: '2.5rem'}} color="brand.white" lineHeight={'110%'} mb={{base: 4, md: 6}} >
                                 {item.title}
                            </Heading>
                            <Text color="brand.white" fontSize="xl" fontWeight="normal">{item.description}</Text>
                        </Box>
                    )
                })
           }
        </SimpleGrid>
        <Box>
            <Image src={"/assets/images/class-work/classwork3.png"} alt="classwork"/>
        </Box>

           <Box>
            <ContactStudent/>
           </Box>

    </Box>
  )
}
