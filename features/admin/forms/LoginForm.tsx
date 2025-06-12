import {
  Box,
  Button,
  Heading,
  Input,
  Text,
  VStack,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'

import { Formik } from 'formik'
import * as Yup from 'yup'
import { auth, db, signInWithEmailAndPassword } from '../../../firebaseConfig' // Update the path as needed
import { useRouter } from 'next/router'
import { SuccessModal } from '../../../components'
import { doc, getDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'

const LoginForm = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const toast = useToast()

  return (
    <>
      <SuccessModal
        isOpen={isOpen}
        onClose={onClose}
        title="Login Successful!"
        description="Welcome Back, you'll be redirected any moment now."
        buttonShow={false}
      />
      <Box
        className="enrol-form"
        as={VStack}
        alignItems="center"
        justifyContent="center"
        overflowY="auto"
        px={['1rem', '1rem', '1rem']}
        py="2rem"
        w="full"
      >
        <Heading
          fontSize="6xl"
          maxW="500px"
          textAlign="center"
          color="brand.dark.100"
        >
          Administrative Login
        </Heading>

        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validationSchema={Yup.object({
            password: Yup.string().required('Password is required'),
            email: Yup.string()
              .email('Invalid email address')
              .required('Email is required'),
          })}
          onSubmit={async (values, actions) => {
            setLoading(true)

            try {
              // Sign in with Firebase
              const response = await signInWithEmailAndPassword(
                auth,
                values.email,
                values.password,
              )

              const user = response.user

              const userDocRef = doc(db, 'users', user.uid)
              const userDoc = await getDoc(userDocRef)

              if (!userDoc.exists()) {
                console.error('User data not found.')
                return
              }

              const userData = userDoc.data()

              if (!userData) {
                console.error('User data not found.')
                toast({
                  title: "User does not have access to this page",
                  status: "error",
                  isClosable: true
                })
                return
              }

              const role = userData.role

              if (role === "admin") {
                router.push('/admin/overview')
                actions.resetForm()
                onOpen()
              } else {
                toast({
                  title: "User does not have access to this page",
                  status: "error",
                  isClosable: true
                })
                // alert('Something went wrong, please try again')
              }
            } catch (error) {
              console.error('Error signing in or submitting form:', error)
              toast({
                title: "An error occurred. Please check your credentials and try again.",
                status: "error",
                isClosable: true
              })
              // alert(
              //   'An error occurred. Please check your credentials and try again.',
              // )
            } finally {
              setLoading(false)
            }
          }}
        >
          {(formik) => (
            <VStack
              spacing="1.5rem"
              maxW="500px"
              w="full"
              alignItems="flex-start"
              as="form"
              onSubmit={(event) => {
                event.preventDefault()
                formik.handleSubmit()
              }}
            >
              <Input
                h="3.5rem"
                placeholder="Email*"
                _placeholder={{ color: 'brand.dark.200' }}
                name="email"
                border="1px solid #000"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                borderColor={
                  formik.touched.email && formik.errors.email
                    ? 'red.500'
                    : 'brand.dark.200'
                }
                _focusVisible={{
                  outline: 'none',
                }}
              />
              {formik.touched.email && formik.errors.email ? (
                <Text color="red.500" fontSize="sm">
                  {formik.errors.email}
                </Text>
              ) : null}

              <Input
                h="3.5rem"
                type="password"
                placeholder="Password*"
                _placeholder={{ color: 'brand.dark.200' }}
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                borderColor={
                  formik.touched.password && formik.errors.password
                    ? 'red.500'
                    : 'brand.dark.200'
                }
                _focusVisible={{
                  outline: 'none',
                }}
              />
              {formik.touched.password && formik.errors.password ? (
                <Text color="red.500" fontSize="sm">
                  {formik.errors.password}
                </Text>
              ) : null}

              <Button
                h="3.688rem"
                w="full"
                type="submit"
                isLoading={loading || formik.isSubmitting}
              >
                Login
              </Button>
            </VStack>
          )}
        </Formik>
      </Box>
    </>
  )
}

export default LoginForm
