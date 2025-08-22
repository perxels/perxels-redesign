import { useEffect } from 'react'
import { useRouter } from 'next/router'

const VideosRedirect = () => {
  const router = useRouter()

  useEffect(() => {
    router.replace('/portal/dashboard/library')
  }, [router])

  return null
}

export default VideosRedirect 