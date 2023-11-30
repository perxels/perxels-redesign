import React from 'react'
import {Box, Text} from '@chakra-ui/react'
export const StagesCard = () => {
  return (
    <Box width="90%">
        <Box
        borderLeft="6px solid #34296B"
        pl="1.375rem"
       
        >
        <Text
        fontSize="32px"
        fontWeight={"600"}
        color="#1A1A1A"
        >
        Eligibility 
        </Text>
        <Text
        fontSize="20px"
        fontWeight={"400"}
        color="#1A1A1A"
        >
        When you invest in this product, you&apos;re getting in at an early stage when property prices are affordable. 
        </Text>
        </Box>
        <Box
         borderLeft="6px solid #EBEBEB"
         pl="1.375rem"
         h="64px"
         w="0.01px"
        />
        <Box
         borderLeft="6px solid #EBEBEB"
         pl="1.375rem"
         color="#707070"
         _hover={{
            borderLeft: "6px solid #34296B",
            color: "#1A1A1A",
         }}
        >
        <Text
        fontSize="32px"
        fontWeight={"600"}
        // color="#707070"
        className='text-title'
        >
        Application
        </Text>
        <Text
         fontSize="20px"
         fontWeight={"400"}
        //  color="#707070"
         className='text-title'
        >
        When you invest in this product, you&apos;re getting in at an early stage when property prices are affordable. 
        </Text>
        </Box>
        
        <Box
         borderLeft="6px solid #EBEBEB"
         pl="1.375rem"
         h="64px"
         w="0.01px"
        />
        <Box
         borderLeft="6px solid #EBEBEB"
         pl="1.375rem"
         color="#707070"
         _hover={{
            borderLeft: "6px solid #34296B",
            color: "#1A1A1A",
         }}
        >
        <Text
         fontSize="32px"
         fontWeight={"600"}
        >
        Examination
        </Text>
        <Text
         fontSize="20px"
         fontWeight={"400"}
        >
        When you invest in this product, you&apos;re getting in at an early stage when property prices are affordable. 
        </Text>
        </Box>
        <Box
         borderLeft="6px solid #EBEBEB"
         pl="1.375rem"
         h="64px"
         w="0.01px"
        />
        <Box
          borderLeft="6px solid #EBEBEB"
          pl="1.375rem"
          color="#707070"
          _hover={{
             borderLeft: "6px solid #34296B",
             color: "#1A1A1A",
          }}
        >
        <Text
         fontSize="32px"
         fontWeight={"600"}
        >
        Results
        </Text>
        <Text
         fontSize="20px"
         fontWeight={"400"}
        >
        When you invest in this product, you&apos;re getting in at an early stage when property prices are affordable. 
        </Text>
        </Box>
        <Box
         borderLeft="6px solid #EBEBEB"
         pl="1.375rem"
         h="64px"
         w="0.01px"
        />
        <Box
          borderLeft="6px solid #EBEBEB"
          pl="1.375rem"
          color="#707070"
          _hover={{
             borderLeft: "6px solid #34296B",
             color: "#1A1A1A",
          }}
        >
        <Text
         fontSize="32px"
         fontWeight={"600"}
        >
        Certifications
        </Text>
        <Text
         fontSize="20px"
         fontWeight={"400"}
        >
        When you invest in this product, you&apos;re getting in at an early stage when property prices are affordable. 
        </Text>
        </Box>
    </Box>
  )
}
