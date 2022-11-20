import { Img, SimpleGrid } from '@chakra-ui/react'
import React from 'react'
import { StudentWorksData } from '../../constant/studentWorks'
import { MainContainer } from '../../layouts'

const StudentWorksWrapper = () => {
  return (
    <MainContainer bg="brand.dark.200">
      <SimpleGrid py="3.75rem" w="100%" spacing={["1.25rem", "1.25rem", "1.25rem", "3.75rem"]} columns={[1, 2]}>
        {StudentWorksData.map(({ id, imgUrl }) => (
          <Img rounded="6px" w="full" h="auto" key={id} src={imgUrl} alt="student" />
        ))}
      </SimpleGrid>
    </MainContainer>
  )
}

export default StudentWorksWrapper
