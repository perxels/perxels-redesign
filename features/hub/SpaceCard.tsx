import React from 'react'
import {Box, Flex, Heading, Text, Spacer, Button, Image} from '@chakra-ui/react'
import {FaArrowAltCircleRight} from 'react-icons/fa'
import Link from 'next/link'
interface SpaceCardProps {
    bgImage: string
    spaceTypeName: string
    spaceTypeIcon: string
    spaceTypeDescription: string
    spaceTypePrice: string
    link: string
}

export const SpaceCard = ({bgImage, spaceTypeName, spaceTypeIcon, spaceTypeDescription, spaceTypePrice, link}: SpaceCardProps) => {
  return (
    <Box minHeight="656px"
    background={`url(${bgImage}) no-repeat center center`}
    backgroundSize="cover"
    borderRadius="10px"
    position="relative"
    >
    <Box position="absolute" bottom="0" left="0" right="0" p="1rem" background="#FCFCFC" borderRadius="10px" margin="21px 25px">
        <Flex alignItems="center" justifyContent="space-between">
        <Text fontSize="1.875rem" lineHeight="normal" color="#000000" fontWeight="bold">{spaceTypeName}</Text>

        <Image  src={spaceTypeIcon} alt="space type" width="60px" height="60px" />
        </Flex>
        <Text
        fontSize="18px"  fontWeight="400" color="#555" w="85%"
        >
            {spaceTypeDescription}
        </Text>
        <Flex alignItems="center" justifyContent="space-between" mt="1.1875rem"> 
            <Box>
                <Text 
                fontSize="30px" fontWeight="700" color="#E3719C" mr=".3125rem"
                >
                {spaceTypePrice}<Text as="span"
                fontSize="18px" fontWeight="700" color="#E3719C" mr=".3125rem"
                >/hour</Text>
                </Text>
            </Box>
            <Link href={link}>
            <Flex>  
                <Text fontSize="18px" fontWeight="700" color="#34296B" mr=".3125rem">
                    Book Now </Text>
                <FaArrowAltCircleRight color="#34296B" fontSize="1.5rem" />
                
            </Flex>
            </Link>
        </Flex>
    </Box>
    </Box>
  )
}
