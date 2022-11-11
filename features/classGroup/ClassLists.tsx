import { Box, VStack } from '@chakra-ui/react'
import React from 'react'
import { classGroupDetails } from '../../constant'
import { MainContainer } from '../../layouts'
import { ClassDetails } from './ClassDetails'

export const ClassLists = () => {
  return (
    <Box py="3.75rem">
      <MainContainer>
        <VStack spacing="3.75rem">
          {
            classGroupDetails.map(({ title, classDur, classTime, classType, installments, tuition, courseOutline }) => (
              <ClassDetails 
                key={title} 
                title={title}
                classDur={classDur}
                classTime={classTime}
                installments={installments}
                tuition={tuition}
                courseOutline={courseOutline}
                classType={classType}
              />
            ))
          }
        </VStack>
      </MainContainer>
    </Box>
  )
}