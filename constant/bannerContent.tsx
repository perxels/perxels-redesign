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
}

export const bannerContent: BannerContent = {
  mainTitle: 'DASHBOARD DESIGN:',
  subTitle: 'THINGS YOU NEED TO KNOW ABOUT',
  time: '7:00 PM',
  date: '10TH SEPTEMBER, 2022.',
  location: 'GOOGLE MEET.',
  bannerImage: '/assets/images/banner/bannerImage.png',
  description:
    'Dashboard design is a frequent request these days as businesses dream about a simple view that presents all information, shows trends and risky areas, and updates users on what happened — a view that will guide them into a bright financial future. Join us as Sebiomo gives us insights into dashboards design.',
  speakerName: 'Sebiomo Anuoluwapo',
  speakerRole: 'Design Lead, Voyance.',
}
