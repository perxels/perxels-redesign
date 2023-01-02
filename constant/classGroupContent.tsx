export interface ClassGroupContentProps {
    title: string
    content: string
    image: string
    link?: string
}

export interface ClassGroupDetailsProps {
    title: string
    id: string
    classDur: string
    classTime: string
    classType: string
    installments: string[]
    tuition: string
    courseOutline: string[]
}

export interface StudentWorkProps {
    imgUrl: string
    link: string
}

export const ClassGroupContent: ClassGroupContentProps[] = [
    {
        title: 'Basic Class',
        content: `
            This class is for beginners just starting out in design 
            to learn the fundamentals of UIUX design.
        `,
        link: '/class-plans#basic-class',
        image: '/assets/images/class-group/basic.jpg',
    },
    {
        title: 'Advanced Class',
        content: `
            This class is for intermediate designers looking to expand 
            their UIUX design knowledge & skills.
        `,
        link: '/class-plans#advanced-class',
        image: '/assets/images/class-group/advance.jpg',
    },
    {
        title: 'Premium Class',
        content: `
            This class is for anyone who want to learn everything in 
            UIUX design from basic to professional level.
        `,
        link: '/class-plans#premium-class',
        image: '/assets/images/class-group/premium.jpg',
    },
    {
        title: 'International',
        content: `
            This class is for anyone who wants a special design training 
            to get International design roles.
        `,
        link: '/international',
        image: '/assets/images/class-group/international.jpg',
    },
]

export const classGroupDetails = [
    {
        title: "Basic Class",
        id: 'basic-class',
        classDur: "7 Weeks.",
        classTime: "2-3 times a week.",
        classType: "Live Virtual Training.",
        installments: ["70% On Admission,", "30% after one month."],
        tuition: "₦40,000",
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
            "Certificate of Completion.",
        ]
    },
    {
        title: "Advanced Class",
        id: 'advanced-class',
        classDur: "9 Weeks.",
        classTime: "2-3 times a week.",
        classType: "Live Virtual Training.",
        installments: ["70% On Admission,", "30% after one month."],
        tuition: "₦70,000",
        courseOutline: [
            "For intermediate designers who have experience designing interface design looking to expand their design skills; this class is focus on UX (User Experience) design.",
            "What is UX design: why is it important to users and business. Learn different approaches to design thinking and how you can implement it",
            "User research methods: qualitative & quantitative research, interpreting user feedbacks to designs.",
            "Creating maps: empathy map, customer journey map, experience map, storyboard, service blueprinting: customer actions, backstage actions and frontstage actions etc",
            "Design systems: Style guide, pattern library, creating and maintaining design systems.",
            "Design full websites screens, mobile application screens (of about 40 Screens).",
            "Advanced testing and prototyping.",
            "Create an advanced design portfolio.",
            "Mock Interviews: showcasing your skills.",
            "Certificate of Completion.",
        ]
    },
    {
        title: "Premium Class",
        id: 'premium-class',
        classDur: "9 Weeks.",
        classTime: "2-3 times a week.",
        classType: "Live Virtual Training.",
        installments: ["70% On Admission,", "30% after one month."],
        tuition: "₦200,000",
        courseOutline: [
            "For anyone who wants to learn everything in UIUX design from beginner to professional level.",
            "It includes everything in the Basic and Advanced class curriculum.",
            "Learn how to use PRO design tools like Miro, Notion, Adobe illustrator, Figjam etc",
            "Exposure to design tips and tricks - shortcuts and resources.",
            "Work on complex case studies and projects that will build your problem solving skills",
            "Direct mentorship with a Senior Product Designer.",
            "Learn how to collaborate with developers and product managers.",
            "Certificate of Completion.",
            "Job search support and guidance + job recommendation and placement when available**",
            "6 weeks internship placement after completing the training.",
        ]
    },
]

export const StudentWorks:StudentWorkProps[]  = [
    {
        imgUrl: '/assets/images/class-group/mini-student-work-1.png',
        link: '/student-works/mosope',
    },
    {
        imgUrl: '/assets/images/class-group/mini-student-work-2.jpg',
        link: '/student-works/daniju',
    },
    {
        imgUrl: '/assets/images/sudent-work/rebecca.jpg',
        link: '/student-works/rebecca',
    },
    {
        imgUrl: '/assets/images/sudent-work/favour.jpg',
        link: '/student-works/favour',
    },
]