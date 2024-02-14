import React from 'react'
import { InternshipHero, Activities, Benefits, Course,  TrainCenters, Impact} from '../features/internship'
import {MainLayout} from '../layouts'
const Internship = () => {
  return (
    <div>
        <MainLayout>
        <InternshipHero />
        <Activities />
        <Benefits/>
        <Course/>
        <TrainCenters/>
        <Impact/>
        </MainLayout>
    </div>
  )
}

export default Internship