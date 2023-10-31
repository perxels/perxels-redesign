import { Box } from '@chakra-ui/react'
import React from 'react'
import { SectionHeader } from '../../components'
import { ClassLists } from '../classGroup'
import { MainContainer } from '../../layouts'
import { ClassDetails } from '../classGroup/ClassDetails'

export const ClassPlan = () => {
  return (
    // <Box my="3.625rem">
    //   <SectionHeader
    //     subTitle="Class Plans"
    //     title="Choose from any of these Class Plans."
    //   />
    //   <ClassLists show isSponsor />
    // </Box>
    <MainContainer>
      <Box id="pricing" />
      {/* <SectionHeader
      title="It’s everything you’ll ever need."
      subTitle="Class Plan"
    /> */}

      <ClassDetails
        title="Weekend Class"
        id="#"
        classDur="9 Weeks."
        classTime="2 times a week."
        installments={['70% On Admission;', '30% after one month.']}
        tuition="₦210,000"
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
        address="LEKKI PHASE 1, LAGOS NIGERIA"
        isAddress
        // stateLocation="scholarship"
        enrolRoute="/sponsorship/signup"
        //   isPhysical
        //   isSponsor
      />

      <Box py="3.75rem" >
      <ClassDetails
        title="Weekday Classes"
        id="#"
        classDur="9 Weeks."
        classTime="2-3 times a week."
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
        address="LEKKI PHASE 1, LAGOS NIGERIA"
        isAddress
        // stateLocation="scholarship"
        enrolRoute="/sponsorship/signup"
        //   isPhysical
        //   isSponsor
      />
      </Box>
    </MainContainer>
  )
}
