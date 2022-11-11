export interface ClassGroupContentProps {
    title: string
    content: string
    image: string
}

export interface ClassGroupDetailsProps {
    title: string
    classDur: string
    classTime: string
    classType: string
    installments: string[]
    tuition: string
    courseOutline: string[]
}

export const ClassGroupContent: ClassGroupContentProps[] = [
    {
        title: 'Basic Class',
        content: `
            This class is for understanding the basic of interface design: 
            typography, colours, layout, balance and alignment, whitespace 
            and iconography.
        `,
        image: '/assets/images/class-group/basic.jpg',
    },
    {
        title: 'Advanced Class',
        content: `
            This class is an In-depth training on the core of UIUX design: 
            information architecture, visual design, interaction design, 
            usability testing, wireframing and prototyping.
        `,
        image: '/assets/images/class-group/advance.jpg',
    },
    {
        title: 'Premium Class',
        content: `
            Proper application of design principles and design thinking process 
            in real-life cases to improve your problem-solving skills.
        `,
        image: '/assets/images/class-group/premium.jpg',
    },
    {
        title: 'International',
        content: `
            Proper application of design principles and design thinking process 
            in real life cases to improve your problem solving skills.
        `,
        image: '/assets/images/class-group/international.jpg',
    },
]

export const classGroupDetails = [
    {
        title: "Basic Class",
        classDur: "9 Weeks.",
        classTime: "2-3 times a week.",
        classType: "Live Virtual Training.",
        installments: ["70% On Admission,", "30% after one month."],
        tuition: "₦40,000",
        courseOutline: [
            "For beginners and those transitioning into UIUX design field.",
            "Introduction to UIUX Design; design principles and design thinking process.",
            "Understanding the basic of interface design: typography, colours, layout, balance and alignment, whitespace and iconography.",
            "Introduction to information architecture, visual design, interaction design, usability testing, wireframing and prototyping.",
            "Work on real-life case-studies.",
            "Build- up a standard portfolio.",
            "Mock Interviews: Showcasing your skills.",
            "Accredited Certificate issued at completion.",
            "Exposure to internship and job opportunities",
        ]
    },
    {
        title: "Advanced Class",
        classDur: "9 Weeks.",
        classTime: "2-3 times a week.",
        classType: "Live Virtual Training.",
        installments: ["70% On Admission,", "30% after one month."],
        tuition: "₦40,000",
        courseOutline: [
            "For Intermediate designers in the design industry looking to expand their knowledge and scale up their skill",
            "In-depth training on the core of UIUX design: information architecture, visual design, interaction design, usability testing, wireframing and prototyping.",
            "Proper application of design principles and design thinking process in real-life cases to improve your problem-solving skills.",
            "User experience design: conducting user research, creating user personas, writing user stories and creating user flow.",
            "Work on real-life case-studies.",
            "Build- up a standard portfolio.",
            "Mock Interviews: Showcasing your skills.",
            "Accredited Certificate issued at completion.",
            "Exposure to internship and job opportunities",
        ]
    },
    {
        title: "Premium Class",
        classDur: "9 Weeks.",
        classTime: "2-3 times a week.",
        classType: "Live Virtual Training.",
        installments: ["70% On Admission,", "30% after one month."],
        tuition: "₦300,000",
        courseOutline: [
            "For beginners and those transitioning into UIUX design field.",
            "Introduction to UIUX Design; design principles and design thinking process.",
            "Understanding the basic of interface design: typography, colours, layout, balance and alignment, whitespace and iconography.",
            "Introduction to information architecture, visual design, interaction design, usability testing, wireframing and prototyping.",
            "Work on real-life case-studies.",
            "Build- up a standard portfolio.",
            "Mock Interviews: Showcasing your skills.",
            "Accredited Certificate issued at completion.",
            "Exposure to internship and job opportunities",
        ]
    },
    {
        title: "International",
        classDur: "9 Weeks.",
        classTime: "2-3 times a week.",
        classType: "Live Virtual Training.",
        installments: ["70% On Admission,", "30% after one month."],
        tuition: "$1,000",
        courseOutline: [
            "In-depth training to guide you from beginner to intermediate level in design",
            "Introduction to UIUX Design; design principles and design thinking process.",
            "Understanding the basic of interface design: typography, colours, layout, balance and alignment, whitespace and iconography.",
            "Introduction to information architecture, visual design, interaction design, usability testing, wireframing and prototyping.",
            "Work on real-life case-studies.",
            "Build- up a standard portfolio.",
            "Mock Interviews: Showcasing your skills.",
            "Accredited Certificate issued at completion.",
            "Exposure to internship and job opportunities",
        ]
    },
]