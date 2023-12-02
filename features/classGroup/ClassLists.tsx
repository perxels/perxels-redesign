import { Box, VStack } from '@chakra-ui/react'
import React from 'react'
import { classGroupDetails } from '../../constant'
import { MainContainer } from '../../layouts'
import { ClassDetails } from './ClassDetails'

export const ClassLists = ({
  show = false,
  isSponsor = false,
}: {
  show?: boolean
  isSponsor?: boolean
}) => {
  return (
    <Box py="3.75rem">
      <MainContainer>
        <VStack spacing="3.75rem">
          {classGroupDetails.map(
            ({
              id,
              title,
              classDur,
              classTime,
              classType,
              installments,
              tuition,
              courseOutline,
              isTab,
              physicalTuition,
              address,
              installmentPhysical,
              classTimePhysical,
              branchAddress,
              stateLocation
            }) => (
              <ClassDetails
                key={id}
                id={id}
                title={title}
                classDur={classDur}
                classTime={classTime}
                installments={installments}
                tuition={tuition}
                courseOutline={courseOutline}
                classType={classType}
                isShow={id == 'basic-class'}
                isSponsor={isSponsor}
                isTab={isTab}
                physicalTuition={physicalTuition}
                address={address}
                branchAddress={branchAddress}
                installmentPhysical={installmentPhysical}
                classTimePhysical={classTimePhysical}
                stateLocation={stateLocation}
              />
            ),
          )}
        </VStack>
      </MainContainer>
    </Box>
  )
}
