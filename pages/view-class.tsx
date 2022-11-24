import React from 'react'

import { CaseHero, CaseStudy, ClassHire } from '../features/view-class'
import { MainLayout } from '../layouts'

const Viewclass = () => {
  return (
   <MainLayout>
        <CaseHero/>
        <CaseStudy />
        <ClassHire/>
   </MainLayout>
  )
}

export default Viewclass