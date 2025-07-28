import React, { useState } from 'react'
import { Box, Button, Input, Text, VStack } from '@chakra-ui/react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { portalDb } from '../../portalFirebaseConfig'
import { checkInStudent } from '../../lib/utils/attendance.utils'
import { usePortalAuth } from '../../hooks/usePortalAuth'

const today = new Date().toISOString().slice(0, 10)

export const StudentCheckinForm = () => {
  const { user, portalUser } = usePortalAuth()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const handleCheckin = async () => {
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      if (!user?.uid) throw new Error('You must be logged in')
      if (!code) throw new Error('Enter the attendance code')
      // Find today's attendance with this code
      const q = query(
        collection(portalDb, 'attendance'),
        where('date', '==', today),
        where('code', '==', code.trim().toUpperCase())
      )
      const snapshot = await getDocs(q)
      if (snapshot.empty) throw new Error('Invalid code or no attendance for today')
      // If student is in multiple classes, check in for all
      for (const docSnap of snapshot.docs) {
        await checkInStudent(docSnap.id, user.uid)
      }
      setSuccess('Check-in successful!')
    } catch (err: any) {
      setError(err.message || 'Check-in failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box p={4} borderWidth={1} borderRadius="md" maxW="400px">
      <VStack spacing={4}>
        <Input
          placeholder="Enter attendance code"
          value={code}
          onChange={e => setCode(e.target.value)}
          textTransform="uppercase"
        />
        <Button
          colorScheme="purple"
          onClick={handleCheckin}
          isLoading={loading}
        >
          Check In
        </Button>
        {success && <Text color="green.600">{success}</Text>}
        {error && <Text color="red.500">{error}</Text>}
      </VStack>
    </Box>
  )
} 