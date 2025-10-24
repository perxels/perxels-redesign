// hooks/useSyllabusProgress.ts
import { useState, useEffect } from 'react'
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore'
import { portalDb } from '../portalFirebaseConfig'

export const useSyllabusProgress = (
  classPlanSyllabusId: string,
  studentId?: string,
) => {
  const [progress, setProgress] = useState({
    completedDays: 0,
    totalDays: 0,
    completionPercentage: 0,
    upcomingSessions: [] as any[],
    overdueSessions: [] as any[],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const syllabusRef = doc(
          portalDb,
          'classPlanSyllabi',
          classPlanSyllabusId,
        )
        const syllabusSnap = await getDoc(syllabusRef)

        if (syllabusSnap.exists()) {
          const data = syllabusSnap.data()
          const scheduledDays = data.scheduledDays || {}
          const totalDays = data.syllabus?.totalDays || 0

          // Calculate completed days
          const completedDays = Object.values(scheduledDays).filter(
            (day: any) => day.isCompleted,
          ).length

          // Find upcoming and overdue sessions
          const now = new Date()
          const upcomingSessions = Object.entries(scheduledDays)
            .filter(
              ([_, day]: [string, any]) =>
                !day.isCompleted && new Date(day.scheduledDate) > now,
            )
            .sort(
              ([_, a]: [string, any], [__, b]: [string, any]) =>
                new Date(a.scheduledDate).getTime() -
                new Date(b.scheduledDate).getTime(),
            )
            .slice(0, 5) // Next 5 sessions

          const overdueSessions = Object.entries(scheduledDays).filter(
            ([_, day]: [string, any]) =>
              !day.isCompleted && new Date(day.scheduledDate) < now,
          )

          setProgress({
            completedDays,
            totalDays,
            completionPercentage:
              totalDays > 0 ? (completedDays / totalDays) * 100 : 0,
            upcomingSessions,
            overdueSessions,
          })
        }
      } catch (error) {
        console.error('Error fetching syllabus progress:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProgress()
  }, [classPlanSyllabusId, studentId])

  return { progress, loading }
}
