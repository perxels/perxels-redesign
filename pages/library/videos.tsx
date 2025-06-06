import React, { useEffect, useRef } from 'react'
import { MainLayout } from '../../layouts'
import { LibraryLayout } from '../../features/library'
import { VideoCardLayout } from '../../features/library'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../../firebaseConfig'
import { useRouter } from 'next/router'

const Videos = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const targetRef = useRef<HTMLDivElement | null>(null)

  const router = useRouter()

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/library/login') // redirect to login if not authenticated
      }
    })

    return () => unsubscribe() // cleanup
  }, [])

  return (
    <div>
      <MainLayout>
        <LibraryLayout>
          <div ref={targetRef}>
            <VideoCardLayout />
          </div>
        </LibraryLayout>
      </MainLayout>
    </div>
  )
}

export default Videos
