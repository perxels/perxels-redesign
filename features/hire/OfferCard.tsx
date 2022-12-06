import { Box, Button, Flex, Heading, Icon, Text, Img } from '@chakra-ui/react'
import React, { useMemo } from 'react'
import { IoChevronForwardCircleOutline } from 'react-icons/io5'
import { hireCardContentProps } from '../../constant'

const OfferCard = ({ bg = 'brand.purple.500', title, description, icon, w, r }: hireCardContentProps) => {
  
    const color = useMemo(() => {
        return bg === 'brand.yellow.500' ? 'brand.purple.500' : 'brand.white'
    }, [bg])
  
    return (
    <Flex
      w="full"
      py="3.75rem"
      pl="1.875rem"
      pr="1.5rem"
      bg={bg}
      rounded="10px"
      flexDir="column"
      h="483px"
      justifyContent="space-between"
      pos="relative"
      overflow="hidden"
    >
      <Box>
        <Heading color={color} fontSize="4xl">
          {title}
        </Heading>
        <Text color={color} fontSize="xl" mt="0.875rem">
          {description}
        </Text>
      </Box>

      <Img
        pos="absolute"
        bottom="-2rem"
        right={r || "0"}
        src={icon}
        alt={title}
        w={w || "235.49px"}
        h="auto"
      />

      <Button
        maxW="199px"
        h="4rem"
        rightIcon={
          <Icon as={IoChevronForwardCircleOutline} fontSize="1.5rem" />
        }
        color={color}
        bg="none"
        variant="outline"
        fontWeight="700"
        fontSize="2xl"
        borderColor={color}
      >
        Learn More
      </Button>
    </Flex>
  )
}

export default OfferCard
