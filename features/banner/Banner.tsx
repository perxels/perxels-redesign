import React, { useEffect, useRef } from 'react'
import {
  Box,
  Button,
  Flex,
  Heading,
  Img,
  Text,
  Spacer,
  keyframes,
} from '@chakra-ui/react'
import { RiTimer2Line } from 'react-icons/ri'
import { AiOutlineCalendar } from 'react-icons/ai'
import { IoLocationOutline } from 'react-icons/io5'
import { bannerContent } from '../../constant'
import { MainContainer } from '../../layouts'
import Link from 'next/link'
import gsap from 'gsap'
export const Banner = () => {
  let boxRef = useRef(null)
  const [visibility, setVisibility] = React.useState(false)
  useEffect(() => {
    const timeOut = setTimeout(() => {
      setVisibility(true)
    }, 1000)
    return () => {
      clearTimeout(timeOut)
    }
  })

  const slideUp = keyframes`
    0%{
        transform: translateY(100%);
    }
    100%{
        transform: translateY(0);
    }
  `

  return (
    <Box
      w="100%"
      bg="#34296B"
      display={visibility ? 'block' : 'none'}
      animation={`${slideUp} cubic-bezier(0.25, 0.46, 0.45, 0.94) .5s both`}
    >
      <MainContainer bg="none">
        <Box
          py={['1rem', '1.5rem', '1.5rem']}
          backgroundImage={[
            "url('/assets/images/banner/mobileBannerPattern2.png')",
            "url('/assets/images/banner/bannerPattern2.png')",
          ]}
          backgroundRepeat="no-repeat"
          backgroundSize={['contain', 'contain', 'contain']}
          display={['block', 'block', 'block', 'block']}
        >
          <Flex
            align={['flex-start', 'flex-start', 'center', 'center']}
            justify={'space-between'}
            columnGap={['1rem', '1rem', '1rem', '1rem']}
            flexDirection={['column', 'column', 'row', 'row']}
          >
            <Flex
              columnGap={'6.5rem'}
              flexDirection={['column', 'column', 'row', 'row']}
            >
              <Box boxSize={['8.3125rem']}>
                <Img
                  src={bannerContent.bannerImage}
                  alt="Banner"
                  rounded={'100%'}
                />
              </Box>

              <Box
                display={['block', 'block', 'block', 'block']}
                mt={['1rem', '1rem', '0rem', '0rem']}
              >
                <Heading
                  fontSize={['1.40625rem', '1.4rem', '4xl', '4xl']}
                  fontWeight="700"
                  color="brand.white"
                >
                  {/* AMA SESSION:  */}
                  {bannerContent.mainTitle}
                </Heading>
                <Heading
                  fontSize={['1.40625rem', '1.4rem', '4xl', '4xl']}
                  maxW={["19rem","27.6875rem"]}
                  fontWeight="700"
                  color="brand.white"
                  lineHeight={'110%'}
                >
                  {bannerContent.subTitle}
                </Heading>
                <Flex
                  columnGap={['0.7825rem', '0.7825rem', '1.39rem', '1.39rem']}
                  mt={'0.5rem'}
                >
                  <Box
                    color={'brand.white'}
                    display={'flex'}
                    alignItems={'center'}
                    columnGap={['0.3375rem', '0.5625rem']}
                  >
                    <Text
                      fontSize={[
                        '0.844375rem',
                        '0.844375rem',
                        '1.25rem',
                        '1.25rem',
                      ]}
                      fontWeight={'bold'}
                    >
                      <RiTimer2Line />
                    </Text>
                    <Text
                      fontSize={[
                        '0.608125rem',
                        '0.608125rem',
                        '1.0625',
                        '1.0625rem',
                      ]}
                      fontWeight={'bold'}
                    >
                      {bannerContent.time}
                    </Text>
                  </Box>
                  <Box
                    color={'brand.white'}
                    display={'flex'}
                    alignItems={'center'}
                    columnGap={['0.3375rem', '0.5625rem']}
                  >
                    <Text
                      fontSize={[
                        '0.844375rem',
                        '0.844375rem',
                        '1.25rem',
                        '1.25rem',
                      ]}
                      fontWeight={'bold'}
                    >
                      <AiOutlineCalendar />
                    </Text>
                    <Text
                      fontSize={[
                        '0.608125rem',
                        '0.608125rem',
                        '1.0625',
                        '1.0625rem',
                      ]}
                      fontWeight={'bold'}
                    >
                      {bannerContent.date}
                    </Text>
                  </Box>
                  <Box
                    color={'brand.white'}
                    display={'flex'}
                    alignItems={'center'}
                    columnGap={['0.3375rem', '0.5625rem']}
                  >
                    <Text
                      fontSize={[
                        '0.844375rem',
                        '0.844375rem',
                        '1.25rem',
                        '1.25rem',
                      ]}
                      fontWeight={'bold'}
                    >
                      <IoLocationOutline />
                    </Text>
                    <Text
                      fontSize={[
                        '0.608125rem',
                        '0.608125rem',
                        '1.0625',
                        '1.0625rem',
                      ]}
                      fontWeight={'bold'}
                    >
                      {bannerContent.location}
                    </Text>
                  </Box>
                </Flex>
              </Box>
            </Flex>

            <Box mt={['1rem', '1rem', '0rem', '0rem']}>
              <Link href="/event">
                <Button
                  variant={'link'}
                  fontSize={'1rem'}
                  fontWeight={'700'}
                  color="brand.white"
                  p="0.79375rem 2.125rem"
                  border={'0.086969375rem solid'}
                  _hover={{
                    bg: 'brand.yellow.500',
                    borderColor: 'brand.yellow.500',
                    color: 'brand.purple.500',
                  }}
                >
                  Register Here
                </Button>
              </Link>
            </Box>
          </Flex>
        </Box>
      </MainContainer>
    </Box>
  )
}
