export const flattenStudentData = (students: any[]) => {
  return students.map((student) => {
    // Calculate attendance rate if available
    const attendanceRate =
      student.totalSessions > 0
        ? (student.checkIns / student.totalSessions) * 100
        : 0

    // Get payment statistics
    const payments = student.schoolFeeInfo?.payments || []
    const approvedPayments = payments.filter(
      (p: any) => p.status === 'approved',
    )
    const totalPaid = approvedPayments.reduce(
      (sum: number, p: any) => sum + (p.amount || 0),
      0,
    )
    const balance = (student.schoolFeeInfo?.totalSchoolFee || 0) - totalPaid

    return {
      // Basic Information
      'Student ID': student.uid || 'N/A',
      'Full Name': student.fullName || 'Not provided',
      Email: student.email || 'N/A',
      Phone: student.phone || 'Not provided',
      Branch: student.branch || 'Not specified',

      // School Fee Information
      Cohort: student.schoolFeeInfo?.cohort || 'N/A',
      'Class Plan': student.schoolFeeInfo?.classPlan || 'N/A',
      'Total School Fee': formatCurrency(student.schoolFeeInfo?.totalSchoolFee),
      'Total Paid': formatCurrency(totalPaid),
      Balance: formatCurrency(balance),
      'Payment Status': student.owingStatus || 'Unknown',
      'Overall Status': student.schoolFeeInfo?.overallStatus || 'N/A',
      'Number of Payments': payments.length,

      // Growth Information
      Profession: student.growthInfo?.profession || 'Not provided',
      Gender: student.growthInfo?.gender || 'Not specified',
      'Class Outcome': student.growthInfo?.classOutcome || 'Not specified',
      'Why Class': student.growthInfo?.whyClass || 'Not specified',
      'Date of Enrollment': student.growthInfo?.dateOfEnrollment || 'N/A',

      // Attendance Information (if available)
      'Total Sessions': student.totalSessions || 0,
      'Check-ins': student.checkIns || 0,
      'Attendance Rate':
        student.totalSessions > 0 ? `${attendanceRate.toFixed(1)}%` : 'N/A',

      // Status Flags
      'Email Verified': student.emailVerified ? 'Yes' : 'No',
      'Registration Complete': student.registrationComplete ? 'Yes' : 'No',
      'Onboarding Complete': student.onboardingComplete ? 'Yes' : 'No',
      'Terms Agreed': student.termsAgreed ? 'Yes' : 'No',

      // Timestamps
      'Created Date': formatFirebaseTimestamp(student.createdAt),
      'Last Payment Date': getLastPaymentDate(payments),

      // First Payment Details
      'First Payment Amount': formatCurrency(payments[0]?.amount),
      'First Payment Status': payments[0]?.status || 'N/A',
      'First Payment Date': formatFirebaseTimestamp(payments[0]?.submittedAt),
    }
  })
}

export const formatFirebaseTimestamp = (timestamp: any): string => {
  if (!timestamp || !timestamp.seconds) return 'N/A'

  try {
    const date = new Date(timestamp.seconds * 1000)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch (error) {
    return 'Invalid Date'
  }
}

export const formatCurrency = (amount: number): string => {
  if (!amount && amount !== 0) return 'N/A'
  return `₦${amount.toLocaleString()}`
}

const getLastPaymentDate = (payments: any[]): string => {
  if (!payments || payments.length === 0) return 'N/A'

  // Find the latest payment date
  const latestPayment = payments.reduce((latest, payment) => {
    if (!payment.submittedAt) return latest

    const paymentDate = new Date(payment.submittedAt.seconds * 1000)
    return !latest || paymentDate > latest ? paymentDate : latest
  }, null)

  return latestPayment
    ? latestPayment.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'N/A'
}
