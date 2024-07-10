import React, { useEffect, useRef } from 'react'
import { MainLayout } from '../../layouts'
import { LibraryLayout} from '../../features/library'
import { VideoCardLayout } from '../../features/library'

const videos = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const targetRef = useRef<HTMLDivElement | null>(null)
// eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (targetRef.current) {
      const topOffset = 100; // Offset for the navbar
      const elementPosition = targetRef.current.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - topOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  }, []);
  return (
    <div>
          <MainLayout>
            <LibraryLayout>
            <div ref={targetRef}>
            <VideoCardLayout/>
            </div>
            </LibraryLayout>
        </MainLayout>
    </div>
  )
}

export default videos


