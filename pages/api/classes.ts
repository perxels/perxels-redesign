import { NextApiRequest, NextApiResponse } from 'next'
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore'
import { portalDb } from '../../portalFirebaseConfig'

interface ClassData {
  id: string
  cohortName: string
  startDate: Date
  endDate: Date
  createdBy: string
  createdAt: any
  status: 'active' | 'inactive' | 'completed'
  studentsCount: number
  branch?: string
  paymentStatus?: 'pending' | 'partial' | 'completed' | 'overdue'
}

interface ClassesResponse {
  success: boolean
  classes?: ClassData[]
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ClassesResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    })
  }

  try {
    const { status, branch, limit } = req.query

    // Build query
    let classesQuery = query(
      collection(portalDb, 'classes'),
      orderBy('createdAt', 'desc')
    )

    // Add status filter if provided
    if (status && typeof status === 'string') {
      classesQuery = query(classesQuery, where('status', '==', status))
    }

    // Add branch filter if provided
    if (branch && typeof branch === 'string') {
      classesQuery = query(classesQuery, where('branch', '==', branch))
    }

    const querySnapshot = await getDocs(classesQuery)
    const classesData: ClassData[] = []

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      classesData.push({
        id: doc.id,
        cohortName: data.cohortName,
        startDate: data.startDate?.toDate() || new Date(),
        endDate: data.endDate?.toDate() || new Date(),
        createdBy: data.createdBy,
        createdAt: data.createdAt,
        status: data.status || 'active',
        studentsCount: data.studentsCount || 0,
        branch: data.branch || 'Not specified',
        paymentStatus: data.paymentStatus || 'pending',
      })
    })

    // Apply limit if provided
    const limitedClasses = limit 
      ? classesData.slice(0, parseInt(limit as string))
      : classesData

    return res.status(200).json({
      success: true,
      classes: limitedClasses
    })
  } catch (error) {
    console.error('Error fetching classes:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch classes'
    })
  }
} 