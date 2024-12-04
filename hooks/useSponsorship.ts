import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebaseConfig'
import { ClassDetails, SponsorshipHero } from '../utils/types'




export const useSponsorshipClass = () => {
  const [classData, setClassData] = useState<ClassDetails[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const fetchSponsorshipClass = async () => {
    setLoading(true)
    try {
        const classCollection = collection(db, 'sponsorshipClasses');
        const classSnapshot = await getDocs(classCollection);
        const classList = classSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ClassDetails[];
        setClassData(classList);
    } catch (error) {
      console.error('Error fetching classes:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {

    fetchSponsorshipClass()
  }, [])

  return { classData, loading, refetchClass:fetchSponsorshipClass }
}


export const useSponsorshipHero = () => {
  const [heroData, setHeroData] = useState<SponsorshipHero[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const fetchClassHero = async () => {
    setIsLoading(true)
    try {
        const heroCollection = collection(db, 'sponsorshipHero');
        const heroSnapshot = await getDocs(heroCollection);
        const heroList = heroSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as SponsorshipHero[];
        setHeroData(heroList);
    } catch (error) {
      console.error('Error fetching hero Data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {

    fetchClassHero()
  }, [])

  return {heroData, isLoading, refetchHero:fetchClassHero }
}
