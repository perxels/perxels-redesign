import React, { useEffect, useRef } from 'react'
import { Button, Text, VStack } from '@chakra-ui/react'
import { MainLayout } from '../../../layouts'
import { LibraryLayout } from '../../../features/library'
import { ClassLists } from '../../../features/classGroup'
import { useRouter } from 'next/router'
import { IoIosArrowBack } from 'react-icons/io'

const Online = () => {
  const router = useRouter()
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
            <Button
              variant="outline"
              borderColor="white"
              backgroundColor="white"
              _hover={{
                borderColor: '#060022',
              }}
              onClick={() => router.back()}
              leftIcon={<IoIosArrowBack />}
            >
              Go Back
            </Button>
            <VStack mb="30px" spacing={8}>
              <ClassLists />
            </VStack>
          </div>
        </LibraryLayout>
      </MainLayout>
    </div>
  )
}

export default Online
