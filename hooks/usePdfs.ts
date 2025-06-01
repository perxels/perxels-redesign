import { useEffect, useState } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../firebaseConfig'
import { PDFDocument } from '../utils/types'

export const useFetchPdfs = () => {
  const [pdfs, setPdfs] = useState<PDFDocument[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    setLoading(true)
    const unsubscribe = onSnapshot(collection(db, 'libraryPDFs'), (querySnapshot) => {
      const pdfsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as PDFDocument[]
      setPdfs(pdfsData)
      setLoading(false)
    }, (error) => {
      console.error('Error fetching PDFs:', error)
      setLoading(false)
    })

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [])

  return { pdfs, loading }
}


