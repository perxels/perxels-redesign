import React from 'react'
import {Box, Image, Heading, Text, Icon, Flex} from '@chakra-ui/react'
import {SectionHeader} from '../../components'
import { MainContainer } from '../../layouts'
export const AbujaSpace = () => {
  return (
    <Box
    py={["3.3rem","6.25rem"]}
    >
        <MainContainer>
        <SectionHeader
        subTitle="Physical Spaces"
        title="Join our Physical Space in Abuja"
        paragraph="Here are some images of our trainings currently happening at our Central Business District, Abuja space. Join us today!"
        />

        <Flex
        columnGap="1.25rem"
        flexDir={["column", "row"]}
        rowGap="1.25rem"
        >
            <Box >
            <Image display={["none","block"]}  src={"/assets/images/class-group/abujaSpace1.png"} objectFit="cover" alt="" />
            <Image display={["block","none"]} src={"/assets/images/class-group/abujaSpace1.png"} alt="" />
            </Box>
            <Box >
                <Image src="/assets/images/class-group/abujaSpace2.png" alt=""/>
            </Box>
        </Flex>
        </MainContainer>
    </Box>
  )
}
