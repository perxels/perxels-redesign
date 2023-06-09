import { Box, Button, Container, Flex, Icon, Text } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'
import { IoCloseSharp } from 'react-icons/io5'
import { RiMenu3Line } from 'react-icons/ri'
import { MainContainer } from '../layouts'
import HeaderDropdown from './HeaderDropdown'
import Logo from './Logo'

interface HeaderProps {
  isDark?: boolean
  isRelative?: boolean
}

const Header = ({ isDark = false, isRelative= false }) => {
  const [showDropdown, setShowDropdown] = React.useState(false)

  return (
    <Box
      pos={isRelative ? "relative" : "sticky" }
      top="0"
      zIndex="5"
      bg={isDark ? 'brand.dark.200' : 'brand.white'}
    >
      <MainContainer bg="none">
        <Flex alignItems="center" justifyContent="space-between" py="1.25rem">
          <Flex alignItems="center" gap="6.875rem">
            <Link href="/">
              <Logo color={isDark ? '#FDE85C' : '#34296B'} />
            </Link>
            <Flex
              display={['none', 'none', 'none', 'flex']}
              alignItems="center"
              gap="4.375rem"
            >
              <Link href="/testimonials">
                <Text
                  color={isDark ? 'brand.white' : 'brand.primary.500'}
                  _hover={{ color: 'brand.yellow.500' }}
                  fontSize="xl"
                >
                  Testimonials
                </Text>
              </Link>
              <Link href="/studentprojects">
                <Text
                  color={isDark ? 'brand.white' : 'brand.primary.500'}
                  _hover={{ color: 'brand.yellow.500' }}
                  fontSize="xl"
                >
                  Student Projects
                </Text>
              </Link>
              <Link href="/event">
                <Text
                  color={isDark ? 'brand.white' : 'brand.primary.500'}
                  _hover={{ color: 'brand.yellow.500' }}
                  fontSize="xl"
                >
                  Events
                </Text>
              </Link>
              <Link href="/partners">
                <Text
                  color={isDark ? 'brand.white' : 'brand.primary.500'}
                  _hover={{ color: 'brand.yellow.500' }}
                  fontSize="xl"
                >
                  Be a Partner
                </Text>
              </Link>
            </Flex>
          </Flex>

          <Link href="/enrol">
            <Button
              h="3.125rem"
              variant={isDark ? 'solid-white' : 'solid'}
              display={['none', 'none', 'none', 'flex']}
              px="2.25rem"
            >
              View Class Plans
            </Button>
          </Link>

          <Icon
            as={!showDropdown ? RiMenu3Line : IoCloseSharp}
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
