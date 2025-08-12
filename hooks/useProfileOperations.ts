import { useState } from 'react'
import { doc, updateDoc, getDoc } from 'firebase/firestore'
import { portalDb } from '../portalFirebaseConfig'
import { useToast } from '@chakra-ui/react'

interface ProfileData {
  fullName: string
  phone: string
  schoolFeeInfo?: any
  growthInfo?: any
}

interface GrowthInfoData {
  profession: string
  whyClass: string
  classOutcome: string
  gender: string
  pictureUrl: string
}

interface ProfileImageData {
  imageUrl: string
}

export const useProfileOperations = () => {
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const updateProfileDetails = async (uid: string, profileData: ProfileData) => {
    setIsLoading(true)
    
    try {


      // Validate on client side
      if (!uid || !profileData.fullName || !profileData.phone) {
        throw new Error('Missing required fields: uid, fullName, and phone are required')
      }

      // Validate phone number format
      const phoneRegex = /^(\+234|0)[789][01]\d{8}$/
      if (!phoneRegex.test(profileData.phone)) {
        throw new Error('Invalid phone number format')
      }

      // Validate full name
      const nameRegex = /^[a-zA-Z\s]*$/
      if (!nameRegex.test(profileData.fullName) || profileData.fullName.length < 2) {
        throw new Error('Invalid full name format')
      }

      // Prepare update data
      const updateData: any = {
        fullName: profileData.fullName.trim(),
        phone: profileData.phone.trim(),
        updatedAt: new Date().toISOString(),
      }

      // Add school fee info if provided
      if (profileData.schoolFeeInfo) {
        updateData.schoolFeeInfo = profileData.schoolFeeInfo
      }

      // Add growth info if provided
      if (profileData.growthInfo) {
        updateData.growthInfo = profileData.growthInfo
      }

      // Update user document in Firestore
      const userDocRef = doc(portalDb, 'users', uid)
      await updateDoc(userDocRef, updateData)


      toast({
        title: 'Success',
        description: 'Profile details updated successfully',
        status: 'success',
        duration: 3000,
      })

      return { success: true, data: updateData }

    } catch (error: any) {
      console.error('❌ Profile details update error:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile details',
        status: 'error',
        duration: 3000,
      })
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  const updateGrowthInfo = async (uid: string, growthInfo: GrowthInfoData) => {
    setIsLoading(true)
    
    try {


      // Validate on client side
      if (!uid || !growthInfo) {
        throw new Error('User ID and growth information are required')
      }

      const { profession, whyClass, classOutcome, gender, pictureUrl } = growthInfo
      if (!profession || !whyClass || !classOutcome || !gender) {
        throw new Error('All growth information fields are required')
      }

      // Verify user exists
      const userDoc = await getDoc(doc(portalDb, 'users', uid))
      if (!userDoc.exists()) {
        throw new Error('User not found')
      }

      // Update user document with growth information
      const updateData: any = {
        growthInfo: {
          profession,
          whyClass,
          classOutcome,
          gender,
        },
        growthInfoUpdatedAt: new Date(),
        // Mark registration as complete
        registrationComplete: true,
        registrationCompletedAt: new Date(),
      }

      // Only add pictureUrl if it's provided
      if (pictureUrl) {
        updateData.growthInfo.pictureUrl = pictureUrl
      }

      await updateDoc(doc(portalDb, 'users', uid), updateData)


      toast({
        title: 'Success',
        description: 'Growth information updated successfully',
        status: 'success',
        duration: 3000,
      })

      return { success: true, data: updateData }

    } catch (error: any) {
      console.error('❌ Growth info update error:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to update growth information',
        status: 'error',
        duration: 3000,
      })
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  const updateProfileImage = async (uid: string, imageUrl: string) => {
    setIsLoading(true)
    
    try {


      // Validate on client side
      if (!uid || !imageUrl) {
        throw new Error('Missing required fields: uid and imageUrl are required')
      }

      // Validate imageUrl format (basic check)
      if (!imageUrl.startsWith('https://') || !imageUrl.includes('cloudinary.com')) {
        throw new Error('Invalid image URL format')
      }

      // Update user document in Firestore
      const updateData = {
        'growthInfo.pictureUrl': imageUrl,
        updatedAt: new Date().toISOString(),
      }

      const userDocRef = doc(portalDb, 'users', uid)
      await updateDoc(userDocRef, updateData)


      toast({
        title: 'Success',
        description: 'Profile image updated successfully',
        status: 'success',
        duration: 3000,
      })

      return { success: true, data: updateData }

    } catch (error: any) {
      console.error('❌ Profile image update error:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile image',
        status: 'error',
        duration: 3000,
      })
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    updateProfileDetails,
    updateGrowthInfo,
    updateProfileImage,
    isLoading,
  }
}
