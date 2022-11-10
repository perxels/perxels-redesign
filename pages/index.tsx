import Footer from '../components/Footer'
import Header from '../components/Header'
import { Banner } from '../features/banner'
import { OurClassGroup } from '../features/classGroup'
import { Hero, HeroSubSection } from '../features/home'
import { Portfolio } from '../features/portfolio'
import { Story } from '../features/story'
import { Testimonial } from '../features/testimonial'

export default function Home() {
  return (
    <>
      <Header />
      <Banner/>
      <Hero /> 
      <HeroSubSection />
      <Story/>
      <OurClassGroup />
      <Portfolio />
      <Testimonial />
      <Footer />
    </>
  )
}
