import React from 'react'
import { Flex, HStack, Box, Text, Spacer, Icon } from '@chakra-ui/react'
import { IoGrid } from 'react-icons/io5'
import { FiPlayCircle } from 'react-icons/fi'
import { BsFiletypePdf } from 'react-icons/bs'
import { IoChatbubblesOutline } from 'react-icons/io5'
import { BiMessageSquareDetail } from 'react-icons/bi'
import { SlGraduation } from 'react-icons/sl'
import { FaWhatsapp } from 'react-icons/fa'

const SidebarData = [
  {
    title: 'All',
    path: '/',
    icon: IoGrid,
    cName: 'nav-text',
  },
  {
    title: 'Videos',
    path: '/videos',
    icon: FiPlayCircle,
    cName: 'nav-text',
  },
  {
    title: 'PDF',
    path: '/library',
    icon: BsFiletypePdf,
    cName: 'nav-text',
  },
  {
    title: 'Testimonials',
    path: '/testimonials',
    icon: IoChatbubblesOutline,
    cName: 'nav-text',
  },
  {
    title: 'Blog',
    path: '/blog',
    icon: BiMessageSquareDetail,
    cName: 'nav-text',
  },
  {
    title: 'Contact',
    path: '/contact',
    icon: IoChatbubblesOutline,
    cName: 'nav-text',
  },

  {
    title: 'Paid courses',
    path: '/about',
    icon: SlGraduation,
    cName: 'nav-text',
  },
  {
    title: 'Join our community',
    path: '/about',
    icon: FaWhatsapp,
    cName: 'nav-text',
  },
]

export const Sidebar = () => {
  return (
    <Box
      pr={['1rem', '2rem']}
      height="100%"
      py={["10%","0"]}
      borderRight={['none', '1px solid rgba(26, 26, 26, 0.10)']}
    >
      <Box mb={["32px","72px"]}>
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
        flexDir={["row","column"]}
        rowGap="32px"
        columnGap={"17px"}
        mb="32px"
        pt={["28px","42px"]}
        overflowY={["scroll","visible"]}
        borderTop={['none','1px solid rgba(26, 26, 26, 0.10)']}
      >
        {SidebarData.map((item, index) => {
          return (
            <HStack
            key={index}
            spacing={["0px", "20px"]}
            // mt="10px"
            cursor="pointer"
            _hover={{
                color: '#FFF',
                backgroundColor: '#34296B',
                borderRadius: '8px',
            }}
            p={["8px 16px", "12px"]}
            color="#888888"
            transition="ease-in-out 0.3s"
            borderRadius={["66px", "8px"]}
            sx={{
                '@media (max-width: 768px)': {
                    '&:hover': {
                        borderRadius: '66px',
                    },
                },
            }}
            backgroundColor={["#F8F8F8", "#FFF"]}
            border={["1px solid #ECECEC","none"]}
            // minWidth="100%"
            h="42px"
            display={["flex"]}
            width={["150px","full"]}

        >
            <Icon display={["none", "block"]} fontSize={["16px", '20px']} as={item.icon} />
            <Text display="flex"   fontSize={["16px", "20px"]}>{item.title}</Text>
        </HStack>
          )
        })}
      </Flex>
    </Box>
  )
}
