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
  HStack,
  IconButton,
} from '@chakra-ui/react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore'
import { db } from '../../../firebaseConfig'
import { MdDelete } from 'react-icons/md'
import { IoAdd } from 'react-icons/io5'
import { ApplicationCriteria } from '../../../utils/types'


interface SponsorshipHero {
  id?: string
  eventTitle: string
  mainTitle: string
  paragraph: string
  applicationCriteria: ApplicationCriteria[]
  applicationOpeningTime: string
  applicationOpeningDate: string
  applicationClosingTime: string
  applicationClosingDate: string
}

interface ManageSponsorshipHeroProps {
  isOpen: boolean
  onClose: () => void
  refetchHero: () => void
  sponsorshipHeroToEdit?: SponsorshipHero | null
}

const ManageSponsorshipHero: React.FC<ManageSponsorshipHeroProps> = ({
  isOpen,
  onClose,
  refetchHero,
  sponsorshipHeroToEdit,
}) => {
  const [isUploading, setIsUploading] = useState(false)

  const formik = useFormik<SponsorshipHero>({
    initialValues: {
      eventTitle: '',
      mainTitle: '',
      paragraph: '',
      applicationCriteria: [
        { title: '', paragraph: '' },
      ],
      applicationOpeningTime: '',
      applicationOpeningDate: '',
      applicationClosingTime: '',
      applicationClosingDate: '',
    },
    validationSchema: Yup.object({
      eventTitle: Yup.string().required('Event title is required'),
      mainTitle: Yup.string().required('Main title is required'),
      paragraph: Yup.string().required('Paragraph is required'),
      applicationCriteria: Yup.array().of(
        Yup.object({
          title: Yup.string().required('Title is required'),
          paragraph: Yup.string().required('Description is required'),
        }),
      ),
      applicationOpeningTime: Yup.string().required('Opening time is required'),
      applicationOpeningDate: Yup.string().required('Opening date is required'),
      applicationClosingTime: Yup.string().required('Closing time is required'),
      applicationClosingDate: Yup.string().required('Closing date is required'),
    }),
    onSubmit: async (values) => {
      try {
        setIsUploading(true)
        if (sponsorshipHeroToEdit?.id) {
          const heroRef = doc(db, 'sponsorshipHero', sponsorshipHeroToEdit.id)
          await updateDoc(heroRef, {
            eventTitle: values.eventTitle,
            mainTitle: values.mainTitle,
            paragraph: values.paragraph,
            applicationOpeningTime: values.applicationOpeningTime,
            applicationOpeningDate: values.applicationOpeningDate,
            applicationClosingTime: values.applicationClosingTime,
            applicationClosingDate: values.applicationClosingDate,
            applicationCriteria: values.applicationCriteria, // If you intend to overwrite the whole array
          });
          
        } else {
          await addDoc(collection(db, 'sponsorshipHero'), values)
        }
        formik.resetForm()
        onClose()
        refetchHero()
      } catch (error) {
        console.error('Error saving sponsorship hero:', error)
      } finally {
        setIsUploading(false)
      }
    },
  })

  useEffect(() => {
    if (sponsorshipHeroToEdit) {
      formik.setValues(sponsorshipHeroToEdit)
    } else {
      formik.resetForm()
    }
  }, [sponsorshipHeroToEdit])

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{sponsorshipHeroToEdit ? 'Edit' : 'Add'} Sponsorship Hero</ModalHeader>
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Event Title</FormLabel>
              <Input
                name="eventTitle"
                value={formik.values.eventTitle}
                onChange={formik.handleChange}
                placeholder="Enter event title"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Main Title</FormLabel>
              <Input
                name="mainTitle"
                value={formik.values.mainTitle}
                onChange={formik.handleChange}
                placeholder="Enter main title"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Paragraph</FormLabel>
              <Textarea
                name="paragraph"
                value={formik.values.paragraph}
                onChange={formik.handleChange}
                placeholder="Enter paragraph"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Application Criteria</FormLabel>
              {formik.values.applicationCriteria.map((criteria, index) => (
                <HStack key={index} w="full" my={4} spacing={4}>
                  <Input
                    name={`applicationCriteria[${index}].title`}
                    placeholder="Criteria title"
                    value={criteria.title}
                    onChange={formik.handleChange}
                  />
                  <Input
                    name={`applicationCriteria[${index}].paragraph`}
                    placeholder="Criteria description"
                    value={criteria.paragraph}
                    onChange={formik.handleChange}
                  />
                  <IconButton
                    aria-label="Remove criteria"
                    icon={<MdDelete />}
                    onClick={() =>
                      formik.setFieldValue(
                        'applicationCriteria',
                        formik.values.applicationCriteria.filter((_, i) => i !== index),
                      )
                    }
                  />
                </HStack>
              ))}
              <Button
                leftIcon={<IoAdd />}
                mt={2}
                size="sm"
                w='full'
                onClick={() =>
                  formik.setFieldValue('applicationCriteria', [
                    ...formik.values.applicationCriteria,
                    { title: '', paragraph: '' },
                  ])
                }
              >
                Add Criteria
              </Button>
            </FormControl>
            <HStack w='full' spacing={4}>
              <FormControl isRequired>
                <FormLabel>Opening Time</FormLabel>
                <Input
                  type="time"
                  name="applicationOpeningTime"
                  value={formik.values.applicationOpeningTime}
                  onChange={formik.handleChange}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Opening Date</FormLabel>
                <Input
                  type="date"
                  name="applicationOpeningDate"
                  value={formik.values.applicationOpeningDate}
                  onChange={formik.handleChange}
                />
              </FormControl>
            </HStack>
            <HStack w='full' spacing={4}>
              <FormControl isRequired>
                <FormLabel>Closing Time</FormLabel>
                <Input
                  type="time"
                  name="applicationClosingTime"
                  value={formik.values.applicationClosingTime}
                  onChange={formik.handleChange}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Closing Date</FormLabel>
                <Input
                  type="date"
                  name="applicationClosingDate"
                  value={formik.values.applicationClosingDate}
                  onChange={formik.handleChange}
                />
              </FormControl>
            </HStack>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={onClose} mr={3}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            isLoading={isUploading}
            onClick={formik.submitForm}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ManageSponsorshipHero
