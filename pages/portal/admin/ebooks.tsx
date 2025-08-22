import { useEffect } from 'react'
import { useRouter } from 'next/router'

const AdminEbooksPage = () => {
  const router = useRouter()

  useEffect(() => {
    router.replace('/portal/admin/library')
  }, [router])

  return null
}

export default AdminEbooksPage
