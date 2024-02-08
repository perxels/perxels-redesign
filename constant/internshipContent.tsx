import React from 'react'
import { Heading } from '@chakra-ui/react'
interface BenefitBoxProps {
  border: string
  width: string
  headText: string
  description: string
  imgSrc: string
}

export interface InternshipCourseProps {
  topic: React.ReactNode
  imageSrc: string
  courseList: string[]
  buttonUrl: string
}

export const BenefitBoxContent: BenefitBoxProps[] = [
  {
    border: 'none',
    width: '40%',
    headText: 'Soft Skill',
    description:
      'Demonstrate your capability to deliver project outcomes at a certain level',
    imgSrc: './assets/images/internship/benefit1.png',
  },
  {
    border: '1px solid #D0D5DD',
    width: '60%',
    headText: 'Presentation',
    description:
      'Demonstrate your capability to deliver project outcomes at a certain level',
    imgSrc: './assets/images/internship/benefit2.png',
  },
  {
    border: '1px solid #98A2B3',
    width: '60%',
    headText: 'Presentation',
    description:
      'Demonstrate your capability to deliver project outcomes at a certain level',
    imgSrc: './assets/images/internship/benefit3.png',
  },
  {
    border: '1px solid #D0D5DD',
    width: '40%',
    headText: 'Presentation',
    description:
      'Demonstrate your capability to deliver project outcomes at a certain level',
    imgSrc: './assets/images/internship/benefit4.png',
  },
]

export const InternshipCourseContent: InternshipCourseProps[] = [
  {
    topic: (
      <Heading fontWeight="400" fontSize={["22px","32px"]} color="#707070">
        I am interested in{' '}
        <Heading as="span" fontWeight="700" fontSize={["22px","32px"]} color="#1A1A1A">
          Data
        </Heading>{' '}
        and{' '}
        <Heading as="span" fontWeight="700" fontSize={["22px","32px"]} color="#1A1A1A">
          Numbers
        </Heading>
      </Heading>
    ),
    imageSrc: './assets/images/internship/course1.png',
    courseList: [
      'Professional Practice',
      'Project Management',
      'Leadership',
      'Communication',
      'Problem Solving',
      'Teamwork',
    ],
    buttonUrl: '/apply',
  },
  {
    topic: (
      <Heading fontWeight="400" color="#707070" fontSize={["22px","32px"]}>
        I am interested in{' '}
        <Heading as="span" fontWeight="700" color="#1A1A1A" fontSize={["22px","32px"]}>
          Design
        </Heading>{' '}
        and{' '}
        <Heading as="span" fontWeight="700" color="#1A1A1A" fontSize={["22px","32px"]}>
          Creative
        </Heading>
      </Heading>
    ),
    imageSrc: './assets/images/internship/course2.png',
    courseList: [
      'Professional Practice',
      'Project Management',
      'Leadership',
      'Communication',
      'Problem Solving',
      'Teamwork',
    ],
    buttonUrl: '/apply',
  },
  
  {
    topic: (
      <Heading fontWeight="400" color="#707070" fontSize={["22px","32px"]}>
        I am interested in{' '}
        <Heading as="span" fontWeight="700" color="#1A1A1A" fontSize={["22px","32px"]}>
          Product Management
        </Heading>{' '}
      </Heading>
    ),
    imageSrc: './assets/images/internship/course3.png',
    courseList: [
      'Professional Practice',
      'Project Management',
      'Leadership',
      'Communication',
      'Problem Solving',
      'Teamwork',
    ],
    buttonUrl: '/apply',
  },
  {
    topic: (
      <Heading fontWeight="400" color="#707070" fontSize={["22px","32px"]}>
        I am interested in{' '}
        <Heading as="span" fontWeight="700" color="#1A1A1A" fontSize={["22px","32px"]}>
          Development
        </Heading>
      </Heading>
    ),
    imageSrc: './assets/images/internship/course4.png',
    courseList: [
      'Professional Practice',
      'Project Management',
      'Leadership',
      'Communication',
      'Problem Solving',
      'Teamwork',
    ],
    buttonUrl: '/apply',
  }
]
