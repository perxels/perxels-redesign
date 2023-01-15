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
  mainTitle: 'DESIGNING FOR EMPATHY:',
  subTitle: 'CREATING PRODUCTS THAT CONNECT WITH THE USERS',
  time: '7pm - 8pm WAT',
  date: '22nd January, 2023.',
  location: 'GOOGLE MEET',
  bannerImage: '/assets/images/banner/bannerImage.jpeg',
  description:
    "Empathy in design refers to the practice of designing products, services, and experiences that take into account the needs, feelings, and perspectives of users. This can involve using user research and user testing to understand the user's context and how they will interact with the product, as well as incorporating principles of universal design to ensure that the product is accessible and usable by people with a wide range of abilities and needs.",
  content1: "One key aspect of empathy in design is the recognition that people have different backgrounds, cultures, and experiences, and that designers need to be mindful of this when creating products. This can involve considering issues of diversity, equity, and inclusion in the design process, as well as ensuring that the product is usable by people with disabilities.",
  content2: "Overall, empathy in design is about creating products that are not only functional and effective, but that also take into account the needs, feelings, and perspectives of the people who will use them. By designing with empathy, designers can create products that are truly useful, usable, and desirable for all users.",
  content3: "",
  content4: "",
  speakerName: 'Aise Idahor',
  speakerRole: 'Creative director',
}
