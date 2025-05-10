import { collection, getDocs } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { db } from '../firebaseConfig'
import { useToast } from '@chakra-ui/react'
import { Advertisement } from '../utils/types'

export const useAdvertisements = () => {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([])
  const [loading, setLoading] = useState(false)

  const toast = useToast()

  const fetchAdvertisements = async () => {
    setLoading(true)
    try {
      const querySnapshot = await getDocs(collection(db, 'advertisements'))
      const advertisementsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as any

      setAdvertisements(advertisementsData)
    } catch (error) {
      toast({
        title: 'Something went wrong!!!',
      })
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchAdvertisements();
  }, [])


  return { advertisements, loading, refetchAdvertisements: fetchAdvertisements }
}
