import React from 'react'
import {Box, Flex, Heading, Text, Button} from '@chakra-ui/react'
import { MainContainer } from '../../layouts'
import Link from 'next/link'
export const Pricing = () => {
  return (
    <MainContainer>
    <Box mt={["3rem","5rem"]}>

        <Heading display={["none", "block"]} fontSize="72px" mb={["2rem","8.25rem"]} fontWeight={"700"}>
            Pricing
        </Heading>
        <Box bgColor="#F7F8F8" padding={["5%","6.875rem 3.875rem"]} rounded="2.625rem">
            <Box bgColor="#FFFFFF" padding={["2rem","3.5rem" ]}rounded=".75rem">
                <Flex justifyContent={"space-between" } alignItems="center" flexDir={["column", "row"]} rowGap="17px">
                    <Box>
                        <Text fontSize={["2rem","2.125rem"]} fontWeight="600" color="#3D3D3D" textAlign={["center", "left"]}>
                        Cost
                        </Text>
                        <Text fontSize={["1rem","24px"]} color="#3D3D3D" w={["100%","80%"]} mt="1rem" textAlign={["center", "left"]}>
                        Here is the examination cost for this examination, click on the button to apply
                        </Text>
                    </Box>
                    <Box 
                    height={["0.001px","72px" ]}
                   
                    width={["100%","0.001px"]}
                    borderLeft="1px solid #BFBFBF"
                    borderTop="1px solid #BFBFBF"
                    />
                    <Box>
                        <Heading fontSize={["2.625rem","4.5rem"]}>
                        ₦50,000
                        </Heading>
                    </Box>
                </Flex>
                <Box >
                    <Button as={Link} href="/evaluation/register"  w="100%" h={["3.9375rem","6.0625rem"]} mt={["1rem","3.75rem"]}>
                    Enroll For This Plan
                    </Button>
                </Box>
            </Box>
        </Box>
    </Box>
    </MainContainer>
  )
}
