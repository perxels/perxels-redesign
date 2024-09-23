import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebaseConfig'
import { Video } from '../utils/types'




export const useFetchVideos = () => {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const fetchVideos = async () => {
    setLoading(true)
    try {
        const querySnapshot = await getDocs(collection(db, 'libraryVideos'))
        const videosData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Video[]
        setVideos(videosData)
    } catch (error) {
      console.error('Error fetching classes:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {

    fetchVideos()
  }, [])

  return { videos, loading, refetchVideos:fetchVideos }
}


