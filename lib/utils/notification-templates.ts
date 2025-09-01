/**
 * Client-safe notification template utilities
 * These functions can be used in both client and server environments
 */

/**
 * Generate HTML for payment reminder notification
 */
export function generatePaymentReminderHtml(
  studentName: string,
  cohort: string,
  classPlan: string,
  totalFee: number,
  totalPaid: number,
  outstandingAmount: number,
): string {
  return `
    <div style="background: #E9E8F9; border-radius: 0; padding: 32px 24px; max-width: 600px; margin: 0 auto; font-family: 'Inter', Arial, sans-serif;">
      <h2 style="font-size: 1.2rem; font-weight: bold; margin: 0 0 24px 0; letter-spacing: 0.5px; color: #333333;">PAYMENT REMINDER</h2>
      <div style="color: #222; font-size: 1rem;">
        <p>Hello ${studentName},</p>
        <p>This is a friendly reminder that you have outstanding school fees for your enrollment at Perxels Design School.</p>
        <p>The deadline for payment is on the 7th of this new month.</p>
        
        <div style="background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="margin: 0 0 15px 0; color: #333; font-size: 1.1rem;">Payment Summary</h3>
          <div style="display: flex; justify-content: space-between; margin: 8px 0;">
            <span><strong>Cohort:</strong></span>
            <span>${cohort}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin: 8px 0;">
            <span><strong>Class Plan:</strong></span>
            <span>${classPlan}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin: 8px 0;">
            <span><strong>Total Fee:</strong></span>
            <span>₦${totalFee.toLocaleString()}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin: 8px 0;">
            <span><strong>Amount Paid:</strong></span>
            <span>₦${totalPaid.toLocaleString()}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin: 8px 0; border-top: 1px solid #dee2e6; padding-top: 8px;">
            <span><strong>Outstanding Amount:</strong></span>
            <span style="color: #dc3545; font-weight: bold;">₦${outstandingAmount.toLocaleString()}</span>
          </div>
        </div>
        
        <p>To avoid any disruption to your learning experience, please complete your payment as soon as possible. You can make your payment through the student portal.</p>
        
        <div style="margin: 24px 0;">
          <a href="/portal/dashboard/school-fees" style="display: inline-block; background: #6C63FF; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">Complete Payment</a>
        </div>
        
        <p>If you have any questions or need assistance with your payment, please don't hesitate to contact our support team.</p>
        
        <p style="margin-top: 32px;">Best regards,<br/>Perxels Management Team</p>
        
        <p style="color: #6c757d; font-size: 13px; margin-top: 20px; border-top: 1px solid #eee; padding-top: 15px;">
          This is an automated reminder. Please do not reply to this email. For support, contact us through the portal.
        </p>
      </div>
    </div>
  `
}

/**
 * Create payment reminder notification payload for in-app notifications
 */
export function createPaymentReminderNotificationPayload(
  studentId: string,
  studentName: string,
  cohort: string,
  classPlan: string,
  totalFee: number,
  totalPaid: number,
  outstandingAmount: number,
): {
  type: string
  title: string
  message: string
  htmlContent: string
  userId: string
  data: {
    cohort: string
    classPlan: string
    totalFee: number
    totalPaid: number
    outstandingAmount: number
    reminderType: string
  }
  read: boolean
  createdAt: Date
} {
  return {
    type: 'payment_reminder',
    title: 'Payment Reminder',
    message: `You have an outstanding balance of ₦${outstandingAmount.toLocaleString()} for ${
      cohort || 'your class'
    }. Please complete your payment to continue.`,
    htmlContent: generatePaymentReminderHtml(
      studentName,
      cohort,
      classPlan,
      totalFee,
      totalPaid,
      outstandingAmount,
    ),
    userId: studentId,
    data: {
      cohort: cohort || '',
      classPlan: classPlan || '',
      totalFee,
      totalPaid,
      outstandingAmount,
      reminderType: 'payment_reminder',
    },
    read: false,
    createdAt: new Date(),
  }
}
