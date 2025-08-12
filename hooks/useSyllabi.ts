import { useState, useEffect, useCallback } from 'react'
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'
import { portalDb } from '../portalFirebaseConfig'
import { Syllabus } from '../types/syllabus.types'

interface UseSyllabiOptions {
  isActive?: boolean
  limit?: number
}

interface UseSyllabiReturn {
  syllabi: Syllabus[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useSyllabi(options: UseSyllabiOptions = {}): UseSyllabiReturn {
  const [syllabi, setSyllabi] = useState<Syllabus[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSyllabi = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      let q = query(collection(portalDb, 'syllabi'), orderBy('createdAt', 'desc'))
      
      if (options.isActive !== undefined) {
        q = query(q, where('isActive', '==', options.isActive))
      }
      
      const snapshot = await getDocs(q)
      const syllabiData: Syllabus[] = snapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          name: data.name,
          description: data.description,
          totalWeeks: data.totalWeeks,
          totalDays: data.totalDays,
          weeks: data.weeks,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          createdBy: data.createdBy,
          isActive: data.isActive,
          version: data.version,
        }
      })

      if (options.limit) {
        syllabiData.splice(options.limit)
      }

      setSyllabi(syllabiData)
    } catch (err) {
      console.error('Error fetching syllabi:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch syllabi')
      setSyllabi([])
    } finally {
      setLoading(false)
    }
  }, [options.isActive, options.limit])

  useEffect(() => {
    fetchSyllabi()
  }, [fetchSyllabi])

  return {
    syllabi,
    loading,
    error,
    refetch: fetchSyllabi
  }
}
