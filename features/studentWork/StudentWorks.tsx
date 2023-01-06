import { Box, Img, SimpleGrid } from '@chakra-ui/react'
import gsap from 'gsap'
import React, { useEffect } from 'react'
import { SectionHeader } from '../../components'
import { StudentWorksData } from '../../constant/studentWorks'
import { MainContainer } from '../../layouts'
import StudentCaseStudy from './StudentCaseStudy'

const StudentWorksWrapper = ({ isPrimary }: { isPrimary?: boolean }) => {
  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.students-card', {
        opacity: '0',
        y: 200,
        duration: 1,
        delay: 1,
        scrollTrigger: {
          trigger: ".class-groups",
          start: "-700 top",
          end: "bottom bottom",
        },
        stagger: 1,
      })
    })

    return () => ctx.revert()
  }, [])
  return (
    <MainContainer bg={isPrimary ? 'brand.purple.500' : 'brand.dark.200'}>
      {isPrimary && (
        <Box pt="6rem">
          <SectionHeader
            title="See Our Students’ work"
            subTitle="Students’ portfolio"
            isWhite
            isArrow
          />
        </Box>
      )}
      <SimpleGrid
        py="3.75rem"
        w="100%"
        spacing={['1.25rem', '1.25rem', '1.25rem', '3.75rem']}
        columns={[1, 2]}
        className="class-groups"
      >
        {StudentWorksData.map(({ id, imgUrl, link }) => (
          <StudentCaseStudy key={id} imgUrl={imgUrl} link={link} />
        ))}
      </SimpleGrid>
    </MainContainer>
  )
}

export default StudentWorksWrapper
