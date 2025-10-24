import { useState, useEffect, useCallback } from 'react'
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from 'firebase/firestore'
import { portalDb } from '../portalFirebaseConfig'
import {
  ClassPlanSyllabus,
  UpdateClassPlanSyllabusData,
} from '../types/syllabus.types'

interface UseClassPlanSyllabiProps {
  classId?: string
  classPlan?: string
}

export function useClassPlanSyllabi({
  classId,
  classPlan,
}: UseClassPlanSyllabiProps = {}) {
  const [classPlanSyllabi, setClassPlanSyllabi] = useState<ClassPlanSyllabus[]>(
    [],
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchClassPlanSyllabi = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      let q = query(collection(portalDb, 'classPlanSyllabi'))

      if (classId) {
        q = query(q, where('classId', '==', classId))
      }

      if (classPlan) {
        q = query(q, where('classPlan', '==', classPlan))
      }

      const querySnapshot = await getDocs(q)
      const syllabiData: ClassPlanSyllabus[] = []

      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data()
        syllabiData.push({
          id: docSnap.id,
          classId: data.classId,
          cohortName: data.cohortName,
          classPlan: data.classPlan,
          baseSyllabusId: data.baseSyllabusId,
          syllabus: data.syllabus,
          startDate: data.startDate?.toDate() || new Date(data.startDate),
          endDate: data.endDate?.toDate() || new Date(data.endDate),
          scheduledDays: data.scheduledDays || {},
          createdAt: data.createdAt?.toDate() || new Date(data.createdAt),
          updatedAt: data.updatedAt?.toDate() || new Date(data.updatedAt),
          createdBy: data.createdBy,
          isActive: data.isActive,
        })
      })

      setClassPlanSyllabi(syllabiData)
    } catch (err) {
      console.error('Error fetching class plan syllabi:', err)
      setError('Failed to load class plan syllabi')
    } finally {
      setLoading(false)
    }
  }, [classId, classPlan])

  const updateClassPlanSyllabus = useCallback(
    async (syllabusId: string, updates: UpdateClassPlanSyllabusData) => {
      try {
        const syllabusRef = doc(portalDb, 'classPlanSyllabi', syllabusId)
        await updateDoc(syllabusRef, {
          ...updates,
          updatedAt: new Date(),
        })

        // Refresh the data
        await fetchClassPlanSyllabi()
        return true
      } catch (err) {
        console.error('Error updating class plan syllabus:', err)
        throw err
      }
    },
    [fetchClassPlanSyllabi],
  )

  useEffect(() => {
    if (classId) {
      fetchClassPlanSyllabi()
    }
  }, [classId, fetchClassPlanSyllabi])

  return {
    classPlanSyllabi,
    loading,
    error,
    refetch: fetchClassPlanSyllabi,
    updateClassPlanSyllabus,
  }
}
