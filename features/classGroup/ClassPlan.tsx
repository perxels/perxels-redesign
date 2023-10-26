import React from 'react'
import {Box, Heading, Text, Flex, Image, Button} from '@chakra-ui/react'
import Link from 'next/link'

export const OnlineClassPlan = () => {
  return (  
    <Flex
    justifyContent="space-between"
    backgroundColor="#FDE85C"
    padding={["4.5625rem 1.0625rem 3.625rem 1.25rem", "2.625rem 2.5rem 2.375rem 5rem"]}
    borderRadius="1.25rem"
    alignItems="center"
    >
        <Box
         display={["none","block"]}
        >
            <Image src="/assets/images/class-group/onlinePerx.png" alt=""  /> 
        </Box>
        <Box
        width={["100%","45%"]}
        >
            <Heading
            color="#121212"
            fontSize={["2.625rem","4.375rem"]}
            fontWeight="800"
            lineHeight={["2.9875rem","4.4625rem"]}
            >
                Explore Our
            </Heading>
            <Heading
            color="#34296B"
            fontSize={["2.625rem","4.375rem"]}
            fontWeight="800"
            lineHeight={["2.9875rem","4.4625rem"]}
            >
                Online Classes.
            </Heading>
            <Text
            color="#555555"
            fontSize="1.25rem"
            fontWeight="500"
            lineHeight="1.6812rem"
            mt={[".75rem","1.875rem"]}
            >
            On our quest to continue expanding and bringing design education to your dorrstep, we have established a couple of physical learning spaces.
            </Text>

            <Button
            fontSize=".9375rem"
            mt={[".6875rem","1.875rem"]}
            as={Link}
            href="/enrol"
            >
            View Online Class Plans
            </Button>
        </Box>
    </Flex>
  )
}


export const PhysicalClassPlan = () => {
    return (  
      <Flex
      justifyContent="space-between"
      backgroundColor="#34296B"
      padding={["4.5625rem 1.0625rem 3.625rem 1.25rem","2.625rem 2.5rem 2.375rem 3.75rem"]}
      borderRadius="1.25rem"
      flexDirection="row-reverse"
      alignItems="center"
      >
          <Box
          width="45%"
          display={["none","block"]}
          >
              <Image src="/assets/images/class-group/physicalPerx.png" alt=""  /> 
          </Box>
          <Box
          width={["100%","50%"]}
          >
              <Heading
              color="#FFF"
              fontSize={["2.625rem","4.375rem"]}
              fontWeight="800"
              lineHeight={["2.9875rem","4.4625rem"]}
              >
                  Explore Our
              </Heading>
              <Heading
              color="#FDE85C"
              fontSize={["2.625rem","4.375rem"]}
              fontWeight="800"
              lineHeight={["2.9875rem","4.4625rem"]}
              >
                 Physical Classes.
              </Heading>
              <Text
              color="#FFF"
              fontSize="1.25rem"
              fontWeight="500"
              lineHeight="1.6812rem"
              mt={[".75rem","1.875rem"]}
              >
             On our quest to continue expanding and bringing design education to your dorrstep, we have establishde a couple of physical learning spaces.
              </Text>
  
              <Button
              fontSize=".9375rem"
              mt={[".6875rem","1.875rem"]}
              color="#34296B"
              background="#FFF"
              as={Link}
              href="/physicalspace"
              >
              View Physical Class Plans
              </Button>
          </Box>
      </Flex>
    )
  }