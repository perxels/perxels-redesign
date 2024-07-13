import React from 'react'
import { Heading, Text, Image, Box } from '@chakra-ui/react'

export const BlogContent = ({ BlogContentData }: any) => {
  return (
    <Box>
      <Box>
        {BlogContentData.map((item: any, i: any) => {
          return item.type === 'image' ? (
            <Image key={i} src={item.content} alt="" mb="37px" />
          ) : item.type === 'heading' ? (
            <Heading key={i} fontSize={['25px', '35px']} mb="37px">
              {' '}
              {item.content}
            </Heading>
          ) : (
            <Text key={i} fontSize="20px" color="#434343" mb="30px">
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
