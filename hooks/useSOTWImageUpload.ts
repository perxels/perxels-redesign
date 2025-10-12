import { useState } from 'react'
import { useToast } from '@chakra-ui/react'

interface UploadResult {
  url: string
  publicId: string
  format: string
}

export const useSOTWImageUpload = () => {
  const [uploading, setUploading] = useState(false)
  const toast = useToast()

  const uploadSOTWImage = async (file: File): Promise<UploadResult> => {
    setUploading(true)

    try {
      // Convert file to base64 (similar to your profile picture upload)
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      // Upload to your existing API endpoint
      const response = await fetch('/api/upload-sotw-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file: base64Data,
          fileName: file.name,
          fileType: file.type,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Upload failed: ${errorText}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Upload failed')
      }

      return result.data
    } catch (error: any) {
      console.error('SOTW image upload error:', error)
      toast({
        title: 'Upload failed',
        description: error.message,
        status: 'error',
        duration: 3000,
      })
      throw error
    } finally {
      setUploading(false)
    }
  }

  return { uploadSOTWImage, uploading }
}
