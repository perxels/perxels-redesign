import type { NextApiRequest, NextApiResponse } from 'next'
import { collection, addDoc } from 'firebase/firestore'
import { portalDb } from '../../portalFirebaseConfig'
import { sendPaymentNotificationEmail, generatePaymentApprovedHtml, generatePaymentRejectedHtml, sendStudentHtmlEmail, generateAdmittedHtml, generateRejectedHtml, sendAdmissionEmail, ONBOARDING_FILES } from '../../lib/utils/email.utils'

interface SendPaymentNotificationRequest {
  uid: string
  studentEmail: string
  studentName: string
  cohort: string
  classPlan: string
  amount: number
  installmentNumber: number
  action: 'approve' | 'reject'
  rejectionReason?: string
  isFirstApproval: boolean
}

interface SendPaymentNotificationResponse {
  success: boolean
  message?: string
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SendPaymentNotificationResponse>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    })
  }

  try {
    const {
      uid,
      studentEmail,
      studentName,
      cohort,
      classPlan,
      amount,
      installmentNumber,
      action,
      rejectionReason,
      isFirstApproval,
    } = req.body as SendPaymentNotificationRequest

    console.log('📥 Notification API received:', {
      uid,
      studentEmail,
      studentName,
      cohort,
      classPlan,
      amount,
      installmentNumber,
      action,
      rejectionReason,
      isFirstApproval,
    })

    // Validate required fields
    if (!uid || !studentEmail || !studentName || !cohort || !classPlan || !amount || !installmentNumber || !action) {
      console.error('❌ Missing required fields')
      return res.status(400).json({
        success: false,
        error: 'All required fields are needed',
      })
    }

    let notificationTitle = ''
    let notificationHtml = ''
    let emailSubject = ''

    if (action === 'approve') {
      notificationTitle = 'Payment Approved!'
      notificationHtml = generatePaymentApprovedHtml(studentName, amount, cohort, classPlan)
      emailSubject = 'Your Payment Has Been Approved! 🎉'

      // If this is the first approval, send admission notification and email
      if (isFirstApproval) {
        const admittedHtml = generateAdmittedHtml(studentName, cohort)
        
        // Create admission notification FOR THE STUDENT
        await addDoc(collection(portalDb, 'notifications'), {
          type: 'admitted',
          title: 'You have been admitted into Perxels',
          message: '',
          htmlContent: admittedHtml,
          read: false,
          createdAt: new Date(),
          userId: uid, // Student's ID - this notification is for the student
          data: { 
            cohort,
            hasAttachment: true,
            attachments: ONBOARDING_FILES.map(file => ({
              name: file.displayName,
              filename: file.filename,
              description: file.description
            }))
          },
        })

        // Send admission email with PDF attachments
        if (studentEmail && studentEmail.includes('@')) {
          console.log('📧 Sending admission email to:', studentEmail)
          console.log('📧 Admission email details:', {
            studentEmail,
            studentName,
            cohort,
            appName: 'Perxels Portal'
          })
          
          const admissionEmailResult = await sendAdmissionEmail(
            studentEmail,
            studentName,
            cohort,
            { appName: 'Perxels Portal' }
          )
          
          if (admissionEmailResult.success) {
            console.log('✅ Admission email sent successfully')
          } else {
            console.error('❌ Failed to send admission email:', admissionEmailResult.error)
          }
        } else {
          console.log('⚠️ No valid email for admission notification:', {
            studentEmail,
            hasEmail: !!studentEmail,
            includesAt: studentEmail?.includes('@')
          })
        }
      } else {
        console.log('📝 Not first approval - skipping admission notification')
      }
    } else {
      notificationTitle = 'Payment Rejected'
      notificationHtml = generateRejectedHtml(studentName, cohort, rejectionReason || '')
      emailSubject = 'Your Payment Was Rejected'
    }

    // Create payment notification in Firestore FOR THE STUDENT
    await addDoc(collection(portalDb, 'notifications'), {
      type: action === 'approve' ? 'payment_approved' : 'payment_rejected',
      title: notificationTitle,
      message: '', // Not used, content is in htmlContent
      htmlContent: notificationHtml,
      read: false,
      createdAt: new Date(),
      userId: uid, // Student's ID - this notification is for the student
      data: {
        amount,
        cohort,
        classPlan,
        installmentNumber,
        ...(action === 'reject' && { rejectionReason }),
      },
    })

    // Send email to student
    if (studentEmail && studentEmail.includes('@')) {
      await sendStudentHtmlEmail(
        studentEmail,
        emailSubject,
        notificationHtml,
        { appName: 'Perxels Portal' }
      )
    } else {
      console.log('⚠️ No valid email for payment notification')
    }

    return res.status(200).json({
      success: true,
      message: 'Notification and email sent successfully',
    })

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: 'Failed to send notification and email',
    })
  }
} 