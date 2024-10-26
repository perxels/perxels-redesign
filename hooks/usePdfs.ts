import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebaseConfig'
import { PDFDocument } from '../utils/types'




export const useFetchPdfs = () => {
  const [pdfs, setPdfs] = useState<PDFDocument[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const fetchPdfs = async () => {
    setLoading(true)
    try {
        const querySnapshot = await getDocs(collection(db, 'libraryPDFs'))
        const pdfsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as PDFDocument[]
        setPdfs(pdfsData)
    } catch (error) {
      console.error('Error fetching classes:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {

    fetchPdfs()
  }, [])

  return { pdfs, loading, refetchPdfs:fetchPdfs }
}


