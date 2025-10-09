import { useState, useCallback } from 'react'
import { useToast } from '@chakra-ui/react'
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { portalDb } from '../portalFirebaseConfig'
import {
  FacilitatorProfile,
  FacilitatorFormData,
  FacilitatorDashboardStats,
} from '../types/facilitator'

export const useFacilitator = () => {
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  const getFacilitatorProfile = useCallback(
    async (uid: string): Promise<FacilitatorProfile | null> => {
      try {
        setLoading(true)
        const userDoc = await getDocs(
          query(
            collection(portalDb, 'users'),
            where('uid', '==', uid),
            where('role', '==', 'facilitator'),
          ),
        )

        if (userDoc.empty) return null

        const data = userDoc.docs[0].data()
        return {
          uid: data.uid,
          email: data.email,
          fullName: data.fullName,
          phone: data.phone,
          gender: data.gender,
          profession: data.profession,
          dateOfBirth: data.dateOfBirth,
          address: data.address,
          pictureUrl: data.pictureUrl,
          isActive: data.isActive !== false,
          emailVerified: data.emailVerified || false,
          registrationComplete: data.registrationComplete || false,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        }
      } catch (error) {
        console.error('Error fetching facilitator profile:', error)
        toast({
          title: 'Error',
          description: 'Failed to load profile data',
          status: 'error',
          duration: 3000,
        })
        return null
      } finally {
        setLoading(false)
      }
    },
    [toast],
  )

  const updateFacilitatorProfile = useCallback(
    async (uid: string, data: Partial<FacilitatorFormData>) => {
      try {
        setLoading(true)
        await updateDoc(doc(portalDb, 'users', uid), {
          ...data,
          updatedAt: serverTimestamp(),
        })

        toast({
          title: 'Success',
          description: 'Profile updated successfully',
          status: 'success',
          duration: 3000,
        })
        return { success: true }
      } catch (error) {
        console.error('Error updating facilitator profile:', error)
        toast({
          title: 'Error',
          description: 'Failed to update profile',
          status: 'error',
          duration: 3000,
        })
        return { success: false, error: 'Update failed' }
      } finally {
        setLoading(false)
      }
    },
    [toast],
  )

  const getDashboardStats = useCallback(
    async (facilitatorId: string): Promise<FacilitatorDashboardStats> => {
      try {
        // Implement actual stats calculation based on your data structure
        // This is a placeholder implementation
        const studentsQuery = query(
          collection(portalDb, 'users'),
          where('role', '==', 'student'),
          where('facilitatorId', '==', facilitatorId), // Adjust based on your schema
        )

        const studentsSnapshot = await getDocs(studentsQuery)

        return {
          totalStudents: studentsSnapshot.size,
          attendanceRate: 85, // Calculate based on your attendance records
          pendingAssessments: 3, // Calculate based on your assessment system
          activeCohorts: 2, // Calculate based on assignments
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
        return {
          totalStudents: 0,
          attendanceRate: 0,
          pendingAssessments: 0,
          activeCohorts: 0,
        }
      }
    },
    [],
  )

  return {
    loading,
    getFacilitatorProfile,
    updateFacilitatorProfile,
    getDashboardStats,
  }
}
