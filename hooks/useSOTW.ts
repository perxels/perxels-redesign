import { useState, useEffect } from 'react'
import {
  doc,
  onSnapshot,
  collection,
  query,
  orderBy,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  where,
  getDoc,
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { portalDb, portalStorage } from '../portalFirebaseConfig'
import {
  SOTWData,
  SOTWHistory,
  SOTWComment,
  SOTWImage,
} from '../types/sotw.types'

export function useCurrentSOTW() {
  const [currentSOTW, setCurrentSOTW] = useState<SOTWData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(portalDb, 'sotw', 'current'),
      (doc) => {
        try {
          if (doc.exists()) {
            const data = doc.data()
            const sotwData: SOTWData = {
              id: doc.id,
              studentId: data.studentId,
              studentName: data.studentName,
              studentEmail: data.studentEmail,
              studentAvatar: data.studentAvatar,
              cohort: data.cohort,
              classPlan: data.classPlan,
              citation: data.citation,
              workHighlight: data.workHighlight,
              workImages:
                data.workImages?.map((img: any) => ({
                  ...img,
                  uploadedAt: img.uploadedAt?.toDate(),
                })) || [],
              selectedBy: data.selectedBy,
              selectedByEmail: data.selectedByEmail,
              selectedAt: data.selectedAt?.toDate(),
              weekStart: data.weekStart?.toDate(),
              weekEnd: data.weekEnd?.toDate(),
              isActive: data.isActive,
              likes: data.likes || [],
              comments:
                data.comments?.map((comment: any) => ({
                  ...comment,
                  createdAt: comment.createdAt?.toDate(),
                })) || [],
            }
            setCurrentSOTW(sotwData)
          } else {
            setCurrentSOTW(null)
          }
          setLoading(false)
        } catch (err: any) {
          setError('Failed to parse SOTW data')
          setLoading(false)
        }
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      },
    )

    return unsubscribe
  }, [])

  return { currentSOTW, loading, error }
}

export function useSOTWHistory() {
  const [history, setHistory] = useState<SOTWHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const q = query(
          collection(portalDb, 'sotwHistory'),
          orderBy('weekStart', 'desc'),
        )
        const snapshot = await getDocs(q)
        const historyData = snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
              selectedAt: doc.data().selectedAt?.toDate(),
              weekStart: doc.data().weekStart?.toDate(),
              weekEnd: doc.data().weekEnd?.toDate(),
              archivedAt: doc.data().archivedAt?.toDate(),
              workImages:
                doc.data().workImages?.map((img: any) => ({
                  ...img,
                  uploadedAt: img.uploadedAt?.toDate(),
                })) || [],
            } as SOTWHistory),
        )
        setHistory(historyData)
        setLoading(false)
      } catch (err: any) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

  return { history, loading, error }
}

export function useSOTWActions() {
  const setSOTW = async (
    studentData: {
      studentId: string
      studentName: string
      studentEmail: string
      studentAvatar?: string
      cohort: string
      classPlan: string
      citation: string
      workHighlight: string
      workImages: SOTWImage[]
    },
    adminUser: any,
  ) => {
    try {
      // Archive current SOTW if exists
      const currentDocRef = doc(portalDb, 'sotw', 'current')
      const currentDoc = await getDoc(currentDocRef)

      if (currentDoc.exists()) {
        const currentData = currentDoc.data()
        await addDoc(collection(portalDb, 'sotwHistory'), {
          ...currentData,
          archivedAt: new Date(),
          totalLikes: currentData.likes?.length || 0,
          totalComments: currentData.comments?.length || 0,
        })
      }

      // Set new SOTW with proper data validation
      const weekStart = new Date()
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekEnd.getDate() + 7)

      // Ensure all fields have proper values (no undefined)
      const newSOTW = {
        studentId: studentData.studentId,
        studentName: studentData.studentName,
        studentEmail: studentData.studentEmail,
        studentAvatar: studentData.studentAvatar || '', // Ensure not undefined
        cohort: studentData.cohort,
        classPlan: studentData.classPlan,
        citation: studentData.citation,
        workHighlight: studentData.workHighlight,
        workImages: studentData.workImages.map((img) => ({
          id: img.id,
          url: img.url,
          caption: img.caption || '', // Ensure caption is not undefined
          uploadedAt: img.uploadedAt,
        })),
        selectedBy: adminUser.uid,
        selectedByEmail: adminUser.email,
        selectedAt: new Date(),
        weekStart,
        weekEnd,
        isActive: true,
        likes: [],
        comments: [],
      }

      console.log('💾 Saving SOTW to Firestore:', newSOTW)
      await setDoc(currentDocRef, newSOTW)
      return { success: true }
    } catch (error: any) {
      console.error('❌ Error setting SOTW:', error)
      return { success: false, error: error.message }
    }
  }

  const deactivateSOTW = async () => {
    try {
      const currentDocRef = doc(portalDb, 'sotw', 'current')
      const currentDoc = await getDoc(currentDocRef)

      if (currentDoc.exists()) {
        const currentData = currentDoc.data()
        // Archive current SOTW
        await addDoc(collection(portalDb, 'sotwHistory'), {
          ...currentData,
          archivedAt: new Date(),
          totalLikes: currentData.likes?.length || 0,
          totalComments: currentData.comments?.length || 0,
        })

        // Remove current SOTW
        await deleteDoc(currentDocRef)
        return { success: true }
      }
      return { success: false, error: 'No active SOTW found' }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const deleteSOTWHistory = async (historyId: string) => {
    try {
      await deleteDoc(doc(portalDb, 'sotwHistory', historyId))
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const addComment = async (comment: string, user: any) => {
    try {
      const currentDocRef = doc(portalDb, 'sotw', 'current')
      const newComment: SOTWComment = {
        id: Date.now().toString(),
        userId: user.uid,
        userName: user.fullName,
        userAvatar: user.growthInfo?.pictureUrl,
        comment: comment.trim(),
        createdAt: new Date(),
        isActive: true,
      }

      await updateDoc(currentDocRef, {
        comments: arrayUnion(newComment),
      })

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const toggleLike = async (userId: string, currentLikes: string[]) => {
    try {
      const currentDocRef = doc(portalDb, 'sotw', 'current')
      const isLiked = currentLikes.includes(userId)

      if (isLiked) {
        await updateDoc(currentDocRef, {
          likes: arrayRemove(userId),
        })
      } else {
        await updateDoc(currentDocRef, {
          likes: arrayUnion(userId),
        })
      }

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  return {
    setSOTW,
    deactivateSOTW,
    deleteSOTWHistory,
    addComment,
    toggleLike,
  }
}
