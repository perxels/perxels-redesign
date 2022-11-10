import { Box, Button, Container, Flex, Icon, Text } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'
import { RiMenu3Line } from 'react-icons/ri'
import { MainContainer } from '../layouts'
import HeaderDropdown from './HeaderDropdown'
import Logo from './Logo'

const Header = () => {
  const [showDropdown, setShowDropdown] = React.useState(false)


  return (
    <Box pos="sticky" top="0" zIndex="5" bg="brand.white">
      <MainContainer>
        <Flex alignItems="center" justifyContent="space-between" py="1.25rem">
          <Flex alignItems="center" gap="6.875rem">
            <Logo />

            <Flex
              display={['none', 'none', 'none', 'flex']}
              alignItems="center"
              gap="4.375rem"
            >
              <Link href="#">
                <Text fontSize="xl">Testimonies</Text>
              </Link>
              <Link href="#">
                <Text fontSize="xl">Student Works</Text>
              </Link>
              <Link href="#">
                <Text fontSize="xl">Events</Text>
              </Link>
              <Link href="#">
                <Text fontSize="xl">Hire</Text>
              </Link>
            </Flex>
          </Flex>

          <Button display={['none', 'none', 'none', 'flex']}>Enroll Now</Button>

          <Icon
            as={RiMenu3Line}
            fontSize="1.875rem"
            cursor="pointer"
            display={['block', 'block', 'block', 'none']}
            onClick={() => setShowDropdown(!showDropdown)}
          />
        </Flex>
      </MainContainer>

      {showDropdown && <HeaderDropdown setShowDropdown={setShowDropdown} />}
    </Box>
  )
}

export default Header
