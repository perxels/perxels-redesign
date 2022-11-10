export interface ClassGroupContentProps {
    title: string
    content: string
    image: string
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