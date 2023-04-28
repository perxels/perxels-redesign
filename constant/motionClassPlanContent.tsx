export interface MotionPlanInterface {
    title: string
    id: string
    classDur: string
    classTime: string
    classType: string
    installments: string[]
    tuition: string
    courseOutline: string[]
}

export const MotionPlan: MotionPlanInterface[] = [
    {
        title: 'Motion Class',
        id: 'motion-class',
        classDur: '8 Weeks.',
        classTime: '2 times a week.',
        classType: 'Live Virtual Training.',
        installments: [
            "70% On Admission;",
           "30% after one month."
        ],
        tuition: '₦70,000',
        courseOutline: [
            "Fundamental path into Motion design how to move from being a newbie into an intermediate/expert in the motion design.",
            "What motion design entails and the impact in fintech brands, companies and other related industry that uses it for growth.",
            "Deep dive into the tool used in creating motion design, Adobe Illustrator, After Effect, Adobe Media Encoder.",
            "The process of creating an epic motion design from mind mapping, mood-boarding, storyboarding, style-frame design, Design board and animation.",
            "Proper explanation of animation terms and its usage.",
            "Creating UI animations for mobile and website.",
            "What is explainer motion design and how it can be created",
            "Work on real life motion design across different use case.",
            "Mock interviews: showcasing your skills.",
            "Certificate of Completion."

        ]
    }
]