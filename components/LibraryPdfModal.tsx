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
  Text,
} from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
// Removed old email imports - now using API routes
import axios from 'axios'

const LibraryPdfModal = ({
  isOpen,
  onClose,
  url,
  userList,
  title,
  dataChanged,
  setDataChanged,
}: any) => {
  const initialRef = useRef<HTMLInputElement>(null)
  const finalRef = useRef<HTMLInputElement>(null)
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [whatYouDo, setWhatYouDo] = useState('')
  const [isOtp, setIsOtp] = useState(false)
  const [enteredOtp, setEnteredOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const trimmedMail = email.trim().toLowerCase()
  const trimmedName = fullName.trim()

  // useEffect(() => {
  //   sendMail()
  // }, [])

  //   Test key
  // reni_test_UN1FRvrKkQEYKUVYDJBI0_UTrIniiFC9u_dev

  // Live Key
  // reni_prod_UN1FRvrKkQEYKUVYDJBI0_UTrIniiFC9u

  useEffect(() => {
    const userExist = localStorage.getItem('userLibraryActivity')
    if (userExist) {
      const parsedUser = JSON.parse(userExist)
      setEmail(parsedUser.email)
      setFullName(parsedUser.fullName)
      setWhatYouDo(parsedUser.whatYouDo)
    }
  }, [isOpen])

  const handlePdfDownload = (pdfUrl: string) => {
    setIsLoading(true)
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
        setIsLoading(false)
        const userExist = localStorage.getItem('userLibraryActivity')
        if (userExist) {
          const parsedUser = JSON.parse(userExist)
          if (parsedUser.email != trimmedMail) {
            setDataChanged(dataChanged + 1)
          }
        } else {
          setDataChanged(dataChanged + 1)
        }
        localStorage.setItem(
          'userLibraryActivity',
          JSON.stringify({
            email: trimmedMail,
            fullName: trimmedName,
            whatYouDo,
          }),
        )
      })
      .catch((error) => {
        setIsLoading(false)
        console.error('Error downloading PDF:', error)
      })
  }

  const handleValidate = async () => {
    if (!email || !fullName || !whatYouDo) {
      return alert('Kindly Fill All Inputs!')
    }

    if (userList.includes(trimmedMail)) {
      return handlePdfDownload(url)
    } else {
      setIsOtp(true)
      setIsLoading(true)
      setEnteredOtp('')
      
      // Use API route to send OTP (API generates and stores the OTP)
      try {
        const response = await fetch('/api/send-otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: trimmedMail }),
        })
        
        const result = await response.json()
        if (!result.success) {
          throw new Error(result.error || 'Failed to send OTP')
        }
      } catch (error) {
        console.error('Failed to send OTP:', error)
        alert('Failed to send verification code. Please try again.')
        setIsOtp(false)
      }
      
      setIsLoading(false)
    }
  }

  const recordUser = () => {
    setIsOtp(false)
    setIsLoading(true)
    const formData = new FormData()
    //current date and time
    formData.append('fullName', trimmedName)
    formData.append('email', trimmedMail)
    formData.append('what_you_do', whatYouDo.trim())
    formData.append('downloadDate', new Date().toLocaleString())
    formData.append('downloaded_pdf', title)

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

  const verifyOtp = async () => {
    if (!enteredOtp.trim()) {
      alert('Please enter the OTP')
      return
    }

    setIsLoading(true)
    
    try {
      // Use API route to verify OTP
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: trimmedMail, 
          otp: enteredOtp.trim() 
        }),
      })
      
      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error || 'Invalid OTP')
      }
      
      // OTP verified successfully, proceed with user registration
      recordUser()
    } catch (error) {
      console.error('OTP verification failed:', error)
      alert(error instanceof Error ? error.message : 'Invalid OTP')
    } finally {
      setIsLoading(false)
    }
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
          {isOtp ? (
            <>
              <Text mb={8}>An OTP has been sent to {email}</Text>
              <FormControl>
                <FormLabel>Enter OTP </FormLabel>
                <Input
                  ref={initialRef}
                  focusBorderColor="blue"
                  onChange={(e) => setEnteredOtp(e.target.value)}
                  value={enteredOtp}
                  placeholder="enter otp"
                />
              </FormControl>
            </>
          ) : (
            <>
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
              <FormControl mt={4}>
                <FormLabel>What do you do?</FormLabel>
                <Input
                  focusBorderColor="blue"
                  onChange={(e) => setWhatYouDo(e.target.value)}
                  value={whatYouDo}
                  placeholder="e.g: Brand Designer"
                />
              </FormControl>
            </>
          )}
        </ModalBody>

        <ModalFooter>
          <Button
            isLoading={isLoading}
            loadingText={isOtp ? 'Sending..' : 'Downloading..'}
            colorScheme="blue"
            mr={3}
            onClick={isOtp ? verifyOtp : handleValidate}
          >
            {isOtp ? 'Verify' : 'Next'}
          </Button>
          <Button
            variant="outline"
            _hover={{ backgroundColor: 'white', color: '#34296B' }}
            onClick={isOtp ? () => setIsOtp(false) : onClose}
          >
            {isOtp ? 'Back' : 'Cancel'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default LibraryPdfModal
