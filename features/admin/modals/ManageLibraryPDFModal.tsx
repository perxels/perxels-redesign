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
import { storage, db } from '../../../firebaseConfig' // Assuming you've set up Firebase
import { PDFDocument } from '../../../utils/types'

interface ManagePDFModalProps {
  isOpen: boolean
  onClose: () => void
  refetchPDFs: () => void
  pdfToEdit?: PDFDocument | null
}

const ManageLibraryPDFModal: React.FC<ManagePDFModalProps> = ({
  isOpen,
  onClose,
  refetchPDFs,
  pdfToEdit,
}) => {
  const [isUploading, setIsUploading] = useState(false)
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)

  const formik = useFormik({
    initialValues: {
      mainTitle: '',
      subTitle: '',
      role: '',
      url: '',
      bannerImage: '',
    },
    validationSchema: Yup.object({
      mainTitle: Yup.string().required('Main title is required'),
      url: Yup.string().required('PDF URL or upload is required'),
    }),
    onSubmit: async (values) => {
      try {
        setIsUploading(true)

        // Handle PDF upload if selected
        let pdfUrl = values.url
        let bannerImageUrl = values.bannerImage
        if (pdfFile) {
          const uniqueName = `${Date.now()}_${pdfFile.name}`
          const pdfRef = ref(storage, `libraryPDFs/${uniqueName}`)
          const snapshot = await uploadBytes(pdfRef, pdfFile)
          pdfUrl = await getDownloadURL(snapshot.ref)
        }

        if (imageFile) {
          const uniqueName = `${Date.now()}_${imageFile.name}`
          const imageRef = ref(storage, `libraryImages/${uniqueName}`)
          const snapshot = await uploadBytes(imageRef, imageFile)
          bannerImageUrl = await getDownloadURL(snapshot.ref)
        }

        const pdfData = {
          ...values,
          url: pdfUrl,
          bannerImage: bannerImageUrl,
          author: 'Perxels', // You can update this as needed
          datePosted: new Date().toISOString(),
          tag: 'E-Book', // Fixed value for your PDFs
        }

        if (pdfToEdit) {
          const pdfRef = doc(db, 'libraryPDFs', pdfToEdit.id!)
          await updateDoc(pdfRef, pdfData)
        } else {
          await addDoc(collection(db, 'libraryPDFs'), pdfData)
        }

        formik.resetForm()
        onClose()
        refetchPDFs()
      } catch (error) {
        console.error('Error saving PDF:', error)
      } finally {
        setIsUploading(false)
      }
    },
  })

  useEffect(() => {
    if (pdfToEdit) {
      formik.setValues({
        mainTitle: pdfToEdit.mainTitle,
        subTitle: pdfToEdit.subTitle || '',
        role: pdfToEdit.role,
        url: pdfToEdit.url,
        bannerImage: pdfToEdit.bannerImage || '',
      })
    } else {
      formik.resetForm()
    }
  }, [pdfToEdit])

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{pdfToEdit ? 'Edit PDF' : 'Create PDF'}</ModalHeader>
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Main Title</FormLabel>
              <Input
                name="mainTitle"
                value={formik.values.mainTitle}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter main title"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Subtitle</FormLabel>
              <Input
                name="subTitle"
                value={formik.values.subTitle}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter subtitle (optional)"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>PDF Upload</FormLabel>
              <Input
                type="file"
                accept="application/pdf"
                onChange={(event) => {
                  if (event.currentTarget.files) {
                    setPdfFile(event.currentTarget.files[0])
                    formik.setFieldValue('url', event.currentTarget.files[0])
                  }
                }}
                onBlur={formik.handleBlur}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Banner Image</FormLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  if (event.currentTarget.files) {
                    setImageFile(event.currentTarget.files[0])
                    formik.setFieldValue(
                      'bannerImage',
                      event.currentTarget.files[0],
                    )
                  }
                }}
                onBlur={formik.handleBlur}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Role</FormLabel>
              <Input
                name="role"
                value={formik.values.role}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter description of the PDF"
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

export default ManageLibraryPDFModal
