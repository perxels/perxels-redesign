import React from 'react'
import {
  HireAsCompany,
  HireAsStaff,
  HireColumns,
  HireForm,
  HireHero,
  Offer,
  OurValues,
} from '../features/hire'
import { MainLayout } from '../layouts'

const hire = () => {
  return (
    <MainLayout>
      <HireHero />
      <Offer />
      <HireColumns />
      <HireAsCompany />
      <HireAsStaff />
      <OurValues />
      <HireForm />
    </MainLayout>
  )
}

export default hire
