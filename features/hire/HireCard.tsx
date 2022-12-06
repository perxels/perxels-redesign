import { Box, Button, Flex, Grid, GridItem, Heading, Img, Text } from '@chakra-ui/react'
import React from 'react'

interface HireCardProps {
    bgImage?: string
    title?: string
    description?: string
    icon?: string
}

const HireCard = ({ bgImage, title, description, icon }: HireCardProps) => {
  return (
    <Box
      w="full"
      h="35.875rem"
      rounded="10px"
      overflow="hidden"
      bgImage={bgImage}
      bgSize="cover"
      bgRepeat="no-repeat"
    >
      <Flex
        flexDir="column"
        justifyContent="flex-end"
        w="full"
        h="full"
        bg="rgba(0, 0, 0, 0.35)"
      >
        <Box
          w="full"
          p="2.625rem"
          bg="linear-gradient(180deg, rgba(0, 0, 0, 0) 6.94%, rgba(0, 0, 0, 0.55) 33.53%);"
          pt="6.813rem"
        >
          <Grid templateColumns="4.375rem 1fr" gap="1.35rem">
            <GridItem>
              <Img
                src={icon}
                w="4.375rem"
                h="4.375rem"
              />
            </GridItem>
            <GridItem>
              <Heading fontSize="1.875rem" color="brand.white">{title}</Heading>
              <Text color="brand.white" fontSize="1.125rem" mt="0.75rem" mb="1.25rem">
                {description}
              </Text>

              <Button variant="solid-white" w="180px">Hire Now</Button>
            </GridItem>
          </Grid>
        </Box>
      </Flex>
    </Box>
  )
}

export default HireCard
