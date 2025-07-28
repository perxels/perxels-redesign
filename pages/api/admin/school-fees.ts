import type { NextApiRequest, NextApiResponse } from 'next'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { portalDb } from '../../../portalFirebaseConfig'

interface Installment {
  amount: number
  receipt: string
  status: string // 'approved' | 'unpaid' | other
}

interface SchoolFeeUser {
  id: string
  name: string
  totalFee: number
  installments: Installment[]
  status: 'debtor' | 'paid'
}

interface ApiResponse {
  users: SchoolFeeUser[]
  hasMore: boolean
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse | { error: string }>) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const { status = 'debtor', page = '1', pageSize = '20', branch, classType, classPlan } = req.query
  const pageNum = Math.max(1, parseInt(page as string, 10) || 1)
  const pageSizeNum = Math.max(1, Math.min(100, parseInt(pageSize as string, 10) || 20))

  try {
    // Get all users with schoolFeeInfo
    const usersQuery = query(collection(portalDb, 'users'), orderBy('fullName'))
    const snapshot = await getDocs(usersQuery)
    let allUsers: SchoolFeeUser[] = []

    snapshot.forEach(doc => {
      const data = doc.data()
      const fee = data.schoolFeeInfo
      if (!fee) return
      const totalFee = fee.totalSchoolFee || 0
      const totalApproved = fee.totalApproved || 0
      const payments = Array.isArray(fee.payments) ? fee.payments : []
      // Always return 3 installments
      const installments: Installment[] = [0, 1, 2].map((idx) => {
        const p = payments.find((pay: any) => pay.installmentNumber === idx + 1)
        return p
          ? {
              amount: p.amount || 0,
              receipt: p.paymentReceiptUrl || '',
              status: p.status || 'unpaid',
            }
          : { amount: 0, receipt: '', status: 'unpaid' }
      })
      const userStatus: 'debtor' | 'paid' = totalApproved < totalFee ? 'debtor' : 'paid'
      // Filtering logic
      if (
        ((status === 'debtor' && userStatus === 'debtor') || (status === 'paid' && userStatus === 'paid')) &&
        (!branch || branch === 'all' || (data.branch && data.branch.toLowerCase() === String(branch).toLowerCase())) &&
        (!classPlan || (fee.classPlan && fee.classPlan.toLowerCase() === String(classPlan).toLowerCase()))
      ) {
        allUsers.push({
          id: doc.id,
          name: data.fullName || '',
          totalFee,
          installments,
          status: userStatus,
        })
      }
    })

    // Pagination
    const startIdx = (pageNum - 1) * pageSizeNum
    const paged = allUsers.slice(startIdx, startIdx + pageSizeNum)
    const hasMore = startIdx + pageSizeNum < allUsers.length

    return res.status(200).json({ users: paged, hasMore })
  } catch (error) {
    console.error('Error fetching school fees:', error)
    return res.status(500).json({ error: 'Failed to fetch school fees' })
  }
} 