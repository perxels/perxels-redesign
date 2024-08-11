import { useEffect, useState } from 'react'
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '../firebaseConfig'

interface Banner {
  id: string
  mainTitle: string
  subTitle: string
  location: string
  bannerImage?: string
  description: string
  content1: string
  content2: string
  content3: string
  content4: string
  speakerName: string
  speakerRole: string
  endDate: string
  startTime: string
  endTime: string
}

export const useActiveBanner = () => {
  const [banner, setBanner] = useState<Banner | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const now = new Date()
        const bannersQuery = query(
          collection(db, 'banners'),
          where('endDate', '>=', now.toISOString().slice(0, 10)),
          orderBy('endDate', 'asc'),
          limit(1)
        )
        const bannersSnapshot = await getDocs(bannersQuery)
        if (bannersSnapshot.empty) {
          setBanner(null)
        } else {
          const bannerData = bannersSnapshot.docs[0].data() as Banner
          setBanner(bannerData)
        }
      } catch (error) {
        console.error('Error fetching banner:', error)
        setBanner(null)
      } finally {
        setLoading(false)
      }
    }

    fetchBanner()
  }, [])

  return { banner, loading }
}

export const useFetchBanner = () => {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const fetchBanners = async () => {
    setLoading(true)
    try {
      const bannersCollection = collection(db, 'banners')
      const bannersSnapshot = await getDocs(bannersCollection)
      const bannersList: Banner[] = bannersSnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Banner),
      )
      setBanners(bannersList)
    } catch (error) {
      console.error('Error fetching banners:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {

    fetchBanners()
  }, [])

  return { banners, loading, refetchBanners:fetchBanners }
}
