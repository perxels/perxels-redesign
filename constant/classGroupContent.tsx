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
  classType?: string
  installments: string[]
  tuition?: string
  courseOutline: string[]
  isShow?: boolean
  isSponsor?: boolean
  isTab?: boolean
  physicalTuition?: string
  address?: string
  branchAddress?: string
  installmentPhysical?: string[]
  classTimePhysical?: string
  isAddress?: boolean
  stateLocation?: string
  enrolRoute?: any
  isPhysical?: boolean
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
    link: '/enrol#basic-class',
    image: '/assets/images/class-group/basic.jpg',
  },
  {
    title: 'Advanced Class',
    content: `
            This class is for intermediate designers looking to expand 
            their UIUX design knowledge & skills.
        `,
    link: '/enrol#advanced-class',
    image: '/assets/images/class-group/advance.jpg',
  },
  {
    title: 'Premium Class',
    content: `
            This class is for anyone who want to learn everything in 
            UIUX design from basic to professional level.
        `,
    link: '/enrol#premium-class',
    image: '/assets/images/class-group/premium.jpg',
  },
  // {
  //   title: 'International',
  //   content: `
  //       This class is for individuals who desire special design training to get International Design roles.
  //       `,
  //   link: '/international',
  //   image: '/assets/images/class-group/international.jpg',
  // },
  // {
  //   title: 'Private Class',
  //   content: `
  //   One-on-one training and mentorship to build your design skills to solve problems and create delightful products.
  //       `,
  //   link: '/private',
  //   image: '/assets/images/class-group/international.jpg',
  // },
  {
    title: 'Physical Class',
    content: `
    Physical training and mentorship to build your design skills to solve problems and create delightful products.
        `,
    link: '/enrol#physical-class',
    image: '/assets/images/class-group/international.jpg',
  },
]

export const classGroupDetails = [
  {
    title: 'Advanced Class',
    id: 'advanced-class',
    classDur: '9 Weeks.',
    classTime: '2-3 times a week.',
    classType: 'Live Virtual Training.',
    installments: ['70% On Admission,', '30% after one month.'],
    tuition: '₦150,000',
    courseOutline: [
      'For intermediate designers who have experience designing interface design looking to expand their design skills; this class is focused on UX (User Experience) design.',
      'What is UX design: why is it important to users and business. Learn different approaches to design thinking and how you can implement it.',
      'User research methods: qualitative & quantitative research, interpreting user feedbacks to designs.',
      'Creating maps: empathy map, customer journey map, experience map, storyboard, service blueprinting: customer actions, backstage actions and frontstage actions etc.',
      'Design systems: Style guide, pattern library, creating and maintaining design systems.',
      'Design full websites screens, mobile application screens (of about 40 Screens).',
      'Advanced testing and prototyping.',
      'Create an advanced design portfolio.',
      'Mock Interviews: showcasing your skills.',
      'Certificate of Completion.',
    ],
  },
  {
    title: 'Premium Class',
    id: 'premium-class',
    classDur: '3 Months.',
    classTime: '2-3 times a week.',
    classType: 'ONLINE TRAINING.',
    installments: ['70% On Admission,', '30% after one month.'],
    tuition: '₦200,000',
    stateLocation: '',
    courseOutline: [
      'For anyone who wants to learn everything in UIUX design from beginner to professional level.',
      'It includes everything in the Basic and Advanced class curriculum.',
      'Learn how to use PRO design tools like Miro, Notion, Adobe illustrator, Figjam etc',
      'Exposure to design tips and tricks - shortcuts and resources.',
      'Work on complex case studies and projects that will build your problem solving skills.',
      'Direct mentorship with a Senior Product Designer.',
      'Learn how to collaborate with developers and product managers.',
      'Certificate of Completion.',
      'Job search support and guidance + job recommendation and placement when available**',
      '6 weeks internship placement after completing the training.',
    ],
    address: 'Lekki Phase 1, Lagos Nigeria',
    isTab: true,
    installmentPhysical: ['60% on admission', '40% after one month'],
    classTimePhysical: '2 times a week.',
    physicalTuition: '₦200,000',
    branchAddress: 'Ring Road, Ibadan Oyo State',
  },
  {
    title: 'Private Class',
    id: '#',
    classDur: '3 Months.',
    classTime: '2 times a week.',
    classType: 'Live Virtual Training.',
    installments: ['70% On Admission,', '30% after one month.'],
    tuition: '₦500,000',
    stateLocation: '',
    courseOutline: [
      'For anyone who wants to learn everything in UIUX design from beginner to professional level.',
      'It includes everything in the Basic and Advanced class curriculum.',
      'Learn how to use PRO design tools like Miro, Notion, Adobe illustrator, Figjam etc',
      'Exposure to design tips and tricks - shortcuts and resources.',
      'Work on complex case studies and projects that will build your problem solving skills.',
      'Direct mentorship with a Senior Product Designer.',
      'Learn how to collaborate with developers and product managers.',
      'Certificate of Completion.',
      'Job search support and guidance + job recommendation and placement when available**',
      '6 weeks internship placement after completing the training.',
    ],
  },
]

export const StudentWorks: StudentWorkProps[] = [
  {
    imgUrl: '/assets/images/sudent-work/mosope.png',
    link: '/casestudy/mosope',
  },
  {
    imgUrl: '/assets/images/sudent-work/daniju.png',
    link: '/casestudy/daniju',
  },
  {
    imgUrl: '/assets/images/sudent-work/rebecca.png',
    link: '/casestudy/rebecca',
  },
  {
    imgUrl: '/assets/images/sudent-work/favour.png',
    link: '/casestudy/favour',
  },
]
