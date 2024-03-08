import React from 'react'
import { MainLayout } from '../../layouts'
import { LibraryLayout} from '../../features/library'
import { VideoCardLayout } from '../../features/library'

const videos = () => {
  return (
    <div>
          <MainLayout>
            <LibraryLayout>
            <VideoCardLayout/>
            </LibraryLayout>
        </MainLayout>
    </div>
  )
}

export default videos


