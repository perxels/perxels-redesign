import React from 'react'
import {MainLayout} from '../layouts'
import { Hero, About, Speaker, Register } from '../features/alumni'
const alumni = () => {
  return (
    <MainLayout>
        <Hero />
        <About />
        <Speaker/>
        <Register/>
    </MainLayout>
  )
}

export default alumni