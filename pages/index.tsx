import { Banner } from '../features/banner'
import { OurClassGroup } from '../features/classGroup'
import { Hero, HeroSubSection } from '../features/home'
import { Portfolio } from '../features/portfolio'
import { Story } from '../features/story'
import { Testimonial } from '../features/testimonial'
import { MainLayout } from '../layouts'

export default function Home() {
  return (
    <MainLayout>
      {/* <Banner/> */}
      <Hero />
      <HeroSubSection />
      <Story />
      <OurClassGroup />
      <Portfolio />
      <Testimonial />
    </MainLayout>
  )
}
