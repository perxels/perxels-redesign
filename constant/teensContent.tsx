import { TestimonialCardProps } from './testimonialContent'
export interface AboutTeenContentProps {
  id: number
  title: string
  description: string
}

export interface CourseOutlineProps {
  num: string
  desc: string
}

export interface AdmissionProcessProps {
  id: number
  step: string
  desc: string
  icon: string
}

export const aboutTeenContent: AboutTeenContentProps[] = [
  {
    id: 1,
    title: 'Intensive',
    description:
      'We equip teens with the core design skills and soft skills to kickstart their design career.',
  },
  {
    id: 2,
    title: 'Intuitive',
    description:
      'We provide an environment that helps teens explore their creativity and push the boundaries of design.',
  },
  {
    id: 3,
    title: 'Interactive',
    description:
      'We have a practical, fun and interactive class for a rich learning experience.',
  },
  {
    id: 4,
    title: 'Impacting',
    description:
      'We ensure that the teens are impacted beyond just design and design tools; they become problem solvers.',
  },
]

export const courseOutlines: CourseOutlineProps[] = [
  {
    num: '01',
    desc: `
        Introduction to UIUX Design; difference between UI and UX design.
        `,
  },
  {
    num: '02',
    desc: `
        Creating designs with Figma; how to use the tool.
        `,
  },
  {
    num: '03',
    desc: `
        Understanding the basics of of UI design: typography, colors, layout, hierarchy, whitespace, icons, balance and alignment.
        `,
  },
  {
    num: '04',
    desc: `
        Learn how to design landing pages and websites.
        `,
  },
  {
    num: '05',
    desc: `
        Learn how to design mobile applications.
        `,
  },
  {
    num: '06',
    desc: `
        Design collaboration and teamwork
        `,
  },
]

export const process: AdmissionProcessProps[] = [
  {
    id: 1,
    step: 'step 1',
    desc: 'Click on the enroll button to speak with our admission',
    icon: 'assets/images/teens/mouse.svg',
  },
  {
    id: 2,
    step: 'step 2',
    desc: 'Get clarification about the training',
    icon: 'assets/images/teens/grid-view.svg',
  },
  {
    id: 3,
    step: 'step 3',
    desc: 'Make your tuition payment',
    icon: 'assets/images/teens/algorithm.svg',
  },
  {
    id: 4,
    step: 'step 4',
    desc: 'Get onboarded to our learning platform.',
    icon: 'assets/images/teens/components.svg',
  },
]

export const teenTestimonial: TestimonialCardProps[] = [
  {
    id: 1,
    imgUrl: '/assets/images/teens/testimonialImage1.png',
    name: 'Pelumi Adekolu',
    title: '13 years old',
    content: `Learning at Perxels was absolutely amazing! I can't even express how much I learned about UI/UX design. The instructors were super cool and patient with us, even when we asked a million questions. This program is very helpful for teens who want to dive into the world of design.`,
  },
  {
    id: 2,
    imgUrl: '/assets/images/teens/testimonialImage2.png',
    name: 'Cynthia Madu',
    title: '16 years old',
    content: `Perxels design training program was a game-changer for me. I had always been interested in design, but this program helped me turn my passion into a skill set. The supportive community and expert guidance made the learning process enjoyable.`,
  },
  {
    id: 2,
    imgUrl: '/assets/images/teens/testimonialImage3.png',
    name: 'Cynthia Madu',
    title: '16 years old',
    content: `I was mind-blown by the training! The classes were well-organized and covered everything from computer basics to user experience design. The practical exercises were so helpful, and I connected with other talented teens who share my design passion.`,
  },
]