import React from 'react'
import {
  Box,
  Text,
  Heading,
  OrderedList,
  ListItem,
  UnorderedList,
} from '@chakra-ui/react'
import { TermsContentObj, TermsContentProps } from '../../constant'
export const TermsContent = () => {
  return (
    <Box>
      {TermsContentObj.map(
        ({
          termsTitle,
          defermentRequest,
          termsContent1,
          termsContent2,
          termsContent3,
          termsContent4,
          termsContent5,
          termsSubTitle1,
          termsSubTitle2,
          termsList,
          id,
          slug,
        }) => {
          return (
            <>
              <Box />
              <Box key={id}>
                <Heading fontSize={['1.3125rem', '1.875rem']} id={slug}>
                  {termsTitle}
                </Heading>
                <Text
                  fontSize="1rem"
                  lineHeight={['1.5rem', '1.6875rem']}
                  color="#121212"
                  mt={['.9375rem', '1.25rem']}
                >
                  {termsContent1}
                </Text>
                <Text
                  fontSize="1rem"
                  lineHeight={['1.5rem', '1.6875rem']}
                  color="#121212"
                  mt={['.9375rem', '1.25rem']}
                >
                  {termsContent2}
                </Text>
                <Text
                  fontSize="1rem"
                  lineHeight={['1.5rem', '1.6875rem']}
                  color="#121212"
                  mt={['.9375rem', '1.25rem']}
                >
                  {termsContent3}
                </Text>
                <Text
                  fontSize="1.25rem"
                  lineHeight={['1.5rem', '1.6875rem']}
                  fontWeight="700"
                  color="#121212"
                  mt={['.9375rem', '1.25rem']}
                >
                  {termsSubTitle1}
                </Text>
                <OrderedList pl="2rem">
                  {termsList?.map((item, index) => {
                    return (
                      <ListItem
                        fontSize="1rem"
                        color="#121212"
                        lineHeight="1.6875rem"
                        key={index}
                        mb={['.9375rem', '1.25rem']}
                      >
                        {item}
                      </ListItem>
                    )
                  })}
                </OrderedList>
                <Text
                  fontSize="1rem"
                  lineHeight={['1.5rem', '1.6875rem']}
                  color="#121212"
                  mt={['.9375rem', '1.25rem']}
                >
                  {termsContent4}
                </Text>
                <Text
                  fontSize="1.25rem"
                  lineHeight={['1.5rem', '1.6875rem']}
                  fontWeight="700"
                  color="#121212"
                  mt={['.9375rem', '1.25rem']}
                >
                  {termsSubTitle2}
                </Text>
                <OrderedList pl="2rem">
                  {defermentRequest?.map((item, index) => {
                    return (
                      <ListItem
                        fontSize="1rem"
                        color="#121212"
                        lineHeight="1.6875rem"
                        key={index}
                        mb={['.9375rem', '1.25rem']}
                      >
                        {item.type === 'text' ? (
                          item.content
                        ) : (
                          <>
                            <Text
                              fontSize="1rem"
                              color="#121212"
                              lineHeight="1.6875rem"
                              mt={0}
                            >
                              {item.content}
                            </Text>
                            <UnorderedList pl="1rem">
                              {item?.children?.map((text, idx) => {
                                return (
                                  <ListItem
                                    key={idx}
                                    fontSize="1rem"
                                    color="#121212"
                                    lineHeight="1.6875rem"
                                    mb={'.5rem'}
                                  >
                                    {text}
                                  </ListItem>
                                )
                              })}
                            </UnorderedList>
                          </>
                        )}
                      </ListItem>
                    )
                  })}
                </OrderedList>
                <Text
                  fontSize="1rem"
                  lineHeight={['1.5rem', '1.6875rem']}
                  color="#121212"
                  my={['.9375rem', '1.25rem']}
                >
                  {termsContent5}
                </Text>
              </Box>
            </>
          )
        },
      )}
    </Box>
  )
}
