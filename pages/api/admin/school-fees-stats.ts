import type { NextApiRequest, NextApiResponse } from 'next'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { portalDb } from '../../../portalFirebaseConfig'

interface StatsResponse {
  totalSchoolFees: number
  totalOwing: number
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<StatsResponse | { error: string }>) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const { branch, classType, classPlan } = req.query

  try {
    const usersQuery = query(collection(portalDb, 'users'), orderBy('fullName'))
    const snapshot = await getDocs(usersQuery)
    let totalSchoolFees = 0
    let totalOwing = 0

    snapshot.forEach(doc => {
      const data = doc.data()
      const fee = data.schoolFeeInfo
      if (!fee) return
      const totalFee = fee.totalSchoolFee || 0
      const totalApproved = fee.totalApproved || 0
      // Filtering logic (same as list)
      if (
        (!branch || branch === 'all' || (data.branch && data.branch.toLowerCase() === String(branch).toLowerCase())) &&
        (!classPlan || (fee.classPlan && fee.classPlan.toLowerCase() === String(classPlan).toLowerCase()))
      ) {
        totalSchoolFees += totalFee
        if (totalApproved < totalFee) {
          totalOwing += (totalFee - totalApproved)
        }
      }
    })

    return res.status(200).json({ totalSchoolFees, totalOwing })
  } catch (error) {
    console.error('Error fetching school fees stats:', error)
    return res.status(500).json({ error: 'Failed to fetch school fees stats' })
  }
} 