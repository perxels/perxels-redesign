import React from 'react'
import {
  Heading,
  Text,
  Image,
  Box,
  List,
  ListItem,
  UnorderedList,
} from '@chakra-ui/react'

export const BlogContentItem = ({ BlogContentData }: any) => {
  return (
    <Box>
      <Box>
        {BlogContentData.map((item: any, i: any) => {
          return item.type === 'image' ? (
            <Image
              key={i}
              width="100%"
              maxH="600px"
              src={item.content}
              objectFit="cover"
              alt="image"
              mb="37px"
            />
          ) : item.type === 'heading' ? (
            <Heading key={i} fontSize={['25px', '35px']} mb="37px">
              {' '}
              {item.content}
            </Heading>
          ) : item.type === 'subheading' ? (
            <Heading key={i} fontSize={['20px', '22px']} my="40px">
              {' '}
              {item.content}
            </Heading>
          ) : item.type === 'list' ? (
            <UnorderedList spacing={4} my="20px">
              {item.content.map((inn: any, i: any) => {
                return (
                  <ListItem fontSize="18px" color="black">
                    {inn}
                  </ListItem>
                )
              })}
            </UnorderedList>
          ) : item.type === 'footer' ? (
            <Text
              key={i}
              fontStyle="italic"
              fontSize="20px"
              color="black"
              mb="20px"
            >
              {item.content}
            </Text>
          ) : (
            <Text key={i} fontSize="20px" color="black" mb="20px">
              {item.content}
            </Text>
          )
        })}
        {/* <Image src={BlogContentData.imgSrc} alt="" mb="37px" />
        <Heading fontSize={['25px', '35px']} mb="37px">
          {BlogContentData.topic}
        </Heading>
        <Text fontSize="20px" color="#434343" mb="30px">
          {BlogContentData.description}
        </Text>
        <Text fontSize="20px" color="#434343" mb="30px" fontWeight="700">
          {BlogContentData.subTopic1}
        </Text>
        <Text fontSize="20px" color="#434343" mb="30px">
          {BlogContentData.description1}
        </Text>
        <Text fontSize="20px" color="#434343" mb="30px" fontWeight="700">
          {BlogContentData.subTopic2}
        </Text>
        <Text fontSize="20px" color="#434343" mb="30px">
          {BlogContentData.description2}
        </Text>
        <Text fontSize="20px" color="#434343" mb="30px" fontWeight="700">
          {BlogContentData.subTopic3}
        </Text>
        <Text fontSize="20px" color="#434343" mb="30px">
          {BlogContentData.description3}
        </Text>
        <Text fontSize="20px" color="#434343" mb="30px">
          {BlogContentData.description4}
        </Text> */}
      </Box>
    </Box>
  )
}
