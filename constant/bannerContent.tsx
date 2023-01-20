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
  mainTitle: 'DATA COLLECTION:',
  subTitle: 'AVOIDING COGNITIVE BIAS IN UX RESEARCH',
  time: '7pm - 8pm (WAT)',
  date: '29nd January, 2023',
  location: 'GOOGLE MEET',
  bannerImage: '/assets/images/banner/bannerImage.jpeg',
  description:
    "Cognitive bias refers to the systematic patterns of deviation from norm or rationality in judgment, whereby inferences about other people and situations may be drawn in an illogical fashion. These biases are often a result of the brain's attempt to simplify information processing. Cognitive biases can lead to perceptual distortion, inaccurate judgment, illogical interpretation, or what is broadly called irrationality.",
  content1: "In UX (user experience) research, it is important to try to avoid cognitive bias in order to gather accurate and valuable data. This can be challenging, as the researchers themselves may be subject to cognitive biases. However, there are steps that can be taken to mitigate the impact of cognitive bias in UX research, such as using structured methods and techniques, having a diverse research team, and regularly reviewing and reflecting on one's own biases.",
  content2: "By attending this session, you will learn about the various types of cognitive bias and how they can affect UX research. You will also learn about strategies for avoiding cognitive bias and for ensuring that your UX research is as objective and accurate as possible.",
  content3: "",
  content4: "",
  speakerName: 'Ruqayyah Yaro',
  speakerRole: 'Product Designer, Bujeti',
}
