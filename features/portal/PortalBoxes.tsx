import React from 'react'
import {Box, Text, Heading, Image, Button} from '@chakra-ui/react'
import {portalInt} from '../../constant'
export const PortalBoxes = ({title, description, image, link, borderColor, textColor, buttonColor, buttText}: portalInt) => {
  return (
    <Box
    border={`1px solid ${borderColor}`}
    rounded="21px"
    padding={["3.1875rem 3.4737rem"]}
    display="flex"
    flexDirection={["column"]}
    alignItems={['center', 'flex-start']}
    bg={"#FFF"}
    >
        <Image mb="30px" src={image} boxSize="102px" alt={title}/>
        <Text
        fontSize={["1.3125rem"]}
        color="#34296B"
        fontWeight="700"
        lineHeight="1.5594rem"
        mb="10px"
        >
            {title}
        </Text>
        <Text
        fontSize={"14px"}
        color="#707070"
        lineHeight="1.25rem"
        >
            {description}
        </Text>
        <Button
        as='a'
        backgroundColor={buttonColor}
        href={link}
        fontSize="14px"
        color={textColor}
        lineHeight="1.25rem"
        mt=".6319rem"
        borderRadius=".3125rem"
        >
            {buttText}
        </Button>
    </Box>
  )
}
