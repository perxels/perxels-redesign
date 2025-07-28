import { useState, useEffect, useCallback } from 'react'
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'
import { portalDb } from '../portalFirebaseConfig'

interface ClassData {
  id: string
  cohortName: string
  startDate: Date
  endDate: Date
  createdBy: string
  createdAt: any
  status: 'active' | 'inactive' | 'completed'
  studentsCount: number
  branch?: string
  paymentStatus?: 'pending' | 'partial' | 'completed' | 'overdue'
}

interface UseClassesOptions {
  status?: 'active' | 'inactive' | 'completed'
  branch?: string
  limit?: number
}

interface UseClassesReturn {
  classes: ClassData[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useClasses(options: UseClassesOptions = {}): UseClassesReturn {
  const [classes, setClasses] = useState<ClassData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchClasses = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      let q = query(collection(portalDb, 'classes'), orderBy('createdAt', 'desc'))
      if (options.status) {
        q = query(q, where('status', '==', options.status))
      }
      if (options.branch) {
        q = query(q, where('branch', '==', options.branch))
      }
      const snapshot = await getDocs(q)
      let data: ClassData[] = snapshot.docs.map(doc => {
        const d = doc.data()
        return {
          id: doc.id,
          cohortName: d.cohortName,
          startDate: d.startDate?.toDate ? d.startDate.toDate() : new Date(d.startDate),
          endDate: d.endDate?.toDate ? d.endDate.toDate() : new Date(d.endDate),
          createdBy: d.createdBy,
          createdAt: d.createdAt,
          status: d.status || 'active',
          studentsCount: d.studentsCount || 0,
          branch: d.branch || 'Not specified',
          paymentStatus: d.paymentStatus || 'pending',
        }
      })
      if (options.limit) {
        data = data.slice(0, options.limit)
      }
      setClasses(data)
    } catch (err) {
      console.error('Error fetching classes:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch classes')
      setClasses([])
    } finally {
      setLoading(false)
    }
  }, [options.status, options.branch, options.limit])

  useEffect(() => {
    fetchClasses()
  }, [fetchClasses])

  return {
    classes,
    loading,
    error,
    refetch: fetchClasses
  }
}

// Convenience hooks for common use cases
export function useActiveClasses() {
  return useClasses({ status: 'active' })
}

export function useClassesByBranch(branch: string) {
  return useClasses({ branch })
} 