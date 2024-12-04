import React, { useState, useEffect } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  HStack,
  IconButton,
} from '@chakra-ui/react'
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore'
import { db } from '../../../firebaseConfig'
import { MdAdd, MdDelete } from 'react-icons/md'

const outlineArray = ["For women who is starting out in UIUX design and want to elevate from beginner to professional level","It includes everything in the Basic and Advanced class curriculum.","Learn how to use PRO design tools like Miro, Notion, Adobe illustrator, Figjam etc","Exposure to design tips and tricks - shortcuts and resources.","Work on complex case studies and projects that will build your problem solving skills.","Direct mentorship with a Senior Product Designer.","Learn how to collaborate with developers and product managers.","Certificate of Completion.","Job search support and guidance + job recommendation and placement when available**","6 weeks internship placement after completing the training."]

interface ClassDetails {
  id?: string
  title: string
  classDur: string
  classTime: string
  installments: string[]
  tuition?: string
  physicalTuition?: string
  courseOutline: string[]
  classType: string
  stateLocation?: string
  enrolRoute?: string
}

interface ManageSponsorshipClassProps {
  isOpen: boolean
  onClose: () => void
  refetchClasses: () => void
  classToEdit?: ClassDetails | null
}

const ManageSponsorshipClass: React.FC<ManageSponsorshipClassProps> = ({
  isOpen,
  onClose,
  refetchClasses,
  classToEdit,
}) => {
  const [title, setTitle] = useState('')
  const [classDur, setClassDur] = useState('')
  const [classTime, setClassTime] = useState('')
  const [installments, setInstallments] = useState<string[]>([''])
  const [tuition, setTuition] = useState('')
  const [physicalTuition, setPhysicalTuition] = useState('')
  const [courseOutline, setCourseOutline] = useState<string[]>(outlineArray)
  const [classType, setClassType] = useState('')
  const [stateLocation, setStateLocation] = useState('')
  const [enrolRoute, setEnrolRoute] = useState('/sponsorship/signup')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (classToEdit) {
      setTitle(classToEdit.title)
      setClassDur(classToEdit.classDur)
      setClassTime(classToEdit.classTime)
      setInstallments(classToEdit.installments)
      setTuition(classToEdit.tuition || '')
      setPhysicalTuition(classToEdit.physicalTuition || '')
      setCourseOutline(classToEdit.courseOutline)
      setClassType(classToEdit.classType)
      setStateLocation(classToEdit.stateLocation || '')
      setEnrolRoute(classToEdit.enrolRoute || '/sponsorship/signup')
    } else {
      resetForm()
    }
  }, [classToEdit])

  const resetForm = () => {
    setTitle('')
    setClassDur('')
    setClassTime('')
    setInstallments([''])
    setTuition('')
    setPhysicalTuition('')
    setCourseOutline(outlineArray)
    setClassType('')
    setStateLocation('')
    setEnrolRoute('/sponsorship/signup')
  }

  const handleSave = async () => {
    const classData: ClassDetails = {
      title,
      classDur,
      classTime,
      installments,
      tuition,
      physicalTuition,
      courseOutline,
      classType,
      stateLocation,
      enrolRoute,
    }

    try {
        setIsLoading(true)
      if (classToEdit?.id) {
        // Update an existing class
        const classRef = doc(db, 'sponsorshipClasses', classToEdit.id)
        await updateDoc(classRef, { ...classData })
        console.log('Class updated successfully')
      } else {
        // Add a new class
        const classCollectionRef = collection(db, 'sponsorshipClasses')
        await addDoc(classCollectionRef, classData)
        console.log('Class added successfully')
      }
      refetchClasses()
      onClose()
    } catch (error) {
      console.error('Error saving class:', error)
    } finally {
        setIsLoading(false)
    }
  }

  const addField = (setter: React.Dispatch<React.SetStateAction<string[]>>) =>
    setter((prev) => [...prev, ''])

  const removeField = (
    index: number,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => setter((prev) => prev.filter((_, i) => i !== index))

  const updateField = (
    index: number,
    value: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => setter((prev) => prev.map((item, i) => (i === index ? value : item)))

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {classToEdit ? 'Edit Sponsorship Class' : 'Add Sponsorship Class'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Title</FormLabel>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter class title"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Class Duration</FormLabel>
              <Input
                value={classDur}
                onChange={(e) => setClassDur(e.target.value)}
                placeholder="Enter class duration"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Class Time</FormLabel>
              <Input
                value={classTime}
                onChange={(e) => setClassTime(e.target.value)}
                placeholder="Enter class time"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Installments</FormLabel>
              {installments.map((installment, index) => (
                <HStack my='10px' key={index} spacing={2}>
                  <Input
                    value={installment}
                    onChange={(e) =>
                      updateField(index, e.target.value, setInstallments)
                    }
                    placeholder="Enter installment details"
                  />
                  <IconButton
                    icon={<MdDelete />}
                    aria-label="Remove installment"
                    onClick={() => removeField(index, setInstallments)}
                  />
                </HStack>
              ))}
              <Button
                mt={2}
                size='sm'
                  fontSize='small'
                w='full'
                leftIcon={<MdAdd />}
                onClick={() => addField(setInstallments)}
              >
                Add Installment
              </Button>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Tuition (₦)</FormLabel>
              <Input
                value={tuition}
                onChange={(e) => setTuition(e.target.value)}
                placeholder="Enter tuition fee"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Discount Tuition (₦)</FormLabel>
              <Input
                value={physicalTuition}
                onChange={(e) => setPhysicalTuition(e.target.value)}
                placeholder="Enter physical tuition fee"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Course Outline</FormLabel>
              {courseOutline.map((outline, index) => (
                <HStack my='10px' key={index} spacing={2}>
                  <Textarea
                    value={outline}
                    onChange={(e) =>
                      updateField(index, e.target.value, setCourseOutline)
                    }
                    placeholder="Enter course outline point"
                  />
                  <IconButton
                    icon={<MdDelete />}
                    aria-label="Remove outline"
                    onClick={() => removeField(index, setCourseOutline)}
                  />
                </HStack>
              ))}
              <Button
                mt={2}
                   size='sm'
                   fontSize='small'
                w='full'
                leftIcon={<MdAdd />}
                onClick={() => addField(setCourseOutline)}
              >
                Add Outline
              </Button>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Class Type</FormLabel>
              <Input
                value={classType}
                onChange={(e) => setClassType(e.target.value)}
                placeholder="Enter class type"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Address</FormLabel>
              <Input
                value={stateLocation}
                onChange={(e) => setStateLocation(e.target.value)}
                placeholder="Enter state location"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Enrollment Route</FormLabel>
              <Input
                value={enrolRoute}
                onChange={(e) => setEnrolRoute(e.target.value)}
                placeholder="Enter enrollment route"
              />
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button isLoading={isLoading} colorScheme="blue" onClick={handleSave}>
            {classToEdit ? 'Update Class' : 'Add Class'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ManageSponsorshipClass
