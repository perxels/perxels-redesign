import { Box, Center, Icon, Img, Text } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'
import { AiOutlineLink } from 'react-icons/ai'

interface CaseStudyProps {
  imgUrl: string
  link: string
}

const StudentCaseStudy = ({ imgUrl, link }: CaseStudyProps) => {
  const [isHover, setIsHover] = React.useState(false)
  return (
    <Box
      as={Link}
      href={link}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      pos="relative"
      rounded="6px"
      className='students-card'
    >
      <Img rounded="6px" w="full" h="auto" src={imgUrl} alt="student" />
      {isHover && (
        <Center
          pos="absolute"
          top="0"
          left="0"
          w="full"
          h="full"
          bg="brand.overlay.300"
        >
          <Icon as={AiOutlineLink} fontSize="2rem" color="brand.white" />
          <Text fontSize="2xl" color="brand.white">
            View Case Study
          </Text>
        </Center>
      )}
    </Box>
  )
}

export default StudentCaseStudy
