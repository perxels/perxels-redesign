import React from 'react'
import { ClassPlan, Instructions, SponsorHero } from '../features/sponsorship'
import { MarqueeComp } from '../features/physical'
import { MainLayout } from '../layouts'
import { TestimonialSch } from '../features/testimonial'
import { Spinner, Text, VStack } from '@chakra-ui/react'
import { useSponsorshipHero } from '../hooks/useSponsorship'
import { IoReload } from 'react-icons/io5'

const sponsorship = () => {
  const {heroData,isLoading,refetchHero} = useSponsorshipHero()

  if(isLoading){
    return  <VStack w="full" h="100vh" alignItems="center" justifyContent="center">
    <Spinner size={['md', 'lg']} />
    <Text as="span">Loading...</Text>
  </VStack>
  }
  if(heroData.length < 1){
    return  <VStack w="full" h="100vh" spacing={0} alignItems="center" justifyContent="center">
    <Text as="span">Something went wrong</Text>
    <Text cursor='pointer' onClick={refetchHero} as="span">click to refresh</Text>
    <IoReload cursor='pointer' onClick={refetchHero}/>
  </VStack>
  }
  return (
    <MainLayout>
      <SponsorHero heroData={heroData} />
      <Instructions heroData={heroData[0]||[]} />
      <MarqueeComp  />
      <ClassPlan  />
      <TestimonialSch />
    </MainLayout>
  )
}

export default sponsorship
