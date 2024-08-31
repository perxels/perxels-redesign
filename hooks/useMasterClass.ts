import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebaseConfig'
import { MasterClass, MasterClassHero } from '../utils/types'




export const useFetchMasterClass = () => {
  const [classes, setClasses] = useState<MasterClass[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const fetchMasterClass = async () => {
    setLoading(true)
    try {
        const querySnapshot = await getDocs(collection(db, 'masterClasses'))
        const classesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as MasterClass[]
        setClasses(classesData)
    } catch (error) {
      console.error('Error fetching classes:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {

    fetchMasterClass()
  }, [])

  return { classes, loading, refetchClasses:fetchMasterClass }
}


export const useFetchMasterclassHero = () => {
  const [heroData, setHeroData] = useState<MasterClassHero[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const fetchMasterClassHero = async () => {
    setLoading(true)
    try {
        const querySnapshot = await getDocs(collection(db, 'masterClassesHero'))
        const heroData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as MasterClassHero[]
        setHeroData(heroData)
    } catch (error) {
      console.error('Error fetching hero Data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {

    fetchMasterClassHero()
  }, [])

  return {heroData, loading, refetchHero:fetchMasterClassHero }
}
