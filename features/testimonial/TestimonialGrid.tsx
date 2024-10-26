import {
  Box,
  Center,
  Flex,
  Icon,
  SimpleGrid,
  useMediaQuery,
} from '@chakra-ui/react'
import React, { useEffect, useMemo, useRef } from 'react'
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi'
import { TestimonialCard } from './TestimonialCard'
import { Testimonial } from '../../utils/types'

interface TestimonialGridProps {
  testimonialContent: Testimonial[]
  isTestimonial?: boolean
  columns?: number[]
}

export const TestimonialGrid = ({
  testimonialContent,
  isTestimonial,
  columns,
}: TestimonialGridProps) => {
  const [isLargerThan800] = useMediaQuery('(max-width: 720px)', {
    ssr: true,
    fallback: false, // return false on the server, and re-evaluate on the client side
  })

  const testimonialRef = useRef<HTMLDivElement>(null)

  const slicedIndes = useRef<number[]>([0, 3])

  const [lastTestimonialIndex, setLastTestimonialIndex] = React.useState(0)
  const [isUpdated, setIsUpdated] = React.useState(false)

  const trimmedContent = useMemo(() => {
    if (isLargerThan800 && !isTestimonial) {
      slicedIndes.current =
        lastTestimonialIndex !== 0
          ? [lastTestimonialIndex, lastTestimonialIndex + 3]
          : lastTestimonialIndex === testimonialContent.length
          ? [lastTestimonialIndex, testimonialContent.length]
          : [0, 3]
    }

    if (isLargerThan800 && isTestimonial) {
      slicedIndes.current =
        lastTestimonialIndex !== 0
          ? [lastTestimonialIndex, lastTestimonialIndex + 8]
          : lastTestimonialIndex === testimonialContent.length
          ? [lastTestimonialIndex, testimonialContent.length]
          : [0, 8]
    }

    if (!isLargerThan800) {
      slicedIndes.current = [0, testimonialContent.length]
    }

    return testimonialContent?.slice(
      slicedIndes.current[0],
      slicedIndes.current[1],
    )
  }, [isLargerThan800, testimonialContent, isTestimonial, lastTestimonialIndex])

  const scrollDown = () => {
    window.scrollTo({
      top: testimonialRef?.current?.offsetTop,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    if (isUpdated) {
      scrollDown()
    } else {
      setIsUpdated(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastTestimonialIndex])

  return (
    <Box>
      <SimpleGrid
        columns={columns ? columns : [1, 2, 2, 3]}
        spacing="1.375rem"
        py="3.75rem"
        pb={['1.5rem', '3.75rem']}
        ref={testimonialRef}
      >
        {trimmedContent?.map(({ name, role, testimony, imageUrl }) => (
          <TestimonialCard
            name={name}
            role={role}
            testimony={testimony}
            imageUrl={imageUrl}
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
            disabled={slicedIndes.current[0] === 0}
            onClick={() => {
              setLastTestimonialIndex((prev) => {
                if (isTestimonial) {
                  return prev - 8 <= 0 ? 0 : prev - 8
                }
                return prev - 3 <= 0 ? 0 : prev - 3
              })
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
              slicedIndes.current[1] >= testimonialContent.length
                ? 'brand.gray.10'
                : 'brand.purple.500'
            }
            rounded="full"
            cursor="pointer"
            transition="all 0.2s ease-in-out"
            as="button"
            disabled={slicedIndes.current[1] >= testimonialContent.length}
            onClick={() => {
              setLastTestimonialIndex((prev) => {
                if (isTestimonial) {
                  return prev + 8 >= testimonialContent.length
                    ? testimonialContent.length - 1
                    : prev + 8
                }
                return prev + 3 >= testimonialContent.length
                  ? testimonialContent.length - 1
                  : prev + 3
              })
            }}
          >
            <Icon
              as={FiArrowRight}
              fontSize="1.5rem"
              color={
                slicedIndes.current[1] >= testimonialContent.length
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
