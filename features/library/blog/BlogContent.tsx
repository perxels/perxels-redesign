import React from 'react'
import {Heading, Text, Image, Box} from '@chakra-ui/react'

const BlogContentData = {
    topic: "Designing the Future: Navigating the World of UI/UX with Perxels",
    description:"In an era where digital presence is not just preferred but essential, the demand for skilled User Interface (UI) and User Experience (UX) designers has skyrocketed. Businesses and brands recognize the critical role these designers play in making digital experiences not only usable but delightful. Amidst this backdrop",
    subTopic1: "A Curriculum Rooted in Innovation",
    description1: "At Perxels, the curriculum is meticulously crafted to bridge the gap between theoretical knowledge and practical application. It's not just about learning the latest design tools but understanding the psychology behind user behavior, the principles of effective interface design, and the strategies for crafting seamless user experiences. ",
    subTopic2: "Hands-On Experience from Day One",
    description2: "What sets Perxels apart is its commitment to hands-on learning. From the very beginning, students are immersed in real-world projects, collaborating with businesses and nonprofits to solve genuine design challenges.",
    subTopic3: "A Faculty of Industry Leaders",
    description3: "Learning from those who have been at the forefront of the UI/UX revolution is a unique advantage offered by Perxels. Our faculty consists of seasoned professionals and visionary leaders who bring a wealth of experience and insights into the classroom.",
    description4: "Embark on a journey with us at Perxels, and together, let's design a future that's more intuitive, engaging, and breathtakingly beautiful",
    imgSrc: "/assets/images/library/blogContentImage.png"
}

export const BlogContent = () => {
  return (
    <Box>
        <Box>
            <Image src={BlogContentData.imgSrc} alt="" mb="37px" />
            <Heading fontSize={["25px","35px"]} mb="37px">
                {BlogContentData.topic}
            </Heading>
            <Text  fontSize="20px" color="#434343"  mb="30px">
                {BlogContentData.description}
            </Text>
            <Text  fontSize="20px" color="#434343"  mb="30px" fontWeight="700">
                {BlogContentData.subTopic1} 
            </Text>
            <Text  fontSize="20px" color="#434343" mb="30px">
                {BlogContentData.description1} 
            </Text>
            <Text  fontSize="20px" color="#434343"  mb="30px" fontWeight="700">
                {BlogContentData.subTopic2} 
            </Text>
            <Text  fontSize="20px" color="#434343" mb="30px">
                {BlogContentData.description2} 
            </Text>
            <Text  fontSize="20px" color="#434343"  mb="30px" fontWeight="700">
                {BlogContentData.subTopic3} 
            </Text>
            <Text  fontSize="20px" color="#434343" mb="30px">
                {BlogContentData.description3} 
            </Text>
            <Text  fontSize="20px" color="#434343"  mb="30px">
                {BlogContentData.description4} 
            </Text>
        </Box>
    </Box>
  )
}
