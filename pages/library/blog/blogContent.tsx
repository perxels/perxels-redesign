import React from 'react'
import { MainLayout } from '../../../layouts'
import { LibraryLayout} from '../../../features/library'
import { BlogContent } from '../../../features/library'

const blogContent = () => {
  return (
    <div>
          <MainLayout>
            <LibraryLayout>
            <BlogContent/>
            </LibraryLayout>
        </MainLayout>
    </div>
  )
}

export default blogContent


