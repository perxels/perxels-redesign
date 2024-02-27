import { Box } from '@chakra-ui/react'
import React from 'react'
import { SectionHeader } from '../../components'
import { ClassLists } from '../classGroup'
import { MainContainer } from '../../layouts'
import { ClassDetails } from '../classGroup/ClassDetails'

interface classInt{
  isApply ?:boolean
}

export const  ClassPlan = ({isApply}: classInt) => {
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
    <SectionHeader
      title="It’s everything you’ll ever need."
      subTitle="Class Plan"
    />

    <ClassDetails
      title="Basic Class"
      id="#"
      classDur="7 Weeks."
      classTime="2 times a week."
      installments={['70% On Admission;', '30% after one month.']}
      tuition="₦50,000"
      physicalTuition="₦40,000"
      courseOutline={[
        'For women who is starting out in UIUX design and want to elevate from beginner to professional level',
        'What is UI design - difference between UI and UX design.',
        'Practical principle of UI design: typography, colours, layout, hierarchy, whitespace, icons, balance and alignment.',
        'Wireframes: creating standard low fidelity and high fidelity wireframes.',
        'Concept of drawing, sketching and mockups.',
        'Interpreting customer briefs and converting it to great designs.',
        'Learn how to design landing pages, mobile apps and dashboard screens.',
        'Work on real-life case studies and create a design portfolio.',
        'Mock interviews: showcasing your skills.',
        'Certificate of Completion.',
      ]}
      classType= "Live Virtual Training."

      stateLocation="discount"
      enrolRoute={isApply === true ? '/apply/signup' :'/sponsorship/signup'}
      // isPhysical
      isSponsor
    />

<Box mt="60px" />

<ClassDetails
      title="Premium Class"
      id="#"
      classDur="3 months."
      classTime="2 times a week."
      installments={['70% On Admission;', '30% after one month.']}
      tuition="₦200,000"
      physicalTuition="₦150,000"
      courseOutline={[
        'For women who is starting out in UIUX design and want to elevate from beginner to professional level',
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
      classType= "Live Virtual Training."
      stateLocation="discount"
      enrolRoute={isApply ? '/apply/signup' :'/sponsorship/signup'}
      // isPhysical
      isSponsor
    />
<Box mt="60px" />
      <ClassDetails
      title="Physical Class"
      id="#"
      classDur="3 Months."
      classTime="2 times a week."
      installments={['70% On Admission;', '30% after one month.']}
      tuition="₦250,000"
      physicalTuition="₦200,000"
      courseOutline={[
        'For women who is starting out in UIUX design and want to elevate from beginner to professional level',
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
      classType= "Physical Training"
      address= "LEKKI, IBADAN, ABUJA"
      isAddress
      stateLocation="discount"
      enrolRoute={isApply ? '/apply/signup' :'/sponsorship/signup'}
      isPhysical
      isSponsor
    />
    <Box mt="60px" />
  </MainContainer>
  )
}
