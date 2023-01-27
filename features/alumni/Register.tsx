import React, { useState } from 'react'
import { SuccessModal } from '../../components'
import { Formik } from 'formik'
import * as Yup from 'yup'
import {
    Box,
    Button,
    Heading,
    Input,
    Select,
    Text,
    Textarea,
    VStack,
    useDisclosure,
    Center,
  } from '@chakra-ui/react'
  
export const Register = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
    <SuccessModal
        isOpen={isOpen}
        onClose={onClose}
        title="Thank you for your submission!"
        description="Our representative will send you a google meet link within the next 24 hours."
      />
    <Box
    backgroundColor="#34296B"
    pt={['5rem', '5rem', '5rem', '6rem']}
    pb="2rem"
    id="register"
    >
        <Box
        p={['3rem 5%', '3rem 10%', '3rem 5%', '3rem 25%']}
        >
            <Center>


                <Heading
                fontSize="2.5rem"
                textTransform="uppercase"
                fontWeight={900}
                color="#fff"
                >Register Here</Heading>
            </Center>

            <Box
                p={['3rem 10%', '3rem 10%', '3rem 15%', '3rem 15%']}
                bgColor="#fff"
                borderRadius="20px"
            >
                <Formik
                    initialValues={{
                        fullname: '',
                        email: '',
                        phone: '',
                        class: '',
                        purpose: '',
                    }}

                    validationSchema={Yup.object({
                        fullname: Yup.string().required('Name Required'),
                        email: Yup.string().email('Invalid email address').required('Email Required'),
                        phone: Yup.string().required('Phone Number Required'),
                        class: Yup.string().required('Class Required'),
                        purpose: Yup.string().required('What do you hope to get required'),


                    })}

                    onSubmit = {(values, action) => {
                        const formData = new FormData()
                        formData.append('fullname', values.fullname as string)
                        formData.append('email', values.email  as string)
                        formData.append('phone', values.phone  as string)
                        formData.append('class', values.class   as string)
                        formData.append('purpose', values.purpose  as string)
                        formData.append('created_at', new Date().toLocaleString())  
                        fetch('https://script.google.com/macros/s/AKfycbya3QkeaYWtHjvNa9lR1y4Yidjga4YAzF4E0IRMpL8C9Y7FsO73egTUboSwfzvKcRht/exec', {
                            method: 'POST',
                            body: formData
                        })
                        .then((response) => {
                            if (response.status === 201 || 200) {
                                action.resetForm()
                                onOpen()
                              } else {
                                alert('Something went wrong, please try again')
                              } 
                        }

                        )
                        .catch(error => console.error('Error:', error))
                    }}

                >
                    {(formik) => (

<VStack
rowGap={"1.5rem"}
as="form"
alignItems={"flex-start"}
onSubmit={(event) => {
    event.preventDefault()
    formik.handleSubmit()
  }}
>
    <Input placeholder="Full Name" 
    w="100%"
    border='1px solid #383838'
    borderRadius= "10px"
    height= "48px"
    outline= "none"
    padding= "0 1.2rem"
    name="fullname"
    onChange={formik.handleChange}
    value={formik.values.fullname}
                onBlur={formik.handleBlur}
                borderColor={
                  formik.touched.fullname && formik.errors.fullname
                    ? 'red.500'
                    : 'brand.dark.200'
                }
                _focusVisible={{
                  outline: 'none',
                }}

    />
    {formik.touched.fullname && formik.errors.fullname ? (
                <Text color="red.500" fontSize="sm">
                  {formik.errors.fullname}
                </Text>
              ) : null}
    <Input
     border='1px solid #383838'
     borderRadius= "10px"
     height= "48px"
     outline= "none"
     padding= "0 1.2rem"
    placeholder="Email"
    name="email"
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
      w="100%"
      border='1px solid #383838'
      borderRadius= "10px"
      height= "48px"
      outline= "none"
      padding= "0 1.2rem"
      name="phone"
     placeholder="Phone Number"
     value={formik.values.phone}
     onChange={formik.handleChange}
                 onBlur={formik.handleBlur}
                 borderColor={
                   formik.touched.phone && formik.errors.phone
                     ? 'red.500'
                     : 'brand.dark.200'
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
    <Input 
      w="100%"
      border='1px solid #383838'
      borderRadius= "10px"
      height= "48px"
      outline= "none"
      padding= "0 1.2rem"
      name="class"
    placeholder="Class Name"  
    value={formik.values.class}
    onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                borderColor={
                  formik.touched.class && formik.errors.class
                    ? 'red.500'
                    : 'brand.dark.200'
                }
                _focusVisible={{
                  outline: 'none',
                }}

    />
    {formik.touched.class && formik.errors.class ? (
                <Text color="red.500" fontSize="sm">
                  {formik.errors.class}
                </Text>
              ) : null}
   <Input name="purpose" placeholder="WHAT DO YOU HOPE TO GAIN FROM THIS EVENT?"
    value={formik.values.purpose}
    onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                borderColor={
                  formik.touched.purpose && formik.errors.purpose
                    ? 'red.500'
                    : 'brand.dark.200'
                }
                _focusVisible={{
                  outline: 'none',
                }}

    />
    {formik.touched.purpose && formik.errors.purpose ? (
                <Text color="red.500" fontSize="sm">
                  {formik.errors.purpose}
                </Text>
              ) : null}
    <Center
    w={["full", "100%"]}
    p={["0 0", "0 10%"]}
    >
    <Button
    w="100%"
    bgColor="#34296B"
    color="#fff"
    borderRadius="10px"
    height="48px"
    type="submit"
    isLoading={formik.isSubmitting}
    >
        REGISTER
    </Button>
    </Center>
  
</VStack>
                    )

                    }
                </Formik>
               
       
            </Box>
        </Box>
    </Box>
    </>
  )
}
