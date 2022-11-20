import { Box, Button, Container, Flex, Icon, Text } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'
import { RiMenu3Line } from 'react-icons/ri'
import { MainContainer } from '../layouts'
import HeaderDropdown from './HeaderDropdown'
import Logo from './Logo'

interface HeaderProps {
  isDark?: boolean
}

const Header = ({ isDark = false }) => {
  const [showDropdown, setShowDropdown] = React.useState(false)

  return (
    <Box
      pos="sticky"
      top="0"
      zIndex="5"
      bg={isDark ? 'brand.dark.200' : 'brand.white'}
    >
      <MainContainer bg="none">
        <Flex alignItems="center" justifyContent="space-between" py="1.25rem">
          <Flex alignItems="center" gap="6.875rem">
            <Logo color={isDark ? '#FDE85C' : '#34296B'} />

            <Flex
              display={['none', 'none', 'none', 'flex']}
              alignItems="center"
              gap="4.375rem"
            >
              <Link href="#">
                <Text
                  color={isDark ? 'brand.white' : 'brand.primary.500'}
                  _hover={{ color: 'brand.yellow.500' }}
                  fontSize="xl"
                >
                  Testimonies
                </Text>
              </Link>
              <Link href="#">
                <Text
                  color={isDark ? 'brand.white' : 'brand.primary.500'}
                  _hover={{ color: 'brand.yellow.500' }}
                  fontSize="xl"
                >
                  Student Works
                </Text>
              </Link>
              <Link href="#">
                <Text
                  color={isDark ? 'brand.white' : 'brand.primary.500'}
                  _hover={{ color: 'brand.yellow.500' }}
                  fontSize="xl"
                >
                  Events
                </Text>
              </Link>
              <Link href="#">
                <Text
                  color={isDark ? 'brand.white' : 'brand.primary.500'}
                  _hover={{ color: 'brand.yellow.500' }}
                  fontSize="xl"
                >
                  Hire
                </Text>
              </Link>
            </Flex>
          </Flex>

          <Button
            h="3.125rem"
            variant={isDark ? 'solid-white' : 'solid'}
            display={['none', 'none', 'none', 'flex']}
            px="2.25rem"
          >
            View Class Plans
          </Button>

          <Icon
            as={RiMenu3Line}
            fontSize="1.875rem"
            color={isDark ? 'brand.white' : 'brand.primary.500'}
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
