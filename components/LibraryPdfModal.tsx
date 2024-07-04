import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'

const LibraryPdfModal = ({ isOpen, onClose, url, userList, title }: any) => {
  const initialRef = useRef<HTMLInputElement>(null)
  const finalRef = useRef<HTMLInputElement>(null)
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const userExist = localStorage.getItem('userLibraryActivity')
    if (userExist) {
      const parsedUser = JSON.parse(userExist)
      setEmail(parsedUser.email)
      setFullName(parsedUser.fullName)
    }
  }, [])

  const handlePdfDownload = (pdfUrl: string) => {
    const url = pdfUrl // Replace with your PDF file path
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]))
        const a = document.createElement('a')
        a.href = url
        a.download = `${title}.pdf` // Set desired file name here
        document.body.appendChild(a)
        a.click()
        a.remove()
        onClose()
      })
      .catch((error) => console.error('Error downloading PDF:', error))
  }

  const handleValidate = () => {
    const trimmedMail = email.trim().toLowerCase()
    const trimmedName = fullName.trim()

    localStorage.setItem(
      'userLibraryActivity',
      JSON.stringify({ email: trimmedMail, fullName: trimmedName }),
    )

    if (userList.includes(trimmedMail)) {
      return handlePdfDownload(url)
    }

    setIsLoading(true)
    const formData = new FormData()
    //current date and time
    formData.append('fullName', trimmedName)
    formData.append('email', trimmedMail)
    formData.append('downloadDate', new Date().toLocaleString())

    //continue form submission
    fetch(
      'https://script.google.com/macros/s/AKfycbzF4dRKbvpx4fsmDIFr36rW1Jz43shVgAWoGfNYdRlDeeyc0Wu7I_54zZiEz-v-YcYydw/exec',
      {
        method: 'POST',
        body: formData,
        mode: 'no-cors',
      },
    )
      .then((response) => {
        if (response.status === 201 || 200) {
          onClose()
          return handlePdfDownload(url)
        } else {
          alert('Something went wrong, please try again')
        }
      })
      .catch((err) => {
        alert(err.message)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <Modal
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Signup to Download</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>Full Name</FormLabel>
            <Input
              ref={initialRef}
              focusBorderColor="blue"
              onChange={(e) => setFullName(e.target.value)}
              value={fullName}
              placeholder="Full name"
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Email</FormLabel>
            <Input
              focusBorderColor="blue"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="email address"
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            isLoading={isLoading}
            loadingText="Downloading.."
            colorScheme="blue"
            mr={3}
            onClick={handleValidate}
          >
            Download
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default LibraryPdfModal
