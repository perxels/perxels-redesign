import { useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'
import { db, storage } from '../../../firebaseConfig'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore'
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Stack,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { Advertisement } from '../../../utils/types'

interface ManageAdvertisementModalProps {
  isOpen: boolean
  onClose: () => void
  refetchAdvertisements: () => void
  advertisementToEdit?: Advertisement | null
}

const ManageAdvertisement: React.FC<ManageAdvertisementModalProps> = ({
  isOpen,
  onClose,
  refetchAdvertisements,
  advertisementToEdit,
}) => {
  const [isUploading, setIsUploading] = useState(false)

  const toast = useToast()

  const [imageFile, setImageFile] = useState<File | null>(null)

  const formik = useFormik({
    initialValues: {
      imageUrl: '',
      link: '',
      name: '',
      openAnotherTab: 'no',
    },
    validationSchema: Yup.object({
      imageUrl: Yup.string().required('Image Url or upload is required'),
      link: Yup.string().required('Advertisement link is required'),
      name: Yup.string().required('Advertisement name is required'),
      openAnotherTab: Yup.string(),
    }),
    onSubmit: async (values) => {
      try {
        setIsUploading(true)

        let imageUrl = values.imageUrl ?? ''

        if (imageFile) {
          const uniqueName = `${Date.now()}_${imageFile.name}`
          const imageRef = ref(storage, `advertisementImages/${uniqueName}`)
          const snapshot = await uploadBytes(imageRef, imageFile)
          imageUrl = await getDownloadURL(snapshot.ref)
        }

        const advertisementData = {
          ...values,
          imageUrl,
          openAnotherTab: values.openAnotherTab === 'yes' ? true : false,
          createdAt: new Date().toISOString(),
        }

        if (advertisementToEdit) {
          const advertisementRef = doc(
            db,
            'advertisements',
            advertisementToEdit.id,
          )
          await updateDoc(advertisementRef, advertisementData)
        } else {
          await addDoc(collection(db, 'advertisements'), advertisementData)
        }

        formik.resetForm()
        onClose()
        refetchAdvertisements()
      } catch (error) {
        toast({
          title: 'Error: Something went wrong',
          status: 'error',
        })
      } finally {
        setIsUploading(false)
      }
    },
  })

  useEffect(() => {
    if (advertisementToEdit) {
      formik.setValues({
        name: advertisementToEdit.name ?? '',
        link: advertisementToEdit.link ?? '',
        imageUrl: advertisementToEdit.imageUrl ?? '',
        openAnotherTab: advertisementToEdit.openAnotherTab ? 'yes' : 'no',
      })
    }
  }, [advertisementToEdit])

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {advertisementToEdit ? 'Edit Advertisement' : 'Create Advertisement'}
        </ModalHeader>
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Title</FormLabel>
              <Input
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter advertisement title"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Advertisement Imaage (880 X 345)</FormLabel>
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

            <FormControl isRequired>
              <FormLabel>Link</FormLabel>
              <Input
                name="link"
                value={formik.values.link}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter advertisement link"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Should open in another browser tab?</FormLabel>
              <RadioGroup
                name="openAnotherTab"
                onChange={(value) =>
                  formik.setFieldValue('openAnotherTab', value)
                }
                value={formik.values.openAnotherTab}
              >
                <Stack direction="row">
                  <Radio value="yes">Yes</Radio>
                  <Radio value="no">No</Radio>
                </Stack>
              </RadioGroup>
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

export default ManageAdvertisement
