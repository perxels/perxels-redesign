export interface InstructionProps {
  id: number
  title: string
  description: string
  image: string
}

export const instructions: InstructionProps[] = [
  {
    id: 1,
    title: 'Physical Learning',
    description:
      'Applicants must be available to attend physical training at Ringroad Ibadan, every sunday 2PM TO 5PM',
    image: './assets/images/sponsorship/virtual-learn.svg',
  },
  {
    id: 2,
    title: 'Laptop and Internet',
    description:
      'Applicants must have laptop to use for the seven weeks training',
    image: './assets/images/sponsorship/laptop-internet.svg',
  },
  // {
  //   id: 3,
  //   title: 'Installmental Payment',
  //   description:
  //     'You can split your payment into two and pay at different installments.',
  //   image: './assets/images/sponsorship/virtual-learn.svg',
  // },
  {
    id: 4,
    title: 'Class Types',
    description:
      'This scholarship covers for only basic plan which is 7weeks training',
    image: './assets/images/sponsorship/laptop-internet.svg',
  },
  // {
  //   id: 5,
  //   title: 'Online Curriculum',
  //   description:
  //     'A carefully designed curriculum to guide you through the required design  principles.',
  //   image: './assets/images/sponsorship/online-curriculum.svg',
  // },
  {
    id: 6,
    title: 'Social Interaction',
    description: 'Students at Perxels collaborate on projects together.',
    image: './assets/images/sponsorship/social-interaction.svg',
  },
]
