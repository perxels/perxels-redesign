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
  // const scriptUrl ='https://script.google.com/macros/s/AKfycbxYSNRrJ1wv1hioFIB7Iuyxg6K_Kos2vgtqCTkKYcQ5xwz5GDkGlxi0O6LaFsjJuSwn/exec';
  const scriptUrl = "https://script.google.com/macros/s/AKfycbwIlHDNqMaywawp4nd-5oYZwOfqB4s4FoVbUBbTEkYXKBJqGD4Js0h2pcxAEK7qo3vfFg/exec"
  const validationSchema = Yup.object({
    firstName: Yup.string().required('Required'),
    surname: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email address').required('Required'),
    phone: Yup.string().required('Required'),
    howyouknew: Yup.string().required('Required'),
    followingPerxels: Yup.string().required('Required'),
    twitter: Yup.string().required('Required'),
    instagram: Yup.string().required('Required'),
  });

  const handleSubmit = async (values: any, actions: any) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('firstName', values.firstName as string);
    formData.append('surname', values.surname as string);
    formData.append('email', values.email as string);
    formData.append('phone', values.phone as string);
    formData.append('howyouknew', values.howyouknew as string);
    formData.append('followingPerxels', values.followingPerxels as string);
    formData.append('twitter', values.twitter as string);
    formData.append('instagram', values.instagram as string);
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
        title="Thank you for registering for the Portfolio Design Competitions"
        description="Join the Competition by clicking on the button."
        buttonTitle="Join Group"
        buttonHref="https://chat.whatsapp.com/FwlXkkpp4sZ8dIwHSulSX2"
      />
      <MainContainer>
        <Box py="3.75rem">
          <Formik
            initialValues={{
              firstName: '',
              surname: '',
              email: '',
              phone: '',
              howyouknew: '',
              followingPerxels: '',
              twitter: '',
              instagram: '',
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
              
                <InputWrapper label="How did you get to know about us">
                  <Textarea
                    w="full"
                    h="5.75rem"
                    py="1.5rem"
                    name="howyouknew"
                    backgroundColor="#F4F7FF"
                    required
                    value={formik.values.howyouknew}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    borderColor={formik.touched.howyouknew && formik.errors.howyouknew ? 'red.500' : '#B4B4B4'}
                  />
                </InputWrapper>
                <InputWrapper label="Are you following Perxels on all social media?">
                <Select
                   border="0.406872px solid #B4B4B4"
                   placeholder=" "
                   // _placeholder={{ color: '#B4B4B4' }}
                   name="followingPerxels"
                   h="3.5rem"
                   _focusVisible={{
                     outline: 'none',
                   }}
                   value={formik.values.followingPerxels}
                   onChange={formik.handleChange}
                   borderColor={
                     formik.touched.followingPerxels && formik.errors.followingPerxels ? 'red.500' : '#B4B4B4'
                   }
                   backgroundColor="#F4F7FF"
                   required
                 >
                   <option value="Yes">Yes</option>
                   <option value="No">No</option>
                   </Select>

                </InputWrapper>
                <InputWrapper label="Drop Link to your twitter profile">
                  <Input
                    type="text"
                    placeholder="Twitter Url"
                    w="full"
                    h={['3rem', '3rem', '3rem', '3.5rem']}
                    name="twitter"
                    backgroundColor="#F4F7FF"
                    value={formik.values.twitter}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    borderColor={formik.touched.twitter && formik.errors.twitter ? 'red.500' : '#B4B4B4'}
                    required
                  />
                </InputWrapper>
                <InputWrapper label="Drop Link to your instagram profile">
                  <Input
                    type="text"
                    placeholder="Instagram Url"
                    w="full"
                    h={['3rem', '3rem', '3rem', '3.5rem']}
                    name="instagram"
                    backgroundColor="#F4F7FF"
                    value={formik.values.instagram}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    borderColor={formik.touched.instagram && formik.errors.instagram ? 'red.500' : '#B4B4B4'}
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