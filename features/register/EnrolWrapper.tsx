import { Box, Link, SimpleGrid } from '@chakra-ui/react'
import gsap from 'gsap'
import React, { useEffect, useRef } from 'react'
import { Logo } from '../../components'
import EnrolForm from './EnrolForm'
import SideImage from './SideImage'
import YabaEnrollForm from './YabaEnrollForm'
import YabaTutorialEnrollForm from './YabaTutorialEnrollForm'
import SponsorshipForm from './SponsorshipForm'

function getEnrollForm({ isYaba, isYabaTutorial, isSponsorship }: { isYaba: boolean; isYabaTutorial: boolean; isSponsorship: boolean }) {
  if (isYaba) return <YabaEnrollForm />
  if (isYabaTutorial) return <YabaTutorialEnrollForm />
  if (isSponsorship) return <SponsorshipForm />
  return <EnrolForm />
}

export const EnrolWrapper = ({isYaba= false, isYabaTutorial = false, isSponsorship = false}:any) => {
  const mainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.enrol-hero', { opacity: 0, y: 500, duration: 1, delay: 0.5 })
      gsap.from('.enrol-form', { opacity: 0, y: -500, duration: 1, delay: 0.5 })
    }, mainRef)

    return () => ctx.revert()
  }, [])

  return (
    <SimpleGrid ref={mainRef} columns={[1, 1, 1, 2]} h="100vh">
      <Box
        as={Link}
        href="/"
        px="1rem"
        py="1rem"
        display={['block', 'block', 'block', 'none']}
      >
        <Logo />
      </Box>
      <SideImage />
      {getEnrollForm({ isYaba, isYabaTutorial, isSponsorship })}
    </SimpleGrid> 
  )
}
