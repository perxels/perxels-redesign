import React, { useState, useRef } from 'react'
import {
  FormControl,
  Input,
  VStack,
  Select,
  Textarea,
  Button,
  Box,
  Text,
  useClipboard,
  HStack,
  useDisclosure,
} from '@chakra-ui/react'
import { FaTwitter } from 'react-icons/fa'
import { BiCopy } from 'react-icons/bi'
import { RiWhatsappFill } from 'react-icons/ri'
import { SuccessModal } from '../../components'
import { TwitterShareButton, WhatsappShareButton } from 'next-share'
import { Formik } from 'formik'
import * as Yup from 'yup'

export const EventForm = () => {
  const { hasCopied, onCopy } = useClipboard(
    'https://perxels.com/event',
  )
  const formRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const scriptUrl =
    'https://script.google.com/macros/s/AKfycbwT-2FTNzCeyQ1f9bZQgcRoTuepP0kHNVemyh5jmrP_H3z7p_EaDNNMAlcWrpdZJj4Cvw/exec'
  const { isOpen, onOpen, onClose } = useDisclosure()
  const handleSubmit = (e: any) => {
    e.preventDefault()
    setLoading(true)
    const inputData = e.target as typeof e.target & {
      name: { value: string }
      email: { value: string }
      phone: { value: string }
      howyouknew: { value: string }
      perxelsStudent: {value: string}
      questions: { value: string }
    }

    const formData = new FormData()
    formData.append('name', inputData.name.value as string)
    formData.append('email', inputData.email.value as string)
    formData.append('phone', inputData.phone.value as string)
    formData.append('howyouknew', inputData.howyouknew.value as string)
    formData.append('questions', inputData.questions.value as string)
    formData.append('perxelsStudent', inputData.perxelsStudents.value as string)
    //current date and time
    formData.append('date', new Date().toLocaleString())
    // const data = Object.fromEntries(formData)
    // console.log(data)
  
  }

  return (
    <>
      <SuccessModal
        isOpen={isOpen}
        onClose={onClose}
        title="Your registration has been received."
        description="You will receive an email with the meeting link shortly."
      />
      <Formik
        initialValues={{
          name: '',
          email: '',
          phone: '',
          howyouknew: '',
          questions: '',
          perxelsStudent: ''
        }}
        validationSchema={Yup.object({
          name: Yup.string().required('Name is Required'),
          email: Yup.string().email('Invalid email address').required('Email is Required'),
          phone: Yup.string().required('Phone Number is Required'),
          howyouknew: Yup.string().required('How you knew is Required'),
          questions: Yup.string().required('Questions is Required'),
          perxelsStudent: Yup.string().required('Are you a Perxels Student? Kindly Answer'),
        })}
        onSubmit ={(values, action) => {
          console.log(values)
            const formData = new FormData()

            formData.append('name', values.name as string)
            formData.append('email', values.email as string)
            formData.append('phone', values.phone as string)
            formData.append('howyouknew', values.howyouknew as string)
            formData.append('questions', values.questions as string)
            formData.append('perxelsStudent', values.perxelsStudent as string)
            formData.append('date', new Date().toLocaleString())

            fetch(scriptUrl, {
              method: 'POST',
              body: formData,
            }).then((response) => {
              if (response.status === 201 || 200) {
                action.resetForm()
                onOpen()
              } else {
                setLoading(false)
                alert('Something went wrong, please try again')
              }
            })
        }}
      >
      {(formik) => (
         <VStack
         as="form"
         spacing={{ base: '1.2rem', md: '1.209375rem' }}
         backgroundColor={'#F6F7FD'}
         px={['1.5rem', '1.5rem', '1.5rem', '2.5rem']}
         py={['1.5rem', '1.5rem', '1.5rem', '3.5rem']}
         rounded="10px"
         className="speaker-form"
         onSubmit = {(event) => {
          event.preventDefault()
          formik.handleSubmit()
        }}
       >
         <Input 
           id="name"
           type="text"
           placeholder='Full Name*'
           h="3.5rem"
           backgroundColor={'#FCFCFC'}
           border="0.406872px solid #B4B4B4"
           _focusVisible={{
             outline: 'none',
           }}
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          borderColor={formik.touched.name && formik.errors.name ? 'red.500' : '#B4B4B4'}
           />
         <Input
           id="email"
           type="email"
           h="3.5rem"
           placeholder="Email Address*"
           backgroundColor={'#FCFCFC'}
           border="0.406872px solid #B4B4B4"
           _focusVisible={{
             outline: 'none',
           }}
           _focus={{ border: 'none' }}
           value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            borderColor={
              formik.touched.email && formik.errors.email ? 'red.500' : '#B4B4B4'
            }
         />
         <Input
           id="phone"
           type="tel"
           h="3.5rem"
           placeholder="Phone Number*"
           backgroundColor={'#FCFCFC'}
           border="0.406872px solid #B4B4B4"
           _focusVisible={{
             outline: 'none',
           }}
           _focus={{ border: 'none' }}
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            borderColor={
              formik.touched.phone && formik.errors.phone ? 'red.500' : '#B4B4B4'
            }
           />
         <FormControl id="how">
           <Select
             backgroundColor={'#FCFCFC'}
             border="0.406872px solid #B4B4B4"
             placeholder="How did you get to know about Us?"
             _placeholder={{ color: '#B4B4B4' }}
             name="howyouknew"
             h="3.5rem"
             _focusVisible={{
               outline: 'none',
             }}
             value ={formik.values.howyouknew}
             onChange={formik.handleChange}
             borderColor={
                formik.touched.howyouknew && formik.errors.howyouknew ? 'red.500' : '#B4B4B4'
             }
           >
             <option value="Whatsapp">Whatsapp</option>
             <option value="Instagram">Instagram</option>
             <option value="Facebook">Facebook</option>
             <option value="Twitter">Twitter</option>
             <option value="Friend">Friend</option>
             <option value="Roadtrip community">Roadtrip community</option>
             <option value="Others">Others</option>
           </Select>
         </FormControl>

            <FormControl id="perxelsStudent">
             <Select  
                backgroundColor={'#FCFCFC'}
                border="0.406872px solid #B4B4B4"
                placeholder="Are you a Perxels Student?"
                _placeholder={{ color: '#B4B4B4' }}
                name="perxelsStudent"
                h="3.5rem"
                _focusVisible={{
                  outline: 'none',
                }}
                value={formik.values.perxelsStudent}
                onChange={formik.handleChange}
                borderColor={
                  formik.touched.perxelsStudent && formik.errors.perxelsStudent ? 'red.500' : '#B4B4B4'
                }>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                </Select>

            </FormControl>


         <FormControl id="questions">
           <Textarea
             backgroundColor={'#FCFCFC'}
             outline="none"
             border="0.406872px solid #B4B4B4"
             placeholder="Questions for the Session"
             name="questions"
             _focusVisible={{
               outline: 'none',
             }}
             value={formik.values.questions}
             onChange={
                formik.handleChange
             }
             onBlur={formik.handleBlur}
             borderColor={
              formik.touched.questions && formik.errors.questions ? 'red.500' : '#B4B4B4'
             }
           />
         </FormControl>
         <Box width="full">
           <Button h="3.1875rem" w="full" type="submit" fontSize={'lg'}
           isLoading={formik.isSubmitting}
          
           >
             Register for this Session
           </Button>
         </Box>
 
         <Box w="full">
           <Text
             fontSize="xl"
             fontWeight={'bold'}
             color="brand.gray.400"
             textAlign={'center'}
             mb="1.5rem"
           >
             Spread the word
           </Text>
 
           <Box>
             <Box
               w="full"
               bgColor={'#FCFCFC'}
               display="flex"
               fontSize={'20px'}
               alignItems="center"
               justifyContent="space-between"
               p={'0.5rem'}
               mb="1.5rem"
             >
               <Input
                 w="70%"
                 border={'0 none'}
                 outline="0 none"
                 _focus={{
                   outline: '0 none',
                   border: '0 none',
                   boxShadow: 'none',
                 }}
                 value="https://perxels.com/event"
                 color="#000000"
                 fontSize={'0.915625rem'}
                 type="disabled"
               />
               <BiCopy onClick={onCopy} cursor="pointer" />
             </Box>
           </Box>
 
           <HStack spacing={{ base: 4, lg: 4 }}>
             <Box w="full">
               <WhatsappShareButton
                 url={'https://perxels.com/event'}
                 title={'DASHBOARD DESIGN: THINGS YOU NEED TO KNOW ABOUT'}
                 separator=":: "
                 style={{ width: '100%' }}
               >
                 <Button
                   backgroundColor={'transparent'}
                   border="1px solid #121212"
                   color={'#121212'}
                   _hover={{
                     backgroundColor: '#121212',
                     color: '#fff',
                   }}
                   w="full"
                 >
                   <RiWhatsappFill />{' '}
                   <Text
                     ml={{ base: '0.35rem', lg: '0.75rem' }}
                     fontSize={{ base: '1rem', lg: '1rem' }}
                   >
                     Share
                   </Text>
                 </Button>
               </WhatsappShareButton>
             </Box>
             <Box w="full">
               <TwitterShareButton
                 url={'https://perxels.com/event'}
                 title={'DASHBOARD DESIGN: THINGS YOU NEED TO KNOW ABOUT'}
                 style={{ width: '100%' }}
               >
                 <Button
                   backgroundColor={'transparent'}
                   border="1px solid #121212"
                   color={'#121212'}
                   _hover={{
                     backgroundColor: '#121212',
                     color: '#fff',
                   }}
                   w="full"
                 >
                   <FaTwitter />{' '}
                   <Text
                     ml={{ base: '0.35rem', lg: '0.75rem' }}
                     fontSize={{ base: '1rem', lg: '1rem' }}
                   >
                     Tweet
                   </Text>
                 </Button>
               </TwitterShareButton>
             </Box>
           </HStack>
         </Box>
       </VStack>
  )}
      </Formik>
    </>
  )
}