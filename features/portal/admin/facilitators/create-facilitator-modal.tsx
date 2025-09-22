import React, { useState } from 'react'
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
  VStack,
  useToast,
  Alert,
  AlertIcon,
  Text,
  InputGroup,
  InputRightElement,
  IconButton,
  Box,
  AlertDescription,
} from '@chakra-ui/react'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { portalAuth, portalDb } from '../../../../portalFirebaseConfig'
import { FiEye, FiEyeOff } from 'react-icons/fi'

interface CreateFacilitatorModalProps {
  isOpen: boolean
  onClose: () => void
  onFacilitatorCreated?: () => void
}

export const CreateFacilitatorModal: React.FC<CreateFacilitatorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const toast = useToast()

  // const loadFacilitators = async () => {
  //     try {
  //       setLoading(true)
  //       const facilitatorsQuery = query (
  //         collection(portalDb, 'users'),
  //         where('role', '==', 'facilitator'),
  //       )
  //       const snapshot = await getDocs(facilitatorsQuery)

  //       const facilitatorsData: FacilitatorData[] = []
  //       snapshot.forEach((doc) => {
  //         const data = doc.data()
  //         facilitatorsData.push({
  //           id: doc.id,
  //           uid: data.uid,
  //           email: data.email,
  //           fullName: data.fullName,
  //           phone: data.phone || 'Not provided',
  //           role: data.role,
  //           emailVerified: data.emailVerified || false,
  //           registrationComplete: data.registrationComplete || false,
  //           createdAt: data.createdAt?.toDate() || new Date(),
  //           createdBy: data.createdBy || 'Admin',
  //           profession: data.profession || 'Not provided',
  //           termsAgreed: data.termsAgreed || false,
  //           termsAgreedAt: data.termsAgreedAt?.toDate() || null,
  //           gender: data.gender,
  //           pictureUrl: data.profileImg || '',
  //           address: data.address || 'Not provided',
  //           assigned: data.assigned || [],
  //           isActive: data.isActive !== false,
  //         })
  //       })

  //       setFacilitators(facilitatorsData)
  //     } catch (err) {
  //       console.error('Error loading facilitators:', err)
  //       setError('Failed to load facilitators')
  //     } finally {
  //       setLoading(false)
  //     }
  //   }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // 1. Client-side validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    // 2. Get the current admin user INSIDE the handler for a fresh reference
    const currentAdminUser = portalAuth.currentUser
    if (!currentAdminUser) {
      setError('You must be logged in as an admin to create a facilitator.')
      return
    }

    setLoading(true)

    try {
      // 3. Create Firebase auth user
      const userCredential = await createUserWithEmailAndPassword(
        portalAuth,
        formData.email.toLowerCase().trim(),
        formData.password,
      )
      const newFacilitatorUser = userCredential.user

      // 4. Update the auth profile with the name
      await updateProfile(newFacilitatorUser, {
        displayName: formData.fullName.trim(),
      })

      // 5. Prepare the data for Firestore
      const facilitatorData = {
        uid: newFacilitatorUser.uid,
        email: formData.email.toLowerCase().trim(),
        fullName: formData.fullName.trim(),
        role: 'facilitator',
        emailVerified: false,
        registrationComplete: true,
        createdAt: serverTimestamp(),
        createdBy: currentAdminUser.uid,
        termsAgreed: true,
        termsAgreedAt: serverTimestamp(),
        isActive: true,
      }

      // 6. Create the document in the 'users' collection
      await setDoc(
        doc(portalDb, 'users', newFacilitatorUser.uid),
        facilitatorData,
      )

      // 7. Success feedback
      toast({
        title: 'Facilitator created successfully',
        description: `${formData.fullName} has been added. They must verify their email to log in.`,
        status: 'success',
        duration: 7000, // Longer duration to read the message
        isClosable: true,
        position: 'top',
      })

      // onFacilitatorCreated() // Refresh the list in the parent component
      onClose() // Close the modal
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
      })
    } catch (error: any) {
      console.error('Error creating facilitator:', error)
      // Handle specific Firebase Auth errors
      let errorMessage = 'An unexpected error occurred. Please try again.'
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email address is already registered.'
          break
        case 'auth/invalid-email':
          errorMessage = 'The email address is not valid.'
          break
        case 'auth/weak-password':
          errorMessage = 'The password is too weak.'
          break
        case 'auth/operation-not-allowed':
          errorMessage = 'Email/password accounts are not enabled.'
          break
        default:
          errorMessage = error.message || errorMessage
      }
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      closeOnOverlayClick={!loading}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add New Facilitator</ModalHeader>
        <ModalCloseButton isDisabled={loading} />

        <form onSubmit={handleSubmit}>
          <ModalBody>
            <VStack spacing={4}>
              {error && (
                <Alert status="error" borderRadius="md" alignItems="start">
                  <AlertIcon />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <FormControl isRequired>
                <FormLabel>Full Name</FormLabel>
                <Input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter facilitator's full name"
                  isDisabled={loading}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Email Address</FormLabel>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  isDisabled={loading}
                  autoComplete="new-email"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    w="full"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter password (min 6 characters)"
                    isDisabled={loading}
                    autoComplete="new-password"
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={
                        showPassword ? 'Hide password' : 'Show password'
                      }
                      icon={showPassword ? <FiEyeOff /> : <FiEye />}
                      h="1.75rem"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      variant="ghost"
                      color="gray.500"
                      bg="transparent"
                      isDisabled={loading}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                  <Input
                    w="full"
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm password"
                    isDisabled={loading}
                    autoComplete="new-password"
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={
                        showConfirmPassword ? 'Hide password' : 'Show password'
                      }
                      icon={showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                      h="1.75rem"
                      size="sm"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      variant="ghost"
                      color="gray.500"
                      bg="transparent"
                      isDisabled={loading}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              {/* Helpful info text */}
              <Box w="full">
                <Text fontSize="sm" color="gray.600">
                  An email verification link will be sent to the facilitator.
                  They must verify their email before their first login.
                </Text>
              </Box>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="outline"
              mr={3}
              onClick={onClose}
              isDisabled={loading}
            >
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              type="submit"
              isLoading={loading}
              loadingText="Creating..."
              isDisabled={
                !formData.fullName ||
                !formData.email ||
                !formData.password ||
                !formData.confirmPassword
              }
            >
              Create Facilitator
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
