import React, { useEffect, useRef, useState } from 'react'
import { Flex, HStack, Box, Text, Spacer, Icon, Center } from '@chakra-ui/react'
import { IoGrid, IoLogOutOutline } from 'react-icons/io5'
import { FiPlayCircle } from 'react-icons/fi'
import { BsFiletypePdf } from 'react-icons/bs'
import { IoChatbubblesOutline } from 'react-icons/io5'
import {
  BiChevronLeft,
  BiChevronRight,
  BiMailSend,
  BiMessageSquareDetail,
  BiPhoneCall,
} from 'react-icons/bi'
import { SlGraduation } from 'react-icons/sl'
import { FaWhatsapp } from 'react-icons/fa'
import Link from 'next/link'
import { signOut } from 'firebase/auth'
import { auth } from '../../firebaseConfig'
import { useRouter } from 'next/router'

const SidebarData = [
  // {
  //   title: 'All',
  //   path: '/library',
  //   icon: IoGrid,
  //   // cName: 'nav-text',
  // },
  {
    title: 'Videos',
    path: '/library/videos',
    icon: FiPlayCircle,
    type: 'link',
    // cName: 'nav-text',
  },
  {
    title: 'Ebooks',
    path: '/library/pdf',
    icon: BsFiletypePdf,
    type: 'link',
    // cName: 'nav-text',
  },
  {
    title: 'Testimonials',
    path: '/library/testimonies',
    icon: IoChatbubblesOutline,
    type: 'link',
    // cName: 'nav-text',
  },
  {
    title: 'Blog',
    path: '/library/blog',
    icon: BiMessageSquareDetail,
    type: 'link',
    // cName: 'nav-text',
  },
  {
    title: 'Paid courses',
    path: '/library/courses',
    icon: SlGraduation,
    type: 'link',
    // cName: 'nav-text',
  },
  {
    title: 'Join our community',
    path: 'https://chat.whatsapp.com/IF3mIjoz6jZ4o1Ni6oynwU',
    icon: FaWhatsapp,
    type: 'link',
    // cName: 'nav-text',
  },
  {
    title: 'Give us a call',
    path: '08135369680',
    icon: BiPhoneCall,
    type: 'phone',
    // cName: 'nav-text',
  },
  {
    title: 'Send us a mail',
    path: 'perxels@gmail.com',
    icon: BiMailSend,
    type: 'mail',
    // cName: 'nav-text',
  },
]

const SCROLLBYAMOUNT = 150

export const Sidebar = () => {
  const [currentRoute, setCurrentRoute] = useState('')

  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const scrollRef = useRef<any>(null)

  const router = useRouter()

  //get route
  useEffect(() => {
    setCurrentRoute(window.location.pathname)
  }, [])

  async function logoutUser() {
    try {
      await signOut(auth)
      // Optionally redirect to login or home page
      // window.location.href = "/login";
      router.push('/library/login')
    } catch (error: any) {
      console.error('Error signing out:', error.message)
    }
  }

  const scroll = (direction: string) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -SCROLLBYAMOUNT : SCROLLBYAMOUNT,
        behavior: 'smooth',
      })
    }
  }

  const checkScroll = () => {
    const el = scrollRef.current
    if (el) {
      setCanScrollLeft(el.scrollLeft > 0)
      setCanScrollRight(el.scrollLeft + el.offsetWidth < el.scrollWidth)
    }
  }

  useEffect(() => {
    checkScroll()
    scrollRef.current?.addEventListener('scroll', checkScroll)
    return () => scrollRef.current?.removeEventListener('scroll', checkScroll)
  }, [])

  return (
    <Box
      pr={['1rem', '2rem']}
      height="100%"
      py={['10%', '0']}
      borderRight={['none', '1px solid rgba(26, 26, 26, 0.10)']}
    >
      <Box mb={['32px', '72px']}>
        <Text
          fontSize="18px"
          fontWeight="400"
          color="#1A1A1A"
          mb="12px"
          textAlign={['center', 'left']}
        >
          GET STARTED
        </Text>
        <Text
          fontSize={['1.7rem', '1.5rem']}
          color={'#34296B'}
          fontWeight={['600', '400']}
          textAlign={['center', 'left']}
          lineHeight={1.3}
        >
          Dive into the various resources we have for you
        </Text>
      </Box>

      <Box pos="relative" w="full">
        {canScrollLeft && (
          <Center
            w={'3rem'}
            h={'3rem'}
            pos="absolute"
            top="50%"
            left={-4}
            transform="translateY(-50%)"
            bg="linear-gradient(-270deg, #FFFFFF 44.57%, rgba(255, 255, 255, 0) 95.05%)"
            zIndex={5}
            onClick={() => scroll("left")}
          >
            <BiChevronLeft size={32} />
          </Center>
        )}
        <Flex
          flexDir={['row', 'column']}
          rowGap="32px"
          columnGap={'17px'}
          mb="32px"
          mt={['28px', '42px']}
          overflowY={['scroll', 'visible']}
          overflowX="auto"
          width="100%"
          pos="relative"
          borderTop={['none', '1px solid rgba(26, 26, 26, 0.10)']}
          sx={{
            '@media (max-width: 768px)': {
              '-webkit-overflow-scrolling': 'touch', // For smooth scrolling on mobile
              '&::-webkit-scrollbar': {
                display: 'none', // Hide scrollbar for Webkit browsers (Chrome, Safari)
              },
              '-ms-overflow-style': 'none', // Hide scrollbar for Internet Explorer and Edge
              'scrollbar-width': 'none', // Hide scrollbar for Firefox
            },
          }}
          ref={scrollRef}
          scrollBehavior="smooth"
        >
          {SidebarData.map((item, index) => {
            if (item.type === 'phone')
              return (
                <HStack
                  key={index}
                  spacing={['0px', '20px']}
                  as={Link}
                  href={`tel:${item.path}`}
                  cursor="pointer"
                  _hover={{
                    color:
                      `${currentRoute}` === `${item.path}`
                        ? 'white'
                        : '#34296B',
                  }}
                  backgroundColor={
                    `${currentRoute}` === `${item.path}`
                      ? '#34296B'
                      : ['#F8F8F8', '#FFF']
                  }
                  color={`${currentRoute}` === item.path ? '#FFF' : '#888888'}
                  p={['8px 16px', '12px']}
                  transition="ease-in-out 0.3s"
                  borderRadius={['66px', '8px']}
                  sx={{
                    '@media (max-width: 768px)': {
                      '&:hover': {
                        borderRadius: '66px',
                      },
                    },
                  }}
                  border={['1px solid #ECECEC', 'none']}
                  minWidth={['fit-content']}
                  display={['inline-flex']}
                  flexWrap="wrap"
                  alignItems="center"
                >
                  <Icon
                    display={['none', 'block']}
                    fontSize={['16px', '20px']}
                    as={item.icon}
                  />
                  <Text fontSize={['16px', '20px']}>{item.title}</Text>
                </HStack>
              )
            if (item.type === 'mail')
              return (
                <HStack
                  key={index}
                  spacing={['0px', '20px']}
                  as={Link}
                  href={`mailto:${item.path}`}
                  cursor="pointer"
                  _hover={{
                    color:
                      `${currentRoute}` === `${item.path}`
                        ? 'white'
                        : '#34296B',
                  }}
                  backgroundColor={
                    `${currentRoute}` === `${item.path}`
                      ? '#34296B'
                      : ['#F8F8F8', '#FFF']
                  }
                  color={`${currentRoute}` === item.path ? '#FFF' : '#888888'}
                  p={['8px 16px', '12px']}
                  transition="ease-in-out 0.3s"
                  borderRadius={['66px', '8px']}
                  sx={{
                    '@media (max-width: 768px)': {
                      '&:hover': {
                        borderRadius: '66px',
                      },
                    },
                  }}
                  border={['1px solid #ECECEC', 'none']}
                  minWidth={['fit-content']}
                  display={['inline-flex']}
                  flexWrap="wrap"
                  alignItems="center"
                >
                  <Icon
                    display={['none', 'block']}
                    fontSize={['16px', '20px']}
                    as={item.icon}
                  />
                  <Text fontSize={['16px', '20px']}>{item.title}</Text>
                </HStack>
              )
            return (
              <HStack
                key={index}
                spacing={['0px', '20px']}
                as={Link}
                href={item.path}
                cursor="pointer"
                _hover={{
                  color:
                    `${currentRoute}` === `${item.path}` ? 'white' : '#34296B',
                }}
                backgroundColor={
                  `${currentRoute}` === `${item.path}`
                    ? '#34296B'
                    : ['#F8F8F8', '#FFF']
                }
                color={`${currentRoute}` === item.path ? '#FFF' : '#888888'}
                p={['8px 16px', '12px']}
                transition="ease-in-out 0.3s"
                borderRadius={['66px', '8px']}
                sx={{
                  '@media (max-width: 768px)': {
                    '&:hover': {
                      borderRadius: '66px',
                    },
                  },
                }}
                border={['1px solid #ECECEC', 'none']}
                minWidth={['fit-content']}
                display={['inline-flex']}
                flexWrap="wrap"
                alignItems="center"
              >
                <Icon
                  display={['none', 'block']}
                  fontSize={['16px', '20px']}
                  as={item.icon}
                />
                <Text fontSize={['16px', '20px']}>{item.title}</Text>
              </HStack>
            )
          })}

          <HStack
            spacing={['0px', '20px']}
            cursor="pointer"
            p={['8px 16px', '12px']}
            color="red"
            _hover={{
              color: 'red',
            }}
            onClick={logoutUser}
          >
            <Icon
              display={['none', 'block']}
              fontSize={['16px', '20px']}
              as={IoLogOutOutline}
            />

            <Text fontSize={['16px', '20px']}>Logout</Text>
          </HStack>
        </Flex>

        {canScrollRight && (
          <Center
            w={'3rem'}
            h={'3rem'}
            pos="absolute"
            top="50%"
            right={-8}
            transform="translateY(-50%)"
            bg="linear-gradient(270deg, #FFFFFF 44.57%, rgba(255, 255, 255, 0) 95.05%)"
            onClick={() => scroll("right")}
          >
            <BiChevronRight size={32} />
          </Center>
        )}
      </Box>
    </Box>
  )
}
