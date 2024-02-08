import React from 'react'
import { Box, Heading, Text, Image, Button } from '@chakra-ui/react'
import { MainContainer } from '../../layouts'
export const InternshipHero = () => {
  return (
    <MainContainer bg="#FFFFFF">
      <Box display="flex" flexDir="column" alignItems="center" pt="5%" pb="10%">
        <Heading
          textAlign={'center'}
          fontSize={['31px', '62px']}
          width={['100%', '85%']}
        >
          Examines knowledge and competency in: professional practice
        </Heading>
        <Text
          width={['100%', '50%']}
          textAlign="center"
          fontSize={['14px', '22px']}
          color="#1A1A1A"
          mt={['14px', '20px']}
        >
          Our class groups are designed to accommodate your current level in
          design and unique learning process
        </Text>
        <Button w={["full","347px"]} height={["45px","56px"]} fontSize={["16px","20px"]} mt={["21px","42px"]}>
          Enroll Now
        </Button>

        <Image
          src="./assets/images/internship/heroImg.png"
          alt="internship-hero"
          mt={["20px","72px"]}
        />
      </Box>
    </MainContainer>
  )
}
