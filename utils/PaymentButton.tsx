import { Button } from '@chakra-ui/react'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { usePaystackPayment } from 'react-paystack' // Assuming you're using react-paystack
import { cartProductProps } from '../features/marketplace/MarketNav'
import { FormState } from '../features/marketplace/MarketDrawer'

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
    publicKey: 'pk_test_ccd9d31670a4e4be4917412334639e338067d4be', // Replace with your test/live public key
  }
  const scriptUrl =
    'https://script.google.com/macros/s/AKfycbx9DjAuNLrQ2G8wcxLlh70j9gv7JJ3jSu5OGMc2UwJxfSyGpr0y6Tb_fEBrfWHT0T7H/exec'
  const initializePayment = usePaystackPayment(config)

  const handlePayment = async () => {
    setIsLoading(true) // Set loading state to indicate payment processing
    // Convert object to FormData
    const formData = new FormData()

    try {
      await initializePayment({
        ...config,
        onSuccess: (ref) => {
          console.log(ref)
          const formDataObject: any = {
            ...form.shipping,
            ...form.payment,
            status: ref.status,
            purchase_amount: amount.toLocaleString(),
            payment_reference: ref.reference,
            transaction_ref: ref.trans,
            products: [...cart],
          }

          // Append fields from formDataObject
          for (const key in formDataObject) {
            const value = formDataObject[key]
            if (Array.isArray(value)) {
              // If the value is an array, iterate through each object in the array
              value.forEach((obj, index) => {
                // Append each key-value pair from the object with a unique key
                for (const objKey in obj) {
                  formData.append(
                    `Product ${objKey} [${index + 1}]`,
                    obj[objKey],
                  )
                }
              })
            } else {
              // If it's not an array, append the value as usual
              formData.append(key, value)
            }
          }

          fetch(scriptUrl, {
            method: 'POST',
            mode: 'no-cors',
            body: formData,
          })
            .then(() => {
              setIsLoading(false)
              setState(5)
              localStorage.setItem('cart_items', JSON.stringify([]))
            })
            .catch((err) => {
              setIsLoading(false)
              alert('Something went wrong, kindly contact our support!')
            })
        },
        onClose: (ref) => {
          // Handle payment closure (e.g., show user closed payment)
          setTimeout(() => {
            setIsLoading(false)
          }, 2000)
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
