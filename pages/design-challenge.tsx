import React from 'react'
import { Hero, Instruction, Task, Prizes, Submission, ChallengeForm, Testimonial, Header } from '../features/designChallenge'
const designChallenge = () => {
  return (
    <div>
        <Header/>
        <Hero />
        <Instruction/>
        <Task/>
        <Prizes/>
        <Submission/>
        <ChallengeForm/>
        <Testimonial/>
    </div>
  )
}

export default designChallenge