import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  VStack,
  Select,
  Textarea,
  Button,
} from '@chakra-ui/react'
import {Field, useField} from 'formik'

interface EventFormProps {
  id: string
  type: string
  placeholder: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  value: string
}

export const EventInput: React.FC<EventFormProps> = ({
  id,
  type,
  placeholder,
  onChange,
}) => {
  return (
    <FormControl id={id}>
      <Field
        as={Input}
        backgroundColor={'#FCFCFC'}
        border="0.406872px solid #B4B4B4"
        type={type}
        placeholder={placeholder}
        _focus={{ border: 'none' }}
        name={id}
        h="3.5rem"
        isRequired
        _focusVisible={{
          outline: 'none',
        }}
        onChange={onChange}
      />
    </FormControl>
  )
}
