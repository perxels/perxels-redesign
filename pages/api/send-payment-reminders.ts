import type { NextApiRequest, NextApiResponse } from 'next'
import { sendPaymentReminderEmail } from '../../lib/utils/email.utils'

interface SendPaymentRemindersRequest {
  filters?: {
    branch?: string
    classType?: string
    classPlan?: string
  }
  debtors?: Array<{
    id: string
    email: string
    fullName: string
    branch?: string
    schoolFeeInfo: any
  }>
}

interface SendPaymentRemindersResponse {
  success: boolean
  message: string
  data?: {
    totalStudents: number
    emailsSent: number
    failedEmails: string[]
  }
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SendPaymentRemindersResponse>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
      error: 'Method not allowed',
    })
  }

  try {
    const { filters, debtors: clientDebtors } = req.body as SendPaymentRemindersRequest

    console.log('📧 Starting bulk payment reminder process...', { filters, hasClientDebtors: !!clientDebtors })

    let debtors: Array<{
      id: string
      email: string
      fullName: string
      branch?: string
      schoolFeeInfo: any
    }> = []

    // Use debtors provided by client (required)
    if (!clientDebtors || clientDebtors.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No debtors data provided',
        error: 'Debtors data is required from client',
      })
    }
    
    debtors = clientDebtors
    console.log(`📧 Using ${debtors.length} debtors provided by client`)

    if (debtors.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No debtors found matching the criteria',
        data: {
          totalStudents: 0,
          emailsSent: 0,
          failedEmails: [],
        },
      })
    }

    // Send payment reminder emails
    const failedEmails: string[] = []
    let emailsSent = 0

    for (const debtor of debtors) {
      try {
        const fee = debtor.schoolFeeInfo
        const totalFee = fee.totalSchoolFee || 0
        const totalApproved = fee.totalApproved || 0
        const outstandingAmount = totalFee - totalApproved

        if (!debtor.email || !debtor.email.includes('@')) {
          console.warn(`⚠️ Skipping debtor ${debtor.fullName} - invalid email: ${debtor.email}`)
          failedEmails.push(`${debtor.fullName} (${debtor.email})`)
          continue
        }

        console.log(`📧 Sending reminder to ${debtor.fullName} (${debtor.email})`)

        const emailResult = await sendPaymentReminderEmail(
          debtor.email,
          debtor.fullName,
          fee.cohort || 'N/A',
          fee.classPlan || 'N/A',
          totalFee,
          totalApproved,
          outstandingAmount,
          {
            appName: 'Perxels Portal',
          }
        )

        if (emailResult.success) {
          emailsSent++
          console.log(`✅ Reminder sent successfully to ${debtor.fullName}`)
        } else {
          console.error(`❌ Failed to send reminder to ${debtor.fullName}:`, emailResult.error)
          failedEmails.push(`${debtor.fullName} (${debtor.email})`)
        }

        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100))
      } catch (error) {
        console.error(`❌ Error sending reminder to ${debtor.fullName}:`, error)
        failedEmails.push(`${debtor.fullName} (${debtor.email})`)
      }
    }

    console.log(`📧 Bulk reminder process completed: ${emailsSent}/${debtors.length} emails sent`)

    return res.status(200).json({
      success: true,
      message: `Payment reminders sent successfully. ${emailsSent} out of ${debtors.length} emails were sent.`,
      data: {
        totalStudents: debtors.length,
        emailsSent,
        failedEmails,
      },
    })

  } catch (error: any) {
    console.error('❌ Send payment reminders API error:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to send payment reminders',
      error: error?.message || 'Failed to send payment reminders',
    })
  }
} 