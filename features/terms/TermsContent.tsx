import React from 'react'
import {Box, Text, Heading, OrderedList, ListItem} from '@chakra-ui/react'
import { TermsContentObj, TermsContentProps } from '../../constant'
export const TermsContent = () => {
  return (
    <Box>
        {
            TermsContentObj.map(({termsTitle, termsContent1, termsContent2, termsContent3, termsSubTitle1, termsList, id, slug}) => {
                return (
                    <>
                    <Box  />
                    <Box key={id} >
                        <Heading
                        fontSize={["1.3125rem","1.875rem"]}
                        id={slug}>{termsTitle}</Heading>
                        <Text fontSize="1rem" lineHeight={["1.5rem","1.6875rem"]} color="#121212" mt={[".9375rem","1.25rem"]}>{termsContent1}</Text>
                        <Text fontSize="1rem" lineHeight={["1.5rem","1.6875rem"]} color="#121212" mt={[".9375rem","1.25rem"]}>{termsContent2}</Text>
                        <Text fontSize="1rem" lineHeight={["1.5rem","1.6875rem"]} color="#121212" mt={[".9375rem","1.25rem"]}>{termsContent3}</Text>
                        <Text fontSize="1.25rem" lineHeight={["1.5rem","1.6875rem"]} fontWeight="700" color="#121212" mt={[".9375rem","1.25rem"]}>{termsSubTitle1}</Text>
                        <OrderedList
                        pl="2rem"
                        >
                            {
                                termsList?.map((item, index) => {
                                    return (
                                        <ListItem fontSize="1rem" color="#121212" lineHeight="1.6875rem" key={index} mb={[".9375rem","1.25rem"]}>{item}</ListItem>
                                    )
                                })
                            }
                        </OrderedList>
                    </Box>
                    </>
                )
            })
        }
    </Box>
  )
}
