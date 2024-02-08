import React from 'react'
import { Heading, Box, Flex } from '@chakra-ui/react'
import { BenefitBox } from './BenefitBox'
import { BenefitBoxContent } from '../../constant'
import {MainContainer} from '../../layouts'
export const Benefits = () => {
  return (
    <MainContainer bg="#FFF">
    <Box mt="50px">
    <Heading  py="50px"textAlign="center" fontSize={["32px","54px"]}>Some of the benefits you stand to gain</Heading>


      <Flex rowGap="20px"  flexDirection="column">
        <Flex columnGap="20px" flexDir={["column","row"]} rowGap="20px">
          <BenefitBox
            border={BenefitBoxContent[0].border}
            width={BenefitBoxContent[0].width}
            headText={BenefitBoxContent[0].headText}
            description={BenefitBoxContent[0].description}
            imgSrc={BenefitBoxContent[0].imgSrc}
          />
          <BenefitBox
            border={BenefitBoxContent[1].border}
            width={BenefitBoxContent[1].width}
            headText={BenefitBoxContent[1].headText}
            description={BenefitBoxContent[1].description}
            imgSrc={BenefitBoxContent[1].imgSrc}
          />
        </Flex>
        <Flex columnGap="20px" flexDir={["column","row"]} rowGap="20px">
        <BenefitBox
            border={BenefitBoxContent[2].border}
            width={BenefitBoxContent[2].width}
            headText={BenefitBoxContent[2].headText}
            description={BenefitBoxContent[2].description}
            imgSrc={BenefitBoxContent[2].imgSrc}
          />
          <BenefitBox
            border={BenefitBoxContent[3].border}
            width={BenefitBoxContent[3].width}
            headText={BenefitBoxContent[3].headText}
            description={BenefitBoxContent[3].description}
            imgSrc={BenefitBoxContent[3].imgSrc}
          />
         
        </Flex>
      </Flex>
    </Box>
    </MainContainer>
  )
}
