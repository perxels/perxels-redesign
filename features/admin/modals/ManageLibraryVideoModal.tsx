import React, { useEffect, useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Select,
} from '@chakra-ui/react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore'
import { storage, db } from '../../../firebaseConfig' // Assuming you've set up Firebase
import { Video } from '../../../utils/types'

interface ManageVideoModalProps {
  isOpen: boolean
  onClose: () => void
  refetchVideos: () => void
  videoToEdit?: Video | null
}

const ManageLibraryVideoModal: React.FC<ManageVideoModalProps> = ({
  isOpen,
  onClose,
  refetchVideos,
  videoToEdit,
}) => {
  const [isUploading, setIsUploading] = useState(false)
  const [videoSourceType, setVideoSourceType] = useState<'youtube' | 'upload'>(
    'youtube',
  )
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)

  const formik = useFormik({
    initialValues: {
      videoTitle: '',
      videoSession: '',
      author: '',
      datePosted: '',
      videoUrl: '',
      imageUrl: '',
    },
    validationSchema: Yup.object({
      videoTitle: Yup.string().required('Video title is required'),
      videoSession: Yup.string().required('Video session is required'),
      videoUrl: Yup.string().required('Video URL or upload is required'),
    }),
    onSubmit: async (values) => {
      try {
        setIsUploading(true)

        // Handle video upload if selected
        let videoUrl = values.videoUrl
        let imageUrl = values.imageUrl
        if (videoSourceType === 'upload' && videoFile) {
          const uniqueName = `${Date.now()}_${videoFile.name}`
          const videoRef = ref(storage, `libraryVideos/${uniqueName}`)
          const snapshot = await uploadBytes(videoRef, videoFile)
          videoUrl = await getDownloadURL(snapshot.ref)
        }

        if (imageFile) {
          const uniqueName = `${Date.now()}_${imageFile.name}`
          const imageRef = ref(storage, `libraryImages/${uniqueName}`)
          const snapshot = await uploadBytes(imageRef, imageFile)
          imageUrl = await getDownloadURL(snapshot.ref)
        }

        const videoData = {
          ...values,
          videoUrl,
          imageUrl,
          author: 'Perxels', // You can update this as needed
          datePosted: new Date().toISOString(),
        }

        if (videoToEdit) {
          const videoRef = doc(db, 'libraryVideos', videoToEdit.id!)
          await updateDoc(videoRef, videoData)
        } else {
          await addDoc(collection(db, 'libraryVideos'), videoData)
        }

        formik.resetForm()
        onClose()
        refetchVideos()
      } catch (error) {
        console.error('Error saving video:', error)
      } finally {
        setIsUploading(false)
      }
    },
  })

  useEffect(() => {
    if (videoToEdit) {
      formik.setValues({
        videoTitle: videoToEdit.videoTitle,
        videoSession: videoToEdit.videoSession,
        author: videoToEdit.author,
        datePosted: videoToEdit.datePosted,
        videoUrl: videoToEdit.videoUrl,
        imageUrl: videoToEdit.imageUrl || '',
      })
    } else {
      formik.resetForm()
    }
  }, [videoToEdit])

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{videoToEdit ? 'Edit Video' : 'Create Video'}</ModalHeader>
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Video Title</FormLabel>
              <Input
                name="videoTitle"
                value={formik.values.videoTitle}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter video title"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Video Session</FormLabel>
              <Input
                name="videoSession"
                value={formik.values.videoSession}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter video session"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Video Source</FormLabel>
              <Select
                value={videoSourceType}
                onChange={(e) =>
                  setVideoSourceType(e.target.value as 'youtube' | 'upload')
                }
              >
                <option value="youtube">YouTube URL</option>
                <option value="upload">Upload Video</option>
              </Select>
            </FormControl>

            {videoSourceType === 'youtube' && (
              <FormControl isRequired>
                <FormLabel>YouTube URL</FormLabel>
                <Input
                  name="videoUrl"
                  value={formik.values.videoUrl}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter YouTube URL"
                />
              </FormControl>
            )}

            {videoSourceType === 'upload' && (
              <FormControl isRequired>
                <FormLabel>Upload Video</FormLabel>
                <Input
                  type="file"
                  accept="video/*"
                  onChange={(event) => {
                    if (event.currentTarget.files) {
                      setVideoFile(event.currentTarget.files[0])
                      formik.setFieldValue(
                        'videoUrl',
                        event.currentTarget.files[0],
                      )
                    }
                  }}
                  onBlur={formik.handleBlur}
                />
              </FormControl>
            )}
            <FormControl isRequired>
              <FormLabel>Video Imaage (431 X 253)</FormLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  if (event.currentTarget.files) {
                    setImageFile(event.currentTarget.files[0])
                    formik.setFieldValue(
                      'imageUrl',
                      event.currentTarget.files[0],
                    )
                  }
                }}
                onBlur={formik.handleBlur}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Author</FormLabel>
              <Input
                name="author"
                value="Perxels" // You can dynamically fetch author if needed
                isReadOnly
              />
            </FormControl>

            <FormControl>
              <FormLabel>Date Posted</FormLabel>
              <Input
                name="datePosted"
                value={new Date().toLocaleDateString()} // Auto-generated date
                isReadOnly
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" onClick={onClose} mr={3}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={formik.submitForm}
            isLoading={isUploading}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ManageLibraryVideoModal
