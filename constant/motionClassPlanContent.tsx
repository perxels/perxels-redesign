export interface MotionPlanInterface {
    title: string
    id: string
    classDur: string
    classTime: string
    installments: string[]
    tuition: string
    courseOutline: string[]
}

export const MotionPlan: MotionPlanInterface[] = [
    {
        title: 'Motion Class',
        id: 'motion-class',
        classDur: '7 Weeks.',
        classTime: '2-3 times a week.',
        installments: [
            "70% On Admission;",
           "30% after one month."
        ],
        tuition: '₦40,000',
        courseOutline: [
            "For beginners to learn the fundamentals of design; focus is majorly on UI (User Interface) design.",
            "What is UI design - difference between UI and UX design.",
            "Practical principle of UI design: typography, colours, layout, hierarchy, whitespace, icons, balance and alignment.",
            "Wireframes: creating standard low fidelity and high fidelity wireframes.",
            "Concept of drawing, sketching and mockups.",
            "Interpreting customer briefs and converting it to great designs.",
            "Learn how to design landing pages, mobile apps and dashboard screens.",
            "Work on real-life case studies and create a design portfolio.",
            "Mock interviews: showcasing your skills.",
            "Certificate of Completion."

        ]
    }
]