import React from 'react'
import { SectionHeader } from '../../components'
import { MainContainer } from '../../layouts'
import { ClassDetails } from '../classGroup/ClassDetails'

export const ClassPlan = () => {
  return (
    <MainContainer>
      <SectionHeader
        title="It’s everything you’ll ever need."
        subTitle="Class Plan"
      />

      <ClassDetails
        title="International"
        classDur="9 Weeks."
        classTime="2-3 times a week."
        installments={["70% On Admission;", "30% after one month."]}
        tuition="$1,000"
        courseOutline={[
            "In-depth training to guide you from beginner to intermediate level in design",
            "Introduction to UIUX Design; design principles and design thinking process.",
            "Understanding the basic of interface design: typography, colours, layout, balance and alignment, whitespace and iconography.",
            "Introduction to information architecture, visual design, interaction design, usability testing, wireframing and prototyping.",
            "Work on real-life case-studies.",
            "Build- up a standard portfolio.",
            "Mock Interviews: Showcasing your skills.",
            "Accredited Certificate issued at completion.",
            "Exposure to internship and job opportunities"
        ]}
        classType="Live Virtual Training."
      />
    </MainContainer>
  )
}
