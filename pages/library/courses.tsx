import React, { useEffect, useRef } from 'react'
import { MainLayout } from '../../layouts'
import { LibraryLayout } from '../../features/library'
import { LibraryCardLayout } from '../../features/library'
import { OurClassGroup } from '../../features/classGroup'
import {
  OnlineClassPlan,
  PhysicalClassPlan,
} from '../../features/classGroup/ClassPlan'
import { VStack } from '@chakra-ui/react'

const courses = () => {
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
            {/* <OurClassGroup library={true} /> */}
            <VStack mb="30px" spacing={8}>
              <OnlineClassPlan sm={true} />
              <PhysicalClassPlan sm={true} />
            </VStack>
          </div>
        </LibraryLayout>
      </MainLayout>
    </div>
  )
}

export default courses
