import { Box, Grid, Heading, Img, SimpleGrid, Text } from '@chakra-ui/react'
import gsap from 'gsap'
import React, { useEffect } from 'react'
import { MainContainer } from '../../layouts'

export const OurWhy = () => {
  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.our-why', {
        opacity: '0',
        y: 200,
        duration: 1,
        delay: 1,
        scrollTrigger: {
          trigger: '.our-why',
          start: '-900 top',
          end: 'bottom bottom',
        },
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <Box className='our-why'
    // mb={['10rem', '10rem', '1rem', '-10%']}
    >
      <MainContainer noMobilePadding>
        <Heading className='our-why-title' fontSize="7xl" color="brand.dark.200">
          Our Why?
        </Heading>

        <SimpleGrid
          columns={[1, 1, 1, 2]}
          w={['100%', '100%', '100%', '108%']}
          gap="3rem"
        >
          <Grid
            templateColumns={['100%', '100%', '100%', '2rem 1fr']}
            gap="1rem"
            px={['1.5rem', '1.5rem', '1.5rem', '0']}
            pl={['1.5rem', '1.5rem', '1.5rem', '1.5rem']}
            py="1rem"
            pb={['1rem', '1rem', '1rem', '24rem']}
          >
            <Heading
              display={['none', 'none', 'none', 'block']}
              fontSize="9xl"
              color="brand.purple.500"
            >
              1
            </Heading>
            <Text color="brand.dark.200" pt="3.5rem">
              According to the International Finance Corporation (IFC), a member
              of the World Bank Group, “57 million jobs will require digital
              skills by 2030 in sub saharan Africa alone” Meanwhile, “Africa has
              the youngest population in the world with more than 400 million
              young people aged between the ages of 15 to 35 years.” (Source:
              African Union) <br /> <br />
              The development of Africa today and in the future is in the hands
              of the youth. <br /> <br />
              We want to lay a strong foundation that we believe will impact
              millions of youths across Africa over the years to come.
            </Text>
          </Grid>
          <Grid
            bg="brand.purple.500"
            templateColumns={['100%', '100%', '100%', '2rem 1fr']}
            gap="2rem"
            px="1.5rem"
            py="1rem"
            pb={['1rem', '1rem', '1rem', '24rem']}
          >
            <Heading
              display={['none', 'none', 'none', 'block']}
              fontSize="9xl"
              color="brand.yellow.500"
            >
              2
            </Heading>
            <Box>
              <Text
                color="brand.white"
                py={['3.5rem', '3.5rem', '3.5rem', '3.5rem']}
                maxW="500px"
              >
                We want to raise funds to equip 100,000 youth with digital
                skills every year for the next 7 years (2023 - 2030); we want to
                help young people across Africa get access to practical hands-on
                digital skill training over the next 7 years.
                <br /> <br />
                We know big results come from a combination of many small
                actions, so we are focused on the small actions today that will
                lead to the big results we want tomorrow.
                <br /> <br />
                Your small contribution in an African youth today will lead to
                the development of the Africa of our dreams tomorrow
              </Text>
            </Box>
          </Grid>
        </SimpleGrid>

        <Box
          mt={['0rem', '2rem', '2rem', '0']}
          pos={['static', 'static', 'static', 'relative']}
          h={['200px', '200px', '200px', '445px']}
          w="full"
          top="-24rem"
          left="0"
          mb={['5rem', '5rem', '0', '0']}
        >
          <Img
            objectFit="cover"
            w="full"
            h="full"
            src="/assets/images/partners/ourWhy.jpg"
          />
        </Box>
      </MainContainer>
    </Box>
  )
}
