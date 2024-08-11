import { Box, Flex, Img, Link, SimpleGrid } from '@chakra-ui/react'
import gsap from 'gsap'
import React, { useEffect, useRef } from 'react'
import { Logo } from '../../components'
import LoginForm from '../../features/admin/LoginForm'

const AdminPage = () => {
  const mainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.enrol-hero', { opacity: 0, y: 500, duration: 1, delay: 0.5 })
      gsap.from('.enrol-form', { opacity: 0, y: -500, duration: 1, delay: 0.5 })
    }, mainRef)

    return () => ctx.revert()
  }, [])

  return (
    <SimpleGrid
      ref={mainRef}
      justifyItems="center"
      columns={[1, 1, 1, 2]}
      h="100vh"
    >
      <Box
        as={Link}
        href="/"
        px="1rem"
        py="1rem"
        display={['block', 'block', 'block', 'none']}
      >
        <Logo />
      </Box>
      <Flex
        bg="brand.pink.700"
        w="full"
        h="full"
        px="2rem"
        alignItems="flex-end"
        position="relative"
        display={['none', 'none', 'none', 'flex']}
      >
        <Box as={Link} href="/" pos="absolute" top="3.125rem" left="6.25rem">
          <Logo color="#fff" />
        </Box>
        <Img
          src="/assets/images/register/registerHero.png"
          alt="Register Hero"
          w="100%"
          maxW="500px"
          mx="auto"
          className="enrol-hero"
        />
      </Flex>
      <LoginForm />
    </SimpleGrid>
  )
}

export default AdminPage
