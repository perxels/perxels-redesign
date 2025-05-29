import {
  Box,
  Button,
  Center,
  HStack,
  Icon,
  Input,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { Formik } from 'formik'
import React, { useState } from 'react'
import * as Yup from 'yup'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from '../../../firebaseConfig'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { FiEye, FiEyeOff } from 'react-icons/fi'

export const LoginForm = () => {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const toast = useToast()

  const router = useRouter()

  return (
    <>
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        validationSchema={Yup.object({
          email: Yup.string()
            .email('Invalid email address')
            .required('Email is required'),
          password: Yup.string().required('Password is required'),
        })}
        onSubmit={async (values, actions) => {
          setLoading(true)

          try {
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
            // const role = userData.role;

            if (userData) {
              router.push('/library')
            } else {
              toast({
                title: 'Unauthorized',
              })
            }
          } catch (error: any) {
            console.error('Error signing up:', error.message)
            toast({
              title: error?.message || '',
            })
          } finally {
            setLoading(false)
          }
        }}
      >
        {(formik) => (
          <VStack
            spacing={'1.5rem'}
            w="full"
            mt={6}
            alignItems="flex-start"
            as="form"
            onSubmit={(event) => {
              event.preventDefault()
              formik.handleSubmit()
            }}
          >
            <Box w="full">
              <Text fontSize="small" color="brand.dark.50">
                EMAIL ADDRESS
              </Text>
              <Input
                h={['3rem', '3.5rem']}
                placeholder="EMAIL ADDRESS"
                _placeholder={{ color: 'brand.dark.50' }}
                name="email"
                border="1px solid #000"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                borderColor={
                  formik.touched.email && formik.errors.email
                    ? 'red.500'
                    : 'brand.yellow.500'
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
            </Box>

            <HStack w="full" flexDir={['column', 'row']} gap={4}>
              <Box w="full">
                <Text fontSize="small" color="brand.dark.50">
                  PASSWORD
                </Text>
                <Box w="full" pos="relative">
                  <Input
                    h={['3rem', '3.5rem']}
                    placeholder="PASSWORD"
                    _placeholder={{ color: 'brand.dark.50' }}
                    name="password"
                    border="1px solid #000"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    type={showPassword ? 'text' : 'password'}
                    borderColor={
                      formik.touched.password && formik.errors.password
                        ? 'red.500'
                        : 'brand.yellow.500'
                    }
                    _focusVisible={{
                      outline: 'none',
                    }}
                  />

                  <Icon
                    cursor="pointer"
                    pos="absolute"
                    top="50%"
                    right={6}
                    transform="translateY(-50%)"
                    as={!showPassword ? FiEye : FiEyeOff}
                    onClick={() => setShowPassword((prev) => !prev)}
                  />
                </Box>
                {formik.touched.password && formik.errors.password ? (
                  <Text color="red.500" fontSize="sm">
                    {formik.errors.password}
                  </Text>
                ) : null}
              </Box>
            </HStack>

            <HStack justifyContent="flex-end" w="full" fontSize="small">
              <Link href="/library/forgot-password">Forgot Password?</Link>
            </HStack>

            <Button
              h="3.688rem"
              w="full"
              type="submit"
              isLoading={loading || formik.isSubmitting}
              bg="brand.yellow.500"
            >
              Login
            </Button>

            <Center gap={1}>
              <Text fontSize="">Not having an account? </Text>
              <Link href="/library/sign-up">
                <Text fontWeight={600}>Create an account</Text>
              </Link>
            </Center>
          </VStack>
        )}
      </Formik>
    </>
  )
}
