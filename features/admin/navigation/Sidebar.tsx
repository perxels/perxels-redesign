import {
  VStack,
  Box,
  HStack,
  Text,
  List,
  ListItem,
  ListIcon,
  useToast,
  Center,
  theme,
  Icon,
} from '@chakra-ui/react'
import { signOut } from 'firebase/auth'
import Link from 'next/link'
import { GiGraduateCap } from 'react-icons/gi'
import { IoMdClose } from 'react-icons/io'
import { IoExitOutline } from 'react-icons/io5'
import {
  MdClass,
  MdEventAvailable,
  MdLibraryBooks,
  MdOutlineContactSupport,
  MdSchool,
  MdSummarize,
} from 'react-icons/md'
import { auth } from '../../../firebaseConfig'
import { useRouter } from 'next/router'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { useMemo, useState } from 'react'

const AdminSidebar = ({ navState, setNavState }: any) => {
  
  const [minimize, setMinimize] = useState(false)
  
  const width = useMemo(() => {
    return navState ? '250px' : '0px'
  }, [navState])

  const toast = useToast()

  const router = useRouter()

  function isActive(path: string) {
    if (window.location.href.includes(path)) {
      return true
    } else {
      false
    }
  }

  async function logoutUser() {
    try {
      await signOut(auth)

      router.push('/admin')
    } catch (error: any) {
      toast({
        title: error.message,
        status: 'error',
        isClosable: true,
      })
    }
  }

  return (
    <VStack
      h="100vh"
      bg="brand.purple.500"
      justifyContent="space-between"
      w={[width, width, minimize ? '70px' : '250px', minimize ? '70px' : '250px']}
      position={navState ? 'fixed' : 'static'}
      transition="0.3s ease"
      // overflowX="hidden"
      top={'0px'}
      bottom={'0px'}
      color="white"
      whiteSpace="nowrap"
      zIndex={200}
      shadow="md"
      borderTopRightRadius="20px"
      borderBottomRightRadius="20px"
      pos="relative"
    >
      <Center
        pos="absolute"
        bgColor="white"
        w={7}
        rounded="full"
        h={7}
        top={14}
        right={-3}
        borderColor={theme.colors.gray[100]}
        borderWidth={1}
        cursor="pointer"
        onClick={() => setMinimize((prev) => !prev)}
      >
        <Icon color={theme.colors.black} as={minimize ? FaChevronRight : FaChevronLeft} />
      </Center>
      <Box w="100%">
        <HStack
          alignItems="center"
          p="20px"
          // ml="10px"
          pb="0"
          justifyContent="space-between"
        >
          <Text as="span" textAlign="left">
            {minimize ? "Admin" : "Perxels Admin"}
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
            {!minimize ? "Overview" : null}
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
            {!minimize ? "Event Banners" : null}
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
            <ListIcon as={MdClass} color="inherit" />
            {!minimize ? "Master Class" : null}
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
            href="/admin/library"
            bg={isActive('/admin/library') ? 'white' : 'transperant'}
            color={isActive('/admin/library') ? 'black' : 'white'}
            _hover={{ borderLeft: '3px solid white' }}
          >
            <ListIcon as={MdLibraryBooks} color="inherit" />
            {!minimize ? "Library" : null}
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
            href="/admin/sponsorship"
            bg={isActive('/admin/sponsorship') ? 'white' : 'transperant'}
            color={isActive('/admin/sponsorship') ? 'black' : 'white'}
            _hover={{ borderLeft: '3px solid white' }}
          >
            <ListIcon as={GiGraduateCap} color="inherit" />
            {!minimize ? "Sponsorship" : null}
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
            {!minimize ? "Support" : null}
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
            onClick={logoutUser}
          >
            <ListIcon as={IoExitOutline} color="inherit" />
            {!minimize ? "Logout" : null}
          </ListItem>
        </List>
      </Box>
    </VStack>
  )
}

export default AdminSidebar
