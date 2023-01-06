import React from 'react'
import { SectionHeader } from '../../components'
import { MainContainer } from '../../layouts'
import { ClassDetails } from '../classGroup/ClassDetails'
import {Box} from '@chakra-ui/react'
export const ClassPlan = () => {
  return (
    <MainContainer>
      <Box 
      id="pricing"
      />
      <SectionHeader
        title="It’s everything you’ll ever need."
        subTitle="Class Plan"
      />

      <ClassDetails
        title="International"
        id="#"
        classDur="3 MONTH."
        classTime="2-3 times a week."
        installments={["70% On Admission;", "30% after one month."]}
        tuition="$500"
        courseOutline={[
            "Exclusive design coaching to get international design roles",
            "Personalized training to suit your unique needs",
            "Understanding UI and UX design",
            "Principle of UI design: typography, colors, layout, hierarchy, whitespace, icons, balance and alignment",
            "Wireframes: creating standard low fidelity an high fidelity wireframes",
            "Concept of drawing, sketching and mockups",
            "UX design: why is it important to users and business",
            "Design thinking and processes",
            "Creating user personas, user flow and carrying out usability test",
            "Creating maps: empathy map, customer journey map, experience map, storyboard, service blueprinting: customer actions, backstage actions and frontstage actions etc",
            "Design systems: Style guide, pattern library, creating and maintaining design systems",
            "Flows: User flows, data flows, information architecture, product feature flows",
            "Learn how to use PRO design tools like Miro, Notion, Adobe illustrator, Figjam etc",
            "Work on case studies and projects that will build your problem solving skills",
            "Direct mentorship with a Senior Product Designer",
            "Learn how to collaborate with developers and product managers",
            "Mock Interviews: showcasing your skills",
            "Certificate of Completion",
        ]}
        classType="Live Virtual Training."
      />
    </MainContainer>
  )
}
