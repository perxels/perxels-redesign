import { NextApiRequest, NextApiResponse } from 'next'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, where, orderBy } from 'firebase/firestore'
import { portalDb } from '../../portalFirebaseConfig'
import { Syllabus, CreateSyllabusFormData } from '../../types/syllabus.types'

interface SyllabiResponse {
  success: boolean
  syllabi?: Syllabus[]
  syllabus?: Syllabus
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SyllabiResponse>
) {
  if (req.method === 'GET') {
    try {
      const { isActive, limit } = req.query

      let syllabiQuery = query(collection(portalDb, 'syllabi'), orderBy('createdAt', 'desc'))

      if (isActive !== undefined) {
        syllabiQuery = query(syllabiQuery, where('isActive', '==', isActive === 'true'))
      }

      const querySnapshot = await getDocs(syllabiQuery)
      const syllabiData: Syllabus[] = []

      querySnapshot.forEach((doc) => {
        const data = doc.data()
        syllabiData.push({
          id: doc.id,
          name: data.name,
          description: data.description,
          totalWeeks: data.totalWeeks,
          totalDays: data.totalDays,
          weeks: data.weeks,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          createdBy: data.createdBy,
          isActive: data.isActive,
          version: data.version,
        })
      })

      // Apply limit if provided
      const limitedSyllabi = limit 
        ? syllabiData.slice(0, parseInt(limit as string))
        : syllabiData

      return res.status(200).json({
        success: true,
        syllabi: limitedSyllabi
      })
    } catch (error) {
      console.error('Error fetching syllabi:', error)
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch syllabi'
      })
    }
  } else if (req.method === 'POST') {
    try {
      const { name, description, weeks }: CreateSyllabusFormData = req.body

      if (!name || !description || !weeks) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields'
        })
      }

      const syllabusData = {
        name,
        description,
        totalWeeks: weeks.length,
        totalDays: weeks.reduce((acc, week) => acc + week.days.length, 0),
        weeks,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: req.body.createdBy || 'system',
        isActive: true,
        version: '1.0.0',
      }

      const docRef = await addDoc(collection(portalDb, 'syllabi'), syllabusData)

      const newSyllabus: Syllabus = {
        id: docRef.id,
        name,
        description,
        totalWeeks: weeks.length,
        totalDays: weeks.reduce((acc, week) => acc + week.days.length, 0),
        weeks,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: req.body.createdBy || 'system',
        isActive: true,
        version: '1.0.0',
      }

      return res.status(201).json({
        success: true,
        syllabus: newSyllabus
      })
    } catch (error) {
      console.error('Error creating syllabus:', error)
      return res.status(500).json({
        success: false,
        error: 'Failed to create syllabus'
      })
    }
  } else if (req.method === 'PUT') {
    try {
      const { id, ...updateData } = req.body

      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'Syllabus ID is required'
        })
      }

      const updatePayload = {
        ...updateData,
        updatedAt: serverTimestamp(),
      }

      if (updateData.weeks) {
        updatePayload.totalWeeks = updateData.weeks.length
        updatePayload.totalDays = updateData.weeks.reduce((acc: number, week: any) => acc + week.days.length, 0)
      }

      await updateDoc(doc(portalDb, 'syllabi', id), updatePayload)

      return res.status(200).json({
        success: true,
        error: 'Syllabus updated successfully'
      })
    } catch (error) {
      console.error('Error updating syllabus:', error)
      return res.status(500).json({
        success: false,
        error: 'Failed to update syllabus'
      })
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query

      if (!id || typeof id !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Syllabus ID is required'
        })
      }

      await deleteDoc(doc(portalDb, 'syllabi', id))

      return res.status(200).json({
        success: true,
        error: 'Syllabus deleted successfully'
      })
    } catch (error) {
      console.error('Error deleting syllabus:', error)
      return res.status(500).json({
        success: false,
        error: 'Failed to delete syllabus'
      })
    }
  } else {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    })
  }
}
