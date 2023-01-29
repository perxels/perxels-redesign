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
  mainTitle: '',
  subTitle: 'INTRODUCING STAKEHOLDERS TO ACCESSIBILITY',
  time: '7pm - 8pm (WAT)',
  date: '5th February, 2023',
  location: 'GOOGLE MEET',
  bannerImage: '/assets/images/banner/bannerImage.jpeg',
  description:
    "Are you interested in designing products that are usable and useful for a wide range of users?",
  content1: "Introducing stakeholders to accessibility can help ensure that your product meets legal requirements, has a better user experience, and has a competitive advantage. ",
  content2: "In this session, we will explore the many benefits of accessibility and provide tips on how to effectively introduce stakeholders to the principles of inclusive design. ",
  content3: "Don't miss this opportunity to learn how accessibility can help make your products more successful and improve your company's reputation!",
  content4: "",
  speakerName: 'Victoria Ottah',
  speakerRole: 'Product Designer',
}
