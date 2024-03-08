import React from 'react'
import { MainLayout } from '../layouts'
import { Hero, LibraryLayout} from '../features/library'
import { LibraryCardLayout } from '../features/library'
const library = () => {
  return (
    <div>
        <MainLayout>
            <LibraryLayout>
            <LibraryCardLayout/>
            </LibraryLayout>
        </MainLayout>
    </div>
  )
}

export default library