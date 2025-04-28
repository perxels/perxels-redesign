import React from 'react'

import { YabaHero, MarqueeComp } from '../features/physical'
import { LeaningTools } from '../features/classGroup'
import { Testimonial } from '../features/testimonial'
import { MainContainer, MainLayout } from '../layouts'
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Image,
  Text,
  VStack,
} from '@chakra-ui/react'
import { SectionHeader } from '../components'
import { YabaFeats } from '../features/yaba/YabaFeatures'
import { ClassDetails } from '../features/classGroup/ClassDetails'
import { YabaSubSection } from '../features/yaba/YabaSubSection'
import Head from 'next/head'
import Script from 'next/script'

const Tutorial = () => {
  return (
    <>
      <Script
        id="facebook-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window,document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '309688088029898'); 
            fbq('track', 'PageView');
          `,
        }}
      />
      {/* NoScript Fallback */}
      <noscript
        dangerouslySetInnerHTML={{
          __html: `
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          alt=""
          src="https://www.facebook.com/tr?id=309688088029898&ev=PageView&noscript=1"
        />
        `,
        }}
      />

      {/* LinkedIn Tracking Script */}
      <Script
        id="linkedin-partner-id"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            _linkedin_partner_id = "7932145";
            window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
            window._linkedin_data_partner_ids.push(_linkedin_partner_id);
          `,
        }}
      />
      <Script
        id="linkedin-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(l) {
              if (!l) {
                window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
                window.lintrk.q = [];
              }
              var s = document.getElementsByTagName("script")[0];
              var b = document.createElement("script");
              b.type = "text/javascript";
              b.async = true;
              b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
              s.parentNode.insertBefore(b, s);
            })(window.lintrk);
          `,
        }}
      />
      {/* NoScript Fallback */}
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          alt=""
          src="https://px.ads.linkedin.com/collect/?pid=7932145&fmt=gif"
        />
      </noscript>

      <MainLayout>
        <YabaHero title="Welcome to Perxels Yaba: Your Gateway to World-Class UI/UX Design Training" />

        <Box py={['3.3rem', '6.25rem']}>
          <MainContainer>
            <SectionHeader
              subTitle="Physical Spaces"
              title=""
              paragraph="Are you ready to transform your passion for design into a thriving career? At Perxels Yaba Center, we provide industry-leading UI/UX design training that equips you with the tools, techniques, and mentorship you need to excel in today’s competitive tech landscape."
            />

            <Flex
              columnGap="1.25rem"
              flexDir={['column', 'row']}
              rowGap="1.25rem"
            >
              <Box>
                <Image
                  display={['none', 'block']}
                  src={'/assets/images/class-group/YabaSpace1.png'}
                  objectFit="cover"
                  alt=""
                />
                <Image
                  display={['block', 'none']}
                  src={'/assets/images/class-group/YabaSpace1.png'}
                  alt=""
                />
              </Box>
              <Box>
                <Image src="/assets/images/class-group/YabaSpace2.png" alt="" />
              </Box>
            </Flex>
          </MainContainer>
        </Box>

        <MarqueeComp />

        <VStack alignItems="center" w="full" pb="7rem">
          <Heading
            color={'brand.purple.500'}
            textAlign="center"
            fontSize={['2rem', '2rem', '7xl']}
            maxW={'auto'}
            m="0 auto"
            mb="1rem"
            mt="1.25rem"
          >
            Why Choose Perxels Yaba Center?
          </Heading>
          <YabaSubSection />
          <Button
            h="3.75rem"
            w="12.75rem"
            fontSize="xl"
            bg="brand.purple.500"
            color="white"
            as="a"
            href="/yabatraining/signup"
            _hover={{ bg: 'brand.yellow.500', color: 'brand.purple.500' }}
            variant="outline"
            borderColor="brand.white"
          >
            Enroll Now
          </Button>
        </VStack>

        <MainContainer>
          <Box id="pricing" />
          <ClassDetails
            title="Standard Training"
            isTitleSmall
            id="#"
            classDur="6 WEEKS"
            classTime="WEEKEND OR WEEKDAY"
            installments={['₦50,000 On Admission;', '₦20,000 after 4 weeks.']}
            tuition=""
            courseOutline={[
              'For beginners to learn the fundamentals of design; focus is majorly on UI (User Interface) design.',
              'What is UI design - difference between UI and UX design.',
              'Practical principle of UI design: typography, colours, layout, hierarchy, whitespace, icons, balance and alignment.',
              'Wireframes: creating standard low fidelity and high fidelity wireframes.',
              'Interpreting customer briefs and converting it to great designs.',
              'Learn how to design landing pages, mobile apps and dashboard screens.',
              'Work on real-life case studies and create a design portfolio.',
              'Mock interviews: showcasing your skills.',
              'Certificate of Completion.'
            ]}
            classType="Physical Class"
            address="4th Floor of Cashcraft Building, 270 MURITALA MUHAMMED WAY, ALAGOMEJI, Yaba."
            isAddress
            // stateLocation="scholarship"
            enrolRoute="/yabaclass/signup"
            stateLocation="discount"
            isPhysical
            // physicalTuition="₦180,000"
            physicalTuition="₦70,000"
            // isSponsor
          />
          {/* <Box py=".75rem">
            <ClassDetails
              title="Weekday Class"
              id="#"
              classDur="3 Months"
              classTime="2 times a week."
              installments={['50% On Admission;', '50% after 4 weeks.']}
              tuition=""
              courseOutline={[
                ' For anyone who wants to learn everything in UIUX design from beginner to professional level.',
                'It includes everything in the Basic and Advanced class curriculum.',
                'Learn how to use PRO design tools like Miro, Notion, Adobe illustrator, Figjam etc',
                'Exposure to design tips and tricks - shortcuts and resources.',
                'Work on complex case studies and projects that will build your problem solving skills',
                'Direct mentorship with a Senior Product Designer.',
                'Learn how to collaborate with developers and product managers.',
                'Certificate of Completion.',
                'Job search support and guidance + job recommendation and placement when available**',
                '6 weeks internship placement after completing the training.',
              ]}
              classType="Physical Training"
              address="4th Floor of Cashcraft Building, 270 MURITALA MUHAMMED WAY, ALAGOMEJI, Yaba."
              isAddress
              // stateLocation="scholarship"
              enrolRoute="/yabaclass/signup"
              isPhysical
              // isSponsor
              stateLocation="discount"
              // physicalTuition="₦220,000"
              physicalTuition="₦200,000"
            />
          </Box> */}
        </MainContainer>
        <YabaFeats />
        <LeaningTools />

        <Testimonial />
        <VStack alignItems="center" w="full" pb="7rem">
          <VStack maxW="600px">
            <Heading
              color={'brand.purple.500'}
              textAlign="center"
              fontSize={['2rem', '2rem', '5xl']}
              maxW={'auto'}
              m="0 auto"
              mb="1rem"
              mt="1.25rem"
            >
              Limited Slots Available - <br /> Enroll Today!
            </Heading>
            <Text as="p" pb="1.5rem" fontWeight="semibold">
              Ready to take the next step?
            </Text>
            <HStack
              alignItems="center"
              justifyContent="center"
              w="full"
              gap="30px"
              flexWrap="wrap"
            >
              <Button
                h="3.75rem"
                w="12.75rem"
                fontSize="xl"
                bg="brand.purple.500"
                color="white"
                as="a"
                href="/yabaclass/signup"
                variant="outline"
                borderColor="brand.white"
              >
                Sign up
              </Button>
              <Button
                h="3.75rem"
                w="12.75rem"
                fontSize="xl"
                bg="brand.yellow.500"
                color="brand.purple.500"
                as="a"
                _hover={{ bg: 'brand.yellow.500', color: 'brand.purple.500' }}
                href="https://wa.me/+2347079807449"
                target="_blank"
                variant="outline"
                borderColor="brand.white"
              >
                Chat with rep
              </Button>
            </HStack>
          </VStack>
        </VStack>
      </MainLayout>
    </>
  )
}

export default Tutorial
