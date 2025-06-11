'use server'

import { Resend } from 'resend'
import type { CreateEmailOptions } from 'resend'

// Types
interface EmailOptions {
  subject?: string
  expiresInMinutes?: number
  appName?: string
  dashboardUrl?: string
}

interface CustomEmailData {
  to: string
  subject: string
  html?: string
  text?: string
  from?: string
  attachments?: Array<{
    filename: string
    content: Buffer | string
  }>
}

interface EmailResponse {
  success: boolean
  emailId?: string
  message: string
  error?: string
}

interface BulkEmailResult extends EmailResponse {
  to: string
}

// Custom error class
class ResendServiceError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message)
    this.name = 'ResendServiceError'
  }
}

// Configuration
const DEFAULT_APP_NAME = 'Perxels'
const DEFAULT_FROM_EMAIL = 'onboarding@resend.dev'

// Utility functions
function generateOTP(length = 6): string {
  const min = Math.pow(10, length - 1)
  const max = Math.pow(10, length) - 1
  return Math.floor(Math.random() * (max - min + 1) + min).toString()
}

// Email templates
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
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
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

function generateWelcomeTemplate(
  name: string,
  appName: string,
  dashboardUrl: string,
): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to ${appName}</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">${appName}</h1>
            <p style="color: rgba(255,255,255,0.8); margin: 10px 0 0 0; font-size: 16px;">Welcome aboard!</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 20px;">
            <h2 style="color: #333; margin: 0 0 20px 0; font-size: 24px; text-align: center;">
              Welcome, ${name}! 🎉
            </h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 30px; text-align: center;">
              Thank you for joining ${appName}. We're excited to have you on board!
            </p>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="${dashboardUrl}" style="display: inline-block; background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Get Started
              </a>
            </div>
            
            <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 30px 0;">
              <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">What's next?</h3>
              <ul style="color: #666; margin: 0; padding-left: 20px;">
                <li style="margin-bottom: 8px;">Complete your profile setup</li>
                <li style="margin-bottom: 8px;">Explore our features</li>
                <li style="margin-bottom: 8px;">Join our community</li>
              </ul>
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

function generatePasswordResetTemplate(
  resetUrl: string,
  expiresInMinutes: number,
  appName: string,
): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">${appName}</h1>
            <p style="color: rgba(255,255,255,0.8); margin: 10px 0 0 0; font-size: 16px;">Password Reset</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 20px;">
            <h2 style="color: #333; margin: 0 0 20px 0; font-size: 24px; text-align: center;">Reset Your Password</h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 30px; text-align: center;">
              We received a request to reset your password. Click the button below to create a new password:
            </p>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="${resetUrl}" style="display: inline-block; background: #dc3545; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Reset Password
              </a>
            </div>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin: 20px 0; text-align: center;">
              <p style="margin: 0; color: #856404; font-size: 14px;">
                ⏰ <strong>This link expires in ${expiresInMinutes} minutes</strong>
              </p>
            </div>
            
            <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 30px 0;">
              <p style="color: #666; font-size: 14px; line-height: 1.4; margin: 0;">
                <strong>Can't click the button?</strong><br>
                Copy and paste this URL into your browser:<br>
                <span style="color: #007bff; word-break: break-all;">${resetUrl}</span>
              </p>
            </div>
            
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 12px; line-height: 1.4; margin: 0; text-align: center;">
                If you didn't request a password reset, please ignore this email or contact support if you have concerns.
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

// Main service
class ResendService {
  private getResendClient() {
    const apiKey = "re_YwHnkPhv_LRMTGUbsBciAh8KkWD9s9JCP"
    if (!apiKey) {
      throw new ResendServiceError('RESEND_API_KEY is not configured')
    }

    // Validate API key format
    if (!apiKey.startsWith('re_')) {
      throw new ResendServiceError('Invalid RESEND_API_KEY format. It should start with "re_"')
    }

    try {
      const resend = new Resend(apiKey)
      return resend
    } catch (error) {
      console.error('Failed to initialize Resend:', error)
      throw new ResendServiceError(
        'Failed to initialize Resend service. Please check your API key and permissions.'
      )
    }
  }

  private getFromEmail() {
    const fromEmail = DEFAULT_FROM_EMAIL
    if (!fromEmail) {
      throw new ResendServiceError('RESEND_FROM_EMAIL is not configured')
    }
    return fromEmail
  }

  async sendOTPEmail(
    to: string,
    otp: string,
    options: EmailOptions = {},
  ): Promise<EmailResponse> {
    const {
      subject = 'Your Verification Code',
      expiresInMinutes = 5,
      appName = DEFAULT_APP_NAME,
    } = options

    try {
      if (!to) {
        throw new ResendServiceError('Recipient email is required')
      }

      const resend = this.getResendClient()
      const fromEmail = this.getFromEmail()

      console.log('Sending OTP email to:', to)
      console.log('Using from email:', fromEmail)

      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to,
        subject,
        html: generateOTPTemplate(otp, expiresInMinutes, appName),
      })

      if (error) {
        console.error('Resend API error:', error)
        if (error.message.includes('permission')) {
          throw new ResendServiceError(
            'Email sending failed: API key does not have sufficient permissions. Please check your Resend API key configuration and verify your sender domain.'
          )
        }
        if (error.message.includes('domain')) {
          throw new ResendServiceError(
            'Email sending failed: Sender domain is not verified. Please verify your domain in the Resend dashboard.'
          )
        }
        throw new ResendServiceError(`Resend error: ${error.message}`, error)
      }

      if (!data?.id) {
        throw new ResendServiceError('No email ID returned from Resend')
      }

      return {
        success: true,
        emailId: data.id,
        message: 'OTP sent successfully',
      }
    } catch (error) {
      console.error('Send OTP email error:', error)
      if (error instanceof ResendServiceError) {
        throw error
      }
      throw new ResendServiceError(
        `Failed to send OTP email: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
        error,
      )
    }
  }

  async sendWelcomeEmail(
    to: string,
    name: string,
    options: EmailOptions = {},
  ): Promise<EmailResponse> {
    const {
      subject = 'Welcome to Our Platform!',
      appName = DEFAULT_APP_NAME,
      dashboardUrl = '#',
    } = options

    try {
      const resend = this.getResendClient()
      const fromEmail = this.getFromEmail()

      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to,
        subject,
        html: generateWelcomeTemplate(name, appName, dashboardUrl),
      })

      if (error) {
        throw new ResendServiceError(`Resend error: ${error.message}`, error)
      }

      if (!data?.id) {
        throw new ResendServiceError('No email ID returned from Resend')
      }

      return {
        success: true,
        emailId: data.id,
        message: 'Welcome email sent successfully',
      }
    } catch (error) {
      console.error('Send welcome email error:', error)
      throw new ResendServiceError(
        `Failed to send welcome email: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
        error,
      )
    }
  }

  async sendPasswordResetEmail(
    to: string,
    resetUrl: string,
    options: EmailOptions = {},
  ): Promise<EmailResponse> {
    const {
      subject = 'Reset Your Password',
      appName = DEFAULT_APP_NAME,
      expiresInMinutes = 15,
    } = options

    try {
      const resend = this.getResendClient()
      const fromEmail = this.getFromEmail()

      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to,
        subject,
        html: generatePasswordResetTemplate(
          resetUrl,
          expiresInMinutes,
          appName,
        ),
      })

      if (error) {
        throw new ResendServiceError(`Resend error: ${error.message}`, error)
      }

      if (!data?.id) {
        throw new ResendServiceError('No email ID returned from Resend')
      }

      return {
        success: true,
        emailId: data.id,
        message: 'Password reset email sent successfully',
      }
    } catch (error) {
      console.error('Send password reset email error:', error)
      throw new ResendServiceError(
        `Failed to send password reset email: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
        error,
      )
    }
  }

  async sendCustomEmail(emailData: CustomEmailData): Promise<EmailResponse> {
    const {
      to,
      subject,
      html,
      text,
      from,
      attachments = [],
    } = emailData

    if (!to || !subject || (!html && !text)) {
      throw new ResendServiceError(
        'Missing required email fields: to, subject, and content',
      )
    }

    try {
      const resend = this.getResendClient()
      const fromEmail = from || this.getFromEmail()

      // Ensure we have either text or html content
      const emailConfig: CreateEmailOptions = {
        from: fromEmail,
        to,
        subject,
        ...(html ? { html } : { text: text || '' }),
        ...(attachments.length > 0 && { attachments }),
      }

      const { data, error } = await resend.emails.send(emailConfig)

      if (error) {
        throw new ResendServiceError(`Resend error: ${error.message}`, error)
      }

      if (!data?.id) {
        throw new ResendServiceError('No email ID returned from Resend')
      }

      return {
        success: true,
        emailId: data.id,
        message: 'Email sent successfully',
      }
    } catch (error) {
      console.error('Send custom email error:', error)
      throw new ResendServiceError(
        `Failed to send email: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
        error,
      )
    }
  }

  async sendBulkEmails(emails: CustomEmailData[]): Promise<BulkEmailResult[]> {
    const results: BulkEmailResult[] = []

    for (const email of emails) {
      try {
        const result = await this.sendCustomEmail(email)
        results.push({ ...result, to: email.to })
      } catch (error) {
        results.push({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          message: 'Failed to send email',
          to: email.to,
        })
      }
    }

    return results
  }
}

// Create singleton instance
const resendService = new ResendService()

export default resendService

// Named exports
export {
  generateOTP,
  ResendServiceError,
  type EmailOptions,
  type CustomEmailData,
  type EmailResponse,
  type BulkEmailResult,
}
