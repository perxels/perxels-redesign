import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  Heading,
  Input,
  Select,
  SimpleGrid,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { SuccessModal } from '../../components';
import { MainContainer } from '../../layouts';
import { InputWrapper } from '../../components/InputWrapper';

export const EventForm = () => {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const scriptUrl =
    'https://script.google.com/macros/s/AKfycbxYSNRrJ1wv1hioFIB7Iuyxg6K_Kos2vgtqCTkKYcQ5xwz5GDkGlxi0O6LaFsjJuSwn/exec';

  const validationSchema = Yup.object({
    firstName: Yup.string().required('Required'),
    surname: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email address').required('Required'),
    phone: Yup.string().required('Required'),
    laptop: Yup.string().required('Required'),
    reason: Yup.string().required('Required'),
    attendance: Yup.string().required('Required'),
    location: Yup.string().required('Required'),
  });

  const handleSubmit = async (values: any, actions: any) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('firstName', values.firstName as string);
    formData.append('surname', values.surname as string);
    formData.append('email', values.email as string);
    formData.append('phone', values.phone as string);
    formData.append('laptop', values.laptop as string);
    formData.append('reason', values.reason as string);
    formData.append('attendance', values.attendance as string);
    formData.append('location', values.location as string   );
    formData.append('created_at', new Date().toLocaleString());
    try {
      const response =await fetch(scriptUrl, {
        method: 'POST',
        body: formData,
      }).then((response)=>{
        if(response.status === 200){
          setIsOpen(true);
          actions.resetForm();
          setLoading(false);
        }
      }).catch((error)=>{
        console.log(error)
      })
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong, please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box id="register" py={["2.3rem","3.75rem"]} px={["0","25%"]}>
      <SuccessModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Congratulations"
        description="Registeration complete, our representative will reach out to you via mail."
        buttonTitle="Back to Home Page"
        buttonHref="/"
      />
      <MainContainer>
        <Box py="3.75rem">
          <Formik
            initialValues={{
              firstName: '',
              surname: '',
              email: '',
              phone: '',
              laptop: '',
              reason: '',
              attendance: '',
              location: '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {(formik) => (
              <VStack
                as="form"
                maxW="1030px"
                m="0 auto"
                spacing={['1rem', '1rem', '1rem', '3.125rem']}
                onSubmit={(event) =>{
                    event.preventDefault()
                    formik.handleSubmit()
                  }}
              >
                <SimpleGrid columns={[1, 1, 1, 1]} w="full" spacing={['1rem', '1rem', '1rem', '2rem']}>
                  <Flex columnGap="1rem"
                  flexDir={["column", "column", "column", "row"]}
                  rowGap={['1rem', '1rem', '1rem', '0']}
                  >
                    <InputWrapper label="First Name">
                      <Input
                        type="text"
                        placeholder="First name"
                        w="full"
                        h={['3rem', '3rem', '3rem', '3.8125rem']}
                        name="firstName"
                        backgroundColor="#F4F7FF"
                        value={formik.values.firstName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        borderColor={formik.touched.firstName && formik.errors.firstName ? 'red.500' : '#B4B4B4'}
                        required
                      />
                    </InputWrapper>
                    <InputWrapper label="Surname">
                      <Input
                        type="text"
                        placeholder="Surname"
                        w="full"
                        h={['3rem', '3rem', '3rem', '3.8125rem']}
                        name="surname"
                        backgroundColor="#F4F7FF"
                        value={formik.values.surname}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        borderColor={formik.touched.surname && formik.errors.surname ? 'red.500' : '#B4B4B4'}
                        required
                      />
                    </InputWrapper>
                  </Flex>
                  <InputWrapper label="Email Address">
                    <Input
                      type="email"
                      placeholder="example@gmail.com"
                      w="full"
                      backgroundColor="#F4F7FF"
                      h={['3rem', '3rem', '3rem', '3.8125rem']}
                      name="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      borderColor={formik.touched.email && formik.errors.email ? 'red.500' : '#B4B4B4'}
                      required
                    />
                  </InputWrapper>
                  <InputWrapper label="Phone Number">
                    <Input
                      type="tel"
                      placeholder="Enter your Phone Number"
                      w="full"
                      backgroundColor="#F4F7FF"
                      h={['3rem', '3rem', '3rem', '3.8125rem']}
                      name="phone"
                      value={formik.values.phone}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      borderColor={formik.touched.phone && formik.errors.phone ? 'red.500' : '#B4B4B4'}
                      required
                    />
                  </InputWrapper>
               
                <FormControl id="laptop">
                <InputWrapper label="Do you have a working laptop??">
                  <Select
                   
                    border="0.406872px solid #B4B4B4"
                    placeholder=" "
                    // _placeholder={{ color: '#B4B4B4' }}
                    name="laptop"
                    h="3.5rem"
                    _focusVisible={{
                      outline: 'none',
                    }}
                    value={formik.values.laptop}
                    onChange={formik.handleChange}
                    borderColor={
                      formik.touched.laptop && formik.errors.laptop ? 'red.500' : '#B4B4B4'
                    }
                    backgroundColor="#F4F7FF"
                    required
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </Select>
                  </InputWrapper>
                </FormControl>
                <InputWrapper label="Why should you be selected for this masterclass">
                  <Textarea
                    w="full"
                    h="5.75rem"
                    py="1.5rem"
                    name="reason"
                    backgroundColor="#F4F7FF"
                    required
                    value={formik.values.reason}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    borderColor={formik.touched.reason && formik.errors.reason ? 'red.500' : '#B4B4B4'}
                  />
                </InputWrapper>
                <InputWrapper label="Do you want to attend physically or virtually">
                <Select
                   border="0.406872px solid #B4B4B4"
                   placeholder=" "
                   // _placeholder={{ color: '#B4B4B4' }}
                   name="attendance"
                   h="3.5rem"
                   _focusVisible={{
                     outline: 'none',
                   }}
                   value={formik.values.attendance}
                   onChange={formik.handleChange}
                   borderColor={
                     formik.touched.attendance && formik.errors.attendance ? 'red.500' : '#B4B4B4'
                   }
                   backgroundColor="#F4F7FF"
                   required
                 >
                   <option value="Physical">Physical</option>
                   <option value="Virtual">Virtual</option>
                   </Select>

                </InputWrapper>
                <InputWrapper label="Location e.g Badore, Ajah">
                  <Input
                    type="text"
                    placeholder="Enter your Location"
                    w="full"
                    h={['3rem', '3rem', '3rem', '3.5rem']}
                    name="location"
                    backgroundColor="#F4F7FF"
                    value={formik.values.location}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    borderColor={formik.touched.location && formik.errors.location ? 'red.500' : '#B4B4B4'}
                    required
                  />
                </InputWrapper>
                </SimpleGrid>
                <Button
                  h={['3rem', '3rem', '3rem', '3.125rem']}
                  w="175px"
                  maxW="437px"
                  type="submit"
                  isLoading={loading ? formik.isSubmitting : false}
                >
                  Register
                </Button>
              </VStack>
            )}
          </Formik>
        </Box>
      </MainContainer>
    </Box>
  );
};