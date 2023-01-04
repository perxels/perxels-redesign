import React, {useState, useRef} from 'react'
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  VStack,
  Select,
  Textarea,
  Button,
  Box,
  Text,
  useClipboard,
  HStack,

} from '@chakra-ui/react'
import { EventInput } from './'
import { FaTwitter } from 'react-icons/fa'
import { BiCopy } from 'react-icons/bi'
import {RiWhatsappFill} from 'react-icons/ri'
export const EventForm = () => {
    const { hasCopied, onCopy } = useClipboard('https://perxels.com/events/dashboard-designs')
    const formRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const scriptUrl = "https://script.google.com/macros/s/AKfycbwT-2FTNzCeyQ1f9bZQgcRoTuepP0kHNVemyh5jmrP_H3z7p_EaDNNMAlcWrpdZJj4Cvw/exec"
    const handleSubmit = (e: any) => {
        console.log("working")
        e.preventDefault()
        setLoading(true)
        const inputData = e.target as typeof e.target & {
            name: { value: string };
            email: { value: string };
            phone: { value: string };
            howyouknew: { value: string };
            questions: { value: string };
        }  
        
        const formData = new FormData
        formData.append('name', inputData.name.value as string)
        formData.append('email', inputData.email.value as string)
        formData.append('phone', inputData.phone.value as string)
        formData.append('howyouknew', inputData.howyouknew.value as string)
        formData.append('questions', inputData.questions.value as string)
        //current date and time
        formData.append('date', new Date().toLocaleString())

        // const data = Object.fromEntries(formData)
        // console.log(data)
        fetch(scriptUrl, { 
          method: 'POST',
         body:  formData,
        }).then(
            (response) => {
              if(response.status === 201 || 200) {
                setLoading(false)
                alert("Your message has been sent successfully")
              }else{
                setLoading(false)
                alert("Something went wrong, please try again")
              }
            }
        )

    }


  return (
    <>
   
    <VStack
      as="form"
      spacing={{ base: "1.2rem", md: "1.209375rem"}}
      backgroundColor={'#F6F7FD'}
      px={['1.5rem', '1.5rem', '1.5rem', '2.5rem']}
      py={['1.5rem', '1.5rem', '1.5rem', '3.5rem']}
      rounded="10px"
      onSubmit={handleSubmit}
    >
      
      <EventInput id="name" type="text" placeholder="Full Name*" />
      <EventInput id="email" type="email" placeholder="Email Address*" />
      <EventInput id="phone" type="tel" placeholder="Phone Number*" />
      <FormControl id="how">
        <Select
          backgroundColor={'#FCFCFC'}
          outline="none"
          border="0.406872px solid #B4B4B4"
          placeholder="How did you get to know about Us?"
          _placeholder={{ color: '#B4B4B4' }}
          name="howyouknew"
          h="3.5rem"
        >
          <option value="Whatsapp">Whatsapp</option>
          <option value ="Instagram">Instagram</option>
          <option value="Facebook">Facebook</option>
          <option value="Twitter">Twitter</option>
          <option value="Friend">Friend</option>
          <option value="Others">Others</option>
        </Select>
      </FormControl>
      <FormControl id="questions">
        <Textarea
          backgroundColor={'#FCFCFC'}
          outline="none"
          border="0.406872px solid #B4B4B4"
          placeholder="Questions for the Session"
          name="questions"
        />
      </FormControl>
      <Box width="full">
        <Button h="3.1875rem" w="full" type="submit" fontSize={'lg'}>
          Register for this Session
        </Button>
      </Box>
     
      <Box
      w="full"
      >
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
            p={"0.5rem"}
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
              value="https://perxels.com/events/dashboard-designs..."
              color="#000000"
              fontSize={'0.915625rem'}
              type="disabled"
            />
            <BiCopy  onClick={onCopy} cursor="pointer"/>
          </Box>
        </Box>

        <HStack  spacing={{base:4, lg:4}}>
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
            <RiWhatsappFill/>{' '}
            <Text ml={{base:"0.35rem", lg:"0.75rem"}} fontSize={{base:'1rem' ,lg:'1rem'}}>
              Share 
            </Text>
          </Button>
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
            <Text ml={{base:"0.35rem", lg:"0.75rem"}} fontSize={{base:'1rem' ,lg:'1rem'}}>
               Tweet
            </Text>
          </Button>
        </HStack>
      </Box>
    </VStack>
   
    </>
  )
}
