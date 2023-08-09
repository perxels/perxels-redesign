import React from 'react'
import { SectionHeader } from '../../components'
import { MainContainer } from '../../layouts'
import { ClassDetails } from '../classGroup/ClassDetails'
import { Box } from '@chakra-ui/react'
export const ClassPlan = () => {
  return (
    <MainContainer>
      <Box id="pricing" />
      <SectionHeader
        title="It’s everything you’ll ever need."
        subTitle="Class Plan"
      />

      <ClassDetails
        title="Private Class"
        id="#"
        classDur="3 Months."
        classTime="2 times a week."
        installments={['70% On Admission;', '30% after one month.']}
        tuition="₦300,000"
        courseOutline={[
          'For anyone who wants to learn everything in UIUX design from beginner to professional level.',
          'It includes everything in the Basic and Advanced class curriculum.',
          'Learn how to use PRO design tools like Miro, Notion, Adobe illustrator, Figjam etc',
          'Exposure to design tips and tricks - shortcuts and resources.',
          'Work on complex case studies and projects that will build your problem solving skills.',
          'Direct mentorship with a Senior Product Designer.',
          'Learn how to collaborate with developers and product managers.',
          'Certificate of Completion.',
          'Job search support and guidance + job recommendation and placement when available**',
          '6 weeks internship placement after completing the training.',
        ]}
        classType="Live Virtual Training."
      />
    </MainContainer>
  )
}
