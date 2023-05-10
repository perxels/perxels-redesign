import React from 'react'
import {Hero, HowItWorks, RefClass, ReferQuestions} from '../features/referral'
import { Footer } from '../components'
const referral = () => {
  return (
    <div>
      <Hero />
      <HowItWorks />
      <RefClass/>
      <ReferQuestions/>
      <Footer/>
    </div>
  )
}

export default referral