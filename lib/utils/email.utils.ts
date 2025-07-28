import { Resend } from 'resend'
import { readFileSync } from 'fs'
import { join } from 'path'

// Types
interface EmailAttachment {
  filename: string
  content: Buffer | string
  contentType?: string
}

interface EmailOptions {
  subject?: string
  expiresInMinutes?: number
  appName?: string
  attachments?: EmailAttachment[]
  from?: string
}

interface EmailResponse {
  success: boolean
  emailId?: string
  message: string
  error?: string
}

// Configuration
const DEFAULT_APP_NAME = 'Perxels'
const DEFAULT_FROM_EMAIL = 'onboarding@resend.dev' // Resend's default testing email

// Initialize Resend client
function getResendClient() {
  const apiKey =
    process.env.RESEND_API_KEY || 're_YwHnkPhv_LRMTGUbsBciAh8KkWD9s9JCP'
  if (!apiKey) {
    throw new Error('RESEND_API_KEY environment variable is not set')
  }
  return new Resend(apiKey)
}

// Email template for OTP
function generateOTPTemplate(
  otp: string,
  expiresInMinutes: number,
  appName: string,
): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white;">
          <!-- Header -->
          <div style="background: #363576; padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">${appName}</h1>
            <p style="color: rgba(255,255,255,0.8); margin: 10px 0 0 0; font-size: 16px;">Email Verification</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 20px;">
            <h2 style="color: #333; margin: 0 0 20px 0; font-size: 24px; text-align: center;">Verify Your Email</h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.5; margin-bottom: 30px; text-align: center;">
              Enter this verification code to complete your registration:
            </p>
            
            <!-- OTP Box -->
            <div style="background: #f8f9fa; border: 2px dashed #667eea; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0;">
              <div style="font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 8px; margin: 0;">
                ${otp}
              </div>
            </div>
            
            <!-- Expiration Notice -->
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin: 20px 0; text-align: center;">
              <p style="margin: 0; color: #856404; font-size: 14px;">
                ⏰ <strong>This code expires in ${expiresInMinutes} minutes</strong>
              </p>
            </div>
            
            <!-- Security Notice -->
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 12px; line-height: 1.4; margin: 0; text-align: center;">
                If you didn't request this verification code, please ignore this email. 
                This code is only valid for ${expiresInMinutes} minutes and can only be used once.
              </p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eee;">
            <p style="margin: 0; color: #999; font-size: 12px;">
              © 2024 ${appName}. All rights reserved.
            </p>
          </div>
        </div>
      </body>
    </html>
  `
}

/**
 * Send OTP email to user
 */
export async function sendOTPEmail(
  to: string,
  otp: string,
  options: EmailOptions = {},
): Promise<EmailResponse> {
  try {
    const {
      subject = 'Your verification code',
      expiresInMinutes = 5,
      appName = DEFAULT_APP_NAME,
    } = options

    const resend = getResendClient()
    const html = generateOTPTemplate(otp, expiresInMinutes, appName)
    const fromEmail = process.env.RESEND_FROM_EMAIL || DEFAULT_FROM_EMAIL

    const result = await resend.emails.send({
      from: fromEmail,
      to: [to],
      subject,
      html,
    })

    if (result.error) {
      console.error('Resend API error details:', result.error)
      return {
        success: false,
        message: 'Failed to send email',
        error: result.error.message || JSON.stringify(result.error),
      }
    }

    return {
      success: true,
      emailId: result.data?.id,
      message: 'Email sent successfully',
    }
  } catch (error) {
    console.error('Send OTP email error:', error)
    return {
      success: false,
      message: 'Failed to send email',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Send welcome email to user
 */
export async function sendWelcomeEmail(
  to: string,
  name: string,
  options: EmailOptions = {},
): Promise<EmailResponse> {
  try {
    const { subject = 'Welcome to our platform!', appName = DEFAULT_APP_NAME } =
      options

    const resend = getResendClient()

    const html = `
      <div style="background: #E9E8F9; border-radius: 0; padding: 32px 24px; max-width: 600px; margin: 0 auto; font-family: 'Inter', Arial, sans-serif;">
        <h2 style="font-size: 1.2rem; font-weight: bold; margin: 0 0 24px 0; letter-spacing: 0.5px; color: #6C63FF;">WELCOME TO ${appName.toUpperCase()}, ${name.toUpperCase()}!</h2>
        <div style="color: #222; font-size: 1rem;">
          <p>Thank you for joining us. We're excited to have you on board!</p>
          <a href="/portal" style="display: inline-block; background: #6C63FF; color: white; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 24px;">Get Started</a>
        </div>
      </div>
    `

    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || DEFAULT_FROM_EMAIL,
      to: [to],
      subject,
      html,
    })

    if (result.error) {
      console.error('Resend API error:', result.error)
      return {
        success: false,
        message: 'Failed to send email',
        error: result.error.message,
      }
    }

    return {
      success: true,
      emailId: result.data?.id,
      message: 'Email sent successfully',
    }
  } catch (error) {
    console.error('Send welcome email error:', error)
    return {
      success: false,
      message: 'Failed to send email',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// Payment notification email template
function generatePaymentNotificationTemplate(
  adminName: string,
  studentName: string,
  studentEmail: string,
  amount: number,
  installmentNumber: number,
  cohort: string,
  classPlan: string,
  submittedAt: string,
  paymentReceiptUrl: string,
  appName: string,
): string {
  return `
    <div style="background: #E9E8F9; border-radius: 0; padding: 32px 24px; max-width: 600px; margin: 0 auto; font-family: 'Inter', Arial, sans-serif;">
      <h2 style="font-size: 1.2rem; font-weight: bold; margin: 0 0 24px 0; letter-spacing: 0.5px; color: #333333;">PAYMENT SUBMITTED FOR REVIEW</h2>
      <div style="color: #222; font-size: 1rem;">
        <p>Hello Admin,</p>
        <p>A student has submitted a payment that requires your approval.</p>
        <ul style="margin-left: 1.2em;">
          <li><b>Student:</b> ${studentName} (${studentEmail})</li>
          <li><b>Amount:</b> ₦${amount.toLocaleString()}</li>
          <li><b>Installment:</b> ${installmentNumber} of 3</li>
          <li><b>Cohort:</b> ${cohort}</li>
          <li><b>Class Plan:</b> ${classPlan}</li>
          <li><b>Submitted:</b> ${submittedAt}</li>
        </ul>
        <div style="margin: 24px 0;">
          <a href="${paymentReceiptUrl}" style="display: inline-block; background: #6C63FF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">View Receipt Screenshot</a>
        </div>
        <div style="margin: 24px 0;">
          <a href="${
            process.env.NEXT_PUBLIC_BASE_URL || 'https://yoursite.com'
          }/portal/admin/school-fees" style="display: inline-block; background: #6C63FF; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">Review Payment</a>
        </div>
        <p style="color: #6c757d; font-size: 13px;">This notification was sent because you are an admin for ${appName}.<br>Please do not reply to this email as it is automatically generated.</p>
      </div>
    </div>
  `
}

/**
 * Send payment notification email to admin(s)
 */
export async function sendPaymentNotificationEmail(
  adminEmails: string[],
  studentName: string,
  studentEmail: string,
  amount: number,
  installmentNumber: number,
  cohort: string,
  classPlan: string,
  submittedAt: string,
  paymentReceiptUrl: string,
  options: EmailOptions = {},
): Promise<EmailResponse> {
  try {
    console.log('📧 Starting payment notification email process...', {
      adminEmails,
      studentName,
      studentEmail,
      amount,
      installmentNumber,
      cohort,
      classPlan,
      submittedAt,
    })

    const { appName = DEFAULT_APP_NAME } = options

    // Validate inputs
    if (!adminEmails || adminEmails.length === 0) {
      console.error('❌ No admin emails provided for notification')
      return {
        success: false,
        message: 'No admin emails provided',
        error: 'Admin emails array is empty or undefined',
      }
    }

    // Filter out invalid emails
    const validEmails = adminEmails.filter(
      (email) => email && email.includes('@'),
    )
    if (validEmails.length === 0) {
      console.error('❌ No valid admin emails found:', adminEmails)
      return {
        success: false,
        message: 'No valid admin emails found',
        error: 'All provided emails are invalid',
      }
    }

    console.log('✅ Valid admin emails for notification:', validEmails)

    const resend = getResendClient()
    const fromEmail = process.env.RESEND_FROM_EMAIL || DEFAULT_FROM_EMAIL

    console.log('📧 Email configuration:', {
      fromEmail,
      toEmails: validEmails,
      appName,
    })

    const subject = `🔔 Payment Submitted: ${studentName} - ₦${amount.toLocaleString()} (Installment ${installmentNumber})`

    const html = generatePaymentNotificationTemplate(
      'Admin', // You might want to personalize this
      studentName,
      studentEmail,
      amount,
      installmentNumber,
      cohort,
      classPlan,
      submittedAt,
      paymentReceiptUrl,
      appName,
    )

    console.log('📧 Sending email via Resend...')

    // Send email to all admin recipients
    const result = await resend.emails.send({
      from: fromEmail,
      to: validEmails,
      subject,
      html,
    })

    console.log('📧 Resend API response:', {
      success: !result.error,
      emailId: result.data?.id,
      error: result.error,
    })

    if (result.error) {
      console.error('❌ Payment notification email error:', result.error)
      return {
        success: false,
        message: 'Failed to send payment notification email',
        error: result.error.message || JSON.stringify(result.error),
      }
    }

    console.log('✅ Payment notification email sent successfully:', {
      emailId: result.data?.id,
      to: validEmails,
    })

    return {
      success: true,
      emailId: result.data?.id,
      message: 'Payment notification email sent successfully',
    }
  } catch (error) {
    console.error('❌ Send payment notification email error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      adminEmails,
      studentName,
    })
    return {
      success: false,
      message: 'Failed to send payment notification email',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Send a custom HTML email to a student (for approval/rejection)
 */
export async function sendStudentHtmlEmail(
  to: string,
  subject: string,
  html: string,
  options: EmailOptions = {},
): Promise<EmailResponse> {
  try {
    const resend = getResendClient()
    const fromEmail = process.env.RESEND_FROM_EMAIL || DEFAULT_FROM_EMAIL
    
    const emailData: any = {
      from: fromEmail,
      to: [to],
      subject,
      html,
    }

    // Add attachments if provided
    if (options.attachments && options.attachments.length > 0) {
      emailData.attachments = options.attachments.map(attachment => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType,
      }))
    }

    const result = await resend.emails.send(emailData)
    
    if (result.error) {
      console.error('❌ Student HTML email error:', result.error)
      return {
        success: false,
        message: 'Failed to send student HTML email',
        error: result.error.message || JSON.stringify(result.error),
      }
    }
    return {
      success: true,
      emailId: result.data?.id,
      message: 'Student HTML email sent successfully',
    }
  } catch (error) {
    console.error('❌ Send student HTML email error:', error)
    return {
      success: false,
      message: 'Failed to send student HTML email',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Send email with attachments (generic function)
 */
export async function sendEmailWithAttachments(
  to: string | string[],
  subject: string,
  html: string,
  attachments: EmailAttachment[],
  options: EmailOptions = {},
): Promise<EmailResponse> {
  try {
    const resend = getResendClient()
    const fromEmail = process.env.RESEND_FROM_EMAIL || DEFAULT_FROM_EMAIL
    
    const emailData: any = {
      from: fromEmail,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      attachments: attachments.map(attachment => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType,
      })),
    }

    const result = await resend.emails.send(emailData)
    
    if (result.error) {
      console.error('❌ Email with attachments error:', result.error)
      return {
        success: false,
        message: 'Failed to send email with attachments',
        error: result.error.message || JSON.stringify(result.error),
      }
    }
    
    return {
      success: true,
      emailId: result.data?.id,
      message: 'Email with attachments sent successfully',
    }
  } catch (error) {
    console.error('❌ Send email with attachments error:', error)
    return {
      success: false,
      message: 'Failed to send email with attachments',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Send payment receipt email with attachment
 */
export async function sendPaymentReceiptEmail(
  to: string,
  studentName: string,
  amount: number,
  cohort: string,
  classPlan: string,
  receiptAttachment: EmailAttachment,
  options: EmailOptions = {},
): Promise<EmailResponse> {
  try {
    const { appName = DEFAULT_APP_NAME } = options
    
    const subject = `Payment Receipt - ₦${amount.toLocaleString()} - ${cohort}`
    
    const html = `
      <div style="background: #E9E8F9; border-radius: 0; padding: 32px 24px; max-width: 600px; margin: 0 auto; font-family: 'Inter', Arial, sans-serif;">
        <h2 style="font-size: 1.2rem; font-weight: bold; margin: 0 0 24px 0; letter-spacing: 0.5px; color: #333333;">PAYMENT RECEIPT</h2>
        <div style="color: #222; font-size: 1rem;">
          <p>Hello ${studentName},</p>
          <p>Thank you for your payment of <b>₦${amount.toLocaleString()}</b> for Perxels Design School.</p>
          
          <div style="background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="margin: 0 0 15px 0; color: #333; font-size: 1.1rem;">Payment Details</h3>
            <div style="display: flex; justify-content: space-between; margin: 8px 0;">
              <span><strong>Amount:</strong></span>
              <span>₦${amount.toLocaleString()}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 8px 0;">
              <span><strong>Cohort:</strong></span>
              <span>${cohort}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 8px 0;">
              <span><strong>Class Plan:</strong></span>
              <span>${classPlan}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 8px 0;">
              <span><strong>Date:</strong></span>
              <span>${new Date().toLocaleDateString()}</span>
            </div>
          </div>
          
          <p>Please find your payment receipt attached to this email.</p>
          <p>If you have any questions, please don't hesitate to contact us.</p>
          
          <p style="margin-top: 32px;">Regards,<br/>Perxels Team<br/>${appName}</p>
        </div>
      </div>
    `

    return await sendEmailWithAttachments(
      to,
      subject,
      html,
      [receiptAttachment],
      options
    )
  } catch (error) {
    console.error('❌ Send payment receipt email error:', error)
    return {
      success: false,
      message: 'Failed to send payment receipt email',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Send certificate email with attachment
 */
export async function sendCertificateEmail(
  to: string,
  studentName: string,
  courseName: string,
  certificateAttachment: EmailAttachment,
  options: EmailOptions = {},
): Promise<EmailResponse> {
  try {
    const { appName = DEFAULT_APP_NAME } = options
    
    const subject = `Your Certificate - ${courseName}`
    
    const html = `
      <div style="background: #E9E8F9; border-radius: 0; padding: 32px 24px; max-width: 600px; margin: 0 auto; font-family: 'Inter', Arial, sans-serif;">
        <h2 style="font-size: 1.2rem; font-weight: bold; margin: 0 0 24px 0; letter-spacing: 0.5px; color: #333333;">🎉 CONGRATULATIONS!</h2>
        <div style="color: #222; font-size: 1rem;">
          <p>Hello ${studentName},</p>
          <p>Congratulations on successfully completing <b>${courseName}</b>!</p>
          <p>We're proud to present you with your certificate of completion. This certificate represents your dedication, hard work, and commitment to learning.</p>
          
          <div style="background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="margin: 0 0 15px 0; color: #333; font-size: 1.1rem;">Certificate Details</h3>
            <div style="display: flex; justify-content: space-between; margin: 8px 0;">
              <span><strong>Course:</strong></span>
              <span>${courseName}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 8px 0;">
              <span><strong>Student:</strong></span>
              <span>${studentName}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 8px 0;">
              <span><strong>Issue Date:</strong></span>
              <span>${new Date().toLocaleDateString()}</span>
            </div>
          </div>
          
          <p>Your certificate is attached to this email. Please keep it safe as it serves as proof of your achievement.</p>
          <p>We wish you continued success in your design journey!</p>
          
          <p style="margin-top: 32px;">Best regards,<br/>Perxels Team<br/>${appName}</p>
        </div>
      </div>
    `

    return await sendEmailWithAttachments(
      to,
      subject,
      html,
      [certificateAttachment],
      options
    )
  } catch (error) {
    console.error('❌ Send certificate email error:', error)
    return {
      success: false,
      message: 'Failed to send certificate email',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Send course materials email with attachments
 */
export async function sendCourseMaterialsEmail(
  to: string,
  studentName: string,
  courseName: string,
  materials: EmailAttachment[],
  options: EmailOptions = {},
): Promise<EmailResponse> {
  try {
    const { appName = DEFAULT_APP_NAME } = options
    
    const subject = `Course Materials - ${courseName}`
    
    const html = `
      <div style="background: #E9E8F9; border-radius: 0; padding: 32px 24px; max-width: 600px; margin: 0 auto; font-family: 'Inter', Arial, sans-serif;">
        <h2 style="font-size: 1.2rem; font-weight: bold; margin: 0 0 24px 0; letter-spacing: 0.5px; color: #333333;">📚 COURSE MATERIALS</h2>
        <div style="color: #222; font-size: 1rem;">
          <p>Hello ${studentName},</p>
          <p>Here are your course materials for <b>${courseName}</b>.</p>
          
          <div style="background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="margin: 0 0 15px 0; color: #333; font-size: 1.1rem;">Materials Included:</h3>
            <ul style="margin: 0; padding-left: 20px;">
              ${materials.map(material => `<li>${material.filename}</li>`).join('')}
            </ul>
          </div>
          
          <p>All materials are attached to this email. Please download and review them before your next class.</p>
          <p>If you have any questions about the materials, please reach out to your instructor.</p>
          
          <p style="margin-top: 32px;">Happy learning!<br/>Perxels Team<br/>${appName}</p>
        </div>
      </div>
    `

    return await sendEmailWithAttachments(
      to,
      subject,
      html,
      materials,
      options
    )
  } catch (error) {
    console.error('❌ Send course materials email error:', error)
    return {
      success: false,
      message: 'Failed to send course materials email',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Generate HTML for payment approval notification (matches the image: purple background, checkmark, etc.)
 */
export function generatePaymentApprovedHtml(
  studentName: string,
  amount: number,
  cohort: string,
  classPlan: string,
): string {
  return `
    <div style="background: #E9E8F9; border-radius: 0; padding: 32px 24px; max-width: 600px; margin: 0 auto; font-family: 'Inter', Arial, sans-serif;">
      <h2 style="font-size: 1.2rem; font-weight: bold; margin: 0 0 24px 0; letter-spacing: 0.5px; color: #333333;">PAYMENT APPROVED</h2>
      <div style="color: #222; font-size: 1rem;">
        <p>Hello,</p>
        <p>Congratulations! Your payment of <b>₦${amount.toLocaleString()}</b> for Perxels Design School (Cohort <b>${cohort}</b>, Plan: <b>${classPlan}</b>) has been <b>approved</b>.</p>
        <p>You are now one step closer to completing your enrollment. If you have any questions or need assistance, feel free to reply to this email or contact support.</p>
        <p style="margin-top: 32px;">Regards,<br/>Perxels Manager<br/>Anu.</p>
      </div>
    </div>
  `
}

/**
 * Generate HTML for payment rejection notification (matches the image style, with rejection reason)
 */
export function generatePaymentRejectedHtml(
  studentName: string,
  amount: number,
  cohort: string,
  classPlan: string,
  reason: string,
): string {
  return `
    <div style="background: #E9E8F9; color: white; border-radius: 16px; padding: 32px 24px; max-width: 480px; margin: 0 auto; font-family: 'Inter', Arial, sans-serif;">
      <div style="display: flex; flex-direction: column; align-items: center;">
        <div style="background: white; border-radius: 50%; width: 64px; height: 64px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px;">
          <span style="color: #F44336; font-size: 36px;">❌</span>
        </div>
        <h2 style="margin: 0 0 8px 0; font-size: 1.5rem; font-weight: 700;">Payment Rejected</h2>
        <p style="margin: 0 0 16px 0; font-size: 1rem; font-weight: 400;">Hi <b>${studentName}</b>, your payment of <b>₦${amount.toLocaleString()}</b> for <b>${classPlan}</b> (${cohort}) was <b>rejected</b>.</p>
        <div style="margin-top: 8px; font-size: 0.95rem; color: #FFDAD6;">Reason: <b>${reason}</b></div>
        <div style="margin-top: 16px; font-size: 0.95rem; color: #FFDAD6;">Please review and resubmit your payment. Contact support if you need help.</div>
      </div>
    </div>
  `
}

/**
 * Generate HTML for "You have been admitted into Perxels" notification/email (matches provided design)
 */
export function generateAdmittedHtml(
  studentName: string,
  cohort: string,
): string {
  return `
    <div style="background: #E9E8F9; border-radius: 0; padding: 32px 24px; max-width: 600px; margin: 0 auto; font-family: 'Inter', Arial, sans-serif;">
      <h2 style="font-size: 1.2rem; font-weight: bold; margin: 0 0 24px 0; letter-spacing: 0.5px;">YOU HAVE BEEN ADMITTED INTO PERXELS</h2>
      <div style="color: #222; font-size: 1rem;">
        <p>Hello,</p>
        <p>I am delighted to inform you that you have been offered admission to Perxels Design School for the UI/UX Design program for a period of 3 months. On behalf of Perxels’ departments and staff, I want to extend a warm welcome to you as a new member of our esteemed design community. Your class name is <b>${cohort}</b>.</p>
        <p>Your acceptance into our program is a testament to your dedication and passion for design, and our mission at Perxels aligns with that which is to equipping designers with the core design skills and soft skills to become proficient in solving problems with design.</p>
        <p>Kindly take note of the following details as listed below (this needs to be done within 24 hours):</p>
        <ul style="margin-left: 1.2em;">
          <li>Join the Slack channel using the PDF guide attached to this email</li>
          <li>Sign up on Figma using the document attached to this email</li>
          <li>Attend Perxels Orientation on the 8th of June at 7 pm (This is very compulsory), and here is the link to join the session: <a href="https://meet.google.com/zii-mtkx-vkd" style="color: #6C63FF; text-decoration: underline;">https://meet.google.com/zii-mtkx-vkd</a></li>
        </ul>
        <p>You can also join via: <a href="https://bit.ly/3xk97VM" style="color: #767474; text-decoration: underline;">https://bit.ly/3xk97VM</a></p>
        <p style="margin-top: 18px; font-weight: bold;">PLEASE REPLY TO THIS EMAIL WITH 'I HAVE COMPLETED THE INSTRUCTIONS'</p>
        <p>Also, just so you know, the hub address and your timetable will be sent to you after the orientation day.<br/>
        Once again, congratulations on your admission to Perxels Design School. We are excited to welcome you to our community and look forward to seeing the incredible contributions you will make as a designer to the World.</p>
        <p>Please don't hesitate to reach out if you have any questions or need assistance.</p>
        <p>Welcome to Perxels Design School!</p>
        <p style="margin-top: 32px;">Regards,<br/>Perxels Manager<br/>Anu.</p>
      </div>
    </div>
  `
}

/**
 * Generate HTML for "Payment Rejected" notification/email (matches provided design, red card)
 */
export function generateRejectedHtml(
  studentName: string,
  cohort: string,
  rejectionReason: string,
): string {
  return `
    <div style="background: #FDEAEA; border-radius: 0; padding: 32px 24px; max-width: 600px; margin: 0 auto; font-family: 'Inter', Arial, sans-serif;">
      <h2 style="font-size: 1.2rem; font-weight: bold; margin: 0 0 24px 0; letter-spacing: 0.5px; color: #D32F2F;">PAYMENT REJECTED</h2>
      <div style="color: #222; font-size: 1rem;">
        <p>Hello,</p>
        <p>We regret to inform you that your recent payment for Perxels Design School (Cohort <b>${cohort}</b>) was <b>rejected</b>.</p>
        <p><b>Reason:</b> ${rejectionReason}</p>
        <p>Please review the reason above, make the necessary corrections, and try again. If you have any questions or need assistance, feel free to reply to this email or contact support.</p>
        <p style="margin-top: 32px;">Regards,<br/>Perxels Manager<br/>Anu.</p>
      </div>
    </div>
  `
}

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
          <a href="${
            process.env.NEXT_PUBLIC_BASE_URL || 'https://yoursite.com'
          }/portal/dashboard" style="display: inline-block; background: #6C63FF; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">Complete Payment</a>
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
 * Send payment reminder email to a student
 */
export async function sendPaymentReminderEmail(
  to: string,
  studentName: string,
  cohort: string,
  classPlan: string,
  totalFee: number,
  totalPaid: number,
  outstandingAmount: number,
  options: EmailOptions = {},
): Promise<EmailResponse> {
  try {
    const { appName = DEFAULT_APP_NAME } = options

    // Validate inputs
    if (!to || !to.includes('@')) {
      console.error('❌ Invalid email address:', to)
      return {
        success: false,
        message: 'Invalid email address',
        error: 'Email address is invalid or missing',
      }
    }

    console.log('📧 Sending payment reminder email to:', to)

    const resend = getResendClient()
    const fromEmail = process.env.RESEND_FROM_EMAIL || DEFAULT_FROM_EMAIL

    const subject = `💰 Payment Reminder - Outstanding Balance: ₦${outstandingAmount.toLocaleString()}`

    const html = generatePaymentReminderHtml(
      studentName,
      cohort,
      classPlan,
      totalFee,
      totalPaid,
      outstandingAmount,
    )

    console.log('📧 Sending payment reminder via Resend...')

    const result = await resend.emails.send({
      from: fromEmail,
      to: [to],
      subject,
      html,
    })

    console.log('📧 Resend API response:', {
      success: !result.error,
      emailId: result.data?.id,
      error: result.error,
    })

    if (result.error) {
      console.error('❌ Payment reminder email error:', result.error)
      return {
        success: false,
        message: 'Failed to send payment reminder email',
        error: result.error.message || JSON.stringify(result.error),
      }
    }

    console.log('✅ Payment reminder email sent successfully:', {
      emailId: result.data?.id,
      to,
      studentName,
    })

    return {
      success: true,
      emailId: result.data?.id,
      message: 'Payment reminder email sent successfully',
    }
  } catch (error) {
    console.error('❌ Send payment reminder email error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      to,
      studentName,
    })
    return {
      success: false,
      message: 'Failed to send payment reminder email',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Utility function to create attachment from file buffer
 */
export function createAttachmentFromBuffer(
  filename: string,
  buffer: Buffer,
  contentType?: string
): EmailAttachment {
  return {
    filename,
    content: buffer,
    contentType: contentType || 'application/octet-stream',
  }
}

/**
 * Utility function to create attachment from base64 string
 */
export function createAttachmentFromBase64(
  filename: string,
  base64Content: string,
  contentType?: string
): EmailAttachment {
  return {
    filename,
    content: base64Content,
    contentType: contentType || 'application/octet-stream',
  }
}

/**
 * Utility function to create PDF attachment
 */
export function createPdfAttachment(
  filename: string,
  content: Buffer | string
): EmailAttachment {
  return {
    filename,
    content,
    contentType: 'application/pdf',
  }
}

/**
 * Utility function to create image attachment
 */
export function createImageAttachment(
  filename: string,
  content: Buffer | string,
  imageType: 'png' | 'jpg' | 'jpeg' | 'gif' | 'webp' = 'png'
): EmailAttachment {
  const contentType = `image/${imageType}`
  return {
    filename,
    content,
    contentType,
  }
}

/**
 * Utility function to create document attachment
 */
export function createDocumentAttachment(
  filename: string,
  content: Buffer | string,
  documentType: 'doc' | 'docx' | 'pdf' | 'txt' | 'rtf' = 'pdf'
): EmailAttachment {
  const contentTypeMap = {
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    pdf: 'application/pdf',
    txt: 'text/plain',
    rtf: 'application/rtf',
  }
  
  return {
    filename,
    content,
    contentType: contentTypeMap[documentType],
  }
}

/**
 * Onboarding file configuration
 */
export const ONBOARDING_FILES = [
  {
    filename: 'how_to_onboard_on_slack.pdf',
    displayName: 'How_to_Onboard_on_Slack.pdf',
    description: 'Slack onboarding guide'
  },
  {
    filename: 'how_to_sign_up_on_figma.pdf',
    displayName: 'How_to_Sign_Up_on_Figma.pdf',
    description: 'Figma signup guide'
  }
] as const

/**
 * Create onboarding PDF attachments from configuration
 */
export function createOnboardingPdfAttachments(): EmailAttachment[] {
  const attachments: EmailAttachment[] = []
  
  try {
    for (const file of ONBOARDING_FILES) {
      const pdfPath = join(process.cwd(), 'public', 'assets', 'files', file.filename)
      const pdfBuffer = readFileSync(pdfPath)
      attachments.push({
        filename: file.displayName,
        content: pdfBuffer,
        contentType: 'application/pdf'
      })
    }
    
    return attachments
  } catch (error) {
    console.error('Error reading onboarding PDFs:', error)
    throw new Error('Failed to read onboarding PDF files')
  }
}

/**
 * Create single onboarding PDF attachment (for backward compatibility)
 */
export function createOnboardingPdfAttachment(): EmailAttachment {
  return createOnboardingPdfAttachments()[0]
}

/**
 * Send admission email with onboarding PDF attachments
 */
export async function sendAdmissionEmail(
  to: string,
  studentName: string,
  cohort: string,
  options: EmailOptions = {},
): Promise<EmailResponse> {
  try {
    console.log('🎓 sendAdmissionEmail called with:', {
      to,
      studentName,
      cohort,
      options
    })
    
    const resend = getResendClient()
    
    // Create the admission HTML content
    const htmlContent = generateAdmittedHtml(studentName, cohort)
    console.log('📧 Generated admission HTML content')
    
    // Create the PDF attachments
    console.log('📎 Creating PDF attachments...')
    const pdfAttachments = createOnboardingPdfAttachments()
    console.log('📎 PDF attachments created:', pdfAttachments.length, 'files')
    
    // Send email with attachments
    console.log('📤 Sending admission email via Resend...')
    const result = await resend.emails.send({
      from: options.from || DEFAULT_FROM_EMAIL,
      to: [to],
      subject: options.subject || 'You have been admitted into Perxels',
      html: htmlContent,
      attachments: pdfAttachments,
    })

    console.log('📥 Resend result:', {
      success: !result.error,
      error: result.error,
      emailId: result.data?.id
    })

    if (result.error) {
      console.error('❌ Resend error:', result.error)
      return {
        success: false,
        message: 'Failed to send admission email',
        error: result.error.message || 'Unknown error',
      }
    }

    console.log('✅ Admission email sent successfully')
    return {
      success: true,
      emailId: result.data?.id,
      message: 'Admission email sent successfully with PDF attachment',
    }
  } catch (error: any) {
    console.error('❌ Send admission email error:', error)
    return {
      success: false,
      message: 'Failed to send admission email',
      error: error?.message || 'Unknown error',
    }
  }
}

