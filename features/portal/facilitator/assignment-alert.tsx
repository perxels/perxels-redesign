import React, { useState, useEffect } from 'react'
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  HStack,
  Box,
} from '@chakra-ui/react'
import { usePortalAuth } from '../../../hooks/usePortalAuth'
import { useRouter } from 'next/router'
import { doc, onSnapshot, serverTimestamp, updateDoc } from 'firebase/firestore'
import { portalDb } from '../../../portalFirebaseConfig'

export const AssignmentAlert: React.FC = () => {
  const { portalUser } = usePortalAuth()
  const router = useRouter()
  const [hasNewAssignments, setHasNewAssignments] = useState(false)
  const [assignmentsCount, setAssignmentsCount] = useState(0)

  useEffect(() => {
    if (!portalUser?.uid) return

    const unsubscribe = onSnapshot(
      doc(portalDb, 'users', portalUser.uid),
      (doc) => {
        const data = doc.data()
        const assignments = data?.assignments || []
        setAssignmentsCount(assignments.length)

        // Check if user has viewed assignments recently
        const lastViewedAssignments = data?.lastViewedAssignments || null
        if (!lastViewedAssignments && assignments.length > 0) {
          setHasNewAssignments(true)
        } else if (lastViewedAssignments) {
          const lastViewedCount = lastViewedAssignments.count || 0
          setHasNewAssignments(assignments.length > lastViewedCount)
        }
      },
    )

    return () => unsubscribe()
  }, [portalUser?.uid])

  const handleViewAssignments = async () => {
    if (!portalUser?.uid) return

    // Mark assignments as viewed
    try {
      await updateDoc(doc(portalDb, 'users', portalUser.uid), {
        lastViewedAssignments: {
          count: assignmentsCount,
          viewedAt: serverTimestamp(),
        },
      })
    } catch (error) {
      console.error('Error updating last viewed assignments:', error)
    }

    setHasNewAssignments(false)
    router.push('/portal/facilitator/assigned')
  }

  if (!hasNewAssignments || assignmentsCount === 0) {
    return null
  }

  return (
    <Alert status="info" borderRadius="lg">
      <AlertIcon />
      <Box flex="1">
        <AlertTitle>New Class Assignments!</AlertTitle>
        <AlertDescription>
          You have been assigned to {assignmentsCount} new cohort
          {assignmentsCount > 1 ? 's' : ''}. Click below to view your assigned
          classes.
        </AlertDescription>
      </Box>
      <Button
        colorScheme="blue"
        size="sm"
        onClick={handleViewAssignments}
        ml={3}
      >
        View Assignments
      </Button>
    </Alert>
  )
}
