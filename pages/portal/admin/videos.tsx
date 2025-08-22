import { useEffect } from 'react'
import { useRouter } from 'next/router'

const AdminVideosPage = () => {
  const router = useRouter()

  useEffect(() => {
    router.replace('/portal/admin/library')
  }, [router])

  return null
}

export default AdminVideosPage 