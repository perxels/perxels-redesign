import { useState, useEffect } from 'react'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { portalDb } from '../portalFirebaseConfig'

interface StudentData {
  uid: string
  email: string
  fullName: string
  phone: string
  branch: string
  role: string
  emailVerified: boolean
  registrationComplete?: boolean
  onboardingComplete?: boolean
  isStudentActive?: boolean
  deactivationReason?: string
  createdAt: any
  schoolFeeInfo?: {
    cohort?: string
    classPlan?: string
    totalSchoolFee?: number
    totalApproved?: number
  }
  growthInfo?: {
    pictureUrl?: string
    gender?: string
    profession?: string
  }
  termsAgreed?: boolean
  gender?: string
  occupation?: string
  owingStatus?: string
  address?: string
  guardianName?: string
  guardianPhone?: string
}

export function useStudents() {
  const [students, setStudents] = useState<StudentData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true)
        setError(null)

        const studentsQuery = query(
          collection(portalDb, 'users'),
          where('role', '==', 'student'),
          orderBy('fullName', 'asc'),
        )

        const querySnapshot = await getDocs(studentsQuery)
        const studentsData: StudentData[] = []

        querySnapshot.forEach((doc) => {
          const data = doc.data()
          studentsData.push({
            uid: doc.id,
            email: data.email || '',
            fullName: data.fullName || 'N/A',
            phone: data.phone || 'N/A',
            branch: data.branch || 'Not specified',
            address: data.address || 'Not specified',
            guardianName: data.guardianName || 'Not available',
            guardianPhone: data.guardianPhone || 'Not available',
            role: data.role || 'student',
            emailVerified: data.emailVerified || false,
            registrationComplete: data.registrationComplete || false,
            onboardingComplete: data.onboardingComplete || false,
            isStudentActive: data.isStudentActive !== false, // Default to true if not set
            deactivationReason: data.deactivationReason,
            createdAt: data.createdAt,
            schoolFeeInfo: data.schoolFeeInfo || {},
            growthInfo: data.growthInfo || {},
            termsAgreed: data.termsAgreed || false,
            gender: data.gender,
            occupation: data.occupation,
            owingStatus: data.owingStatus || 'Not Set',
          })
        })

        setStudents(studentsData)
      } catch (err: any) {
        console.error('Error fetching students:', err)
        setError('Failed to load students. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [])

  const refetch = async () => {
    const studentsQuery = query(
      collection(portalDb, 'users'),
      where('role', '==', 'student'),
      orderBy('fullName', 'asc'),
    )

    const querySnapshot = await getDocs(studentsQuery)
    const studentsData: StudentData[] = []

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      studentsData.push({
        uid: doc.id,
        email: data.email || '',
        fullName: data.fullName || 'N/A',
        phone: data.phone || 'N/A',
        branch: data.branch || 'Not specified',
        address: data.address || 'Not specified',
        guardianName: data.guardianName || 'Not available',
        guardianPhone: data.guardianPhone || 'Not available',
        role: data.role || 'student',
        emailVerified: data.emailVerified || false,
        registrationComplete: data.registrationComplete || false,
        onboardingComplete: data.onboardingComplete || false,
        isStudentActive: data.isStudentActive !== false,
        deactivationReason: data.deactivationReason,
        createdAt: data.createdAt,
        schoolFeeInfo: data.schoolFeeInfo || {},
        growthInfo: data.growthInfo || {},
        termsAgreed: data.termsAgreed || false,
        gender: data.gender,
        occupation: data.occupation,
        owingStatus: data.owingStatus || 'Not Set',
      })
    })

    setStudents(studentsData)
  }

  return { students, loading, error, refetch }
}
