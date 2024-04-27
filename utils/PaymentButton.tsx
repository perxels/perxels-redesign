import { Button } from '@chakra-ui/react'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { usePaystackPayment } from 'react-paystack' // Assuming you're using react-paystack
import { cartProductProps } from '../features/marketplace/MarketNav'

interface PaystackProps {
  email: string
  amount: number
  setState: Dispatch<SetStateAction<number>>
  setCart: Dispatch<SetStateAction<cartProductProps[]>>
}

const PaystackPaymentButton: React.FC<PaystackProps> = ({
  email,
  amount,
  setCart,
  setState,
}) => {
  const [isLoading, setIsLoading] = useState(false) // Track payment loading state

  const config = {
    reference: new Date().getTime().toString(),
    email,
    amount: amount * 100, // Convert amount to kobo for Paystack (N200 = 20000 kobo)
    publicKey: 'pk_test_ccd9d31670a4e4be4917412334639e338067d4be', // Replace with your test/live public key
  }

  const initializePayment = usePaystackPayment(config)

  const handlePayment = async () => {
    setIsLoading(true) // Set loading state to indicate payment processing

    try {
      await initializePayment({
        ...config,
        onSuccess: (ref) => {
          // Handle successful payment (e.g., show success message)
          setTimeout(() => {
            setIsLoading(false)
            setState(5)
 
              // setCart([])
              localStorage.setItem('cart_items', JSON.stringify([]))
          
          }, 2000)
          console.log('Payment successful!', ref)
        },
        onClose: (ref) => {
          // Handle payment closure (e.g., show user closed payment)
          setTimeout(() => {
            setIsLoading(false)
          }, 2000)
          alert('Something went wrong !')
          console.log('Payment closed.', ref)
        },
      })
    } catch (error) {
      // Handle errors (e.g., show error message)
      setIsLoading(false)
      console.error('Payment error:', error)
    }
  }

  return (
    <Button
      w="full"
      rounded="sm"
      fontFamily="Proxima Nova"
      fontWeight="600"
      fontSize="18px"
      type="button"
      onClick={handlePayment}
      isLoading={isLoading} // Pass loading state to Button component (if applicable)
      disabled={isLoading} // Optionally disable button while payment is processing
    >
      {isLoading ? 'Processing...' : 'Pay'}
    </Button>
  )
}

export default PaystackPaymentButton
