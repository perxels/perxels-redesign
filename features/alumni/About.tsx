import React from 'react'
import { Box, Text, Heading, Button } from '@chakra-ui/react'
import NextLink from 'next/link'
export const About = () => {
  return (
    <Box w="100%" minH="100vh" bgColor="#34296B" px={["7%","10%"]} py="5%">
      {/* container */}
      <Box display={'flex'} margin="0px auto" gap="3em"
      alignItems={'center'} 
      flexDirection={['column', 'column', 'row']}
      >
        {/* date and time */}
        <Box
          display={['none', 'flex']}
          flexDirection={'column'}
          rowGap={'0.8em'}
          alignItems={'center'}
        >
          {/* date */}
          <Box
            bgColor={'#FEDA00'}
            display={'flex'}
            flexDirection={'column'}
            alignItems={'center'}
            justifyContent={'center'}
            p="2.5rem 1.1rem 2.5rem 1.1rem"
            border="3.78218px solid rgba(255, 255, 255, 0.38);"
            boxShadow={'0px 44.3112px 59.5245px rgba(254, 218, 0, 0.24);'}
          >
            <Heading
              fontSize={'4.8rem'}
              color="#363576"
              fontStyle={'normal'}
              fontWeight={'700'}
              lineHeight={'4.8rem'}
            >
              11
            </Heading>
            <Heading
              fontSize={'4.8rem'}
              color="#363576"
              fontStyle={'normal'}
              fontWeight={'700'}
              lineHeight={'4.8rem'}
            >
              &
            </Heading>
            <Heading
             fontSize={'4.8rem'}
             color="#363576"
             fontStyle={'normal'}
             fontWeight={'700'}
             lineHeight={'4.8rem'}
            >12</Heading>
            <Text
            fontSize={"2.1rem"}
            fontWeight={'600'}
             color="#363576"
             lineHeight={'2.1rem'}
            >February</Text>
            <Text
            fontSize={"2.1rem"}
            fontWeight={'600'}
             color="#363576"
             lineHeight={'2.1rem'}
            >2023</Text>
          </Box>
        </Box>

        {/* aboutcontainer */}
        <Box
        // display="flex"
        // flexDirection="column"
        // alignItems={['center', 'center', 'flex-start']}
        >
          <Heading
            fontWeight={'700'}
            fontSize={'2.5rem'}
            color="#fff"
            lineHeight={'120%'}
          >
            ABOUT
          </Heading>
          <Text
            fontWeight={'900'}
            fontSize={'1.5rem'}
            color="#FEDA00"
            lineHeight={'120%'}
            mb="1.5rem"
          >
            THE SESSION
          </Text>

          <Text
            fontSize="1rem"
            color="#ebebeb;"
            fontWeight="400"
            lineHeight="1.4rem"
            pb="1.5rem"
          >
            This is a two day event that aims to guide and impact the alumni students in the following ways: Get ideas to make required adjustments to your portfolio, Learn advanced design techniques, Know what Hiring Managers are looking for in junior designers,Gain knowledge to make adjustments in your Curriculum Vitae (CV), Perform well in job interviews, Learn to scale and mature your design practice and many others.

          </Text>
          <Text
            fontSize="1rem"
            color="#ebebeb;"
            fontWeight="400"
            lineHeight="1.4rem"
            pb="1.5rem"
          >
           The alumni retreat also aims to update the alumnus with recent developments and courses newly added to Perxels curriculum.
          </Text>
            
          <Text
            fontSize="1rem"
            color="#ebebeb;"
            lineHeight="1.4rem"
            pb="1.5rem"
            fontWeight="700"
          >
           Day One Date: Saturday, 11th February, 2023 Time: 1:30pm - 4:30pm <br/>
Day Two Date: Sunday, 12th February, 2023, Time: 7:00 pm - 9:00 pm (WAT). <br/>
Venue: Google Meet.
          </Text>
         

          {/* date */}
          <Box
            display={['flex', 'none']}
            padding={'1.75rem 2.25rem 2rem  2.25rem'}
            gap="2rem"
            flexDirection={'column'}
          >
            <Box bgColor={'#FFFFFF'} padding={'2.5rem 1.1rem'}>
              {/* datecontainer */}
              <Box
                display={'flex'}
                gap="0.53rem"
                alignItems={'center'}
                paddingBottom="0.5rem"
                justifyContent={'center'}
              >
                <Heading fontSize="5rem" fontWeight="900">
                  11
                </Heading>
                <Heading fontSize="5rem" fontWeight="900">
                  &
                </Heading>
                <Heading fontSize="5rem" fontWeight="900">
                  12
                </Heading>
              </Box>
              <Text
                fontSize="2.1rem"
                fontWeight="600"
                color="#363576"
                textAlign={'center'}
                lineHeight="1.8rem"
              >
              February 
                <br />
                2023
              </Text>
            </Box>
            {/* time   */}
            <Box bgColor={'#FFFFFF'}
            display={'flex'}
            flexDirection={'column'}
            alignItems={'center'}
            justifyContent={'center'}
            padding={'3.5rem 2.25rem 3.5rem  2.25rem'}
            >
              <Heading
                fontSize="2.1rem"
                fontWeight="900"
                color="#363576"
                textAlign={'center'}
                lineHeight="1.8rem"
              >
                1:30PM 
              </Heading>
              <Box
                display={'flex'}
                gap="0.53rem"
                // justifyContent={'space-between'}
                alignItems={'center'}
              >
                <Box
                  w="1.094rem"
                  h="0rem"
                  border="1.09603px solid #363576"
                  color="#363576"
                />
                <Heading
                  bgColor="#FFFFFF"
                  fontSize="2.1rem"
                  color="#363576"
                  padding="0.3rem"
                  
                >
                  TO
                </Heading>
                <Box   w="1.094rem"
                  h="0rem"
                  border="1.09603px solid #363576"
                  color="#363576"/>
              </Box>
              <Heading
                fontSize="2.1rem"
                fontWeight="900"
                color="#363576"
                textAlign={'center'}
                lineHeight="1.8rem"
              >
                4:30PM
              </Heading>
            </Box>
          </Box>

            <NextLink href="#register">
          <Button
          padding="1.1rem 4rem"
          borderRadius="50px"
          color="#363576"
          backgroundColor="#FEDA00"
            height="3.5rem"
            w={['100%', '100%', 'auto']}
            
          >REGISTER NOW</Button>
           </NextLink>
        </Box>
       
        {/* time */}
        <Box
          display={['none', 'flex']}
          flexDirection={'column'}
          rowGap="0.8rem"
        //   paddingTop={'17rem'}
        >
          <Box
            bgColor={'#FEDA00'}
            display={'flex'}
            flexDirection={'column'}
            alignItems={'center'}
            justifyContent={'center'}
            p="2.5rem 1.1rem 2.5rem 1.1rem"
            border="3.78218px solid rgba(255, 255, 255, 0.38);"
            boxShadow={'0px 44.3112px 59.5245px rgba(254, 218, 0, 0.24);'}
          >
            <Heading
              fontSize="2.1rem"
              color="#363576"
              fontWeight="900"
              lineHeight="2.9rem"
            >
              1:30PM
            </Heading>
            <Box
            display={'flex'}
            alignItems={'center'}
            gap="0.53rem"
            >
              <Box
                w="1.094rem"
                h="0rem"
                border="1.09603px solid #363576"
                color="#363576"
              />
              <Heading
                bgColor="#FFFFFF"
                fontSize="2.1rem"
                color="#363576"
                padding="0.3rem"
                borderRadius="50%"
              >
                TO
              </Heading>
              <Box
                w="1.094rem"
                h="0rem"
                border="1.09603px solid #363576"
                color="#363576"
              />
            </Box>
            <Heading
              fontSize="2.1rem"
              color="#363576"
              fontWeight="900"
              lineHeight="2.9rem"
            >
              4:30PM
            </Heading>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
