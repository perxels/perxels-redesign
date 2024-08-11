import React, { useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  FormControl,
  FormLabel,
  Textarea,
  useToast,
} from '@chakra-ui/react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore'
import { db, storage } from '../../firebaseConfig'

interface Banner {
  id?: string
  mainTitle: string
  subTitle: string
  location: string
  bannerImage?: string
  description: string
  content1: string
  content2: string
  content3: string
  content4: string
  speakerName: string
  speakerRole: string
  endDate: string
  startTime: string
  endTime: string
}

interface CreateBannerModalProps {
  isOpen: boolean
  onClose: () => void
  banner?: Banner | null
  fetchBanners: () => void
}

const CreateBannerModal = ({
  isOpen,
  onClose,
  banner,
  fetchBanners,
}: CreateBannerModalProps) => {
  const toast = useToast()
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{banner ? 'Edit Banner' : 'Create Banner'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            initialValues={{
              mainTitle: banner?.mainTitle || '',
              subTitle: banner?.subTitle || '',
              location: banner?.location || '',
              bannerImage: banner?.bannerImage || '',
              description: banner?.description || '',
              content1: banner?.content1 || '',
              content2: banner?.content2 || '',
              content3: banner?.content3 || '',
              content4: banner?.content4 || '',
              speakerName: banner?.speakerName || '',
              speakerRole: banner?.speakerRole || '',
              endDate: banner?.endDate || '',
              startTime: banner?.startTime || '',
              endTime: banner?.endTime || '',
            }}
            validationSchema={Yup.object({
              mainTitle: Yup.string().required('Required'),
              subTitle: Yup.string().required('Required'),
              location: Yup.string().required('Required'),
              description: Yup.string().required('Required'),
              content1: Yup.string().required('Required'),
              content2: Yup.string().required('Required'),
              content3: Yup.string().required('Required'),
              content4: Yup.string().required('Required'),
              speakerName: Yup.string().required('Required'),
              speakerRole: Yup.string().required('Required'),
              endDate: Yup.string().required('Required'),
              startTime: Yup.string().required('Required'),
              endTime: Yup.string().required('Required'),
            })}
            onSubmit={async (values, actions) => {
              setLoading(true)
              try {
                // Check if there is an existing active banner
                const now = new Date()
                const endDateTime = `${values.endDate} ${values.endTime}`
                const endDate = new Date(endDateTime)
                if (endDate < now) {
                  toast({
                    title: 'Invalid end date/time',
                    description: 'The end date/time cannot be in the past.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                  })
                  return
                }

                // Handle image upload
                let bannerImageUrl = ''
                if (image) {
                  const imageRef = ref(storage, `banners/${image.name}`)
                  await uploadBytes(imageRef, image)
                  bannerImageUrl = await getDownloadURL(imageRef)
                }

                // If editing an existing banner
                if (banner) {
                  const bannerRef = doc(db, 'banners', banner.id!)
                  await updateDoc(bannerRef, {
                    ...values,
                    bannerImage: bannerImageUrl || banner.bannerImage,
                  })
                } else {
                  // Handle single active banner logic
                  const bannersQuery = query(
                    collection(db, 'banners'),
                    where('endDate', '>=', now.toISOString().slice(0, 10)),
                    orderBy('endDate', 'asc'),
                    limit(1),
                  )
                  const bannersSnapshot = await getDocs(bannersQuery)
                  const activeBanner =
                    bannersSnapshot.docs.length > 0
                      ? (bannersSnapshot.docs[0].data() as Banner)
                      : null

                  // Only create a new banner if no active banner exists
                  if (!activeBanner) {
                    await addDoc(collection(db, 'banners'), {
                      ...values,
                      bannerImage: bannerImageUrl,
                    })
                  } else {
                    toast({
                      title: 'Banner already exists',
                      description:
                        'An active banner already exists. Please adjust the end date/time.',
                      status: 'error',
                      duration: 5000,
                      isClosable: true,
                    })
                    return onClose()
                  }
                }

                toast({
                  title: 'Success',
                  description: banner
                    ? 'Banner updated successfully.'
                    : 'Banner created successfully.',
                  status: 'success',
                  duration: 5000,
                  isClosable: true,
                })
                onClose()
                fetchBanners()
              } catch (error) {
                console.error('Error creating/updating banner:', error)
                toast({
                  title: 'Error',
                  description:
                    'An error occurred while creating/updating the banner.',
                  status: 'error',
                  duration: 5000,
                  isClosable: true,
                })
              } finally {
                setLoading(false)
              }
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
              isSubmitting,
            }) => (
              <form onSubmit={handleSubmit}>
                <FormControl
                  mb={4}
                  isInvalid={!!errors.mainTitle && touched.mainTitle}
                >
                  <FormLabel>Main Title</FormLabel>
                  <Input
                    name="mainTitle"
                    value={values.mainTitle}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    borderColor={
                      touched.mainTitle && errors.mainTitle
                        ? 'red.500'
                        : 'brand.dark.200'
                    }
                  />
                </FormControl>

                <FormControl
                  mb={4}
                  isInvalid={!!errors.subTitle && touched.subTitle}
                >
                  <FormLabel>Sub Title</FormLabel>
                  <Input
                    name="subTitle"
                    value={values.subTitle}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    borderColor={
                      touched.subTitle && errors.subTitle
                        ? 'red.500'
                        : 'brand.dark.200'
                    }
                  />
                </FormControl>

                <FormControl
                  mb={4}
                  isInvalid={!!errors.location && touched.location}
                >
                  <FormLabel>Location</FormLabel>
                  <Input
                    name="location"
                    value={values.location}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    borderColor={
                      touched.location && errors.location
                        ? 'red.500'
                        : 'brand.dark.200'
                    }
                  />
                </FormControl>

                <FormControl mb={4}>
                  <FormLabel>Banner Image</FormLabel>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      if (event.currentTarget.files) {
                        setImage(event.currentTarget.files[0])
                      }
                    }}
                  />
                </FormControl>

                <FormControl
                  mb={4}
                  isInvalid={!!errors.description && touched.description}
                >
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    borderColor={
                      touched.description && errors.description
                        ? 'red.500'
                        : 'brand.dark.200'
                    }
                  />
                </FormControl>

                <FormControl
                  mb={4}
                  isInvalid={!!errors.content1 && touched.content1}
                >
                  <FormLabel>Content 1</FormLabel>
                  <Textarea
                    name="content1"
                    value={values.content1}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    borderColor={
                      touched.content1 && errors.content1
                        ? 'red.500'
                        : 'brand.dark.200'
                    }
                  />
                </FormControl>

                <FormControl
                  mb={4}
                  isInvalid={!!errors.content2 && touched.content2}
                >
                  <FormLabel>Content 2</FormLabel>
                  <Textarea
                    name="content2"
                    value={values.content2}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    borderColor={
                      touched.content2 && errors.content2
                        ? 'red.500'
                        : 'brand.dark.200'
                    }
                  />
                </FormControl>

                <FormControl
                  mb={4}
                  isInvalid={!!errors.content3 && touched.content3}
                >
                  <FormLabel>Content 3</FormLabel>
                  <Textarea
                    name="content3"
                    value={values.content3}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    borderColor={
                      touched.content3 && errors.content3
                        ? 'red.500'
                        : 'brand.dark.200'
                    }
                  />
                </FormControl>

                <FormControl
                  mb={4}
                  isInvalid={!!errors.content4 && touched.content4}
                >
                  <FormLabel>Content 4</FormLabel>
                  <Textarea
                    name="content4"
                    value={values.content4}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    borderColor={
                      touched.content4 && errors.content4
                        ? 'red.500'
                        : 'brand.dark.200'
                    }
                  />
                </FormControl>

                <FormControl
                  mb={4}
                  isInvalid={!!errors.speakerName && touched.speakerName}
                >
                  <FormLabel>Speaker Name</FormLabel>
                  <Input
                    name="speakerName"
                    value={values.speakerName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    borderColor={
                      touched.speakerName && errors.speakerName
                        ? 'red.500'
                        : 'brand.dark.200'
                    }
                  />
                </FormControl>

                <FormControl
                  mb={4}
                  isInvalid={!!errors.speakerRole && touched.speakerRole}
                >
                  <FormLabel>Speaker Role</FormLabel>
                  <Input
                    name="speakerRole"
                    value={values.speakerRole}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    borderColor={
                      touched.speakerRole && errors.speakerRole
                        ? 'red.500'
                        : 'brand.dark.200'
                    }
                  />
                </FormControl>

                <FormControl
                  mb={4}
                  isInvalid={!!errors.endDate && touched.endDate}
                >
                  <FormLabel>End Date</FormLabel>
                  <Input
                    type="date"
                    name="endDate"
                    value={values.endDate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    borderColor={
                      touched.endDate && errors.endDate
                        ? 'red.500'
                        : 'brand.dark.200'
                    }
                  />
                </FormControl>

                <FormControl
                  mb={4}
                  isInvalid={!!errors.startTime && touched.startTime}
                >
                  <FormLabel>Start Time</FormLabel>
                  <Input
                    type="time"
                    name="startTime"
                    value={values.startTime}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    borderColor={
                      touched.startTime && errors.startTime
                        ? 'red.500'
                        : 'brand.dark.200'
                    }
                  />
                </FormControl>

                <FormControl
                  mb={4}
                  isInvalid={!!errors.endTime && touched.endTime}
                >
                  <FormLabel>End Time</FormLabel>
                  <Input
                    type="time"
                    name="endTime"
                    value={values.endTime}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    borderColor={
                      touched.endTime && errors.endTime
                        ? 'red.500'
                        : 'brand.dark.200'
                    }
                  />
                </FormControl>

                <ModalFooter>
                  <Button
                    colorScheme="blue"
                    mr={3}
                    type="submit"
                    isLoading={loading || isSubmitting}
                  >
                    {banner ? 'Update' : 'Create'}
                  </Button>
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                </ModalFooter>
              </form>
            )}
          </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default CreateBannerModal
