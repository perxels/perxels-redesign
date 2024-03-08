import React from 'react'
import { MainLayout } from '../../layouts'
import { LibraryLayout} from '../../features/library'
import { PdfCardLayout } from '../../features/library'

const pdf = () => {
  return (
    <div>
          <MainLayout>
            <LibraryLayout>
            <PdfCardLayout/>
            </LibraryLayout>
        </MainLayout>
    </div>
  )
}

export default pdf


