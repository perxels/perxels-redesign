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
  Textarea,
  VStack,
  Image,
} from '@chakra-ui/react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore'
import { storage, db } from '../../../firebaseConfig' // Assuming you've set up Firebase

interface MasterClass {
  id?: string // For identifying classes during editing
  title: string
  dateTime: string
  content1?: string
  content2?: string
  content3?: string
  importantInfo: string
  image: string
}

interface ManageMasterClassModalProps {
  isOpen: boolean
  onClose: () => void
  refetchClasses: () => void
  masterClassToEdit?: MasterClass | null // For editing
}

const ManageMasterClassModal: React.FC<ManageMasterClassModalProps> = ({
  isOpen,
  onClose,
  refetchClasses,
  masterClassToEdit,
}) => {
  const [isUploading, setIsUploading] = useState(false)
  const [image, setImage] = useState<File | null>(null)

  const formik = useFormik({
    initialValues: {
      title: '',
      dateTime: '',
      content1: '',
      content2: '',
      content3: '',
      importantInfo: '',
      image: '',
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      dateTime: Yup.string().required('Date and time are required'),
      importantInfo: Yup.string().required('Important information is required'),
    }),
    onSubmit: async (values) => {
      try {
        setIsUploading(true)
        let imageUrl = values.image
        if (image) {
          const uniqueName = `${Date.now()}_${image.name}` // Use timestamp and original name
          const imageRef = ref(storage, `masterClasses/${uniqueName}`)
          const snapshot = await uploadBytes(imageRef, image)
          imageUrl = await getDownloadURL(snapshot.ref)
        }
        const masterClassData = {
          ...values,
          image: imageUrl,
        }

        if (masterClassToEdit) {
          const classRef = doc(db, 'masterClasses', masterClassToEdit.id!)
          await updateDoc(classRef, masterClassData)
        } else {
          await addDoc(collection(db, 'masterClasses'), {
            ...masterClassData,
          })
        }
        // onSave(masterClassData)
        formik.resetForm()
        onClose()
        return refetchClasses()
      } catch (error) {
        console.error('Error saving master class:', error)
      } finally {
        setIsUploading(false)
      }
    },
  })

  useEffect(() => {
    if (masterClassToEdit) {
      formik.setValues({
        title: masterClassToEdit.title,
        dateTime: masterClassToEdit.dateTime,
        content1: masterClassToEdit.content1 || '',
        content2: masterClassToEdit.content2 || '',
        content3: masterClassToEdit.content3 || '',
        importantInfo: masterClassToEdit.importantInfo,
        image: masterClassToEdit.image,
      })
    } else {
      formik.resetForm()
    }
  }, [masterClassToEdit])

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {masterClassToEdit ? 'Edit Master Class' : 'Create Master Class'}
        </ModalHeader>
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Title</FormLabel>
              <Input
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter class title"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Date and Time</FormLabel>
              <Input
                type="datetime-local"
                name="dateTime"
                value={formik.values.dateTime}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Content 1</FormLabel>
              <Textarea
                name="content1"
                value={formik.values.content1}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter content 1"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Content 2</FormLabel>
              <Textarea
                name="content2"
                value={formik.values.content2}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter content 2"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Content 3</FormLabel>
              <Textarea
                name="content3"
                value={formik.values.content3}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter content 3"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Important Information</FormLabel>
              <Textarea
                name="importantInfo"
                value={formik.values.importantInfo}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter important information"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Image</FormLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  if (event.currentTarget.files) {
                    setImage(event.currentTarget.files[0])
                    formik.setFieldValue('image', event.currentTarget.files[0])
                  }
                }}
                onBlur={formik.handleBlur}
              />
              {formik.values.image && (
                <Image
                  src={
                    typeof formik.values.image === 'string'
                      ? formik.values.image
                      : URL.createObjectURL(formik.values.image)
                  }
                  alt="Class Image"
                  mt={2}
                  maxW="100%"
                  maxH="200px"
                  objectFit="contain"
                  objectPosition="center"
                />
              )}
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" onClick={onClose} mr={3}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={() => {
              formik.submitForm()
              // Any other logic you want to execute on click
            }}
            isLoading={isUploading}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ManageMasterClassModal
