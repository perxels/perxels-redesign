export interface InstructionProps {
  id: number
  title: string
  description: string
  image: string
}

export const instructions: InstructionProps[] = [
  {
    id: 1,
    title: 'Learning Options',
    description:
      'Applicants have the opportunity to choose between the virtual class plans and the physical class plan',
    image: './assets/images/sponsorship/virtual-learn.svg',
  },
  {
    id: 2,
    title: 'Laptop and Internet',
    description:
      'Applicants must have access to a laptop and a good internet connection for the duration of the training.',
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
      'This scholarship caters to the Basic, Premium, and Physical class plans',
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
    title: 'Inclusive Opportunity',
    description: 'Open to applicants from all backgrounds and professions as a gateway to kickstart their journey in UIUX design.',
    image: './assets/images/sponsorship/social-interaction.svg',
  },
]
