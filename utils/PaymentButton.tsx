import { Button } from '@chakra-ui/react'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { usePaystackPayment } from 'react-paystack' // Assuming you're using react-paystack
import { cartProductProps } from '../features/marketplace/MarketNav'
import { FormState } from '../features/marketplace/MarketDrawer'
import { paystackKey, productScriptUrl } from '../constant'

interface PaystackProps {
  email: string
  amount: number
  setState: Dispatch<SetStateAction<number>>
  setCart: Dispatch<SetStateAction<cartProductProps[]>>
  cart: cartProductProps[]
  form: FormState
}

const PaystackPaymentButton: React.FC<PaystackProps> = ({
  email,
  amount,
  setCart,
  cart,
  form,
  setState,
}) => {
  const [isLoading, setIsLoading] = useState(false) // Track payment loading state

  const config = {
    reference: new Date().getTime().toString(),
    email,
    amount: amount * 100, // Convert amount to kobo for Paystack (N200 = 20000 kobo)
    publicKey: paystackKey, 
  }
  const scriptUrl = productScriptUrl

  const initializePayment = usePaystackPayment(config)

  const handlePayment = async () => {
    setIsLoading(true)


    try {
      await initializePayment({
        ...config,
        onSuccess: (ref) => {
          // Loop through each item in the cart
          for  (let i = 0; i < cart.length; i++) {
            const item = cart[i]
            const formData = new FormData()
            // Prepare formDataObject for the current cart item
            const formDataObject: any = {
              ...form.shipping,
              ...form.payment,
              status: ref.status,
              purchase_amount: amount.toLocaleString(),
              payment_reference: ref.reference,
              transaction_ref: ref.trans,
              ...item, // Spread the current cart item data
            }

            // Append fields from formDataObject to formData
            for (const key in formDataObject) {
              const value = formDataObject[key]
              formData.append(key, value)
            }

            // Send formData to server
           fetch(scriptUrl, {
              method: 'POST',
              mode: 'no-cors',
              body: formData,
            })
          }
          setIsLoading(false)
          setState(5)
          localStorage.setItem('cart_items', JSON.stringify([]))
        },
        onClose: (ref) => {
          setIsLoading(false)
          alert('Payment closed!')
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
