import React, { useEffect }  from 'react'
import {Box, Heading, Text, Image, SimpleGrid} from '@chakra-ui/react'
import { MainContainer } from '../../layouts'
import {YabaFeatsContent} from '../../constant'

import gsap from 'gsap'

import ScrollTrigger from 'gsap/dist/ScrollTrigger'
import { HubFeatCard } from '../hub/HubFeatCard'
gsap.registerPlugin(ScrollTrigger)
export const YabaFeats = () => {
    useEffect(() => {
        let ctx = gsap.context(() => {
          gsap.from('.hub-feats-card', {
            opacity: '0',
            y: 200,
            duration: 1,
            delay: 1,
            scrollTrigger: {
              trigger: '.hub-feats-wrapper',
              start: '-900 top',
              end: 'bottom bottom',
            },
            stagger: 1,
          })
        })
    
        return () => ctx.revert()
      }, [])

  return (
    <Box>
        <MainContainer>
        <SimpleGrid py="81px" columns={[1,1,2,3]} spacing="1.5rem" className="hub-feats-wrapper">
            {
                YabaFeatsContent.map((data, index) => (
                    <HubFeatCard
                        key={index}
                        icon={data.icon}
                        title={data.title}
                        description={data.description}
                    />
                ))
            }
        </SimpleGrid>
        </MainContainer>
    </Box>
  )
}
