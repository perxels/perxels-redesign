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
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore'
import { db } from '../../../firebaseConfig' // Assuming you've set up Firebase
import { MasterClassHero } from '../../../utils/types'



interface ManageMasterClassHeroModalProps {
  isOpen: boolean
  onClose: () => void
  refetchHero: () => void
  masterClassHeroToEdit?: MasterClassHero | null // For editing
}

const ManageMasterClassHero: React.FC<ManageMasterClassHeroModalProps> = ({
  isOpen,
  onClose,
  refetchHero,
  masterClassHeroToEdit,
}) => {
  const [isUploading, setIsUploading] = useState(false)

  const formik = useFormik({
    initialValues: {
      title: '',
      desc: '',
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      desc: Yup.string().required('Description information is required'),
    }),
    onSubmit: async (values) => {
      try {
        setIsUploading(true)
        const masterClassHeroData = {
          ...values,
        }

        if (masterClassHeroToEdit) {
          const heroRef = doc(
            db,
            'masterClassesHero',
            masterClassHeroToEdit.id!,
          )
          await updateDoc(heroRef, masterClassHeroData)
        } else {
          await addDoc(collection(db, 'masterClassesHero'), {
            ...masterClassHeroData,
          })
        }
        formik.resetForm()
        onClose()
        return refetchHero()
      } catch (error) {
        console.error('Error saving master class hero:', error)
      } finally {
        setIsUploading(false)
      }
    },
  })

  useEffect(() => {
    if (masterClassHeroToEdit) {
      formik.setValues({
        title: masterClassHeroToEdit.title,
        desc: masterClassHeroToEdit.desc,
      })
    } else {
      formik.resetForm()
    }
  }, [masterClassHeroToEdit])

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Hero Section</ModalHeader>
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
              <FormLabel>Description</FormLabel>
              <Textarea
                name="desc"
                value={formik.values.desc}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Description"
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

export default ManageMasterClassHero
