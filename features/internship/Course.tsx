import React from 'react'
import {Box, Heading, Text, Image, Button, SimpleGrid} from '@chakra-ui/react'
import {CourseBox} from './CourseBox'
import {InternshipCourseContent} from '../../constant/internshipContent'
import {MainContainer} from '../../layouts'
export const Course = () => {
  return (
  <MainContainer bg="#FFF">
    <Box py="10%">
        <Heading textAlign="center" fontSize={["32px","54px"]}>Courses we offer</Heading>
        <SimpleGrid columns={[1, 2, 2, 2]} spacing="40px" mt={["28px","50px"]}>
            {
                InternshipCourseContent.map((course, index) => (
                    <CourseBox
                        key={index}
                        topic={course.topic}
                        imageSrc={course.imageSrc}
                        courseList={course.courseList}
                        buttonUrl={course.buttonUrl}
                    />
                ))
            }
        </SimpleGrid>
    </Box>
  </MainContainer>
  )
}
