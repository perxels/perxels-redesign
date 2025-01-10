import { SimpleGrid } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { YabaClassData,YabaClassDataProps } from '../../constant/yabaClassData'
import { MainContainer } from '../../layouts'
import gsap from 'gsap'

import ScrollTrigger from 'gsap/dist/ScrollTrigger'
import { HeroCard } from '../home/HeroCard'
gsap.registerPlugin(ScrollTrigger)

export const YabaSubSection = ({
  data = YabaClassData,
}: {
  data?: YabaClassDataProps[]
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
        py={['2.75rem', '2.75rem', '4rem']}
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
