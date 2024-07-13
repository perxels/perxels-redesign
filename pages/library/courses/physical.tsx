import React, { useEffect, useRef } from 'react'
import { Box, Button, VStack } from '@chakra-ui/react'
import { MainLayout } from '../../../layouts'
import { LibraryLayout } from '../../../features/library'
import { PhysCardLayout } from '../../../features/physical'
import { useRouter } from 'next/router'
import { IoIosArrowBack } from 'react-icons/io'

const physical = () => {
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
        behavior: 'instant',
      })
    }
  }, [])

  return (
    <div>
      <MainLayout>
        <LibraryLayout>
          <div ref={targetRef}>
            <Button
              mb="10px"
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
            <Box mb="30px">
              <PhysCardLayout />
            </Box>
          </div>
        </LibraryLayout>
      </MainLayout>
    </div>
  )
}

export default physical
