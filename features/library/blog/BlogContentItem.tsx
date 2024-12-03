import React from 'react'
import { Box } from '@chakra-ui/react'
import './blogcontent.module.css'

export const BlogContentItem = ({ blog }: any) => {
  return (
    <Box >
      <div className='blog_content' dangerouslySetInnerHTML={{ __html: blog }} />
    </Box>
  )
}




// {BlogContentData.map((item: any, i: any) => {
//   return item.type === 'image' ? (
//     <Image
//       key={i}
//       width="100%"
//       maxH="600px"
//       src={item.content}
//       objectFit="cover"
//       alt="image"
//       mb="37px"
//     />
//   ) : item.type === 'heading' ? (
//     <Heading key={i} fontSize={['25px', '35px']} mb="37px">
//       {' '}
//       {item.content}
//     </Heading>
//   ) : item.type === 'subheading' ? (
//     <Heading key={i} fontSize={['20px', '22px']} my="40px">
//       {' '}
//       {item.content}
//     </Heading>
//   ) : item.type === 'list' ? (
//     <UnorderedList spacing={4} my="20px">
//       {item.content.map((inn: any, i: any) => {
//         return (
//           <ListItem fontSize="18px" color="black">
//             {inn}
//           </ListItem>
//         )
//       })}
//     </UnorderedList>
//   ) : item.type === 'footer' ? (
//     <Text
//       key={i}
//       fontStyle="italic"
//       fontSize="20px"
//       color="black"
//       mb="20px"
//     >
//       {item.content}
//     </Text>
//   ) : (
//     <Text key={i} fontSize="20px" color="black" mb="20px">
//       {item.content}
//     </Text>
//   )
// })}