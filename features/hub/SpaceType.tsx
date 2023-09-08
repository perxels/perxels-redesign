import React, { useEffect }  from 'react'
import {Box, Flex, Heading, Text, Spacer, Button, SimpleGrid} from '@chakra-ui/react'
import {SectionHeader} from '../../components'
import {MainContainer} from '../../layouts'
import {SpaceCard} from './SpaceCard'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

const SpaceTypeData = [
    {
        bgImage: "/assets/images/hub/spaceType1.png",
        spaceTypeName: "Work Station",
        spaceTypeIcon: "/assets/images/hub/spaceTypeIcon1.svg",
        spaceTypeDescription: "Ideal for freelancers, remote workers, creators, designers, writers, and developers seeking an environment conducive to accomplishing their tasks.",
        spaceTypePrice: "₦1,500",
        link: "/hub#bookspace", 
    },
    {
        bgImage: "/assets/images/hub/spaceType2.png",
        spaceTypeName: "Boardroom",
        spaceTypeIcon: "/assets/images/hub/spaceTypeIcon2.svg",
        spaceTypeDescription: "Tailored for CEOs and executive personnel, providing an ideal setting for board meetings and strategic growth deliberations.",
        spaceTypePrice: "₦10,000",
        link: "/hub#bookspace", 
    }
]

export const SpaceType = () => {
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
    <Box>
        <MainContainer>
            <Box px="5%" id="workspace">
            <SectionHeader
                subTitle="Types of space we offer"
                title="Choose a space that suits your needs"
            />
            </Box>
            <SimpleGrid  className="section-grid" columns={[1, 1, 2, 2]} spacing={["1.25rem","1.875rem"]} px="0" py="2rem">
                {
                    SpaceTypeData.map((data, index) => (
                        <SpaceCard
                            key={index}
                            bgImage={data.bgImage}
                            spaceTypeName={data.spaceTypeName}
                            spaceTypeIcon={data.spaceTypeIcon}
                            spaceTypeDescription={data.spaceTypeDescription}
                            spaceTypePrice={data.spaceTypePrice}
                            link={data.link}
                        />
                    ))
                }
            </SimpleGrid>
        </MainContainer>
    </Box>
  )
}
