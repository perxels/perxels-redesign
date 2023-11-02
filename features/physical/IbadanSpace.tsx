import React from 'react'
import {Box, Image, Heading, Text, Icon, Flex} from '@chakra-ui/react'
import {SectionHeader} from '../../components'
import { MainContainer } from '../../layouts'
export const IbadanSpace = () => {
  return (
    <Box
    py="6.25rem"
    >
        <MainContainer>
        <SectionHeader
        subTitle="Physical Spaces"
        title="Join our Physical Space in Ibadan"
        paragraph="Here are some images of our trainings currently happening in our Ring Road, Ibadan space. Join us today!"
        />

        <Flex
        columnGap="1.25rem"
        flexDir={["column", "row"]}
        rowGap="1.25rem"
        >
            <Box>
            <Image display={["none","block"]} src={"/assets/images/class-group/ibadanSpace1.png"} alt="" />
            <Image display={["block","none"]} src={"/assets/images/class-group/ibadanSpaceMobile1.png"} alt="" />
            </Box>
            <Box>
                <Image src="/assets/images/class-group/ibadanSpace2.png" alt=""/>
            </Box>
        </Flex>
        </MainContainer>
    </Box>
  )
}
