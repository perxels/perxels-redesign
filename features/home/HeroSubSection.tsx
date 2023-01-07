import { SimpleGrid } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { heroData, HeroDataProps } from '../../constant/heroData'
import { MainContainer } from '../../layouts'
import { HeroCard } from './HeroCard'

import gsap from 'gsap'

import ScrollTrigger from 'gsap/dist/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

export const HeroSubSection = ({
  data = heroData,
}: {
  data?: HeroDataProps[]
}) => {
  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.section-grid', {
        opacity: '0',
        y: 200,
        duration: 1,
        delay: 1,
        scrollTrigger: {
          trigger: '.section-grid',
        },
      })
    })

    return () => ctx.revert()
  }, [])
  return (
    <MainContainer>
      <SimpleGrid
        py={['3.75rem', '3.75rem', '7.125rem']}
        columns={[1, 1, 2, 3]}
        spacing={['2.5rem', '2.5rem', '2.5rem', '3.5rem']}
        className="section-grid"
      >
        {data.map(({ title, content, image, color }) => (
          <HeroCard
            key={image}
            color={color}
            title={title}
            content={content}
            image={image}
          />
        ))}
      </SimpleGrid>
    </MainContainer>
  )
}
