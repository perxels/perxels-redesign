import React from 'react'
import { Box, Heading, Text, Image, Button } from '@chakra-ui/react'
import { ActivitiesCard } from './ActivitiesCard'
import { MainContainer } from '../../layouts'
export const Activities = () => {
  return (
    <MainContainer bg="#FFFFFF">
      <Box>
        <Heading textAlign="center" fontSize={["32px","54px"]}>What we do</Heading>
        <Text textAlign={"center"} fontSize={["16px","24px"]} color="#1A1A1A" mb={["25px","100px"]}>Examines knowledge and competency in: professional practice</Text>

        <Box display="flex"
        flexDir={["column", "row"]}
        columnGap="20px" rowGap={"20px"}>
          <ActivitiesCard
            bgColor="#34296B"
            headColor="#FFF"
            textColor="#FFF"
            buttonBg="#FFD600"
            buttonColor="#1A1A1A"
            headText="3 Month Training"
            descriptionText="Demonstrate your capability to deliver project outcomes at a certain level"
            imgSrc="./assets/images/internship/activitiesImage1.png"
          />
          <ActivitiesCard
            bgColor="#F7F8F8"
            headColor="#707070"
            textColor="#1A1A1A"
            buttonBg="transparent"
            buttonColor="#1A1A1A"
            headText="6 Month Training"
            descriptionText="Demonstrate your capability to deliver project outcomes at a certain level "
            imgSrc='./assets/images/internship/activitiesImage2.png'
          />
        </Box>
      </Box>
    </MainContainer>
  )
}
