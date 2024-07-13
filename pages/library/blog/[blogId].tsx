import React, { useEffect, useRef, useState } from 'react'
import { MainLayout } from '../../../layouts'
import { LibraryLayout } from '../../../features/library'
import { BlogContentItem } from '../../../features/library'
import { useRouter } from 'next/router'
import {
  blogContentProps,
  blogContentDataArray,
} from '../../../constant/blogContent'

const BlogContent = () => {
  const router = useRouter()
  const { blogId } = router.query
  const [blogContentData, setBlogContentData] = useState([])

  function findObjectById(
    array: blogContentProps[],
    id: number,
  ): blogContentProps | null {
    for (let obj of array) {
      if (obj.id === id) {
        return obj
      }
    }
    return null // Return null if ID doesn't belong to any object
  }

  useEffect(() => {
    if (typeof blogId === 'string') {
      const id = parseInt(blogId) // Convert string to number
      if (!isNaN(id)) {
        const blog = findObjectById(blogContentDataArray, id)
        if (blog) {
          // Handle the found blog
          setBlogContentData(blog.blog)
        } else {
          alert(`Blog with ID ${id} not found`)
        }
      } else {
        alert(`Invalid Blog url`)
      }
    }
  }, [blogId])

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const targetRef = useRef<HTMLDivElement | null>(null)
    // eslint-disable-next-line react-hooks/rules-of-hooks
      useEffect(() => {
        if (targetRef.current) {
          const topOffset = 100 // Offset for the navbar
          const elementPosition =
            targetRef.current.getBoundingClientRect().top + window.pageYOffset
          const offsetPosition = elementPosition - topOffset
    
          window.scrollTo({
            top: offsetPosition,
            
          })
        }
      }, [])

  return (
    <div>
      <MainLayout>
        <LibraryLayout>
        <div ref={targetRef}>
          <BlogContentItem BlogContentData={blogContentData} />
          </div>
        </LibraryLayout>
      </MainLayout>
    </div>
  )
}

export default BlogContent
