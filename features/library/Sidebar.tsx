import React, { useEffect, useState } from 'react'
import { Flex, HStack, Box, Text, Spacer, Icon } from '@chakra-ui/react'
import { IoGrid } from 'react-icons/io5'
import { FiPlayCircle } from 'react-icons/fi'
import { BsFiletypePdf } from 'react-icons/bs'
import { IoChatbubblesOutline } from 'react-icons/io5'
import { BiMessageSquareDetail } from 'react-icons/bi'
import { SlGraduation } from 'react-icons/sl'
import { FaWhatsapp } from 'react-icons/fa'
import Link from 'next/link'
const SidebarData = [
  {
    title: 'All',
    path: '/library',
    icon: IoGrid,
    // cName: 'nav-text',
  },
  {
    title: 'Videos',
    path: '/library/videos',
    icon: FiPlayCircle,
    // cName: 'nav-text',
  },
  {
    title: 'PDF',
    path: '/library/pdf',
    icon: BsFiletypePdf,
    // cName: 'nav-text',
  },
  {
    title: 'Testimonials',
    path: '/library/testimonies',
    icon: IoChatbubblesOutline,
    // cName: 'nav-text',
  },
  {
    title: 'Blog',
    path: '/library/blog',
    icon: BiMessageSquareDetail,
    // cName: 'nav-text',
  },
  {
    title: 'Paid courses',
    path: '/library/courses',
    icon: SlGraduation,
    // cName: 'nav-text',
  },
  {
    title: 'Join our community',
    path: '/about',
    icon: FaWhatsapp,
    // cName: 'nav-text',
  },
]

export const Sidebar = () => {
  const [currentRoute, setCurrentRoute] = useState('')
  //get route
  useEffect(() => {
    setCurrentRoute(window.location.pathname)
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
          fontSize={'24px'}
          color={'#34296B'}
          fontWeight="400"
          textAlign={['center', 'left']}
        >
          Dive into the various resources we have for you
        </Text>
      </Box>
      <Flex
        flexDir={['row', 'column']}
        rowGap="32px"
        columnGap={'17px'}
        mb="32px"
        pt={['28px', '42px']}
        overflowY={['scroll', 'visible']}
        overflowX="auto"
        width="100%"
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
      >
        {SidebarData.map((item, index) => {
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
      </Flex>


    </Box>
  )
}
