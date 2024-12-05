import { Box } from '@chakra-ui/react'
import React from 'react'
import { SectionHeader } from '../../components'
import { ClassLists } from '../classGroup'
import { MainContainer } from '../../layouts'
import { ClassDetails } from '../classGroup/ClassDetails'
import { useSponsorshipClass } from '../../hooks/useSponsorship'

interface classInt{
  isApply ?:boolean
}

export const  ClassPlan = ({isApply}: classInt) => {
  const {classData,loading,refetchClass} = useSponsorshipClass()
  return (
    // <Box my="3.625rem">
    //   <SectionHeader
    //     subTitle="Class Plans"
    //     title="Choose from any of these Class Plans."
    //   />
    //   <ClassLists show isSponsor />
    // </Box>
    <MainContainer>
    <Box id="pricing" />
    <SectionHeader
      title="It’s everything you’ll ever need."
      subTitle="Class Plan"
    />

    {classData?.map((item,i)=>{
      return <Box mt='60px'>
        <ClassDetails
      key={i}
      {...item}
      address={item.stateLocation}
    />
      </Box>
    }) }


    <Box mt="60px" />
  </MainContainer>
  )
}
