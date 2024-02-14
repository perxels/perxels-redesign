import React from 'react'
import {Flex, Box, Heading, Text, Image, Button} from '@chakra-ui/react'
import {MainContainer} from '../../layouts'
export const Impact = () => {
  return (
    <MainContainer bg="#FFF">
    <Flex justifyContent="space-between" alignItems={['flex-start',"center"]}
    flexDir={["column","row"]} 
    py="10%"
    px={["0%","10%"]}
    >
        <Box width={["90%","60%"]}>
            <Heading fontSize={["32px","54px"]}>
            We create impact on our students
            </Heading>
            <Text fontSize={["0.8rem","1rem" ]}color="#1C1C1C">
            Lorem ipsum dolor sit amet consectetur. Dolor congue justo proin elementum pretium nec sit. At cras aliquet nunc vel ultricies. At feugiat id lorem nec. Aliquet adipiscing egestas gravida vitae odio eros cras cras vitae.
            </Text>
            <Flex pt={["16px","32px"]} alignItems="center" columnGap={["10px","13px"]}>
            <Image width={["140px","153px"]} src="./assets/images/internship/impactPeople.png" alt="icon1"  />
            <Text fontSize={["0.7rem","16px"]} color="#1C1C1C">
            Over 400+ successful IT training
            </Text>
            </Flex>
            <Button  bg="#34296B" 
            color="#FFFF"
            fontSize={["16px",'24px']} padding="20px 40px" fontWeight="500" borderRadius="1rem" mt="25px" rounded="42px"  height={["48px","62px"]} width={["full","256px"]}>
            Get started
            </Button>
        </Box>
        <Box>
            <Image src="./assets/images/internship/impactImage.png" alt="impact" width="full" my="54px" />
        </Box>
    </Flex>
    </MainContainer>
  )
}
