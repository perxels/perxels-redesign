export interface InstructionProps {
    id: number;
    title: string;
    description: string;
    image: string;
}

export const instructions: InstructionProps[] = [
    {
        id: 1,
        title: "Virtual Learning",
        description: "Perxels is an online training school and all class are fully virtual.",
        image: "./assets/images/sponsorship/virtual-learn.svg"
    },
    {
        id: 2,
        title: "Laptop and Internet",
        description: "A laptop and good internet is required to have a smooth learning experience.",
        image: "./assets/images/sponsorship/laptop-internet.svg"
    },
    {
        id: 3,
        title: "Installmental Payment",
        description: "You can split your payment into two and pay at different installments.",
        image: "./assets/images/sponsorship/virtual-learn.svg"
    },
    {
        id: 4,
        title: "Class Types",
        description: "You can apply for any of Perxels class plans; Basic class, Advanced class & Premium class.",
        image: "./assets/images/sponsorship/laptop-internet.svg"
    },
    {
        id: 5,
        title: "Online Curriculum",
        description: "100 undergraduates will receive 50% scholarship. Applicants are responsible for the other 50%.",
        image: "./assets/images/sponsorship/online-curriculum.svg"
    },
    {
        id: 6,
        title: "Social Interaction",
        description: "Students at Perxels collaborate on projects together.",
        image: "./assets/images/sponsorship/social-interaction.svg"
    },
];