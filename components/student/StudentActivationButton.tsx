import React, { useState, useEffect } from 'react'
import { Button, Spinner } from '@chakra-ui/react'
import { doc, getDoc } from 'firebase/firestore'
import { portalDb } from '../../portalFirebaseConfig'
import { StudentActivationModal } from '../../features/portal/admin/classes/StudentActivationModal'

interface StudentActivationButtonProps {
  studentId: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  variant?: 'outline' | 'solid' | 'ghost'
  minW?: string
  fontSize?: string
  onStatusChange?: () => void
}

interface StudentData {
  uid: string
  fullName?: string
  email?: string
  phone?: string
  isStudentActive?: boolean
  deactivationReason?: string
}

export const StudentActivationButton: React.FC<
  StudentActivationButtonProps
> = ({
  studentId,
  size = 'xs',
  variant = 'outline',
  minW = '50px',
  fontSize = 'xs',
  onStatusChange,
}) => {
  const [studentData, setStudentData] = useState<StudentData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Fetch student data when component mounts
  useEffect(() => {
    const fetchStudentData = async () => {
      if (!studentId) {
        setIsLoading(false)
        return
      }

      try {
        const studentDoc = await getDoc(doc(portalDb, 'users', studentId))
        if (studentDoc.exists()) {
          const data = studentDoc.data()
          setStudentData({
            uid: studentDoc.id,
            fullName: data.fullName || 'Student',
            email: data.email || '',
            phone: data.phone || '',
            isStudentActive: data.isStudentActive !== false,
            deactivationReason: data.deactivationReason,
          })
        }
      } catch (error) {
        console.error('Error fetching student data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStudentData()
  }, [studentId])

  const handleButtonClick = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleStatusChange = () => {
    // Refresh student data after status change
    const fetchUpdatedData = async () => {
      try {
        const studentDoc = await getDoc(doc(portalDb, 'users', studentId))
        if (studentDoc.exists()) {
          const data = studentDoc.data()
          setStudentData({
            uid: studentDoc.id,
            fullName: data.fullName || 'Student',
            email: data.email || '',
            phone: data.phone || '',
            isStudentActive: data.isStudentActive !== false,
            deactivationReason: data.deactivationReason,
          })
        }
      } catch (error) {
        console.error('Error fetching updated student data:', error)
      }
    }

    fetchUpdatedData()

    // Notify parent component
    if (onStatusChange) {
      onStatusChange()
    }

    // Close modal
    setIsModalOpen(false)
  }

  // Show loading state while fetching student data
  if (isLoading) {
    return (
      <Button
        size={size}
        variant={variant}
        isLoading={true}
        loadingText="..."
        minW={minW}
        fontSize={fontSize}
      />
    )
  }

  // Show error state if student not found
  if (!studentData) {
    return (
      <Button
        size={size}
        variant={variant}
        isDisabled={true}
        minW={minW}
        fontSize={fontSize}
      >
        N/A
      </Button>
    )
  }

  const isActive = studentData.isStudentActive

  return (
    <>
      <Button
        size={size}
        variant={variant}
        colorScheme={isActive ? 'red' : 'green'}
        onClick={handleButtonClick}
        fontSize={fontSize}
        minW={minW}
      >
        {isActive ? 'Deactivate' : 'Activate'}
      </Button>

      {/* Student Activation Modal */}
      {isModalOpen && (
        <StudentActivationModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          student={studentData}
          onStatusChange={handleStatusChange}
        />
      )}
    </>
  )
}
