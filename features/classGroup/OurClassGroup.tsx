import { Box, SimpleGrid } from '@chakra-ui/react'
import React from 'react'
import { SectionHeader } from '../../components'
import { ClassGroupContent } from '../../constant'
import { MainContainer } from '../../layouts'
import { ClassCard } from './ClassCard'

export const OurClassGroup = ({ title }: { title?: string }) => {
  return (
    <Box mt={["3.75rem", "3.75rem", "7.5rem"]}>
      <MainContainer>
        <SectionHeader
          subTitle={title || "Our CLass Groups"}
          title="Here At Perxels,"
          paragraph="Our class groups are designed to accommodate your current level in design and unique learning process"
        />

        <SimpleGrid mb={["3.75rem", "3.75rem", "7rem"]} columns={[1, 1, 2]} spacing="1rem">
          {ClassGroupContent.map(({ title, content, image, link }) => (
            <ClassCard
              key={title}
              link={link}
              title={title}
              content={content}
              image={image}
            />
          ))}
        </SimpleGrid>
      </MainContainer>
    </Box>
  )
}
