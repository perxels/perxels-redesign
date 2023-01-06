import {
  Grid,
  GridItem,
  Heading,
  Img,
  SimpleGrid,
  Text,
} from '@chakra-ui/react'
import gsap from 'gsap'
import React, { useEffect } from 'react'
import { MainContainer } from '../../layouts'

interface FundingDataProps {
  title: string
  description: string
  image: string
}

const FundingData: FundingDataProps[] = [
  {
    title: 'Product Design',
    description:
      'Intensive training on user interface user experience design using figma',
    image: '/assets/images/partners/product.svg',
  },
  {
    title: 'Product Management',
    description: 'In-depth coaching on how to become a skilled product manager',
    image: '/assets/images/partners/management.svg',
  },
  {
    title: 'Software Development',
    description:
      'Practical training on different coding languages and how to build tech products',
    image: '/assets/images/partners/development.svg',
  },
  {
    title: 'No-Code Programs',
    description:
      'Exposure to no-code tech skills like UX writing, product marketing, motion design etc',
    image: '/assets/images/partners/no-code.svg',
  },
]

export const Funding = () => {
  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.funding', {
        opacity: '0',
        y: 200,
        duration: 1,
        delay: 1,
        scrollTrigger: {
          trigger: '.funding',
          start: '-900 top',
          end: 'bottom bottom',
        },
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <MainContainer>
      <Grid
        px={['0', '0', '0', '6rem']}
        pt={['4rem', '4rem', '4rem', '0']}
        templateColumns={['100%', '100%', '100%', '400px 1fr']}
        gap="4rem"
        pb={['8rem', '8rem', '8rem', '12rem']}
        className="funding"
      >
        <GridItem>
          <Heading
            fontSize={['7xl', '7xl', '7xl', '8xl']}
            color="brand.dark.200"
            maxW="363px"
          >
            What the funding will enable
          </Heading>
          <Text mt="2rem" color="brand.dark.200">
            Providing tech skills training on uiux design, software development,
            product management and no-code skills
          </Text>
        </GridItem>

        <GridItem>
          <SimpleGrid columns={[1, 1, 1, 2]} gap="3rem">
            {FundingData.map(({ title, description, image }) => (
              <Grid w="full" key={title} templateColumns="3rem 1fr" gap="1rem">
                <GridItem>
                  <Img src={image} alt={title} w="3rem" h="auto" />
                </GridItem>
                <GridItem>
                  <Heading
                    fontSize="2xl"
                    // h="51px"
                    maxW="152px"
                    color="brand.dark.200"
                  >
                    {title}
                  </Heading>
                  <Text
                    maxW="211px"
                    fontSize="lg"
                    mt="10px"
                    color="brand.dark.200"
                  >
                    {description}
                  </Text>
                </GridItem>
              </Grid>
            ))}
          </SimpleGrid>
        </GridItem>
      </Grid>
    </MainContainer>
  )
}
