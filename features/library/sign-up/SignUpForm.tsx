import {
  Box,
  Button,
  Center,
  HStack,
  Icon,
  Input,
  Select,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { Formik } from 'formik'
import React, { useState } from 'react'
import * as Yup from 'yup'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '../../../firebaseConfig'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export const SignUpForm = () => {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const toast = useToast()

  return (
    <>
      <Formik
        initialValues={{
          email: '',
          password: '',
          first_name: '',
          last_name: '',
          phone: '',
          confirm_password: '',
          level_of_design: '',
        }}
        validationSchema={Yup.object({
          email: Yup.string()
            .email('Invalid email address')
            .required('Email is required'),
          password: Yup.string().required('Password is required'),
          confirm_password: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Please confirm your password'),
          first_name: Yup.string()
            .min(2, 'First name must be at least 2 characters')
            .max(50, 'First name must be at most 50 characters')
            .required('First name is required'),
          last_name: Yup.string()
            .min(2, 'Last name must be at least 2 characters')
            .max(50, 'Last name must be at most 50 characters')
            .required('Last name is required'),
          phone: Yup.string()
            .matches(/^(0\d{10}|\+?\d{10,14})$/, 'Phone number is not valid')
            .required('Phone number is required'),

          level_of_design: Yup.string()
            .oneOf(
              ['Beginner', 'Intermediate', 'Advanced'],
              'Invalid design level',
            )
            .required('Design level is required'),
        })}
        onSubmit={async (values, actions) => {
          setLoading(true)

          try {
            // Create user with email and password
            // This automatically signs in the user as well
            const response = await createUserWithEmailAndPassword(
              auth,
              values.email,
              values.password,
            )

            const user = response.user

            // Save additional user data to Firestore
            await setDoc(doc(db, 'users', user.uid), {
              email: user.email,
              role: 'user',
              firstName: values.first_name,
              lastName: values.last_name,
              phone: values.phone,
              levelOfDesign: values.level_of_design,
              createdAt: new Date(),
            })
            
            // Show success message
            toast({
              title: 'Account created successfully!',
              description: 'Welcome to Perxels Library',
              status: 'success',
              duration: 5000,
              isClosable: true,
            })
            
            // Redirect to library page
            router.push('/library')
          } catch (error: any) {
            console.error('Error signing up:', error.message)
            if(error.message === 'Firebase: Error (auth/email-already-in-use).') {
              toast({
                title: 'An account with this email may already exist. Please log in or use a different email.',
                status: 'error',
                duration: 5000,
                isClosable: true,
              })
            } else {
              toast({
                title: 'Something went wrong',
                description: error.message || 'Failed to create account',
                status: 'error',
                duration: 5000,
                isClosable: true,
              })
            }
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
            <HStack w="full" flexDir={['column', 'row']} gap={4}>
              <Box w="full">
                <Text fontSize="small" color="brand.dark.50">
                  FIRST NAME
                </Text>
                <Input
                  h={['3rem', '3.5rem']}
                  placeholder="FIRST NAME"
                  _placeholder={{ color: 'brand.dark.50' }}
                  name="first_name"
                  border="1px solid #000"
                  value={formik.values.first_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  borderColor={
                    formik.touched.first_name && formik.errors.first_name
                      ? 'red.500'
                      : 'brand.yellow.500'
                  }
                  _focusVisible={{
                    outline: 'none',
                  }}
                />
                {formik.touched.first_name && formik.errors.first_name ? (
                  <Text color="red.500" fontSize="sm">
                    {formik.errors.first_name}
                  </Text>
                ) : null}
              </Box>
              <Box w="full">
                <Text fontSize="small" color="brand.dark.50">
                  LAST NAME
                </Text>
                <Input
                  h={['3rem', '3.5rem']}
                  placeholder="LAST NAME"
                  _placeholder={{ color: 'brand.dark.50' }}
                  name="last_name"
                  border="1px solid #000"
                  value={formik.values.last_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  borderColor={
                    formik.touched.last_name && formik.errors.last_name
                      ? 'red.500'
                      : 'brand.yellow.500'
                  }
                  _focusVisible={{
                    outline: 'none',
                  }}
                />
                {formik.touched.last_name && formik.errors.last_name ? (
                  <Text color="red.500" fontSize="sm">
                    {formik.errors.last_name}
                  </Text>
                ) : null}
              </Box>
            </HStack>

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
                  PHONE NUMBER
                </Text>
                <Input
                  h={['3rem', '3.5rem']}
                  placeholder="PHONE NUMBER"
                  _placeholder={{ color: 'brand.dark.50' }}
                  name="phone"
                  border="1px solid #000"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  borderColor={
                    formik.touched.phone && formik.errors.phone
                      ? 'red.500'
                      : 'brand.yellow.500'
                  }
                  _focusVisible={{
                    outline: 'none',
                  }}
                />
                {formik.touched.phone && formik.errors.phone ? (
                  <Text color="red.500" fontSize="sm">
                    {formik.errors.phone}
                  </Text>
                ) : null}
              </Box>
              <Box w="full">
                <Text fontSize="small" color="brand.dark.50">
                  LEVEL OF DESIGN
                </Text>
                <Select
                  h={['3rem', '3.5rem']}
                  placeholder="Select level of design"
                  _placeholder={{ color: 'brand.dark.50' }}
                  name="level_of_design"
                  border="1px solid #000"
                  value={formik.values.level_of_design}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  borderColor={
                    formik.touched.level_of_design &&
                    formik.errors.level_of_design
                      ? 'red.500'
                      : 'brand.yellow.500'
                  }
                  _focusVisible={{
                    outline: 'none',
                  }}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                </Select>
                {formik.touched.level_of_design &&
                formik.errors.level_of_design ? (
                  <Text color="red.500" fontSize="sm">
                    {formik.errors.level_of_design}
                  </Text>
                ) : null}
              </Box>
            </HStack>

            <HStack w="full" flexDir={['column', 'row']} gap={4}>
              <Box w="full">
                <Text fontSize="small" color="brand.dark.50">
                  PASSWORD
                </Text>
                <Box pos="relative">
                  <Input
                    h={['3rem', '3.5rem']}
                    placeholder="PASSWORD"
                    _placeholder={{ color: 'brand.dark.50' }}
                    name="password"
                    border="1px solid #000"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    borderColor={
                      formik.touched.password && formik.errors.password
                        ? 'red.500'
                        : 'brand.yellow.500'
                    }
                    _focusVisible={{
                      outline: 'none',
                    }}
                    type={showPassword ? 'text' : 'password'}
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
              <Box w="full">
                <Text fontSize="small" color="brand.dark.50">
                  CONFIRM PASSWORD
                </Text>

                <Box w="full" pos="relative">
                  <Input
                    h={['3rem', '3.5rem']}
                    placeholder="CONFIRM PASSWORD"
                    _placeholder={{ color: 'brand.dark.50' }}
                    name="confirm_password"
                    border="1px solid #000"
                    value={formik.values.confirm_password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    borderColor={
                      formik.touched.confirm_password &&
                      formik.errors.confirm_password
                        ? 'red.500'
                        : 'brand.yellow.500'
                    }
                    _focusVisible={{
                      outline: 'none',
                    }}
                    type={showPassword ? 'text' : 'password'}
                  />
                </Box>
                {formik.touched.confirm_password &&
                formik.errors.confirm_password ? (
                  <Text color="red.500" fontSize="sm">
                    {formik.errors.confirm_password}
                  </Text>
                ) : null}
              </Box>
            </HStack>

            <Button
              h="3.688rem"
              w="full"
              type="submit"
              isLoading={loading || formik.isSubmitting}
              bg="brand.yellow.500"
            >
              Get Started
            </Button>

            <Center gap={1}>
              <Text fontSize="">Already have an account? </Text>
              <Link href="/library/login">
                <Text fontWeight={600}>Login</Text>
              </Link>
            </Center>
          </VStack>
        )}
      </Formik>
    </>
  )
}
