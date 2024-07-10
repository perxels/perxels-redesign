import React, { useEffect, useRef } from 'react'
import { MainLayout } from '../../layouts'
import { LibraryLayout } from '../../features/library'
import { TestimonialLayout } from '../../features/library'

const testimonies = () => {
  const targetRef = useRef<HTMLDivElement | null>(null)

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
            <TestimonialLayout />
          </div>
        </LibraryLayout>
      </MainLayout>
    </div>
  )
}

export default testimonies
