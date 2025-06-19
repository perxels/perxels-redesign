import {
  FormControl,
  Modal,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  VStack,
  ModalBody,
  FormLabel,
  Input,
  ModalFooter,
  Button,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import * as Yup from 'yup'
import { AdminMasterClass } from '../../../utils/types'
import { useFormik } from 'formik'
import { addDoc, collection, doc, getDocs, updateDoc } from 'firebase/firestore'
import { db, storage } from '../../../firebaseConfig'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

interface ManageLibraryMasterClassModalProps {
  isOpen: boolean
  onClose: () => void
  refetchMasterClasses: () => void
  masterClassToEdit: AdminMasterClass | null
}

const ManageLibraryMasterClassModal = ({
  isOpen,
  onClose,
  refetchMasterClasses,
  masterClassToEdit,
}: ManageLibraryMasterClassModalProps) => {
  const [isUploading, setIsUploading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)

  const formik = useFormik({
    initialValues: {
      title: '',
      firstTag: '',
      secondTag: '',
      url: '',
      bannerImage: '',
      datePosted: '',
      order: 0,
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      firstTag: Yup.string().required('First tag is required'),
      url: Yup.string().required('URL is required'),
    }),
    onSubmit: async (values) => {
      try {
        setIsUploading(true)

        let bannerImage = values.bannerImage
        if (imageFile) {
          const uniqueName = `${Date.now()}_${imageFile.name}`
          const imageRef = ref(storage, `libraryImages/${uniqueName}`)
          const snapshot = await uploadBytes(imageRef, imageFile)
          bannerImage = await getDownloadURL(snapshot.ref)
        }
        const masterClassData = {
          ...values,
          bannerImage,
          datePosted: new Date().toISOString(),
          order: masterClassToEdit
            ? values.order
            : (await getDocs(collection(db, 'adminMasterClasses'))).size,
        }

        if (masterClassToEdit && masterClassToEdit.id) {
          await updateDoc(
            doc(db, 'adminMasterClasses', masterClassToEdit.id),
            masterClassData,
          )
        } else {
          await addDoc(collection(db, 'adminMasterClasses'), masterClassData)
        }

        formik.resetForm()
        onClose()
        refetchMasterClasses()
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
        firstTag: masterClassToEdit.firstTag,
        secondTag: masterClassToEdit.secondTag,
        url: masterClassToEdit.url,
        bannerImage: masterClassToEdit.bannerImage,
        datePosted: masterClassToEdit.datePosted || '',
        order: masterClassToEdit.order || 0,
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
          <VStack spacing={4} w="full">
            <FormControl isRequired>
              <FormLabel>Title</FormLabel>
              <Input
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter title"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Video URL</FormLabel>
              <Input
                name="url"
                value={formik.values.url}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter video URL"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Video Image (431 X 253)</FormLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  if (event.currentTarget.files) {
                    setImageFile(event.currentTarget.files[0])
                  }
                }}
                onBlur={formik.handleBlur}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>First Tag</FormLabel>
              <Input
                name="firstTag"
                value={formik.values.firstTag}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter first tag"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Second Tag</FormLabel>
              <Input
                name="secondTag"
                value={formik.values.secondTag}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter second tag"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Date Posted</FormLabel>
              <Input
                name="datePosted"
                value={new Date().toLocaleDateString()}
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

export default ManageLibraryMasterClassModal
