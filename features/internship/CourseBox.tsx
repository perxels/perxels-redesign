import React from 'react'
import {
  Box,
  Heading,
  Text,
  Image,
  Button,
  UnorderedList,
  ListItem,
} from '@chakra-ui/react'
import { InternshipCourseProps } from '../../constant/internshipContent'
import { FiArrowUpRight } from "react-icons/fi";

export const CourseBox = ({
  topic,
  imageSrc,
  courseList,
  buttonUrl,
}: InternshipCourseProps) => {
  return (
    <Box bg="#F6F6F6" padding={["24px","54px 42px"]} rounded="16px">
      {topic}
      <Image src={imageSrc} alt="courseImage" width="full" my={["24px","54px"]} />
      <UnorderedList>
        {courseList?.map((course, index) => (
          <ListItem key={index}
          color="#707070" fontSize={["16px","24px"]}
          mb={["16px","24px"]}>{course}</ListItem>
        ))}
      </UnorderedList>
      <Button
        bg="#FFD600"
        color="#1A1A1A"
        fontSize={["16px",'24px']}
        padding="20px 40px"
        fontWeight="500"
        borderRadius="1rem"
        mt={["12px","25px"]}
        as="a"
        href={buttonUrl}
        rightIcon={<FiArrowUpRight                                                                                                                                
        size="24px" color="#1A1A1A" />}
        rounded="42px"
        height={["48px","62px"]}
        width={["full","256px"]}
        >
        Apply Now
      </Button>
    </Box>
  )
}
