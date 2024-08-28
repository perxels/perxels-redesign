import {
  VStack,
  Box,
  HStack,
  Text,
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/react'
import Link from 'next/link'
import { IoMdClose } from 'react-icons/io'
import { IoExitOutline } from 'react-icons/io5'
import {
  MdEventAvailable,
  MdOutlineContactSupport,
  MdSchool,
  MdSummarize,
} from 'react-icons/md'

const AdminSidebar = ({ navState, setNavState }: any) => {
  const width = navState ? '250px' : '0px'

  function isActive(path: string) {
    if (window.location.href.includes(path)) {
      return true
    } else {
      false
    }
  }

  return (
    <VStack
      h="100vh"
      bg="brand.purple.500"
      justifyContent="space-between"
      w={[width, width, '250px', '250px']}
      position={navState ? 'fixed' : 'static'}
      transition="0.3s ease"
      overflowX="hidden"
      top={'0px'}
      bottom={'0px'}
      color="white"
      whiteSpace="nowrap"
      zIndex={200}
      shadow="md"
      borderTopRightRadius="20px"
      borderBottomRightRadius="20px"
    >
      <Box w="100%">
        <HStack
          alignItems="center"
          p="20px"
          // ml="10px"
          pb="0"
          justifyContent="space-between"
        >
          <Text as="span" textAlign="left">
            Perxels Admin
          </Text>
          <Box color="white" display={['block', 'block', 'none', 'none']}>
            <IoMdClose onClick={() => setNavState(false)} />
          </Box>
        </HStack>
        <List pt="50px" spacing={2}>
          <ListItem
            display="flex"
            alignItems="center"
            fontSize={['13px', '13px', '15px', '15px']}
            fontWeight="700"
            pl="20px"
            cursor="pointer"
            py="10px"
            as={Link}
            href="/admin/overview"
            bg={isActive('/admin/overview') ? 'white' : 'transperant'}
            color={isActive('/admin/overview') ? 'black' : 'white'}
            _hover={{ borderLeft: '3px solid white' }}
          >
            <ListIcon as={MdSummarize} color="inherit" />
            Overview
          </ListItem>
          <ListItem
            display="flex"
            alignItems="center"
            fontSize={['13px', '13px', '15px', '15px']}
            fontWeight="700"
            pl="20px"
            cursor="pointer"
            py="10px"
            as={Link}
            href="/admin/banners"
            _hover={{ borderLeft: '3px solid white' }}
            bg={isActive('/admin/banners') ? 'white' : 'transperant'}
            color={isActive('/admin/banners') ? 'black' : 'white'}
          >
            <ListIcon as={MdEventAvailable} color="inherit" />
            Event Banners
          </ListItem>
          <ListItem
            display="flex"
            alignItems="center"
            fontSize={['13px', '13px', '15px', '15px']}
            fontWeight="700"
            pl="20px"
            cursor="pointer"
            py="10px"
            as={Link}
            href="/admin/masterclass"
            bg={isActive('/admin/masterclass') ? 'white' : 'transperant'}
            color={isActive('/admin/masterclass') ? 'black' : 'white'}
            _hover={{ borderLeft: '3px solid white' }}
          >
            <ListIcon as={MdSchool} color="inherit" />
            Master Class
          </ListItem>
          <ListItem
            display="flex"
            alignItems="center"
            fontSize={['13px', '13px', '15px', '15px']}
            fontWeight="700"
            pl="20px"
            cursor="pointer"
            py="10px"
            as={Link}
            href="/admin/masterclass"
            bg={isActive('/admin/library') ? 'white' : 'transperant'}
            color={isActive('/admin/library') ? 'black' : 'white'}
            _hover={{ borderLeft: '3px solid white' }}
          >
            <ListIcon as={MdSchool} color="inherit" />
            Library
          </ListItem>
        </List>
      </Box>

      <Box w="100%" mb="100px">
        <List spacing={2}>
          <ListItem
            as={Link}
            href="#"
            display="flex"
            alignItems="center"
            fontSize={['13px', '13px', '15px', '15px']}
            fontWeight="700"
            pl="20px"
            py="10px"
            cursor="pointer"
            color={'white'}
            // borderLeft={isActive('support') && '3px solid white'}
            _hover={{ borderLeft: '3px solid white' }}
          >
            <ListIcon as={MdOutlineContactSupport} color="inherit" />
            Support
          </ListItem>
          <ListItem
            display="flex"
            alignItems="center"
            fontSize={['13px', '13px', '15px', '15px']}
            fontWeight="700"
            pl="20px"
            cursor="pointer"
            py="10px"
            color={'red'}
            _hover={{ borderLeft: '3px solid red' }}
          >
            <ListIcon as={IoExitOutline} color="inherit" />
            Logout
          </ListItem>
        </List>
      </Box>
    </VStack>
  )
}

export default AdminSidebar
