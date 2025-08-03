import * as Yup from 'yup'
import React, { useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Select,
  SimpleGrid,
  VStack,
  useToast,
  Text,
} from '@chakra-ui/react'
import { Formik } from 'formik'
import { AuthInput } from './auth-input'
import { portalAuth, portalDb } from '../../../portalFirebaseConfig'
import { useRouter } from 'next/navigation'
import { usePortalAuth } from '../../../hooks/usePortalAuth'
import { EnhancedImageUpload } from '../../../components/EnhancedImageUpload'
import { doc, updateDoc, getDoc } from 'firebase/firestore'

interface GrowthInfoFormValues {
  profession: string
  whyClass: string
  classOutcome: string
  gender: string
  picture: File | null
}

interface GrowthInfoData {
  profession: string
  whyClass: string
  classOutcome: string
  gender: string
  pictureUrl: string
}

const formSchema = Yup.object().shape({
  profession: Yup.string().required('Profession is required'),
  whyClass: Yup.string().required('Why UI/UX is required'),
  classOutcome: Yup.string().required('Class outcome is required'),
  gender: Yup.string()
    .required('Gender is required')
    .oneOf(['male', 'female'], 'Please select a valid gender'),
  picture: Yup.mixed().nullable().optional(),
})

export const GrowthInfoForm = () => {
  const [pictureFile, setPictureFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const toast = useToast()
  const router = useRouter()
  const { user } = usePortalAuth()

  const handleGrowthInfoSubmit = async (values: GrowthInfoFormValues) => {
    setIsSubmitting(true)

    try {
      // Verify user authentication before proceeding
      const currentUser = portalAuth.currentUser
      if (!currentUser || !user?.uid) {
        throw new Error('User not authenticated. Please log in again.')
      }

      // Wait for auth state to be ready
      await currentUser.reload()
      const uid = currentUser.uid

      // Upload profile picture to Cloudinary (optional)
      let pictureUrl = ''
      if (pictureFile) {
        try {
          // Convert file to base64 for API upload
          const reader = new FileReader()
          const base64Promise = new Promise<string>((resolve, reject) => {
            reader.onload = () => resolve(reader.result as string)
            reader.onerror = reject
          })
          reader.readAsDataURL(pictureFile)
          
          const base64Data = await base64Promise
          
          // Upload to Cloudinary via our API
          const uploadResponse = await fetch('/api/upload-profile-picture', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              uid,
              file: base64Data,
              fileName: pictureFile.name,
              fileType: pictureFile.type,
            }),
          })

          if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text()
            console.error('❌ Upload API error response:', errorText)
            throw new Error('Failed to upload profile picture')
          }

          const uploadResult = await uploadResponse.json()

          if (!uploadResult.success) {
            throw new Error(uploadResult.error || 'Failed to upload profile picture')
          }

          pictureUrl = uploadResult.url
        } catch (uploadError: any) {
          console.error('Profile picture upload error:', uploadError)
          throw new Error('Failed to upload profile picture. Please try again.')
        }
      }

      // Verify user exists in Firestore
      const userDoc = await getDoc(doc(portalDb, 'users', uid))
      if (!userDoc.exists()) {
        throw new Error('User not found. Please log in again.')
      }

      // Check if user already has growth info
      const userData = userDoc.data()
      if (userData?.growthInfo) {
        throw new Error('Growth information already exists.')
      }

      // Prepare growth info data
      const growthInfoData: GrowthInfoData = {
        profession: values.profession,
        whyClass: values.whyClass,
        classOutcome: values.classOutcome,
        gender: values.gender,
        pictureUrl,
      }

      // Update user document with growth info directly in Firestore
      await updateDoc(doc(portalDb, 'users', uid), {
        growthInfo: growthInfoData,
        growthInfoUpdatedAt: new Date(),
      })

      toast({
        title: 'Growth Information Updated! 🎉',
        description: 'Your information has been saved successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top',
      })

      // Redirect to terms and conditions or dashboard
      router.push('/portal/terms-and-conditions')
    } catch (error: any) {
      console.error('Growth info update error:', error)

      let errorMessage =
        'Failed to update growth information. Please try again.'
      if (error.message.includes('session')) {
        errorMessage = error.message
      } else if (error.message.includes('upload')) {
        errorMessage = 'Failed to upload picture. Please try again.'
      }

      toast({
        title: 'Update Failed',
        description: errorMessage,
        status: 'error',
        duration: 8000,
        isClosable: true,
        position: 'top',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Formik<GrowthInfoFormValues>
      initialValues={{
        profession: '',
        whyClass: '',
        classOutcome: '',
        gender: '',
        picture: null,
      }}
      validationSchema={formSchema}
      onSubmit={handleGrowthInfoSubmit}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting: formikIsSubmitting,
        isValid,
        setFieldValue,
      }) => {
        return (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmit(e)
            }}
          >
            <VStack w="full" alignItems="flex-start">
              <SimpleGrid columns={[1, 2]} spacing={[5, 10]} w="full" maxW={'750px'}>
                <AuthInput name="profession" placeholder="Current Profession" />

                <AuthInput
                  name="whyClass"
                  label="Why UI/UX"
                  placeholder="Why UIUX Design"
                />

                <AuthInput
                  name="classOutcome"
                  placeholder="What are you looking forward to?"
                />

                <Box w="full">
                  <Select
                    h="3.5rem"
                    w="full"
                    placeholder="Select your gender*"
                    name="gender"
                    borderWidth={1}
                    borderColor={
                      touched.gender && errors.gender ? 'red.500' : 'yellow.300'
                    }
                    bgColor="yellow.50"
                    value={values.gender}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    _focus={{
                      borderColor:
                        touched.gender && errors.gender
                          ? 'red.500'
                          : 'yellow.400',
                      bgColor: 'yellow.50',
                    }}
                    _focusVisible={{
                      outline: 'none',
                    }}
                    _active={{
                      borderColor:
                        touched.gender && errors.gender
                          ? 'red.500'
                          : 'yellow.400',
                      bgColor: 'yellow.50',
                    }}
                    _hover={{
                      borderColor:
                        touched.gender && errors.gender
                          ? 'red.500'
                          : 'yellow.400',
                      bgColor: 'yellow.50',
                    }}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </Select>
                  {touched.gender && errors.gender && (
                    <Text fontSize="sm" color="red.500" mt={1}>
                      {errors.gender}
                    </Text>
                  )}
                </Box>

                <VStack w="full" alignItems="flex-start" gap="4">
                  <FormControl>
                    <FormLabel>Profile Picture (Optional)</FormLabel>
                    <EnhancedImageUpload
                      value={pictureFile ? URL.createObjectURL(pictureFile) : undefined}
                      onChange={(file) => {
                        setPictureFile(file)
                        setFieldValue('picture', file)
                      }}
                      onError={(error) => {
                        setFieldValue('picture', null)
                      }}
                      maxSize={5}
                      acceptedTypes={['image/jpeg', 'image/png', 'image/jpg']}
                      aspectRatio={{ width: 1, height: 1 }}
                      minDimensions={{ width: 200, height: 200 }}
                      uploadText="Drop profile picture here or click to upload (optional)"
                      previewText="PROFILE"
                    />
                  </FormControl>
                </VStack>
              </SimpleGrid>

              <HStack justifyContent="flex-end" w="full" mt={10}>
                <Button
                  h="3.5rem"
                  type="submit"
                  disabled={isSubmitting || !isValid}
                  isLoading={isSubmitting}
                  px={16}
                >
                  Complete Registration
                </Button>
              </HStack>
            </VStack>
          </form>
        )
      }}
    </Formik>
  )
}
