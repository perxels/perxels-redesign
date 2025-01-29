import React, { useEffect }  from 'react'
import {EventCard} from './EventCard'
import {Box, Text, Heading, Image, Center, SimpleGrid, Button, HStack, VStack, Stack} from '@chakra-ui/react'
import { InfoContent,Info2Content } from '../../constant'
import {MainContainer} from '../../layouts'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
export const EventInfo = () => {
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
    <HStack pt='60px' alignItems='flex-start' justifyContent={['center','space-between']} flexWrap='wrap' gap={'50px'}>
          <Image display={['none','block']} src="assets/images/retreat/image2.png" width='430px' h='500px' objectFit='cover' roundedTop='full' objectPosition='center' border='1px solid #34296B' alt="retreat2" />
        <Box w={['90%','60%']}>
            <Heading fontSize={["2rem","55px"]} maxW='600px'  color="#34296B" lineHeight="110%" fontWeight="900"  >
            A retreat to help our Alumnis get Jobs
            </Heading>
            <Text fontSize={["1rem","22px"]} fontWeight="400" w={["100%","70%"]} lineHeight="133%"  mt="1.15rem">
            This retreat aims to empower our alumni with insights into the current job market and effective strategies for securing employment in 2025.
            </Text>
            <HStack mt='30px' flexWrap='wrap' gap='30px'>
                <VStack w={['full','220px']} bg='#FFFCDF' rounded='15px' p='20px'>
                   <Text as='span' textAlign='center' bg='#34296B' w='full' p='5px' color='white' fontSize={["1rem","30px"]} fontWeight='800' textTransform='uppercase'>Day one</Text>

                   <VStack w='full' color='#34296B' mt='10px'  alignItems='flex-start' spacing={0}>
                    <Text as='span' fontWeight='600'>Date</Text>
                    <Text as='span' fontSize='22px' fontWeight='900'>28th Feb, 2025</Text>
                   </VStack>
                   <VStack w='full' color='#34296B'  alignItems='flex-start' spacing={0}>
                    <Text as='span' fontWeight='600'>Time</Text>
                    <Text as='span' fontSize='22px' fontWeight='900'>11:00am</Text>
                   </VStack>
                   <VStack w='full' color='#34296B'  alignItems='flex-start' spacing={0}>
                    <Text as='span' fontWeight='600'>Venue</Text>
                    <Text as='span' fontSize='22px' fontWeight='900'>Yaba</Text>
                   </VStack>
                </VStack>
                <VStack w={['full','220px']} bg='#FCEBFF' rounded='15px' p='20px'>
                   <Text as='span' textAlign='center' bg='#34296B' w='full' p='5px' color='white' fontSize={["1rem","30px"]} fontWeight='800' textTransform='uppercase'>Day two</Text>

                   <VStack w='full' color='#34296B' mt='10px'  alignItems='flex-start' spacing={0}>
                    <Text as='span' fontWeight='600'>Date</Text>
                    <Text as='span' fontSize='22px' fontWeight='900'>1st March, 2025</Text>
                   </VStack>
                   <VStack w='full' color='#34296B'  alignItems='flex-start' spacing={0}>
                    <Text as='span' fontWeight='600'>Time</Text>
                    <Text as='span' fontSize='22px' fontWeight='900'>03:00pm</Text>
                   </VStack>
                   <VStack w='full' color='#34296B'  alignItems='flex-start' spacing={0}>
                    <Text as='span' fontWeight='600'>Venue</Text>
                    <Text as='span' fontSize='22px' fontWeight='900'>Google Meet</Text>
                   </VStack>
                </VStack>
            </HStack>
            <VStack alignItems={['center','flex-start']} justifyContent='center'  mt="2rem" gap='10px' spacing={0}>
            <HStack alignItems='center' w={['full','470px']} gap='20px' justifyContent='center' bg='#FFFCDF' >
            <Text as='span' fontSize='23px' fontWeight='600'>ACCESS FEE:</Text>
            <Text as='span' fontSize='45px' fontWeight='900'>₦10,000</Text>
            </HStack>
            <Button  as='a' href="/retreat/register"  backgroundColor="#34296B" color="#fff" fontSize="1.25rem" fontWeight="700" w={['full','470px']} h="3rem" borderRadius="4px" >
            Register Now
            </Button>
            </VStack>
        </Box>

        {/* <SimpleGrid columns={{sm: 1, md: 2, lg: 3}} spacing="26px" mt="2.625rem" className="section-grid">
                    {
                InfoContent.map((item, index) => (
                    <EventCard
                        key={index}
                        title={item.title}
                        iconSrc={item.iconSrc}
                        content={item.content}
                        fontSize={item.fontSize}
                        bgColor={item.bgColor}
                        marginT={item.marginT}
                    />
                ))
            }
        </SimpleGrid> */}
      {/*  <Heading fontSize={["1.3rem","35px"]} mt="30px" color="#34296B" fontWeight="900" width={["90%","60%"]} >
            Day Two
            </Heading>
        <SimpleGrid columns={{sm: 1, md: 2, lg: 3}} spacing="26px" mt="2.625rem" className="section-grid">
                    {
                Info2Content.map((item, index) => (
                    <EventCard
                        key={index}
                        title={item.title}
                        iconSrc={item.iconSrc}
                        content={item.content}
                        fontSize={item.fontSize}
                        bgColor={item.bgColor}
                        marginT={item.marginT}
                    />
                ))
            }
        </SimpleGrid> */}

     
           
      
    </HStack>
    </MainContainer>
  )
}
