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
} from '@chakra-ui/react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore'
import { storage, db } from '../../../firebaseConfig'
import { Testimonial } from '../../../utils/types' // Assuming Testimonial type is defined

interface ManageTestimonialModalProps {
  isOpen: boolean
  onClose: () => void
  refetchTestimonials: () => void
  testimonialToEdit?: Testimonial | null
}

const ManageTestimonialModal: React.FC<ManageTestimonialModalProps> = ({
  isOpen,
  onClose,
  refetchTestimonials,
  testimonialToEdit,
}) => {
  const [isUploading, setIsUploading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)

  const formik = useFormik({
    initialValues: {
      name: '',
      role: '',
      testimony: '',
      imageUrl: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      role: Yup.string().required('Role is required'),
      testimony: Yup.string().required('Testimony is required'),
    }),
    onSubmit: async (values) => {
      try {
        setIsUploading(true)

        // Handle image upload if selected
        let imageUrl = values.imageUrl
        if (imageFile) {
          const uniqueName = `${Date.now()}_${imageFile.name}`
          const imageRef = ref(storage, `testimonialsImages/${uniqueName}`)
          const snapshot = await uploadBytes(imageRef, imageFile)
          imageUrl = await getDownloadURL(snapshot.ref)
        }

        const testimonialData = {
          ...values,
          imageUrl,
        }

        if (testimonialToEdit) {
          const testimonialRef = doc(db, 'testimonials', testimonialToEdit.id!)
          await updateDoc(testimonialRef, testimonialData)
        } else {
          await addDoc(collection(db, 'testimonials'), testimonialData)
        }

        formik.resetForm()
        onClose()
        refetchTestimonials()
      } catch (error) {
        console.error('Error saving testimonial:', error)
      } finally {
        setIsUploading(false)
      }
    },
  })

  useEffect(() => {
    if (testimonialToEdit) {
      formik.setValues({
        name: testimonialToEdit.name,
        role: testimonialToEdit.role,
        testimony: testimonialToEdit.testimony,
        imageUrl: testimonialToEdit.imageUrl || '',
      })
    } else {
      formik.resetForm()
    }
  }, [testimonialToEdit])

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {testimonialToEdit ? 'Edit Testimonial' : 'Create Testimonial'}
        </ModalHeader>
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter name"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Role</FormLabel>
              <Input
                name="role"
                value={formik.values.role}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter role"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Testimony</FormLabel>
              <Input
                name="testimony"
                value={formik.values.testimony}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter testimony"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Upload Image (75 X 75)</FormLabel>
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

export default ManageTestimonialModal
