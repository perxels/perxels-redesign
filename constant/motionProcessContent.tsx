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
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        image: "assets/images/motion/wave.gif"
    },
    {
        title: "Access Content & Materials",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        image: "assets/images/motion/book.gif"
    },
    {
        title: "Portfolio Building",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        image: "assets/images/motion/screen.gif"
    }
] 