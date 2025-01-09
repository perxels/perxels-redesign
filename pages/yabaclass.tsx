import React from 'react'
import {YabaHero, YabaSpace, StudentJob, ClassPlanYaba, OtherPhysCardLayout, MarqueeComp,  OnlinePhysicalCardData} from '../features/physical'
import {LeaningTools, StudentWorkWrapper} from '../features/classGroup'
import { Testimonial } from '../features/testimonial'
import { MainContainer, MainLayout } from '../layouts'
import { Box, Flex, Image } from '@chakra-ui/react'
import { SectionHeader } from '../components'
import { YabaFeatsContent } from '../constant'
import { YabaFeats } from '../features/yaba/YabaFeatures'
import { ClassDetails } from '../features/classGroup/ClassDetails'
const yaba = () => {
  return (
    <MainLayout>
        <YabaHero title='Welcome to Perxels Yaba: Your Gateway to World-Class UI/UX Design Training' />
        <Box
    py={["3.3rem","6.25rem"]}
    >
        <MainContainer>
        <SectionHeader
        subTitle="Physical Spaces"
        title=""
        paragraph="Are you ready to transform your passion for design into a thriving career?
 At Perxels Yaba Center, we provide industry-leading UI/UX design
training that equips you with the tools, techniques, and mentorship
 you need to excel in today’s competitive tech landscape."
        />

        <Flex
        columnGap="1.25rem"
        flexDir={["column", "row"]}
        rowGap="1.25rem"
        >
            <Box >
            <Image display={["none","block"]}  src={"/assets/images/class-group/YabaSpace1.png"} objectFit="cover" alt="" />
            <Image display={["block","none"]} src={"/assets/images/class-group/YabaSpace1.png"} alt="" />
            </Box>
            <Box >
                <Image src="/assets/images/class-group/YabaSpace2.png" alt=""/>
            </Box>
        </Flex>
        </MainContainer>
    </Box>
        <MarqueeComp/>
        <MainContainer>
             <Box id="pricing" />
             <ClassDetails
               title="Weekend Class"
               id="#"
               classDur="12 Weeks."
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
               enrolRoute="/signup"
               stateLocation="discount"
               isPhysical
               // physicalTuition="₦180,000"
               physicalTuition="₦200,000"
                 // isSponsor
             />
             <Box py=".75rem">
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
                 enrolRoute="/signup"
                 isPhysical
                 // isSponsor
                 stateLocation="discount"
                 // physicalTuition="₦220,000"
                 physicalTuition="₦200,000"
               />
             </Box>
           </MainContainer>
        <YabaFeats/>
        <LeaningTools/>
        {/* <OtherPhysCardLayout cardData={OnlinePhysicalCardData} /> */}
        {/* <StudentWorkWrapper/> */}
        <Testimonial/>
    </MainLayout>
  )
}

export default yaba