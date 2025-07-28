import { doc, setDoc, getDoc, collection, getDocs, query, where } from 'firebase/firestore'
import { portalDb } from '../../portalFirebaseConfig'
import { Attendance, Checkin } from '../../types/attendance.types'

export async function createAttendance(attendance: Attendance) {
  const attendanceRef = doc(portalDb, 'attendance', attendance.attendanceId)
  await setDoc(attendanceRef, attendance)
}

export async function checkInStudent(attendanceId: string, studentId: string) {
  const checkinRef = doc(portalDb, 'attendance', attendanceId, 'checkins', studentId)
  await setDoc(checkinRef, {
    checkedIn: true,
    checkInTime: new Date(),
  })
}

export async function getCheckins(attendanceId: string): Promise<Checkin[]> {
  const checkinsRef = collection(portalDb, 'attendance', attendanceId, 'checkins')
  const snapshot = await getDocs(checkinsRef)
  return snapshot.docs.map(doc => ({ studentId: doc.id, ...doc.data() } as Checkin))
}

/**
 * Find attendance records with case-insensitive classId matching
 * This handles the issue where classId values might have different casing
 */
export async function findAttendanceByClassId(classId: string, date?: string) {
  // Try original case first
  let q = query(
    collection(portalDb, 'attendance'),
    where('classId', '==', classId),
    ...(date ? [where('date', '==', date)] : [])
  )
  let snapshot = await getDocs(q)
  
  // If no results, try lowercase
  if (snapshot.empty) {
    q = query(
      collection(portalDb, 'attendance'),
      where('classId', '==', classId.toLowerCase()),
      ...(date ? [where('date', '==', date)] : [])
    )
    snapshot = await getDocs(q)
  }
  
  // If still no results, try uppercase
  if (snapshot.empty) {
    q = query(
      collection(portalDb, 'attendance'),
      where('classId', '==', classId.toUpperCase()),
      ...(date ? [where('date', '==', date)] : [])
    )
    snapshot = await getDocs(q)
  }
  
  return snapshot
}

export async function didStudentCheckIn(attendanceId: string, studentId: string): Promise<Checkin | null> {
  const checkinRef = doc(portalDb, 'attendance', attendanceId, 'checkins', studentId)
  const docSnap = await getDoc(checkinRef)
  return docSnap.exists() ? (docSnap.data() as Checkin) : null
}

export function generateAttendanceCode(): string {
  const random = Math.floor(1000 + Math.random() * 9000)
  return `COP${random}`
}

export async function getStudentsInCohort(cohortName: string) {
  const usersQuery = query(
    collection(portalDb, 'users'),
    where('schoolFeeInfo.cohort', '==', cohortName),
    where('role', '==', 'student')
  )
  const snapshot = await getDocs(usersQuery)
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
} 