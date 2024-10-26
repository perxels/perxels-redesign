import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebaseConfig'
import { Testimonial } from '../utils/types'




export const useFetchTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const fetchTestimonials = async () => {
    setLoading(true)
    try {
        const querySnapshot = await getDocs(collection(db, 'testimonials'))
        const testimonialsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Testimonial[]
        setTestimonials(testimonialsData)
    } catch (error) {
      console.error('Error fetching testimonials:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {

    fetchTestimonials()
  }, [])

  return { testimonials, loading, refetchTestimonials:fetchTestimonials }
}


