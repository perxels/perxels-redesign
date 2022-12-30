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
  nextLink?: string
  prevLink?: string
}

export interface WorkDetails {
  mosope: Work
  daniju: Work
  rebecca: Work
  favour: Work
  tolu: Work
  omame: Work
  abimbola: Work
  zainab: Work
}

export const StudentWorksData: StudentWorksProps[] = [
  {
    id: 1,
    imgUrl: './assets/images/sudent-work/daniju.jpg',
    link: '/student-works/daniju',
  },
  {
    id: 2,
    imgUrl: './assets/images/sudent-work/mosope.jpg',
    link: '/student-works/mosope',
  },
  {
    id: 3,
    imgUrl: './assets/images/sudent-work/rebecca.jpg',
    link: '/student-works/rebecca',
  },
  {
    id: 4,
    imgUrl: './assets/images/sudent-work/favour.jpg',
    link: '/student-works/favour',
  },
  {
    id: 5,
    imgUrl: './assets/images/sudent-work/omame.jpg',
    link: '/student-works/omame',
  },
  {
    id: 6,
    imgUrl: './assets/images/sudent-work/tolu.jpg',
    link: '/student-works/tolu',
  },
  {
    id: 7,
    imgUrl: './assets/images/sudent-work/abimbola.jpg',
    link: '/student-works/abimbola',
  },
  {
    id: 8,
    imgUrl: './assets/images/sudent-work/zainab.jpg',
    link: '/student-works/zainab',
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
    prevLink: '/student-works/daniju',
    nextLink: '/student-works/rebecca',
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
    approach: `<ul style="margin-left: 1rem;">
            <li>Firstly, a proper understanding of the design brief and knowing exactly the method of approach to the solution.</li>
            <li>Secondly, I worked on an information Architecture which is needed to guide me on how to achieve the sketch.</li>
            <li>Then, a sketch was created and moving to the low fidelity, and this brings us to the high fidelity of the design.</li>
        </ul>`,
    nextLink: '/student-works/mosope',
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
      'The high cost of product delivery, the inability to track packages throughout delivery, and the failure to receive items in the same condition as when they were sent are all problems for users.',
    approach:
      'The five design phases were used to approach this problem. User research and user interviews were used to make discoveries, There were clearly defined target audiences for the design. The product was designed with clarity.',
    results:
      'A landing page that allows users to check delivery prices before booking. Provision of a tracking ID to track their product and delivery of goods in the same condition they were sent in.',
    prevLink: '/student-works/mosope',
    nextLink: '/student-works/favour',
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
      'Donation of blood is much more than an intentional act, it takes courage to visit the hospital to make blood donations. Many people have so many myths and fears about blood donation and they prefer not to engage in it.',
    approach:
      'To get the best possible experience for the users, I conducted user interviews, drew out the information architecture and user flows. High attention was paid to the data collected at the interview stage, it served as a guild in the design process.',
    results:
      'In order to make sure the design/prototype was solving the users’ needs, I conducted a usability testing with more than 3 potential users and they loved the experience. I also worked on the issues that the users talked about as regards their experience.',
    prevLink: '/student-works/rebecca',
    nextLink: '/student-works/omame',
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
      'Undergraduates find it challenging to save for long term goals. Reasons for this vary, however extravagant lifestyles, low income, poor budgeting, indiscipline and poor orientation are some of the reasons.',
    approach:
      'I created research questions, this research revealed the pain points of my users. I brainstormed possible solutions which led to designing several features to tackle the challenges faced by undergraduates when it comes to saving.',
    results:
      'It was quite amazing working on this project right from researching to  designing. From this project i learned that all design decision should have the users in mind and offer them a great user experience. I also learned the importance of user research in designs as it helps in identify the pain points of my users.',
    prevLink: '/student-works/omame',
    nextLink: '/student-works/abimbola',
  },
  omame: {
    projectName: 'Savings Application',
    name: 'Omame Otemabore',
    linkedin: {
      link: 'https://www.linkedin.com/in/temabo-omame/',
      name: 'Omame Otemabore',
    },
    heroImg: '/assets/images/class-work/omame/heroImage.png',
    workCover: {
      w1: '/assets/images/class-work/omame/work-cover-1.jpg',
      w2: '/assets/images/class-work/omame/work-cover-2.jpg',
      w3: '/assets/images/class-work/omame/work-cover-3.jpg',
    },
    overview:
      'A saving application for Undergraduates to save money all through the duration of their degree and cash out on the day of their graduation.',
    challenge:
      'Saving money is one of the essential aspects of building wealth and having a financially secure future. Most of the time University students are broke after graduating and can’t start up their own business or support themselves because they do not have savings to fall back to.',
    approach:
      'To understand the challenges Undergraduates face while saving, I used three research methods: Competitive analysis, Qualitative research, Quantitative research.',
    results:
      'Coinbox is an application with which Undergraduates can save money consistently all through the duration of their degree and cash out on the day of their graduation. This money would be used as support fund or even capital for students who want to start their personal business.',
    prevLink: '/student-works/favour',
    nextLink: '/student-works/tolu',
  },
  abimbola: {
    projectName: 'vaccine App AND WEBSITE',
    name: 'Abimbola Alaka',
    linkedin: {
      link: '#',
      name: 'Abimbola Alaka',
    },
    heroImg: '/assets/images/class-work/abimbola/heroImage.png',
    workCover: {
      w1: '/assets/images/class-work/abimbola/work-cover-1.jpg',
      w2: '/assets/images/class-work/abimbola/work-cover-2.jpg',
      w3: '/assets/images/class-work/abimbola/work-cover-3.jpg',
    },
    overview: `
      The Vaccine App is an app that helps users keep track of their medical health. The rise of COVID has brought attention to how essential it is to take care of our health, and the vaccine app offers a solution for keeping track of the important vaccinations you need while also offering additional health advantages.
      <br /> <br />
      The app includes many features, including vaccine appointment reminders, a vaccine tracker that assists parents in keeping track of and reminding them of necessary vaccinations for the development of their infants, and Doc-Chat which enables users to chat with a qualified and certified doctor on the app.
      `,
    challenge:
      `
        Many people lost their lives as a result of the COVID 19 pandemic, this unfortunate incident served as a reminder of how essential our health is and how easily disregarded it can be. I had to design a UI/UX solution to the following challenges: <br /> <br />
        <ol style="margin-left: 1rem;">
          <li>There are several illnesses apart from COVID, that require immunizations and frequent reminders since they are easy to overlook.</li>
          <li>Babies' health requires additional care, which can be overwhelming for parents. They require routine vaccinations to protect them from diseases like polio, measles, and a host of others.</li>
          <li>Humans are naturally mobile and have a tendency to move to new locations, which creates the problem of disjointed medical data which are hard to keep track of.</li>
        </ol>
      `,
    approach:
      `
      People often have a negative perception of the medical world since it is typically associated with illness, diseases, and negative stuff. I mean, who is ever excited to visit the hospital.<br /> <br />
      Here is how I approached the project while keeping this in mind.<br /> <br />

      <ol style="margin-left: 1rem;">
        <li>I interviewed stakeholders to gather insight about what they expected from the project.</li>
        <li>To understand how the medical industry functions, I conducted market research, as well as interviewed medical professionals. After that, I conducted user research to create user personas.</li>
        <li>I generated UX solutions using the insights I had gathered.</li>
        <li>I created the information architecture and simplified the complex medical terms so that the average users could easily understand it.</li>
        <li>I ensured that the user interface and visuals were appealing and encouraging to use.</li>
      </ol>
      `,
    results:
      `
        <ol style="margin-left: 1rem;">
          <li>I designed a visually pleasing User Interface of mobile app and website</li>
          <li>I designed a well-structured User Experience of mobile app and website.</li>
          <li>Vaccine app style guide</li>
          <li>A simple UX writing that broke down the ambiguous medical term.</li>
          <li>UX sketches and wireframe.</li>
        </ol>
      `,
    prevLink: '/student-works/tolu',
    nextLink: '/student-works/zainab',
  },
  zainab: {
    projectName: 'Savings Application',
    name: 'Bakare Zainab',
    linkedin: {
      link: '#',
      name: 'Bakare Zainab',
    },
    heroImg: '/assets/images/class-work/zainab/heroImage.png',
    workCover: {
      w1: '/assets/images/class-work/zainab/work-cover-1.jpg',
      w2: '/assets/images/class-work/zainab/work-cover-2.jpg',
      w3: '/assets/images/class-work/zainab/work-cover-3.jpg',
    },
    overview:
      'This project is targeted at undergraduates. It helps them save money which they are unable to withdraw until few days to graduation or on graduation day. It helps them fulfil  their dream after school or help to works towards it.',
    challenge:
      ' After graduating from university, a lot of student face the challenge of how to establish themselves. Most times, they know what they want but are enable to fund it. University is the best time to save towards it.',
    approach:
      'I did research on how students behavior towards money and why they don’t save most times. I was about to deduce a lot, part of which is lack of knowledge on savings, and lack of discipline with money.',
    results:
      'I designed an app which helps them save for a long period time without withdrawal till graduation day or at least 2 years after saving, There’s also a platform that educates on how to save on my app.',
    prevLink: '/student-works/zainab',
  },
}