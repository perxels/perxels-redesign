import React from 'react'
import { MainLayout } from '../layouts'
import { Hero, LibraryLayout} from '../features/library'
const library = () => {
  return (
    <div>
        <MainLayout>
            <Hero/>
           
            <LibraryLayout/>
        </MainLayout>
    </div>
  )
}

export default library