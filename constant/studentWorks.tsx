interface StudentWorksProps {
  id: number
  imgUrl: string
  link: string
}

interface Work {
    projectName: string
    name: string
    linkedin: {
        link: string
        name: string
    }
    twitter?: {
        link: string
        name: string
    }
    behance?: {
        link: string
        name: string
    }
    heroImg: string
    workCover: {
        w1: string
        w2: string
        w3: string
        w4?: string
    }
    overview: string
    challenge: string
    approach: string
    results?: string
}

export interface WorkDetails {
    mosope: Work
    daniju: Work
    rebecca: Work
    favour: Work
    tolu: Work
}

export const StudentWorksData: StudentWorksProps[] = [
  {
    id: 1,
    imgUrl: './assets/images/sudent-work/daniju.jpg',
    link: '/student-works/daniju'
  },
  {
    id: 2,
    imgUrl: './assets/images/sudent-work/mosope.jpg',
    link: '/student-works/mosope'
  },
  {
    id: 3,
    imgUrl: './assets/images/sudent-work/rebecca.jpg',
    link: '/student-works/rebecca'
  },
  {
    id: 4,
    imgUrl: './assets/images/sudent-work/favour.jpg',
    link: '/student-works/favour'
  },
  {
    id: 5,
    imgUrl: './assets/images/sudent-work/tolu.jpg',
    link: '/student-works/tolu'
  },
  {
    id: 6,
    imgUrl: './assets/images/sudent-work/daniju.jpg',
    link: '/student-work/daniju'
  },
  {
    id: 7,
    imgUrl: './assets/images/sudent-work/mosope.jpg',
    link: '/student-works/mosope'
  },
  {
    id: 8,
    imgUrl: './assets/images/sudent-work/rebecca.jpg',
    link: '/student-works/rebecca'
  },
]

export const studentWorkDetails: WorkDetails = {
  mosope: {
    projectName: 'Savings Application',
    name: 'Mosope Aderibigbe',
    linkedin: {
      link: 'https://www.linkedin.com/in/mosopeaderibigbe/',
      name: 'Mosope Aderibigbe',
    },
    twitter: {
      link: 'https://twitter.com/mo_ssope',
      name: '@mo_ssope',
    },
    behance: {
      link: 'https://www.behance.net/mosopeaderibigbe',
      name: 'behance.net/mosopeaderibigbe',
    },
    heroImg: '/assets/images/class-work/mosope/heroImage.png',
    workCover: {
      w1: '/assets/images/class-work/mosope/work-cover-1.jpg',
      w2: '/assets/images/class-work/mosope/work-cover-2.jpg',
      w3: '/assets/images/class-work/mosope/work-cover-3.jpg',
    },
    overview:
      'A Micro-Savings Solution for Undergraduates to Invest and Save for a long-term.',
    challenge:
      "University graduates are almost always stranded after graduating from the university and can't start their entrepreneurship journery because they don't have savings, Saveyy would give them flexible savings plans to help them cultivate a better saving habit.",
    approach:
      'I started out with carrying out a research and Analysing the results, then I created a Brand Identity for the product and the Low-Fi Designs. After all that was done, I designed the High Fidelity mockups and carried out a Usability Testing.',
    results:
      'It was quite amazing working on this project right from researching to  designing. From this project i learned that all design decision should have the users in mind and offer them a great user experience. I also learned the importance of user research in designs as it helps in identify the pain points of my users.',
  },
  daniju: {
    projectName: 'Charity website',
    name: 'Daniju Abdullateef',
    linkedin: {
      link: '#',
      name: 'abdullateef-daniju',
    },
    heroImg: '/assets/images/class-work/daniju/heroImage.png',
    workCover: {
      w1: '/assets/images/class-work/daniju/work-cover-1.jpg',
      w2: '/assets/images/class-work/daniju/work-cover-2.jpg',
      w3: '/assets/images/class-work/daniju/work-cover-3.jpg',
    },
    overview:
      'Hepco is a digital charity organization website strictly to link interested donors to the destitute people in the society (Needy).',
    challenge:
      'People who are ready to donate (extend helping hands towards the needy), but find it difficult to get a proper direction and enough time to achieve this, Hepco is willing to close the gap.',
    approach: `<ul>
            <li>Firstly, a proper understanding of the design brief and knowing exactly the method of approach to the solution.</li>
            <li>Secondly, I worked on an information Architecture which is needed to guide me on how to achieve the sketch.</li>
            <li>Then, a sketch was created and moving to the low fidelity, and this brings us to the high fidelity of the design.</li>
        </ul>`,
  },
  rebecca: {
    projectName: 'Logistics LANDING PAGE',
    name: 'Rebecca Adeyoju',
    linkedin: {
      link: 'https://www.linkedin.com/in/rebecca-adeyoju-b254a2234/',
      name: 'Rebecca Adeyoju',
    },
    heroImg: '/assets/images/class-work/rebecca/heroImage.png',
    workCover: {
      w1: '/assets/images/class-work/rebecca/work-cover-1.jpg',
      w2: '/assets/images/class-work/rebecca/work-cover-2.jpg',
      w3: '/assets/images/class-work/rebecca/work-cover-3.jpg',
    },
    overview:
      'NoExcuse Logistics is a company whose service is to deliver products across the nation while maintaining high standards and integrity at a low cost. It solves the transportation and storage problems of various types of products.',
    challenge:
      "The high cost of product delivery, the inability to track packages throughout delivery, and the failure to receive items in the same condition as when they were sent are all problems for users.",
    approach:
      'The five design phases were used to approach this problem. User research and user interviews were used to make discoveries, There were clearly defined target audiences for the design. The product was designed with clarity.',
    results:
      'A landing page that allows users to check delivery prices before booking. Provision of a tracking ID to track their product and delivery of goods in the same condition they were sent in.',
  },
  favour: {
    projectName: 'Blood Donation Application',
    name: 'Favour Aderemi',
    linkedin: {
      link: '#',
      name: 'Favour Aderemi',
    },
    heroImg: '/assets/images/class-work/favour/heroImage.png',
    workCover: {
      w1: '/assets/images/class-work/favour/work-cover-1.jpg',
      w2: '/assets/images/class-work/favour/work-cover-2.jpg',
      w3: '/assets/images/class-work/favour/work-cover-3.jpg',
      w4: '/assets/images/class-work/favour/work-cover-4.jpg',
    },
    overview:
      'Samaritan is an app that seeks to increase the rate and convenience at which people can make blood donation in Nigeria. Currently, the blood donation numbers in Nigeria are very low. Samaritan seeks to solve this problem.',
    challenge:
      "Donation of blood is much more than an intentional act, it takes courage to visit the hospital to make blood donations. Many people have so many myths and fears about blood donation and they prefer not to engage in it.",
    approach:
      'To get the best possible experience for the users, I conducted user interviews, drew out the information architecture and user flows. High attention was paid to the data collected at the interview stage, it served as a guild in the design process.',
    results:
      'In order to make sure the design/prototype was solving the users’ needs, I conducted a usability testing with more than 3 potential users and they loved the experience. I also worked on the issues that the users talked about as regards their experience.',
  },
  tolu: {
    projectName: 'Savings Application',
    name: 'Tolu Oluyole',
    linkedin: {
      link: 'https://www.linkedin.com/in/oluyole-tolu-89282519b/',
      name: 'Oluyole Tolu',
    },
    heroImg: '/assets/images/class-work/tolu/heroImage.png',
    workCover: {
      w1: '/assets/images/class-work/tolu/work-cover-1.jpg',
      w2: '/assets/images/class-work/tolu/work-cover-2.jpg',
      w3: '/assets/images/class-work/tolu/work-cover-3.jpg',
    },
    overview:
      'Saved Up is  a savings mobile application designed specifically for undergraduates. The application would help undergraduate build a disciplined saving culture for long term goals.',
    challenge:
      "Undergraduates find it challenging to save for long term goals. Reasons for this vary, however extravagant lifestyles, low income, poor budgeting, indiscipline and poor orientation are some of the reasons.",
    approach:
      'I created research questions, this research revealed the pain points of my users. I brainstormed possible solutions which led to designing several features to tackle the challenges faced by undergraduates when it comes to saving.',
    results:
      'It was quite amazing working on this project right from researching to  designing. From this project i learned that all design decision should have the users in mind and offer them a great user experience. I also learned the importance of user research in designs as it helps in identify the pain points of my users.',
  },
}
