import type { NextApiRequest, NextApiResponse } from 'next'
import { doc, updateDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { portalDb } from '../../portalFirebaseConfig'
import { PaymentInstallment, SchoolFeeInfo } from '../../types/school-fee.types'
import { sendPaymentNotificationEmail } from '../../lib/utils/email.utils'

interface FirstInstallmentData {
  cohort: string
  classPlan: string
  schoolFee: number
  amountPaid: number
  paymentReceiptUrl?: string
}

interface UpdateSchoolFeeInfoRequest {
  uid: string
  schoolFeeInfo: FirstInstallmentData
}

interface UpdateSchoolFeeInfoResponse {
  success: boolean
  message?: string
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UpdateSchoolFeeInfoResponse>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    })
  }

  try {
    const { uid, schoolFeeInfo } = req.body as UpdateSchoolFeeInfoRequest

    // Validate required fields
    if (!uid || !schoolFeeInfo) {
      return res.status(400).json({
        success: false,
        error: 'User ID and school fee information are required',
      })
    }

    // Validate school fee info fields
    const { cohort, classPlan, schoolFee, amountPaid, paymentReceiptUrl } = schoolFeeInfo
    if (!cohort || !classPlan || !schoolFee || !amountPaid) {
      return res.status(400).json({
        success: false,
        error: 'Cohort, class plan, school fee, and amount paid are required',
      })
    }

    // Verify user exists
    const userDoc = await getDoc(doc(portalDb, 'users', uid))
    if (!userDoc.exists()) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      })
    }

    // Verify cohort exists in classes collection
    const classesQuery = query(
      collection(portalDb, 'classes'),
      where('cohortName', '==', cohort)
    )
    const classesSnapshot = await getDocs(classesQuery)
    
    if (classesSnapshot.empty) {
      return res.status(400).json({
        success: false,
        error: `Cohort "${cohort}" does not exist. Please select a valid cohort.`,
      })
    }

    const userData = userDoc.data()
    const existingSchoolFeeInfo = userData?.schoolFeeInfo as SchoolFeeInfo | undefined

    // Check if user already has school fee info
    if (existingSchoolFeeInfo && existingSchoolFeeInfo.payments && existingSchoolFeeInfo.payments.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'School fee information already exists. Use the installment payment endpoint to add additional payments.',
      })
    }

    // Create the first installment
    const firstInstallment: PaymentInstallment = {
      installmentNumber: 1,
      amount: Number(amountPaid),
      paymentReceiptUrl: paymentReceiptUrl || '',
      status: 'pending',
      submittedAt: new Date(),
    }

    // Create the new school fee info structure
    const newSchoolFeeInfo: SchoolFeeInfo = {
      cohort,
      classPlan,
      totalSchoolFee: Number(schoolFee),
      payments: [firstInstallment],
      totalSubmitted: Number(amountPaid),
      totalApproved: 0,
      overallStatus: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Update user document with new school fee information structure
    await updateDoc(doc(portalDb, 'users', uid), {
      schoolFeeInfo: newSchoolFeeInfo,
      schoolFeeInfoUpdatedAt: new Date(),
    })

    // Get student details for notification
    const studentName = `${userData?.fullName || ''}`.trim() || 'Unknown Student'
    const studentEmail = userData?.email || ''

    // Create notification for admins
    try {
      // Get all admin users
      const adminUsersQuery = query(
        collection(portalDb, 'users'),
        where('role', '==', 'admin')
      )
      
      const adminUsersSnapshot = await getDocs(adminUsersQuery)
      const adminUsers = adminUsersSnapshot.docs
      
      // Extract admin emails for email notification
      const adminEmails = adminUsers.map(doc => doc.data().email).filter(Boolean)
      console.log('📧 Admin emails for notification:', adminEmails)
      
      // Create notification for each admin
      for (const adminDoc of adminUsers) {
        const adminId = adminDoc.id
        const notificationResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/notifications/create-notification`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'payment_submitted',
            userId: adminId, // Use admin's UID as userId
            title: 'Payment Submitted',
            message: `${studentName} has submitted installment 1 payment of ₦${Number(amountPaid).toLocaleString()}`,
            data: {
              studentId: uid,
              studentName,
              studentEmail,
              amount: Number(amountPaid),
              installmentNumber: 1,
              paymentReceiptUrl: paymentReceiptUrl || '',
              cohort,
              classPlan,
            },
          }),
        })

        if (!notificationResponse.ok) {
          console.error(`Failed to create notification for admin ${adminId}:`, notificationResponse.statusText)
          const errorText = await notificationResponse.text()
          console.error('Notification error details:', errorText)
        } else {
          const notificationResult = await notificationResponse.json()
          console.log(`✅ Notification created successfully for admin ${adminId}:`, notificationResult)
        }
      }
      
      // Send email notification to all admins
      if (adminEmails.length > 0) {
        const emailResult = await sendPaymentNotificationEmail(
          adminEmails,
          studentName,
          studentEmail,
          Number(amountPaid),
          1, // installment number
          cohort,
          classPlan,
          new Date().toLocaleString(),
          paymentReceiptUrl || '',
          {
            appName: 'Perxels Portal'
          }
        )
        
        if (emailResult.success) {
          console.log('✅ Email notification sent successfully:', emailResult)
        } else {
          console.error('❌ Failed to send email notification:', emailResult.error)
        }
      } else {
        console.log('⚠️ No admin emails found for notification')
      }
    } catch (notificationError) {
      console.error('Notification creation error:', notificationError)
      // Don't fail the main request if notification fails
    }

    return res.status(200).json({
      success: true,
      message: 'First installment submitted successfully and is pending admin approval',
    })

  } catch (error: any) {
    console.error('Update school fee info API error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to update school fee information',
    })
  }
} 