import { m } from 'framer-motion'

interface BannerContent {
  mainTitle: string
  subTitle: string
  time: string
  date: string
  location: string
  bannerImage: string
  description: string
  speakerName: string
  speakerRole: string
  content1: string
  content2: string
  content3: string
  content4: string

}

export const bannerContent: BannerContent = {
  mainTitle: 'PORTFOLIO REVIEW SESSION:',
  subTitle: 'GETTING READY FOR THE JOB MARKET',
  time: '11am  - 1PM WAT',
  date: '14th January, 2023.',
  location: 'GOOGLE MEET.',
  bannerImage: '/assets/images/banner/bannerImage.png',
  description:
    'The objectives of the Portfolio Review Event is to:',
  content1: "To assess, evaluate and review the design abilities and knowledge of  students through their portfolio.",
  content2: "To provide the students with insights that will help them make necessary changes on their portfolios.",
  content3: "To prepare the students for the labor market.",
  content4: "To give the students  a sense of direction in order to enable them to take the right step in their careers.",
  speakerName: 'Abiodun Fiwa',
  speakerRole: 'Senior Product Designer',
}
