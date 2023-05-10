import React from 'react'
import {Box, Flex} from '@chakra-ui/react'
import { HowCard } from './HowCard'
import { HowForm } from './HowForm'
import {ReferHeader} from './ReferHeader'
export const HowItWorks = () => {
  return (
    <Box py="5%" bg="#F6F4FF">
            <ReferHeader title="ACHIEVEMENTS" subtitle="How It Works" color="#34296B" />
    <Box 
    
    px={["5%","10%"]}
    >


      <Flex
      justifyContent={"space-between"}
      pt="2.375rem"
      flexDir={['column', 'column', 'column', 'row']}
      rowGap="3.25rem"
      >
        <Box
        w={["100%","30%"]}
        display="flex"
        flexDirection="column"
        rowGap="3.25rem"
        >
          <HowCard/>
          <HowCard/>
          <HowCard/>
        </Box>
        <Box>
          <HowForm/>
        </Box>
      </Flex>
    </Box>
    </Box>
  )
}
