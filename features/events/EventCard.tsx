import { Box, Center, Icon, Image, Link } from '@chakra-ui/react'
import React from 'react'
import { BsFillPlayCircleFill } from 'react-icons/bs'

interface EventCardProps {
    imageSrc: string
    link?: string
}

export const EventCard = ({ imageSrc, link }: EventCardProps) => {
  const [isHover, setIsHover] = React.useState(false)
  return (
    <Link
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      href={link}
      key={imageSrc}
      overflow="hidden"
    >
      <Box
        w={{ base: '20rem', md: '100%', lg: '100%' }}
        h="100%"
        position="relative"
      >
        <Image src={imageSrc} alt="event" />

        {isHover && (
          <Center
            pos="absolute"
            top="0"
            left="0"
            w="full"
            h="full"
            bg="rgba(15, 0, 38, 0.78)"
          >
            <Icon
              as={BsFillPlayCircleFill}
              color="brand.yellow.500"
              fontSize="2.5rem"
            />
          </Center>
        )}
      </Box>
    </Link>
  )
}
