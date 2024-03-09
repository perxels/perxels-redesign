import React from 'react'
import { MainLayout } from '../../layouts'
import { LibraryLayout} from '../../features/library'
import { BlogCardLayout } from '../../features/library'

const blog = () => {
  return (
    <div>
          <MainLayout>
            <LibraryLayout>
            <BlogCardLayout/>
            </LibraryLayout>
        </MainLayout>
    </div>
  )
}

export default blog


