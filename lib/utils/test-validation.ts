import { Test, TestAttempt } from '../../types/test'

export interface TestAccessResult {
  canTake: boolean
  reason: string
  remainingAttempts?: number
  hasPassed?: boolean
}

export const canTakeTest = (
  studentId: string,
  test: Test,
  previousAttempts: TestAttempt[],
): TestAccessResult => {
  const totalAttempts = previousAttempts.length
  const hasPassed = previousAttempts.some((attempt) => attempt.passed)
  const remainingAttempts = test.maxAttempts - totalAttempts

  // Check max attempts
  if (totalAttempts >= test.maxAttempts) {
    return {
      canTake: false,
      reason: `Maximum attempts (${test.maxAttempts}) reached`,
      remainingAttempts: 0,
      hasPassed,
    }
  }

  // Check retakes
  if (hasPassed && !test.allowRetakes) {
    return {
      canTake: false,
      reason: 'Cannot retake test after passing',
      remainingAttempts,
      hasPassed: true,
    }
  }

  return {
    canTake: true,
    reason: '',
    remainingAttempts,
    hasPassed,
  }
}

// Additional utility function
export const getTestAttemptStats = (
  test: Test,
  previousAttempts: TestAttempt[],
) => {
  const accessResult = canTakeTest('', test, previousAttempts) // studentId not needed for stats
  const bestScore =
    previousAttempts.length > 0
      ? Math.max(...previousAttempts.map((a) => a.percentage || 0))
      : 0

  return {
    ...accessResult,
    totalAttempts: previousAttempts.length,
    bestScore,
    lastAttempt: previousAttempts.length > 0 ? previousAttempts[0] : null,
  }
}
