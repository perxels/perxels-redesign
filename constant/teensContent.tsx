export interface AboutTeenContentProps {
    id: number;
    title: string;
    description: string;
}

export interface CourseOutlineProps {
    num: string;
    desc: string;
}

export interface AdmissionProcessProps {
    id: number;
    step: string;
    desc: string;
    icon: string;
}

export const aboutTeenContent: AboutTeenContentProps[] = [
    {
        id: 1,
        title: "Intensive Training",
        description: "We equip teens with the core design skills and soft skills to become proficient designers"
    },
    {
        id: 2,
        title: "Intensive Training",
        description: "We equip teens with the core design skills and soft skills to become proficient designers"
    },
    {
        id: 3,
        title: "Intensive Training",
        description: "We equip teens with the core design skills and soft skills to become proficient designers"
    },
    {
        id: 4,
        title: "Intensive Training",
        description: "We equip teens with the core design skills and soft skills to become proficient designers"
    },
]

export const courseOutlines: CourseOutlineProps[] = [
    {
        num: "01",
        desc: `
            We equip teens with the core design skills and soft skills to 
            become proficient designers. We equip teens with the core design 
            skills and soft skills to become proficient designers.
        `
    },
    {
        num: "02",
        desc: `
            We equip teens with the core design skills and soft skills to 
            become proficient designers. We equip teens with the core design 
            skills and soft skills to become proficient designers.
        `
    },
    {
        num: "03",
        desc: `
            We equip teens with the core design skills and soft skills to 
            become proficient designers. We equip teens with the core design 
            skills and soft skills to become proficient designers.
        `
    },
    {
        num: "04",
        desc: `
            We equip teens with the core design skills and soft skills to 
            become proficient designers. We equip teens with the core design 
            skills and soft skills to become proficient designers.
        `
    },
    {
        num: "05",
        desc: `
            We equip teens with the core design skills and soft skills to 
            become proficient designers. We equip teens with the core design 
            skills and soft skills to become proficient designers.
        `
    },
    {
        num: "06",
        desc: `
            We equip teens with the core design skills and soft skills to 
            become proficient designers. We equip teens with the core design 
            skills and soft skills to become proficient designers.
        `
    },
]

export const process: AdmissionProcessProps[] = [
    {
        id: 1,
        step: "step 1",
        desc: "Click on the enroll button to speak with our admission",
        icon: "assets/images/teens/mouse.svg"
    },
    {
        id: 2,
        step: "step 2",
        desc: "Get clarification about the training",
        icon: "assets/images/teens/grid-view.svg"
    },
    {
        id: 3,
        step: "step 3",
        desc: "Make your tuition payment",
        icon: "assets/images/teens/algorithm.svg"
    },
    {
        id: 4,
        step: "step 4",
        desc: "Get onboarded to our learning platform.",
        icon: "assets/images/teens/components.svg"
    },
]