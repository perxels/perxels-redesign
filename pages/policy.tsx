import React from 'react'
import {TermsLayout} from '../features/terms'
import { MainLayout } from '../layouts'
import {Header, Footer} from '../components/'
const terms = () => {
  return (
    <div>
      <Header isRelative />
        {/* <MainLayout> */}
        <TermsLayout/>   
        <Footer />
        {/* </MainLayout> */}
    </div>
  )
}

export default terms