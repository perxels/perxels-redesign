import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@chakra-ui/react'
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore'
import { ScheduledDay } from '../components/SyllabusComponents'
import { portalDb } from '../../../../../portalFirebaseConfig'
import { Syllabus, SyllabusDay } from '../../../../../types/syllabus.types'
import { usePortalAuth } from '../../../../../hooks/usePortalAuth'

interface UseSyllabusManagerProps {
  classId: string
  currentSyllabusId?: string
  onSyllabusUpdate?: (syllabusId: string) => void
}

export const useSyllabusManager = ({ classId, currentSyllabusId, onSyllabusUpdate }: UseSyllabusManagerProps) => {
  // State
  const [syllabus, setSyllabus] = useState<Syllabus | null>(null)
  const [availableSyllabi, setAvailableSyllabi] = useState<Syllabus[]>([])
  const [scheduledDays, setScheduledDays] = useState<Record<string, ScheduledDay>>({})
  const [loading, setLoading] = useState(true)
  const [loadingSyllabi, setLoadingSyllabi] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingDay, setEditingDay] = useState<string | null>(null)
  const [editDayTitle, setEditDayTitle] = useState('')
  const [editDayContent, setEditDayContent] = useState('')
  const [savingDayEdit, setSavingDayEdit] = useState(false)
  
  // Hooks
  const toast = useToast()
  const { user, portalUser } = usePortalAuth()

  // Computed values
  const isAdmin = portalUser?.role === 'admin'

  // Fetch current syllabus
  const fetchCurrentSyllabus = useCallback(async () => {
    if (!currentSyllabusId) {
      setSyllabus(null)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const syllabusRef = doc(portalDb, 'syllabi', currentSyllabusId)
      const syllabusSnap = await getDoc(syllabusRef)

      if (syllabusSnap.exists()) {
        const syllabusData = syllabusSnap.data() as any
        setSyllabus({
          id: syllabusSnap.id,
          name: syllabusData.name,
          description: syllabusData.description,
          totalWeeks: syllabusData.totalWeeks,
          totalDays: syllabusData.totalDays,
          weeks: syllabusData.weeks,
          createdAt: syllabusData.createdAt?.toDate() || new Date(),
          updatedAt: syllabusData.updatedAt?.toDate() || new Date(),
          createdBy: syllabusData.createdBy,
          isActive: syllabusData.isActive,
          version: syllabusData.version,
        })
      } else {
        setSyllabus(null)
        setError('Syllabus not found')
      }
    } catch (err) {
      console.error('Error fetching syllabus:', err)
      setError('Failed to load syllabus')
      setSyllabus(null)
    } finally {
      setLoading(false)
    }
  }, [currentSyllabusId])

  // Fetch available syllabi
  const fetchAvailableSyllabi = useCallback(async () => {
    if (!isAdmin) return

    setLoadingSyllabi(true)
    try {
      const querySnapshot = await getDocs(collection(portalDb, 'syllabi'))
      const syllabiData: Syllabus[] = querySnapshot.docs
        .map((doc) => {
          const data = doc.data()
          return {
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
          }
        })
        .filter((s) => s.isActive) // Only show active syllabi
      setAvailableSyllabi(syllabiData)
    } catch (err) {
      console.error('Error fetching syllabi:', err)
    } finally {
      setLoadingSyllabi(false)
    }
  }, [isAdmin])

  // Fetch scheduled days
  const fetchScheduledDays = useCallback(async () => {
    if (!classId || !isAdmin) return

    try {
      const classRef = doc(portalDb, 'classes', classId)
      const classSnap = await getDoc(classRef)

      if (classSnap.exists()) {
        const classData = classSnap.data()
        const savedScheduledDays = classData.scheduledDays || {}
        
        // Convert Firestore Timestamps to Date objects
        const convertedScheduledDays: Record<string, ScheduledDay> = {}
        Object.keys(savedScheduledDays).forEach(dayId => {
          const dayData = savedScheduledDays[dayId]
          convertedScheduledDays[dayId] = {
            scheduledDate: dayData.scheduledDate?.toDate() || new Date(),
            isCompleted: dayData.isCompleted || false,
            notes: dayData.notes || ''
          }
        })
        
        setScheduledDays(convertedScheduledDays)
      }
    } catch (err) {
      console.error('Error fetching scheduled days:', err)
    }
  }, [classId, isAdmin])

  // Effects
  useEffect(() => {
    fetchCurrentSyllabus()
  }, [fetchCurrentSyllabus])

  useEffect(() => {
    if (syllabus) {
      fetchScheduledDays()
    }
  }, [syllabus, fetchScheduledDays])

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && editingDay) {
        cancelEditingDay()
      }
    }

    if (editingDay) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [editingDay])

  // Day content editing functions
  const startEditingDay = useCallback((day: SyllabusDay) => {
    setEditingDay(day.id)
    setEditDayTitle(day.title)
    setEditDayContent(day.content)
  }, [])

  const cancelEditingDay = useCallback(() => {
    setEditingDay(null)
    setEditDayTitle('')
    setEditDayContent('')
  }, [])

  const handleTitleChange = useCallback((title: string) => {
    setEditDayTitle(title)
  }, [])

  const handleContentChange = useCallback((content: string) => {
    setEditDayContent(content)
  }, [])

  const saveDayEdit = useCallback(async (day: SyllabusDay) => {
    if (!user?.uid || !isAdmin || !syllabus) return

    // Validation
    if (!editDayTitle.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Day title cannot be empty',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    if (!editDayContent.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Day content cannot be empty',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    try {
      setSavingDayEdit(true)

      // Find the week and day to update
      const updatedWeeks = syllabus.weeks.map(week => ({
        ...week,
        days: week.days.map(d => 
          d.id === day.id 
            ? { ...d, title: editDayTitle, content: editDayContent }
            : d
        )
      }))

      // Update the syllabus in Firestore
      const syllabusRef = doc(portalDb, 'syllabi', syllabus.id)
      await updateDoc(syllabusRef, {
        weeks: updatedWeeks,
        updatedAt: new Date()
      })

      // Update local state
      setSyllabus(prev => prev ? {
        ...prev,
        weeks: updatedWeeks
      } : null)

      cancelEditingDay()

      toast({
        title: 'Day Updated Successfully! ✅',
        description: 'Day content has been updated',
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
    } catch (err) {
      console.error('Error updating day content:', err)
      toast({
        title: 'Error',
        description: 'Failed to update day content',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setSavingDayEdit(false)
    }
  }, [user?.uid, isAdmin, syllabus, editDayTitle, editDayContent, toast, cancelEditingDay])

  // Schedule management functions
  const saveScheduledDayInline = useCallback(async (dayId: string, scheduledDay: ScheduledDay) => {
    if (!user?.uid || !isAdmin) return

    try {
      const newScheduledDays = {
        ...scheduledDays,
        [dayId]: scheduledDay,
      }

      await updateDoc(doc(portalDb, 'classes', classId), {
        scheduledDays: newScheduledDays,
        updatedAt: new Date(),
      })

      setScheduledDays(newScheduledDays)

      toast({
        title: 'Updated Successfully! ✅',
        description: 'Day schedule has been updated',
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
    } catch (err) {
      console.error('Error updating scheduled day:', err)
      toast({
        title: 'Error',
        description: 'Failed to update day schedule',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }, [user?.uid, isAdmin, scheduledDays, classId, toast])

  const getScheduledDay = useCallback((dayId: string): ScheduledDay | null => {
    return scheduledDays[dayId] || null
  }, [scheduledDays])

  const handleScheduleUpdate = useCallback((dayId: string, scheduledDay: ScheduledDay) => {
    setScheduledDays(prev => ({
      ...prev,
      [dayId]: scheduledDay
    }))
  }, [])

  // Syllabus assignment functions
  const handleAssignSyllabus = useCallback(async (syllabusId: string) => {
    if (!user?.uid || !isAdmin) return

    try {
      // Update the class with the new syllabus ID
      await updateDoc(doc(portalDb, 'classes', classId), {
        syllabusId: syllabusId,
        updatedAt: new Date(),
      })

      // Update local state
      const selectedSyllabus = availableSyllabi.find((s) => s.id === syllabusId)
      if (selectedSyllabus) {
        setSyllabus(selectedSyllabus)
      }

      // Notify parent component
      if (onSyllabusUpdate) {
        onSyllabusUpdate(syllabusId)
      }

      toast({
        title: 'Syllabus Assigned Successfully! ✅',
        description: 'The syllabus has been assigned to this class',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      return true // Success
    } catch (err) {
      console.error('Error assigning syllabus:', err)
      toast({
        title: 'Error',
        description: 'Failed to assign syllabus',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      return false // Error
    }
  }, [user?.uid, isAdmin, classId, availableSyllabi, onSyllabusUpdate, toast])

  const handleRemoveSyllabus = useCallback(async () => {
    if (!user?.uid || !isAdmin) return

    try {
      // Remove syllabus from class
      await updateDoc(doc(portalDb, 'classes', classId), {
        syllabusId: null,
        updatedAt: new Date(),
      })

      setSyllabus(null)

      // Notify parent component
      if (onSyllabusUpdate) {
        onSyllabusUpdate('')
      }

      toast({
        title: 'Syllabus Removed Successfully! 🗑️',
        description: 'The syllabus has been removed from this class',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    } catch (err) {
      console.error('Error removing syllabus:', err)
      toast({
        title: 'Error',
        description: 'Failed to remove syllabus',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }, [user?.uid, isAdmin, classId, onSyllabusUpdate, toast])

  // Utility functions
  const safeToISOString = useCallback((date: any): string => {
    if (!date) return ''
    try {
      // If it's a Firestore Timestamp, convert to Date first
      if (date.toDate && typeof date.toDate === 'function') {
        return date.toDate().toISOString().split('T')[0]
      }
      // If it's already a Date object
      if (date instanceof Date) {
        return date.toISOString().split('T')[0]
      }
      // If it's a string, try to parse it
      if (typeof date === 'string') {
        return new Date(date).toISOString().split('T')[0]
      }
      // Fallback
      return new Date(date).toISOString().split('T')[0]
    } catch (error) {
      console.error('Error converting date to ISO string:', error)
      return ''
    }
  }, [])

  return {
    // State
    syllabus,
    availableSyllabi,
    scheduledDays,
    loading,
    loadingSyllabi,
    error,
    editingDay,
    editDayTitle,
    editDayContent,
    savingDayEdit,
    isAdmin,
    
    // Actions
    fetchAvailableSyllabi,
    startEditingDay,
    cancelEditingDay,
    handleTitleChange,
    handleContentChange,
    saveDayEdit,
    saveScheduledDayInline,
    getScheduledDay,
    handleScheduleUpdate,
    handleAssignSyllabus,
    handleRemoveSyllabus,
    safeToISOString,
  }
}
