import {FormControl, FormLabel, FormErrorMessage, Input, VStack, Select, Textarea, Button} from '@chakra-ui/react'

interface EventFormProps {
    id: string
    type: string
    placeholder: string
}


export const EventInput: React.FC<EventFormProps> = ({id, type, placeholder}) => {
  return (
    <FormControl id={id}>
    <Input 
    backgroundColor={"#FCFCFC"}
    outline="none"
    border="0.406872px solid #B4B4B4"
    type={type} placeholder={placeholder}
    />
    </FormControl>
  )
}

