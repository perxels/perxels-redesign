import { useEffect, useState } from 'react'
import { AdminMasterClass } from '../utils/types'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebaseConfig'

export const useFetchMasterClass = () => {
  const [masterClasses, setMasterClasses] = useState<AdminMasterClass[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const fetchMasterClasses = async () => {
    setLoading(true)
    try {
      const querySnapshot = await getDocs(collection(db, 'adminMasterClasses'))
      const masterClassesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as AdminMasterClass[]
      setMasterClasses(masterClassesData)
    } catch (error) {
      console.error('Error fetching master classes:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMasterClasses()
  }, [])

  return { masterClasses, loading, refetchMasterClasses: fetchMasterClasses }
}
