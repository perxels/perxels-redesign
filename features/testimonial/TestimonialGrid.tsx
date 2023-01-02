import {
  Box,
  Center,
  Flex,
  Icon,
  SimpleGrid,
  useMediaQuery,
} from '@chakra-ui/react'
import React, { useMemo, useRef } from 'react'
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi'
import { TestimonialCardProps } from '../../constant'

import { TestimonialCard } from './TestimonialCard'

interface TestimonialGridProps {
  testimonialContent: TestimonialCardProps[]
  isTestimonial?: boolean
}

export const TestimonialGrid = ({
  testimonialContent,
  isTestimonial,
}: TestimonialGridProps) => {
  const [isLargerThan800] = useMediaQuery('(max-width: 720px)', {
    ssr: true,
    fallback: false, // return false on the server, and re-evaluate on the client side
  })
  const slicedIndes = useRef<number[]>([0, 3])

  const [lastTestimonialIndex, setLastTestimonialIndex] = React.useState(0)

  const trimmedContent = useMemo(() => {
    if (isLargerThan800 && !isTestimonial) {
      slicedIndes.current =
        lastTestimonialIndex !== 0
          ? [lastTestimonialIndex, lastTestimonialIndex + 4]
          : lastTestimonialIndex === testimonialContent.length
          ? [lastTestimonialIndex, testimonialContent.length]
          : [0, 3]
    }

    if (isLargerThan800 && isTestimonial) {
      slicedIndes.current =
        lastTestimonialIndex !== 0
          ? [lastTestimonialIndex, lastTestimonialIndex + 9]
          : lastTestimonialIndex === testimonialContent.length
          ? [lastTestimonialIndex, testimonialContent.length]
          : [0, 9]
    }

    return testimonialContent?.slice(
      slicedIndes.current[0],
      slicedIndes.current[1],
    )
  }, [isLargerThan800, testimonialContent, isTestimonial, lastTestimonialIndex])

  return (
    <Box>
      <SimpleGrid
        columns={[1, 2, 2, 3]}
        spacing="1.375rem"
        py="3.75rem"
        pb={['1.5rem', '3.75rem']}
      >
        {trimmedContent?.map(({ name, title, content, imgUrl, id }) => (
          <TestimonialCard
            key={id}
            id={id}
            name={name}
            title={title}
            content={content}
            imgUrl={imgUrl}
          />
        ))}
      </SimpleGrid>

      <Flex
        display={['flex', 'none']}
        mb="6rem"
        alignItems="center"
        justifyContent="space-between"
      >
        <Center w="3.125rem" h="full">
          <Center
            w="3.125rem"
            h="3.125rem"
            borderWidth="1px"
            borderColor={
              slicedIndes.current[0] === 0
                ? 'brand.gray.10'
                : 'brand.purple.500'
            }
            rounded="full"
            cursor="pointer"
            transition="all 0.2s ease-in-out"
            as="button"
            disabled={
              slicedIndes.current[0] === 0
            }
            onClick={() => {
              setLastTestimonialIndex(prev => prev - 1)
            }}
          >
            <Icon
              as={FiArrowLeft}
              fontSize="1.5rem"
              color={
                slicedIndes.current[0] === 0
                  ? 'brand.gray.10'
                  : 'brand.purple.500'
              }
            />
          </Center>
        </Center>

        <Center w="3.125rem" h="full">
          <Center
            w="3.125rem"
            h="3.125rem"
            borderWidth="1px"
            borderColor={
              slicedIndes.current[1] === testimonialContent.length
                ? 'brand.gray.10'
                : 'brand.purple.500'
            }
            rounded="full"
            cursor="pointer"
            transition="all 0.2s ease-in-out"
            as="button"
            disabled={
              slicedIndes.current[1] === testimonialContent.length
            }
            onClick={() => {
              setLastTestimonialIndex(prev => prev + 1)
            }}
          >
            <Icon
              as={FiArrowRight}
              fontSize="1.5rem"
              color={
                slicedIndes.current[1] === testimonialContent.length
                  ? 'brand.gray.10'
                  : 'brand.purple.500'
              }
            />
          </Center>
        </Center>
      </Flex>
    </Box>
  )
}
