import { Box } from '@chakra-ui/react'
import React from 'react'
import { SectionHeader } from '../../components'
import { ClassLists } from '../classGroup'

export const ClassPlan = () => {
  return (
    <Box my="3.625rem">
      <SectionHeader
        subTitle="Class Plans"
        title="Choose from any of these Class Plans."
      />
      <ClassLists />
    </Box>
  )
}
