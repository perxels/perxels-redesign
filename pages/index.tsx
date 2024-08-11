import { Banner } from '../features/banner'
import { OurClassGroup } from '../features/classGroup'
import { Hero, HeroSubSection } from '../features/home'
import { Portfolio } from '../features/portfolio'
import { Story } from '../features/story'
import { Testimonial } from '../features/testimonial'
import { useActiveBanner } from '../hooks/useActiveBanner'
import { MainLayout } from '../layouts'

export default function Home() {
  const { banner } = useActiveBanner()

  return (
    <MainLayout>
      {banner && <Banner data={banner} />}
      <Hero />
      <HeroSubSection />
      <OurClassGroup />
      <Story />
      <Portfolio />
      <Testimonial />
    </MainLayout>
  )
}
