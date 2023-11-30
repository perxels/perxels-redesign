import React, {useState} from 'react'
import {Box, Center, Text} from '@chakra-ui/react'
import {Info} from './Info'
import {Benefits} from './Benefits'

export const InfoLayout = () => {
  const [tab, setTab] = useState("examInfo")
  return (
    <Box mt="4rem">
      <Center columnGap="1rem"> 
        <Center px={["1.5REM", "1REM"]} h="54px" border={tab === "examInfo" ? ("1px solid #34296B") : "none"} rounded="46px"
        onClick={()=>setTab("examInfo")}
        cursor="pointer" 
        >
          <Text fontSize={["0.8rem", "1.5rem"]} color="#34296B" >
         Exam Information
          </Text>
        </Center>
        <Center cursor="pointer" px={["1.5REM", "1REM"]} h="54px" border={tab === "benefitInfo" ? ("1px solid #34296B") : "none"}  rounded="46px" onClick={()=> setTab("benefitInfo")}>
          <Text fontSize={["0.8rem", "1.5rem"]} color="#34296B" >
          Benefits of Examinations
          </Text>
        </Center>
      </Center>
      <Box>
   {
    tab === "examInfo" ? 
  (
    <Info/>
  )
: (
  <Benefits/>
)
   }
     
      </Box>
    </Box>
  )
}
