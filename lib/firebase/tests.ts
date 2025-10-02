import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  query,
  where,
  orderBy,
  getDoc,
  writeBatch,
  Timestamp,
  arrayUnion,
  setDoc,
  deleteDoc,
  limit,
} from 'firebase/firestore'
import { portalDb } from '../../portalFirebaseConfig'
import {
  Question,
  Test,
  TestAttempt,
  TestResult,
  TestParticipant,
} from '../../types/test'
import { StudentData } from '../../types/user'

// Generate a random access code
const generateAccessCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Create test with access code
export const createTest = async (
  testData: Omit<
    Test,
    | 'testId'
    | 'accessCode'
    | 'participants'
    | 'totalParticipants'
    | 'createdAt'
    | 'updatedAt'
  >,
  questions: Omit<Question, 'questionId' | 'testId' | 'createdAt'>[],
) => {
  try {
    const batch = writeBatch(portalDb)

    // Create test document
    const testRef = doc(collection(portalDb, 'tests'))
    const testWithId: Test = {
      ...testData,
      testId: testRef.id,
      accessCode: generateAccessCode(),
      participants: [],
      totalParticipants: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }
    batch.set(testRef, testWithId)

    // Create questions
    questions.forEach((question, index) => {
      const questionRef = doc(collection(portalDb, 'questions'))
      batch.set(questionRef, {
        ...question,
        questionId: questionRef.id,
        testId: testRef.id,
        order: index,
        createdAt: Timestamp.now(),
      })
    })

    await batch.commit()

    // Return test with access code for display
    const createdTest = await getDoc(testRef)
    return createdTest.data() as Test
  } catch (error) {
    console.error('Error creating test:', error)
    throw error
  }
}

// Update test information
export const updateTest = async (testId: string, updates: Partial<Test>) => {
  try {
    await updateDoc(doc(portalDb, 'tests', testId), {
      ...updates,
      updatedAt: Timestamp.now(),
    })
  } catch (error) {
    console.error('Error updating test:', error)
    throw error
  }
}

// Get all tests for admin
export const getAllTests = async () => {
  const q = query(collection(portalDb, 'tests'), orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => doc.data() as Test)
}

// Get tests that student has access to
export const getStudentAccessibleTests = async (studentId: string) => {
  const q = query(
    collection(portalDb, 'tests'),
    where('participants', 'array-contains', studentId),
    where('isActive', '==', true),
    orderBy('createdAt', 'desc'),
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => doc.data() as Test)
}

// Validate access code and grant access
export const validateAccessCode = async (
  accessCode: string,
  studentId: string,
) => {
  try {
    // Find test with this access code
    const q = query(
      collection(portalDb, 'tests'),
      where('accessCode', '==', accessCode.toUpperCase()),
      where('isActive', '==', true),
    )

    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      throw new Error('Invalid access code or test not found')
    }

    const testDoc = snapshot.docs[0]
    const test = testDoc.data() as Test

    // Check if student already has access
    if (test.participants.includes(studentId)) {
      return {
        success: true,
        test,
        message: 'You already have access to this test',
      }
    }

    // Grant access by adding student to participants
    await updateDoc(doc(portalDb, 'tests', test.testId), {
      participants: arrayUnion(studentId),
      totalParticipants: test.totalParticipants + 1,
      updatedAt: Timestamp.now(),
    })

    return { success: true, test, message: 'Access granted successfully' }
  } catch (error) {
    console.error('Error validating access code:', error)
    throw error
  }
}

// Get test by ID
export const getTestById = async (testId: string): Promise<Test | null> => {
  try {
    const testDoc = await getDoc(doc(portalDb, 'tests', testId))
    return testDoc.exists() ? (testDoc.data() as Test) : null
  } catch (error) {
    console.error('Error getting test:', error)
    throw error
  }
}

// Get test questions
export const getTestQuestions = async (testId: string) => {
  const q = query(
    collection(portalDb, 'questions'),
    where('testId', '==', testId),
    orderBy('order', 'asc'),
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => doc.data() as Question)
}

// Check if student has taken test
export const hasStudentTakenTest = async (
  studentId: string,
  testId: string,
): Promise<boolean> => {
  try {
    const q = query(
      collection(portalDb, 'attempts'),
      where('studentId', '==', studentId),
      where('testId', '==', testId),
    )
    const snapshot = await getDocs(q)
    return !snapshot.empty
  } catch (error) {
    console.error('Error checking test attempt:', error)
    return false
  }
}

// Submit test attempt
export const submitTestAttempt = async (
  attempt: Omit<TestAttempt, 'attemptId'>,
) => {
  try {
    const attemptRef = await addDoc(collection(portalDb, 'attempts'), {
      ...attempt,
      submittedAt: Timestamp.now(),
    })

    await updateTestResult(attempt.studentId, attempt.testId, attemptRef.id)
    return attemptRef.id
  } catch (error) {
    console.error('Error submitting test attempt:', error)
    throw error
  }
}

// Update test results summary
const updateTestResult = async (
  studentId: string,
  testId: string,
  attemptId: string,
) => {
  try {
    const attemptDoc = await getDoc(doc(portalDb, 'attempts', attemptId))
    if (!attemptDoc.exists()) {
      throw new Error('Attempt not found')
    }

    const attempt = attemptDoc.data() as TestAttempt
    const resultRef = doc(portalDb, 'testResults', `${studentId}_${testId}`)
    const existingResult = await getDoc(resultRef)

    const percentage = Math.round((attempt.score! / attempt.totalPoints) * 100)
    const passed = percentage >= attempt.passingScore

    const resultData: any = {
      studentId,
      testId,
      latestAttemptId: attemptId,
      bestScore: attempt.score,
      bestPercentage: percentage,
      attemptsCount: 1,
      lastAttemptDate: attempt.submittedAt,
      passed,
      accessCodeUsed: attempt.accessCodeUsed,
    }

    if (existingResult.exists()) {
      const existing = existingResult.data() as TestResult
      resultData.attemptsCount = existing.attemptsCount + 1

      if (attempt.score! > existing.bestScore!) {
        resultData.bestScore = attempt.score
        resultData.bestPercentage = percentage
        resultData.passed = passed
      } else {
        resultData.bestScore = existing.bestScore
        resultData.bestPercentage = existing.bestPercentage
        resultData.passed = existing.passed
      }
    }

    // Get test info
    const testDoc = await getDoc(doc(portalDb, 'tests', testId))
    if (testDoc.exists()) {
      const test = testDoc.data() as Test
      resultData.testName = test.testName
    }

    // Use setDoc with merge instead of updateDoc
    await setDoc(resultRef, resultData, { merge: true })

    // await updateDoc(resultRef, resultData)
  } catch (error) {
    console.error('Error updating test result:', error)
    throw error
  }
}

// Get student's test results
export const getStudentResults = async (studentId: string) => {
  const q = query(
    collection(portalDb, 'testResults'),
    where('studentId', '==', studentId),
    orderBy('lastAttemptDate', 'desc'),
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => doc.data() as TestResult)
}

// Get test analytics for admin
export const getTestAnalytics = async (testId: string) => {
  const attemptsQuery = query(
    collection(portalDb, 'attempts'),
    where('testId', '==', testId),
  )
  const resultsQuery = query(
    collection(portalDb, 'testResults'),
    where('testId', '==', testId),
  )

  const [attemptsSnapshot, resultsSnapshot] = await Promise.all([
    getDocs(attemptsQuery),
    getDocs(resultsQuery),
  ])

  const attempts = attemptsSnapshot.docs.map((doc) => doc.data() as TestAttempt)
  const results = resultsSnapshot.docs.map((doc) => doc.data() as TestResult)

  return {
    totalAttempts: attempts.length,
    totalParticipants: results.length,
    averageScore:
      attempts.length > 0
        ? attempts.reduce(
            (sum, attempt) => sum + (attempt.percentage || 0),
            0,
          ) / attempts.length
        : 0,
    passRate:
      results.length > 0
        ? (results.filter((result) => result.passed).length / results.length) *
          100
        : 0,
    attempts,
    results,
  }
}

// For backward compatibility
export const getTests = getAllTests

// Toggle test status
export const toggleTestStatus = async (testId: string, isActive: boolean) => {
  try {
    await updateDoc(doc(portalDb, 'tests', testId), {
      isActive,
      updatedAt: Timestamp.now(),
    })
  } catch (error) {
    console.error('Error toggling test status:', error)
    throw error
  }
}

// Delete test and all related data
export const deleteTest = async (testId: string) => {
  try {
    const batch = writeBatch(portalDb)

    // Delete test
    batch.delete(doc(portalDb, 'tests', testId))

    // Delete questions
    const questionsQuery = query(
      collection(portalDb, 'questions'),
      where('testId', '==', testId),
    )
    const questionsSnapshot = await getDocs(questionsQuery)
    questionsSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref)
    })

    // Delete attempts
    const attemptsQuery = query(
      collection(portalDb, 'attempts'),
      where('testId', '==', testId),
    )
    const attemptsSnapshot = await getDocs(attemptsQuery)
    attemptsSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref)
    })

    // Delete results
    const resultsQuery = query(
      collection(portalDb, 'testResults'),
      where('testId', '==', testId),
    )
    const resultsSnapshot = await getDocs(resultsQuery)
    resultsSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref)
    })

    await batch.commit()
  } catch (error) {
    console.error('Error deleting test:', error)
    throw error
  }
}

// Get test participants with their results
export const getTestParticipants = async (
  testId: string,
): Promise<TestParticipant[]> => {
  try {
    // Get test results in one query
    const resultsQuery = query(
      collection(portalDb, 'testResults'),
      where('testId', '==', testId),
    )
    const resultsSnapshot = await getDocs(resultsQuery)

    if (resultsSnapshot.empty) {
      return []
    }

    // Get all student IDs for batch fetching
    const studentIds = resultsSnapshot.docs.map((doc) => doc.data().studentId)

    // Batch fetch student data to reduce Firestore reads
    const studentPromises = studentIds.map((studentId) =>
      getDoc(doc(portalDb, 'users', studentId)),
    )

    const studentSnapshots = await Promise.all(studentPromises)

    // Create a map for quick student data lookup
    const studentDataMap = new Map<string, StudentData>()
    studentSnapshots.forEach((studentDoc, index) => {
      if (studentDoc.exists()) {
        studentDataMap.set(studentIds[index], studentDoc.data() as StudentData)
      }
    })

    // Process all participants
    const participants = await Promise.all(
      resultsSnapshot.docs.map(async (doc) => {
        const data = doc.data() as TestResult
        const studentData = studentDataMap.get(data.studentId)

        // Get first access date efficiently
        let accessedAt = data.lastAttemptDate
        try {
          const attemptsQuery = query(
            collection(portalDb, 'attempts'),
            where('studentId', '==', data.studentId),
            where('testId', '==', testId),
            orderBy('startedAt', 'asc'),
            limit(1),
          )
          const attemptsSnapshot = await getDocs(attemptsQuery)

          if (!attemptsSnapshot.empty) {
            const firstAttempt = attemptsSnapshot.docs[0].data() as TestAttempt
            accessedAt = firstAttempt.startedAt
          }
        } catch (error) {
          console.warn(
            `Could not fetch access date for student ${data.studentId}:`,
            error,
          )
          // Use last attempt date as fallback
        }

        return {
          studentId: data.studentId,
          studentName: studentData?.fullName || 'Unknown Student',
          studentEmail: studentData?.email || 'unknown@email.com',
          cohort: studentData?.schoolFeeInfo?.cohort,
          classPlan: studentData?.schoolFeeInfo?.classPlan,
          accessedAt,
          attempts: data.attemptsCount,
          bestScore: data.bestScore,
          bestPercentage: data.bestPercentage,
          passed: data.passed,
          lastAttemptDate: data.lastAttemptDate,
        } as TestParticipant
      }),
    )

    // Sort by last attempt date (most recent first)
    return participants.sort((a, b) => {
      const dateA = a.lastAttemptDate?.toDate?.() || new Date(0)
      const dateB = b.lastAttemptDate?.toDate?.() || new Date(0)
      return dateB.getTime() - dateA.getTime()
    })
  } catch (error) {
    console.error('Error fetching test participants:', error)
    throw new Error('Failed to load test participants')
  }
}

// Update a specific question
export const updateQuestion = async (
  questionId: string,
  updates: Partial<Question>,
) => {
  try {
    await updateDoc(doc(portalDb, 'questions', questionId), {
      ...updates,
      updatedAt: Timestamp.now(),
    })
  } catch (error) {
    console.error('Error updating question:', error)
    throw error
  }
}

// Delete a question
export const deleteQuestion = async (questionId: string) => {
  try {
    await deleteDoc(doc(portalDb, 'questions', questionId))
  } catch (error) {
    console.error('Error deleting question:', error)
    throw error
  }
}

// Add a new question to an existing test
export const addQuestion = async (
  testId: string,
  questionData: Omit<Question, 'questionId' | 'testId' | 'createdAt'>,
) => {
  try {
    const questionRef = doc(collection(portalDb, 'questions'))
    await setDoc(questionRef, {
      ...questionData,
      questionId: questionRef.id,
      testId,
      createdAt: Timestamp.now(),
    })
  } catch (error) {
    console.error('Error adding question:', error)
    throw error
  }
}

export const getStudentAttempts = async (
  studentId: string,
  testId: string,
): Promise<TestAttempt[]> => {
  try {
    const q = query(
      collection(portalDb, 'attempts'),
      where('studentId', '==', studentId),
      where('testId', '==', testId),
      orderBy('submittedAt', 'desc'),
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(
      (doc) =>
        ({
          attemptId: doc.id,
          ...doc.data(),
        } as TestAttempt),
    )
  } catch (error) {
    console.error('Error getting student attempts:', error)
    return []
  }
}

export const getTestByAccessCode = async (
  accessCode: string,
): Promise<Test | null> => {
  const q = query(
    collection(portalDb, 'tests'),
    where('accessCode', '==', accessCode.toUpperCase()),
    where('isActive', '==', true),
  )
  const snapshot = await getDocs(q)
  return snapshot.empty ? null : (snapshot.docs[0].data() as Test)
}
