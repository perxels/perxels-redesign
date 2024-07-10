// utils/email.ts
import emailjs from 'emailjs-com';

export const generateOTP = (length: number = 6): string => {
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
};

export const sendOTPEmail = async (email: string, fullName:string, otp: string): Promise<void> => {
  const templateParams = {
    user_email: email,
    otp: otp,
    name:fullName
  };

  try {
    await emailjs.send(
      'service_znreobf',       // Replace with your Service ID
      'template_ymbip7b',      // Replace with your Template ID
      templateParams,
      '6Bzh_uSjCnKOCzC5B'    // Replace with your Public API Key
    );
  } catch (error) {
    console.error('Failed to send OTP email:', error);
  }
};
