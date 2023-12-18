import React, {useState} from 'react'
import {Box, Text} from '@chakra-ui/react'
export const StagesCard = () => {
  const [first, setFirst] = useState("firstCard")
  return (
    <Box width="75%">
        <Box
        borderLeft={
          first === "firstCard" ? "6px solid #34296B" : "6px solid #EBEBEB"
        }
        pl="1.375rem"
        onMouseEnter={()=> setFirst("firstCard")}

        >
        <Text
        fontSize="32px"
        fontWeight={"600"}
        color={first === "firstCard" ? "#34296B" : "#707070"}
        >
        Eligibility 
        </Text>
        <Text
        fontSize="20px"
        fontWeight={"400"}
        color={first === "firstCard" ? "#1A1A1A" : "#707070"}
      
        >
        Individuals who have completed a design course, regardless of whether it was at Perxels or elsewhere, are eligible to take the examination.
        </Text>
        </Box>
        <Box
         borderLeft="6px solid #EBEBEB"
         pl="1.375rem"
         h="64px"
         w="0.01px"
        />
        <Box
         borderLeft="6px solid #EBEBEB"
         pl="1.375rem"
         color="#707070"
         _hover={{
            borderLeft: "6px solid #34296B",
            color: "#1A1A1A",
         }}
         onMouseEnter={()=> setFirst("notFirst")}
        >
        <Text
        fontSize="32px"
        fontWeight={"600"}
        // color="#707070"
        className='text-title'
        >
        Application
        </Text>
        <Text
         fontSize="20px"
         fontWeight={"400"}
        //  color="#707070"
         className='text-title'
        >
        To enroll for this examination, please fill the form on  at perxels.com/exam. You will be contacted regarding the examination upon completing this form and payment follow.
        </Text>
        </Box>
        
        <Box
         borderLeft="6px solid #EBEBEB"
         pl="1.375rem"
         h="64px"
         w="0.01px"
        />
        <Box
         borderLeft="6px solid #EBEBEB"
         pl="1.375rem"
         color="#707070"
         _hover={{
            borderLeft: "6px solid #34296B",
            color: "#1A1A1A",
         }}
         onMouseEnter={()=> setFirst("notFirst")}
        >
        <Text
         fontSize="32px"
         fontWeight={"600"}
        >
        Examination
        </Text>
        <Text
         fontSize="20px"
         fontWeight={"400"}
        >
        Expect an email informing you about the scheduled date and time of your examination. Stay tuned to your inbox for updates.
        </Text>
        </Box>
        <Box
         borderLeft="6px solid #EBEBEB"
         pl="1.375rem"
         h="64px"
         w="0.01px"
        />
        <Box
          borderLeft="6px solid #EBEBEB"
          pl="1.375rem"
          color="#707070"
          _hover={{
             borderLeft: "6px solid #34296B",
             color: "#1A1A1A",
          }}
          onMouseEnter={()=> setFirst("notFirst")}
        >
        <Text
         fontSize="32px"
         fontWeight={"600"}
        >
        Results
        </Text>
        <Text
         fontSize="20px"
         fontWeight={"400"}
        >
        The examination is graded as follows: 70% - 100% signifies excellence, 40% - 69% indicates a good performance, while 0% - 39% reflects a lower performance.
        </Text>
        </Box>
        <Box
         borderLeft="6px solid #EBEBEB"
         pl="1.375rem"
         h="64px"
         w="0.01px"
        />
        <Box
          borderLeft="6px solid #EBEBEB"
          pl="1.375rem"
          color="#707070"
          _hover={{
             borderLeft: "6px solid #34296B",
             color: "#1A1A1A",
          }}
          onMouseEnter={()=> setFirst("notFirst")}
        >
        <Text
         fontSize="32px"
         fontWeight={"600"}
        >
        Certifications
        </Text>
        <Text
         fontSize="20px"
         fontWeight={"400"}
        >
       This exam evaluates your competency through rigorous testing and our certification is accredited by the American Counsel of Training and Development
        </Text>
        </Box>
    </Box>
  )
}
