import React from 'react'
import { MainLayout } from '../../layouts'
import { LibraryLayout} from '../../features/library'
import { TestimonialLayout } from '../../features/library'

const testimonies = () => {
  return (
    <div>
          <MainLayout>
            <LibraryLayout>
                <TestimonialLayout/>
            </LibraryLayout>
        </MainLayout>
    </div>
  )
}

export default testimonies


