import {
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
  writeBatch,
} from 'firebase/firestore'
import { portalDb } from '../../portalFirebaseConfig'
import {
  DailyCode,
  Session,
  SessionCheckin,
  AttendanceSummary,
} from '../../types/attendance-v2.types'

// Daily Code Operations
export async function createDailyCode(dailyCode: Omit<DailyCode, 'createdAt'>) {
  // Check if code already exists for this date
  const existingCode = await getDailyCode(dailyCode.date)
  if (existingCode) {
    throw new Error('A daily code already exists for this date')
  }

  const dailyCodeRef = doc(portalDb, 'dailyCodes', dailyCode.date)
  await setDoc(dailyCodeRef, {
    ...dailyCode,
    createdAt: new Date(),
  })
}

export async function getDailyCode(date: string): Promise<DailyCode | null> {
  const dailyCodeRef = doc(portalDb, 'dailyCodes', date)
  const docSnap = await getDoc(dailyCodeRef)
  return docSnap.exists() ? (docSnap.data() as DailyCode) : null
}

export async function getAllDailyCodes(filters?: {
  status?: 'active' | 'expired' | 'all'
}): Promise<DailyCode[]> {
  let q = query(collection(portalDb, 'dailyCodes'), orderBy('date', 'desc'))

  if (filters?.status && filters.status !== 'all') {
    q = query(q, where('status', '==', filters.status))
  }

  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ ...doc.data() } as DailyCode))
}

export async function expireDailyCode(date: string) {
  // First, get all sessions associated with this daily code
  const sessionsQuery = query(
    collection(portalDb, 'sessions'),
    where('dailyCodeId', '==', date),
  )
  const sessionsSnapshot = await getDocs(sessionsQuery)

  // Update all associated sessions to 'closed' status
  const batch = writeBatch(portalDb)
  sessionsSnapshot.docs.forEach((doc) => {
    batch.update(doc.ref, { status: 'closed' })
  })

  // Update the daily code status to 'expired'
  const dailyCodeRef = doc(portalDb, 'dailyCodes', date)
  batch.update(dailyCodeRef, { status: 'expired' })

  // Commit all changes
  await batch.commit()
}

export async function deleteDailyCode(date: string) {
  // First, get all sessions associated with this daily code
  const sessionsQuery = query(
    collection(portalDb, 'sessions'),
    where('dailyCodeId', '==', date),
  )
  const sessionsSnapshot = await getDocs(sessionsQuery)

  // Update all associated sessions to 'cancelled' status
  const batch = writeBatch(portalDb)
  sessionsSnapshot.docs.forEach((doc) => {
    batch.update(doc.ref, { status: 'cancelled' })
  })

  // Delete the daily code
  const dailyCodeRef = doc(portalDb, 'dailyCodes', date)
  batch.delete(dailyCodeRef)

  // Commit all changes
  await batch.commit()
}

// Session Operations
export async function createSession(
  session: Omit<Session, 'sessionId' | 'createdAt'>,
) {
  const sessionRef = doc(collection(portalDb, 'sessions'))
  await setDoc(sessionRef, {
    ...session,
    sessionId: sessionRef.id,
    createdAt: new Date(),
  })
  return sessionRef.id
}

export async function createMultipleSessions(
  sessions: Omit<Session, 'sessionId' | 'createdAt'>[],
) {
  const batch = writeBatch(portalDb)

  sessions.forEach((sessionData) => {
    const sessionRef = doc(collection(portalDb, 'sessions'))
    batch.set(sessionRef, {
      ...sessionData,
      sessionId: sessionRef.id,
      createdAt: new Date(),
    })
  })

  await batch.commit()
}

export async function getSessionsByDate(date: string): Promise<Session[]> {
  const q = query(
    collection(portalDb, 'sessions'),
    where('date', '==', date),
    orderBy('cohortId'),
    orderBy('planId'),
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ ...doc.data() } as Session))
}

// export async function getSessionsByFilters(filters: {
//   dateRange?: { start: string; end: string }
//   cohortId?: string
//   planId?: string
//   status?: string
// }): Promise<Session[]> {
//   console.log('🔍 getSessionsByFilters called with:', filters)

//   let q = query(collection(portalDb, 'sessions'), orderBy('date', 'desc'))

//   if (filters.dateRange) {
//     console.log('🔍 Adding date range filter:', filters.dateRange)
//     q = query(
//       q,
//       where('date', '>=', filters.dateRange.start),
//       where('date', '<=', filters.dateRange.end),
//     )
//   }

//   // Old approach - trying to do all filtering server-side(Emma)
//   // if (filters.cohortId) {
//   //   console.log('🔍 Adding cohort filter:', filters.cohortId)
//   //   q = query(q, where('cohortId', '==', filters.cohortId))
//   // }

//   // if (filters.planId) {
//   //   console.log('🔍 Adding plan filter:', filters.planId)
//   //   q = query(q, where('planId', '==', filters.planId))
//   // }

//   // if (filters.status) {
//   //   console.log('🔍 Adding status filter:', filters.status)
//   //   q = query(q, where('status', '==', filters.status))
//   // }

//   const snapshot = await getDocs(q)
//   // initailized with let instead of const
//   let sessions = snapshot.docs.map((doc) => ({ ...doc.data() } as Session))

//   console.log('🔍 Query result:', {
//     totalDocs: snapshot.docs.length,
//     sessions: sessions.map((s) => ({
//       sessionId: s.sessionId,
//       date: s.date,
//       cohortId: s.cohortId,
//       planId: s.planId,
//       status: s.status,
//     })),
//   })

//   // Apply other filters client-side
//   if (filters.cohortId) {
//     sessions = sessions.filter((s) => s.cohortId === filters.cohortId)
//   }

//   if (filters.planId) {
//     sessions = sessions.filter((s) => s.planId === filters.planId)
//   }

//   if (filters.status) {
//     sessions = sessions.filter((s) => s.status === filters.status)
//   }

//   return sessions
// }
export async function getSessionsByFilters(filters: {
  dateRange?: { start: string; end: string }
  cohortId?: string
  planId?: string
  status?: string
}): Promise<Session[]> {
  console.log('🔍 getSessionsByFilters called with:', filters)

  // Set default date range (last 6 months to today) if not provided
  const defaultEndDate = new Date().toISOString().split('T')[0]
  const defaultStartDate = new Date()
  defaultStartDate.setMonth(defaultStartDate.getMonth() - 6)
  const formattedStartDate = defaultStartDate.toISOString().split('T')[0]

  const effectiveDateRange = filters.dateRange || {
    start: formattedStartDate,
    end: defaultEndDate,
  }

  let q = query(
    collection(portalDb, 'sessions'),
    where('date', '>=', effectiveDateRange.start),
    where('date', '<=', effectiveDateRange.end),
    orderBy('date', 'desc'),
  )

  console.log('🔍 Using date range:', effectiveDateRange)

  const snapshot = await getDocs(q)
  let sessions = snapshot.docs.map((doc) => ({ ...doc.data() } as Session))

  console.log('🔍 Query result:', {
    totalDocs: snapshot.docs.length,
    sessions: sessions.map((s) => ({
      sessionId: s.sessionId,
      date: s.date,
      cohortId: s.cohortId,
      planId: s.planId,
      status: s.status,
    })),
  })

  // Apply other filters client-side
  if (filters.cohortId) {
    sessions = sessions.filter((s) => s.cohortId === filters.cohortId)
  }

  if (filters.planId) {
    sessions = sessions.filter((s) => s.planId === filters.planId)
  }

  if (filters.status) {
    sessions = sessions.filter((s) => s.status === filters.status)
  }

  return sessions
}

// Debug function to check all sessions
export async function getAllSessions(): Promise<Session[]> {
  console.log('🔍 getAllSessions - Checking all sessions in database')
  const q = query(collection(portalDb, 'sessions'), orderBy('date', 'desc'))
  const snapshot = await getDocs(q)
  const sessions = snapshot.docs.map((doc) => ({ ...doc.data() } as Session))

  console.log('🔍 getAllSessions result:', {
    totalDocs: snapshot.docs.length,
    sessions: sessions.map((s) => ({
      sessionId: s.sessionId,
      date: s.date,
      cohortId: s.cohortId,
      planId: s.planId,
      status: s.status,
    })),
  })

  return sessions
}

export async function getSessionById(
  sessionId: string,
): Promise<Session | null> {
  const sessionRef = doc(portalDb, 'sessions', sessionId)
  const docSnap = await getDoc(sessionRef)
  return docSnap.exists() ? (docSnap.data() as Session) : null
}

export async function deleteSession(sessionId: string) {
  const sessionRef = doc(portalDb, 'sessions', sessionId)
  await deleteDoc(sessionRef)
}

export async function deleteMultipleSessions(sessionIds: string[]) {
  const batch = writeBatch(portalDb)

  sessionIds.forEach((sessionId) => {
    const sessionRef = doc(portalDb, 'sessions', sessionId)
    batch.delete(sessionRef)
  })

  await batch.commit()
}

// Check-in Operations
export async function checkInToSession(sessionId: string, studentId: string) {
  const checkinRef = doc(portalDb, 'sessions', sessionId, 'checkins', studentId)
  await setDoc(checkinRef, {
    checkedIn: true,
    checkInTime: new Date(),
  })
}

export async function getSessionCheckins(
  sessionId: string,
): Promise<SessionCheckin[]> {
  const checkinsRef = collection(portalDb, 'sessions', sessionId, 'checkins')
  const snapshot = await getDocs(checkinsRef)
  return snapshot.docs.map(
    (doc) =>
      ({
        studentId: doc.id,
        ...doc.data(),
      } as SessionCheckin),
  )
}

export async function didStudentCheckInToSession(
  sessionId: string,
  studentId: string,
): Promise<SessionCheckin | null> {
  const checkinRef = doc(portalDb, 'sessions', sessionId, 'checkins', studentId)
  const docSnap = await getDoc(checkinRef)
  return docSnap.exists()
    ? ({ studentId, ...docSnap.data() } as SessionCheckin)
    : null
}

// Student Operations
export async function getStudentsByCohortAndPlan(
  cohortId: string,
  planId: string,
) {
  console.log('🔍 getStudentsByCohortAndPlan called with:', {
    cohortId,
    planId,
  })

  const usersQuery = query(
    collection(portalDb, 'users'),
    where('schoolFeeInfo.cohort', '==', cohortId),
    where('schoolFeeInfo.classPlan', '==', planId),
    where('role', '==', 'student'),
  )
  const snapshot = await getDocs(usersQuery)
  const students = snapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      } as any),
  )

  console.log('🔍 getStudentsByCohortAndPlan result:', {
    cohortId,
    planId,
    totalStudents: students.length,
    students: students.map((s) => ({
      id: s.id,
      fullName: s.fullName,
      email: s.email,
      cohort: s.schoolFeeInfo?.cohort,
      classPlan: s.schoolFeeInfo?.classPlan,
    })),
  })

  return students
}

// Add this function to your attendance-v2.utils.ts
export async function getStudentsByCohortsAndPlans(
  combinations: { cohortId: string; planId: string }[],
) {
  try {
    // For each combination, query students and combine results
    const studentPromises = combinations.map(async ({ cohortId, planId }) => {
      const q = query(
        collection(portalDb, 'users'),
        where('role', '==', 'student'),
        where('schoolFeeInfo.cohort', '==', cohortId),
        where('schoolFeeInfo.classPlan', '==', planId),
      )

      const snapshot = await getDocs(q)
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
    })

    const studentArrays = await Promise.all(studentPromises)
    // Flatten and remove duplicates
    const allStudents = studentArrays.flat()
    const uniqueStudents = allStudents.filter(
      (student, index, array) =>
        index === array.findIndex((s) => s.id === student.id),
    )

    return uniqueStudents
  } catch (error) {
    console.error('Error fetching students by cohorts/plans:', error)
    throw new Error('Failed to fetch students')
  }
}

// Get all students for attendance reports (without filtering by cohort/plan)
export async function getAllStudents() {
  console.log('🔍 getAllStudents called')

  const usersQuery = query(
    collection(portalDb, 'users'),
    where('role', '==', 'student'),
  )
  const snapshot = await getDocs(usersQuery)
  const students = snapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      } as any),
  )

  console.log('🔍 getAllStudents result:', {
    totalStudents: students.length,
    students: students.map((s) => ({
      id: s.id,
      fullName: s.fullName,
      email: s.email,
      cohort: s.schoolFeeInfo?.cohort,
      classPlan: s.schoolFeeInfo?.classPlan,
    })),
  })

  return students
}

// Attendance Summary
export async function getAttendanceSummary(
  sessionId: string,
): Promise<AttendanceSummary | null> {
  const session = await getSessionById(sessionId)
  if (!session) return null

  const students = await getStudentsByCohortAndPlan(
    session.cohortId,
    session.planId,
  )
  const checkins = await getSessionCheckins(sessionId)

  const checkinMap = new Map(checkins.map((c) => [c.studentId, c]))
  let presentCount = 0

  students.forEach((student) => {
    const checkin = checkinMap.get(student.id)
    if (checkin?.checkedIn) presentCount++
  })

  return {
    sessionId,
    cohortId: session.cohortId,
    planId: session.planId,
    date: session.date,
    totalStudents: students.length,
    presentCount,
    absentCount: students.length - presentCount,
    attendanceRate:
      students.length > 0 ? (presentCount / students.length) * 100 : 0,
  }
}

// Utility Functions
export function generateAttendanceCode(): string {
  const random = Math.floor(1000 + Math.random() * 9000)
  return `COP${random}`
}

export function getTodayDateString(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Student check-in validation
export async function validateStudentCheckIn(
  studentId: string,
  code: string,
  date: string,
) {
  try {
    // Get daily code
    const dailyCode = await getDailyCode(date)
    if (!dailyCode || dailyCode.code !== code.toUpperCase()) {
      throw new Error('Invalid attendance code')
    }

    if (dailyCode.status !== 'active') {
      throw new Error('Attendance code is no longer active')
    }

    // Get student info
    const userRef = doc(portalDb, 'users', studentId)
    const userSnap = await getDoc(userRef)
    if (!userSnap.exists()) {
      throw new Error('Student not found')
    }

    const userData = userSnap.data()
    const cohortId = userData.schoolFeeInfo?.cohort
    const planId = userData.schoolFeeInfo?.classPlan

    if (!cohortId || !planId) {
      throw new Error('Student cohort or plan not found')
    }

    // Find matching session
    const sessions = await getSessionsByDate(date)
    const matchingSession = sessions.find(
      (session) =>
        session.cohortId === cohortId &&
        session.planId === planId &&
        session.status === 'open',
    )

    if (!matchingSession) {
      throw new Error('No active session found for your class plan today')
    }

    // Check time window
    const now = new Date()
    const sessionStart = new Date(matchingSession.startsAt)
    const sessionEnd = new Date(matchingSession.endsAt)

    if (now < sessionStart || now > sessionEnd) {
      throw new Error('Check-in is only allowed during class time')
    }

    // Check if already checked in
    const existingCheckin = await didStudentCheckInToSession(
      matchingSession.sessionId,
      studentId,
    )
    if (existingCheckin?.checkedIn) {
      throw new Error('You have already checked in for this session')
    }

    return matchingSession
  } catch (error) {
    console.error('Check-in validation error:', error)
    throw new Error(error instanceof Error ? error.message : 'Check-in failed')
  }
}
