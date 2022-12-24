import { SimpleGrid, useMediaQuery } from '@chakra-ui/react'
import React, { useMemo } from 'react'
import { TestimonialCardProps } from '../../constant'

import { TestimonialCard } from './TestimonialCard'

interface TestimonialGridProps {
  testimonialContent: TestimonialCardProps[]
}

export const TestimonialGrid = ({
  testimonialContent
}: TestimonialGridProps) => {
  const [isLargerThan800] = useMediaQuery('(max-width: 720px)', {
    ssr: true,
    fallback: false, // return false on the server, and re-evaluate on the client side
  })

  const trimmedContent = useMemo(() => {
    if (isLargerThan800) {
      return testimonialContent.slice(0, 3)
    }

    return testimonialContent
  }, [isLargerThan800, testimonialContent])

  return (
    <SimpleGrid columns={[1, 2, 2, 3]} spacing="1.375rem" py="3.75rem">
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
  )
}
