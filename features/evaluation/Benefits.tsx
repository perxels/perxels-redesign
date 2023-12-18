import React, {useState} from 'react'
import { Box, Text, Heading, Flex } from '@chakra-ui/react'
import { MainContainer } from '../../layouts'
export const Benefits = () => {
  const [visible, setVisible] = useState("tab1")


  const handleSwitchTab = (tab: string) => {
    setVisible(tab)
  }
  

  return (
    <MainContainer>
      <Flex bgColor="#F7F8F8" padding={["30px","5%"]}    mt={["3.75rem","4.5625rem"]} rounded="2.625rem" columnGap="1.25rem"
      flexDir={["column", "row"]}
      rowGap="2rem"
      >
        <Box
        minHeight={["400px","554px"]}
          position="relative"
          bgColor="#FFFFFF"
          p={["2rem 5%","3.875rem 2.625rem"]}
          rounded="2rem"
          onMouseEnter={() => handleSwitchTab("tab1")}
          w={visible === "tab1" ? ["100%","40%"] : ["100%","30%"]}
        >
          <Text
            fontSize={visible === "tab1" ? "72px" : "52px"}
            color="#1A1A1A"
            fontWeight="400"
            textAlign="right"
            mb={["3.0625rem","6.875rem"]}
          
          >
            01
          </Text>
          <Box position="absolute" bottom={"0"} pb={["49px"]} pt="100px" >
          <Text fontSize={["32px","42px"]} color="#1A1A1A" lineHeight={["2.4362rem","3.25rem"]} 
          >
            Be Recognized for your skill
          </Text>
          <Text fontSize={["18px","24px"]} lineHeight={["1.125rem","36px"]} mt={["1rem","2rem"]}  color="#707070"
          display={visible === "tab1" ? "block" : "none"}
          >
            Demonstrate your capability to deliver project outcomes at a certain
            level
          </Text>
          </Box>
        </Box>
        <Box position="relative" 
          bgColor="#FFFFFF"
          p={["2rem 5%","3.875rem 2.625rem"]}
          onMouseEnter={() => handleSwitchTab("tab2")}
          w={visible === "tab2" ? ["100%","40%"] : ["100%","30%"]}
          rounded="2rem"
          minHeight={["400px","554px"]}
          >
          <Text
              fontSize={visible === "tab2" ? "72px" : "52px"}
              color="#626262"
              fontWeight="400"
              textAlign="right"
              mb={["3.0625rem","6.875rem"]}
          >02</Text>
          <Box  position="absolute" bottom={"0"} pb={["49px"]}>
            <Text
            fontSize={["32px","36px"]} color="#1A1A1A" lineHeight={["2.4362rem","3.25rem"]}
            >Give yourself competitive edge</Text>
           <Text 
            display={visible === "tab2" ? "block" : "none"}
           fontSize={["18px","24px"]} lineHeight={["1.125rem","36px"]} mt="2rem" color="#707070">
           Gain a competitive edge by taking an examination that enhances your CV.
          </Text>
          </Box>
        </Box>
        <Box position="relative" 
          bgColor="#FFFFFF"
          p={["2rem 5%","3.875rem 2.625rem"]}
          onMouseEnter={() => handleSwitchTab("tab3")}
          w={visible === "tab3" ? ["100%","40%"] : ["100%","30%"]}
          rounded="2rem"
          minHeight={["400px","554px"]}
          >
          <Text
             fontSize={visible === "tab3" ? "72px" : "52px"}
              color="#626262"
              fontWeight="400"
              textAlign="right"
              mb={["3.0625rem","6.875rem"]}
          >03</Text>
          <Box position="absolute" bottom={"0"} pb={["49px"]}>
            <Text
            fontSize={["32px","36px"]} color="#1A1A1A" lineHeight={["2.4362rem","3.25rem"]}
            >Empower 
            your career growth</Text>
           <Text fontSize={["18px","24px"]} lineHeight={["1.125rem","36px"]} mt="2rem"   display={visible === "tab3" ? "block" : "none"} color="#707070"> 
           Taking an examination like this will amplify your career growth.
          </Text>
          </Box>
        </Box>
      </Flex>
    </MainContainer>
  )
}
