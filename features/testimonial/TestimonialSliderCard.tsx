import { Box, Flex, Heading, Img, Text } from '@chakra-ui/react'
import React from 'react'
import { TestimonialCardProps } from '../../constant'
import { setSelectedTestimonial, setTestimonials } from '../../state/features/TestimonialSlice'
import { useAppDispatch, useAppSelector } from '../../state/store'

interface TestimonialSliderCardProps extends TestimonialCardProps {
  active?: boolean
  index: number
}

export const TestimonialSliderCard = ({
  id,
  imgUrl,
  title,
  name,
  active,
  smallImgUrl,
  video,
  index,
}: TestimonialSliderCardProps) => {
  const dispatch = useAppDispatch()

  const { selectedTestimonial, testimonials } = useAppSelector(
    (state) => state.testimonial,
  )

  function handleSliderCardClick() {
    const prevSelectedTestimonial = selectedTestimonial
    let fullTestimoials = [...testimonials]

    dispatch(setSelectedTestimonial({id, name, title, imgUrl, smallImgUrl, video}))
    fullTestimoials[0] = {id, name, title, imgUrl, smallImgUrl, video}
    fullTestimoials[index] = prevSelectedTestimonial

    dispatch(setTestimonials(fullTestimoials))
  }

  return (
    <Box
      pos="relative"
      w={active ? '290px' : '235px'}
      h={active ? '171px' : '138px'}
      bg="brand.pink.500"
      rounded="8px"
      cursor="pointer"
      onClick={handleSliderCardClick}
    >
      <Img
        w="full"
        h="full"
        src={smallImgUrl || imgUrl}
        alt={title}
        rounded="8px"
      />

      <Flex
        pos="absolute"
        top="0"
        left="0"
        w="full"
        h="full"
        bg="rgba(0, 0, 0, 0.25)"
        py="0.875rem"
        px="1rem"
        flexDir="column"
        justifyContent="flex-end"
        rounded="8px"
      >
        <Heading color="brand.white" fontSize="1rem">
          {name}
        </Heading>
        <Text color="brand.white" fontSize="0.75rem">
          {title}
        </Text>
      </Flex>
    </Box>
  )
}
