export interface MotionProcessInterface {
    title: string;
    description: string;
    image: string;
}

export interface MotionAdmission{
    id: number
    step: string
    desc: string
    icon: string 
}

export const MotionAdmissionProcess: MotionAdmission[] = [
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

export const MotionProcessContent: MotionProcessInterface[] = [
    {
        title: "Learning Model",
        description: "With experienced motion designers, you get to learn the knowledge, skills, and real-world experience of motion design.",
        image: "assets/images/motion/wave.gif"
    },
    {
        title: "Access Content & Materials",
        description: "Access to a wide range of resources would boost your learning and aid in preparing you for your career ahead",
        image: "assets/images/motion/book.gif"
    },
    {
        title: "Portfolio Building",
        description: "Get to have hands on case studies to showcase your creative personal projects to build a portfolio while learning motion design",
        image: "assets/images/motion/screen.gif"
    }
] 