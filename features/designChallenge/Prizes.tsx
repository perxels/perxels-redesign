import React, { useEffect } from 'react'
import { Box, Text, Heading, Center, Image } from '@chakra-ui/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
export const Prizes = () => {
  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.prizeGrid', {
        opacity: '0',
        y: 200,
        duration: 1,
        delay: 1,
        scrollTrigger: {
          trigger: '.prizeGrid',
        },
      })
    })

    return () => ctx.revert()
  }, [])
  return (
    <Box py="6.25rem" id="prizes">
      <Box className="prizeGrid">
        <Center>
          <Box
            bg="#E3719C"
            borderRadius={'30px'}
            padding={'1rem 1.5625rem'}
            display="flex"
            columnGap={'1rem'}
            alignItems="center"
          >
            <Image src="/assets/icons/trophy.svg" alt="" />
            <Text fontSize={['.875rem','18px']} fontWeight="700" color="#FFF">
              PRIZES
            </Text>
          </Box>
        </Center>
        <Heading
          textAlign="center"
          fontSize={["2.5rem","3.125rem"]}
          lineHeight={['3.045rem','3.8062rem']}
          color="#000"
          mt={[".5rem","1.25rem"]}
        >
          Lots of amazing prizes to be won!
        </Heading>

        <Box px={["5%","20%"]} mt="3.0625rem">
          <Box
            position="relative"
            bgColor="#E3719C"
            py={["1.5rem","3.75rem"]}
            px="1.875rem"
            rounded=".9375rem"
            mb="1.875rem"
          >
            <Box position="absolute" width={["6.25rem","auto"]} top="0" right="0" height={["7.625rem","18.625rem"]}>
              <Image
                src="/assets/images/designChallenge/prizeBg.png"
                alt="designChallenge"
              />
            </Box>
            <Box
           
            >
              <Image
              boxSize={["2.4375rem", "5rem"]}
                src="/assets/images/designChallenge/gold1.svg"
                alt="designChallenge"
              />
            </Box>
            <Box>
              <Heading
                fontSize={["1.125rem","1.875rem"]}
                fontWeight="700"
                lineHeight={["1.125rem","2.2837rem"]}
                color="brand.white"
                mt={["1.625rem","4.625rem"]}
              >
                First Place - Winner 🎉
              </Heading>
              <Text
                fontSize={[".9375rem","1.875rem"]}
                fontWeight="500"
                lineHeight={["1.3406rem","2.7844rem"]}
                color="brand.white"
                mt={["0.5rem","1.25rem"]}
              >
                Gets 50,000 Naira Cash Prize, and a feature on Perxels
                spotlight.
              </Text>
            </Box>
          </Box>
          <Box display="flex" columnGap={[".75rem","1.875rem"]}>
            <Box
              border="1px solid #D2D2D2"
              rounded=".9375rem"
              px={[".75rem","2.125rem"]}
              py={["1.1875rem","2.5rem"]}
              width={['50%', '50%']}
            >
              <Box
            
              >
                <Image
                  boxSize={["2.5531rem", "6.25rem"]}
                  src="/assets/images/designChallenge/gold2.svg"
                  alt="designChallenge"
                />
              </Box>
              <Heading
                fontSize={["1.25rem","1.875rem"]}
                fontWeight="700"
                lineHeight="2.6812rem"
                color="#000"
                mt={["1.375rem" ,"4.625rem"]}

              >
                Second Place
              </Heading>
              <Text
                fontSize={[".9375rem","1.875rem"]}
                fontWeight="500"
                lineHeight={["1.3925rem","2.7844rem"]}
                color="#555555"
                mt="1.25rem"
              >
                Gets Perxels Swags and a feature on Perxels spotlight.
              </Text>
            </Box>

            <Box
              border="1px solid #D2D2D2"
              rounded=".9375rem"
              px={[".75rem","2.125rem"]}
              py={["1.1875rem","2.5rem"]}
              width={['50%', '50%']}
            >
              <Box>
                <Image
                  boxSize={["2.5531rem", "6.25rem"]}
                  src="/assets/images/designChallenge/gold3.svg"
                  alt="designChallenge"
                />
              </Box>
              <Heading
                  fontSize={["1.25rem","1.875rem"]}
                fontWeight="700"
                lineHeight="2.6812rem"
                color="#000"
                mt={["1.375rem" ,"4.625rem"]}
              >
                Third Place
              </Heading>
              <Text
                 fontSize={[".9375rem","1.875rem"]}
                 fontWeight="500"
                 lineHeight={["1.3925rem","2.7844rem"]}
                color="#555555"
                mt="1.25rem"
              >
                Gets our exclusive Perxels Swags.
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
