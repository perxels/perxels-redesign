import { Box } from '@chakra-ui/react'
import React from 'react'
import { SectionHeader } from '../../components'
import { ClassLists } from '../classGroup'
import { MainContainer } from '../../layouts'
import { ClassDetails } from '../classGroup/ClassDetails'

export const ClassPlanAbj = () => {
  return (
    <MainContainer>
    <Box  id="pricing" />
    <Box py=".75rem" >
    <ClassDetails
      title="Premium Class"
      id="#"
      classDur="3 Months"
      classTime="2 times a week."
      installments={['70% On Admission;', '30% after one month.']}
      tuition="₦250,000"
      courseOutline={[
        ' For anyone who wants to learn everything in UIUX design from beginner to professional level.',
        'It includes everything in the Basic and Advanced class curriculum.',
        'Learn how to use PRO design tools like Miro, Notion, Adobe illustrator, Figjam etc',
        'Exposure to design tips and tricks - shortcuts and resources.',
        'Work on complex case studies and projects that will build your problem solving skills',
        'Direct mentorship with a Senior Product Designer.',
        'Learn how to collaborate with developers and product managers.',
        'Certificate of Completion.',
        'Job search support and guidance + job recommendation and placement when available**',
        '6 weeks internship placement after completing the training.',
      ]}
      classType="Physical Training"
      address="WUSE II, ABUJA"
      isAddress
      // stateLocation="scholarship"
      enrolRoute="/signup"
      isPhysical
      // isSponsor
      stateLocation="discount"
      physicalTuition='₦200,000'
    />
    </Box>
    </MainContainer>
  )
}
