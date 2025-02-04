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
      expect_title: '',
      expect_desc: '',
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      desc: Yup.string().required('Description information is required'),
      expect_title: Yup.string().required('What to expect title is required'),
      expect_desc: Yup.string().required('What to expect desc is required'),
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
        expect_title: masterClassHeroToEdit.expect_title,
        expect_desc: masterClassHeroToEdit.expect_desc,
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
            <FormControl isRequired>
              <FormLabel>What to expect: Title</FormLabel>
              <Input
                name="expect_title"
                value={formik.values.expect_title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter what to expect title"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>What to expect: Desc</FormLabel>
              <Textarea
                name="expect_desc"
                value={formik.values.expect_desc}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter what to expect description"
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
