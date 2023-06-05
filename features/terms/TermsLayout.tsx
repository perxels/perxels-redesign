import React from 'react'
import {Box, Flex} from '@chakra-ui/react'
import {TermsContent} from './TermsContent'
import { TermsNav } from './TermsNav'
import {TermsHero} from './TermsHero'
export const TermsLayout = () => {
  return (
    <Box
    >
      <TermsHero/>

        <Flex
        px={["5%","10%"]}
        py="10%"
        justifyContent={['center', 'center', 'center', 'space-between', 'space-between']}
        position={"relative"}
        >
          <Box
          width="30%"
          display={['none', 'none', 'none', 'block']}
       
          >
          <TermsNav/>
          </Box>
          <Box  width={["100%","60%"]}>
        <TermsContent/>
        </Box>
        </Flex>
    </Box>
  )
}
