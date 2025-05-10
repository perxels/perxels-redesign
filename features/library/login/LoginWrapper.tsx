import { Box, Heading, HStack, Image, Text } from '@chakra-ui/react'
import React from 'react'
import { IoChevronBack } from 'react-icons/io5'
import { LoginForm } from './LoginForm'
import { useRouter } from 'next/router'
// import { SignUpForm } from './SignUpForm'

export const LoginWrapper = () => {
  const router = useRouter();
  return (
    <HStack flexDir={["column", "row"]} w="100%" h="100%" spacing={0}>
      <Box display={["block", "none"]} pos="sticky" top={0} zIndex={10}>
        <Image src="/assets/images/library/auth-image-mobile.jpg" width="100%" height="auto" alt="auth image" />
      </Box>
      <Box w="100%" h={["auto", "100%"]} bg="white" px={[6, '5.375rem']} py={[8, '4rem']} pb={[12, 0]}>
        <HStack cursor="pointer" onClick={() => router.push("/")}>
          <IoChevronBack />
          <Text as="h6" fontWeight={300}>
            Back
          </Text>
        </HStack>

        <Heading fontSize={["xx-large", "xxx-large"]} mt={4}>
          Welcome back
        </Heading>
        <Text fontSize={["medium"]} py={2}>
          Perxels is an online community that provides training and mentorship
          for User Interface and User Experience designers to grow and thrive in
          the Industry.
        </Text>

        <LoginForm />
      </Box>
      <Box w="100%" h="100%" pos="relative" display={['none', 'block']}>
        <Image
          src="/assets/images/library/auth-image.jpg"
          width="100%"
          height="100%"
          objectFit="cover"
          alt="image auth"
          objectPosition="center"
        />

        <Box
          pos="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          gap={0}
        >
          <Image
            src="/assets/images/library/perxels-logo-white.svg"
            width={148}
            height={40}
            alt="perxels logo"
          />

          <Heading
            fontSize={[64]}
            lineHeight={1.2}
            textAlign="center"
            color="brand.yellow.500"
          >
            BE A PART OF AWESOMENESS
          </Heading>
        </Box>
      </Box>
    </HStack>
  )
}
