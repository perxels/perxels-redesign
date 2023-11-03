import React from 'react'
import {Box, Image, Heading, Text, Icon, Flex} from '@chakra-ui/react'
import {SectionHeader} from '../../components'
import { MainContainer } from '../../layouts'
export const LagSpace = () => {
  return (
    <Box
    py={["3.3rem","6.25rem"]}
    >
        <MainContainer>
        <SectionHeader
        subTitle="Physical Spaces"
        title="Join our Physical Space in Lekki"
        paragraph="Here are some images of our trainings currently happening in our Lekki, Lagos space. Join us today!"
        />

        <Flex
        columnGap="1.25rem"
        flexDir={["column", "row"]}
        rowGap="1.25rem"
        >
            <Box>
            <Image display={["none","block"]} src={"/assets/images/class-group/lagSpace1.png"} alt="" />
            <Image display={["block","none"]} src={"/assets/images/class-group/lagSpaceMobile1.png"} alt="" />
            </Box>
            <Box>
                <Image src="/assets/images/class-group/lagSpace2.png" alt=""/>
            </Box>
        </Flex>
        </MainContainer>
    </Box>
  )
}
