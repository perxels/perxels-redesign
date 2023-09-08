import React from 'react'
import {Box, Heading, Text, Image} from '@chakra-ui/react'
import {HubFeatProps} from '../../constant'


export const HubFeatCard = ({icon, title, description}: HubFeatProps) => {
  return (
    <Box
    border="1px solid #E2E8F0"
    p={["2.0625rem","2.375rem"]}
    rounded="1.1875rem"
    className="hub-feats-card"
    >
        <Image width="4.375rem" height="4.375rem" src={icon} alt="feat1" />
        <Heading  as="h3" fontSize={["1.3125rem","1.5rem"]} fontWeight="bold" color="brand.dark.200" mt="1.4375rem">
        {title}
        </Heading>
        <Text fontSize={["1.2rem", "1.375rem"]} color="#555" mt="1.8125rem">
       {description}
        </Text>
    </Box>
  )
}
