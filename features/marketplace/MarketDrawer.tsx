import {
  Badge,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Img,
  Input,
  Select,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { cartProductProps } from './MarketNav'
import {
  RiArrowLeftSFill,
  RiArrowRightSFill,
  RiDeleteBin6Line,
} from 'react-icons/ri'
import { BiChevronRight } from 'react-icons/bi'
import PaystackPaymentButton from '../../utils/PaymentButton'
import { deliveryFee } from '../../constant'
import Link from 'next/link'

interface MarketDrawerProps {
  isOpen: boolean // Required and must be a boolean
  onClose: () => void // Required and must be a function that takes no arguments and returns void
  state: number
  setState: Dispatch<SetStateAction<number>>
  cart: cartProductProps[]
  setCart: Dispatch<SetStateAction<cartProductProps[]>>
}

export interface FormState {
  shipping: {
    address: string
    city: string
    state: string
    country: string
    delivery_note: string
    shipping_region: string
  }
  payment: {
    first_name: string
    last_name: string
    email: string
    phone: number
  }
}

const initialFormState: FormState = {
  shipping: {
    address: '',
    city: '',
    state: '',
    country: '',
    delivery_note: '',
    shipping_region: '',
  },
  payment: {
    first_name: '',
    last_name: '',
    email: '',
    phone: 0,
  },
}

export const MarketDrawer: React.FC<MarketDrawerProps> = ({
  isOpen,
  onClose,
  state,
  setState,
  cart,
  setCart,
}) => {
  const [form, setForm] = useState<FormState>(() => {
    if (typeof window !== 'undefined') {
      const storedForm = localStorage.getItem('form')
      return storedForm ? JSON.parse(storedForm) : initialFormState
    }
    return initialFormState
  })

  useEffect(() => {
    const savedCart = localStorage.getItem('contact')
    setForm(savedCart ? JSON.parse(savedCart) : [])
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    const [section, field] = name.split('.') as [
      keyof FormState,
      keyof FormState[keyof FormState],
    ]
    const updatedForm: FormState = {
      ...form,
      [section]: {
        ...form[section],
        [field]: value,
      },
    }
    setForm(updatedForm)
    localStorage.setItem('contact', JSON.stringify(updatedForm))
  }

  useEffect(() => {
    if (cart.length >= 1) {
      setState(1)
    } else if (cart.length < 1) {
      setState(0)
    }
  }, [cart])

  // Function to remove a product from the cart
  const removeFromCart = (productId: number) => {
    const updatedCart = cart.filter((item) => item.id !== productId)
    setCart(updatedCart)
    localStorage.setItem('cart_items', JSON.stringify(updatedCart))
  }

  // Function to update the quantity of a product in the cart
  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity === 0) {
      return removeFromCart(productId)
    } else {
      const updatedCart = cart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item,
      )
      setCart(updatedCart)
      localStorage.setItem('cart_items', JSON.stringify(updatedCart))
    }
  }

  const calculateTotalPrice = (products: cartProductProps[]): number => {
    // Use reduce to iterate through the array and accumulate the total price
    return products.reduce((totalPrice, product) => {
      // Calculate the total price for each product based on price_th and quantity
      const productTotalPrice = product.price_th * product.quantity
      // Add the product's total price to the running total
      return totalPrice + productTotalPrice
    }, 0) // Initialize the total price to 0
  }

  return (
    <Drawer onClose={onClose} isOpen={isOpen} size={['sm', 'md']}>
      <DrawerOverlay />
      {state === 0 && (
        <DrawerContent>
          <DrawerHeader borderBottom="0.4px solid #CFCFCF">
            <HStack
              p="0px 20px"
              mt={['10px', '10px', '40px', '40px']}
              justifyContent="space-between"
            >
              <Box position="relative" >
              <Img
                cursor="pointer"
                src="/assets/icons/cart_icon.svg"
                alt="cart icon"
                width="30px"
              />
              {cart.length > 0 && (
                <Badge
                  position="absolute"
                  borderRadius="50%"
                  w="15px"
                  h="15px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  bg="brand.purple.500"
                  color="white"
                  bottom="-4px"
                  fontWeight="400"
                  right="0"
                >
                  {cart.length}
                </Badge>
              )}
            </Box>
              <DrawerCloseButton
                top={['25px', '25px', '50px', '50px']}
                right="20px"
                fontSize="18px"
                variant="ghost"
              />
            </HStack>
          </DrawerHeader>
          <DrawerBody>
            <Text
              as="p"
              fontSize="18px"
              fontWeight="400"
              fontFamily="Proxima Nova"
              mt="60px"
              textAlign="center"
              color="#414141"
            >
              You have no item in your bag.
            </Text>
          </DrawerBody>
          <DrawerFooter padding="40px 20px" borderTop="0.4px solid #CFCFCF">
            <Button
              w="full"
              bg="#FAFAFA"
              rounded="sm"
              border="1px solid #EFEFEF"
              color="#414141"
              fontFamily="Proxima Nova"
              fontWeight="600"
              fontSize="18px"
              as={Link}
              href="/market-place/collections"
            >
              Continue Shopping
            </Button>
          </DrawerFooter>
        </DrawerContent>
      )}
      {state === 1 && (
        <DrawerContent>
          <DrawerHeader borderBottom="0.4px solid #CFCFCF">
            <HStack
              p="0px 20px"
              mt={['10px', '10px', '40px', '40px']}
              justifyContent="space-between"
            >
             <Box position="relative">
              <Img
                cursor="pointer"
                src="/assets/icons/cart_icon.svg"
                alt="cart icon"
                width="30px"
              />
              {cart.length > 0 && (
                <Badge
                  position="absolute"
                  borderRadius="50%"
                  cursor="pointer"
                  w="15px"
                  h="15px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  bg="brand.purple.500"
                  color="white"
                  bottom="-4px"
                  fontWeight="400"
                  right="0"
                >
                  {cart.length}
                </Badge>
              )}
            </Box>
              <DrawerCloseButton
                top={['25px', '25px', '50px', '50px']}
                right="20px"
                fontSize="18px"
                variant="ghost"
              />
            </HStack>
          </DrawerHeader>
          <DrawerBody>
            <VStack w="full" h="full" justifyContent="space-between">
              <VStack w="full" mt="10px">
                {cart?.map((item, i) => {
                  return (
                    <HStack w="full" key={i} justifyContent="space-between">
                      <HStack>
                        <Img
                          src={item.imgUrl}
                          w="70px"
                          h="60px"
                          objectFit="contain"
                          objectPosition="center"
                          padding="10px"
                          rounded="6px"
                          border="0.7px solid #CFCFCF"
                        />{' '}
                        <VStack spacing={0} alignItems="flex-start">
                          <Text
                            as="span"
                            fontFamily="Proxima Nova"
                            fontSize="15px"
                            fontWeight="600"
                            color="#414141"
                          >
                            {item.title}
                          </Text>
                          <Text
                            as="span"
                            fontFamily="Proxima Nova"
                            fontSize="14px"
                            fontWeight="400"
                            color="#414141"
                          >
                            {item.price}
                          </Text>
                        </VStack>
                      </HStack>

                      <HStack>
                        <HStack>
                          <RiArrowLeftSFill
                            size="25px"
                            cursor="pointer"
                            color="#CFCFCF"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                          />
                          <Text as="span" color="#414141">
                            {item.quantity}
                          </Text>
                          <RiArrowRightSFill
                            size="25px"
                            cursor="pointer"
                            color="#CFCFCF"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          />
                        </HStack>
                        <RiDeleteBin6Line
                          size="20px"
                          cursor="pointer"
                          color="#414141"
                          onClick={() => removeFromCart(item.id)}
                        />
                      </HStack>
                    </HStack>
                  )
                })}
              </VStack>
              <HStack w="full" justifyContent="space-between">
                <Text as="h2">Subtotal ({cart.length} items)</Text>
                <Text as="h2">
                  ₦ {calculateTotalPrice(cart).toLocaleString()}
                </Text>
              </HStack>
            </VStack>
          </DrawerBody>
          <DrawerFooter padding="40px 20px" borderTop="0.4px solid #CFCFCF">
            <VStack w="full">
              <Button
                w="full"
                rounded="sm"
                fontFamily="Proxima Nova"
                fontWeight="600"
                fontSize="18px"
                onClick={() => setState(2)}
              >
                Checkout
              </Button>
              <Button
                w="full"
                bg="#FAFAFA"
                rounded="sm"
                border="1px solid #EFEFEF"
                color="#414141"
                fontFamily="Proxima Nova"
                fontWeight="600"
                fontSize="18px"
                as={Link}
                href="/market-place/collections"
              >
                Continue Shopping
              </Button>
            </VStack>
          </DrawerFooter>
        </DrawerContent>
      )}

      {state === 2 && (
        <DrawerContent>
          <DrawerHeader borderBottom="0.4px solid #CFCFCF">
            <HStack mt="10px" justifyContent="space-between">
              <VStack alignItems="flex-start" spacing={0}>
                <Text as="h1">
                  {cart.length === 1
                    ? cart[0].title
                    : cart.length - 1 === 1
                    ? `${cart[0].title} and ${cart.length - 1} other`
                    : `${cart[0].title} and ${cart.length - 1} others`}
                </Text>
                <Breadcrumb
                  spacing="8px"
                  separator={<BiChevronRight color="gray.500" />}
                >
                  <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink
                      fontWeight="400"
                      fontSize="15px"
                      fontFamily="Proxima Nova"
                      color="#414141"
                      href="#"
                    >
                      Shipping
                    </BreadcrumbLink>
                  </BreadcrumbItem>

                  <BreadcrumbItem>
                    <BreadcrumbLink
                      isCurrentPage
                      fontWeight="400"
                      fontSize="15px"
                      fontFamily="Proxima Nova"
                      color="#CFCFCF"
                      href="#"
                    >
                      Payment
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </Breadcrumb>
              </VStack>
              <DrawerCloseButton
                top="25px"
                right="20px"
                fontSize="18px"
                variant="ghost"
              />
            </HStack>
          </DrawerHeader>
          <DrawerBody>
            <Box
              as="form"
              w="full"
              h="full"
              onSubmit={(e: any) => {
                e.preventDefault()
                setState(3)
              }}
            >
              <VStack w="full" h="full" justifyContent="space-between">
                <VStack w="full">
                  <FormControl isRequired mt="20px">
                    <FormLabel
                      fontSize="15px"
                      fontWeight="600"
                      fontFamily="Proxima Nova"
                      color="#414141"
                    >
                      Delivery address
                    </FormLabel>
                    <Input
                      focusBorderColor="brand.purple.500"
                      type="text"
                      placeholder="Full Address"
                      name="shipping.address"
                      value={form.shipping?.address}
                      onChange={handleChange}
                      required
                    />
                    <HStack my="10px" w="full">
                      <Input
                        focusBorderColor="brand.purple.500"
                        type="text"
                        placeholder="City"
                        name="shipping.city"
                        value={form.shipping?.city}
                        onChange={handleChange}
                        required
                      />
                      <Select
                        focusBorderColor="brand.purple.500"
                        placeholder="State"
                        name="shipping.state"
                        value={form.shipping?.state}
                        onChange={handleChange}
                        required
                      >
                        <option value="Lagos">Lagos</option>
                        <option value="Abuja">Abuja</option>
                        <option value="Ibadan">Ibadan</option>
                      </Select>
                    </HStack>
                    <Select
                      w="full"
                      focusBorderColor="brand.purple.500"
                      defaultValue={form.shipping?.country}
                      name="shipping.country"
                      onChange={handleChange}
                      required
                    >
                      <option value="Nigeria">Nigeria</option>
                    </Select>
                  </FormControl>
                  <FormControl mt="20px">
                    <FormLabel
                      fontSize="15px"
                      fontWeight="600"
                      fontFamily="Proxima Nova"
                      color="#414141"
                    >
                      Delivery Note
                    </FormLabel>
                    <Input
                      focusBorderColor="brand.purple.500"
                      type="text"
                      placeholder="Optional"
                      name="shipping.delivery_note"
                      value={form.shipping?.delivery_note}
                      onChange={handleChange}
                    />
                  </FormControl>
                  <FormControl isRequired mt="20px">
                    <FormLabel
                      fontSize="15px"
                      fontWeight="600"
                      fontFamily="Proxima Nova"
                      color="#414141"
                    >
                      Shipping Region
                    </FormLabel>
                    <Select
                      focusBorderColor="brand.purple.500"
                      placeholder="Select region"
                      required
                      name="shipping.shipping_region"
                      value={form.shipping?.shipping_region}
                      onChange={handleChange}
                    >
                      <option value="Lagos">Lagos</option>
                      <option value="Abuja">Abuja</option>
                      <option value="Ibadan">Ibadan</option>
                    </Select>
                    <FormHelperText
                      mt="30px"
                      fontSize="15px"
                      fontWeight="400"
                      fontFamily="Proxima Nova"
                      color="#414141"
                      textAlign="center"
                    >
                      Delivery takes 72 hours after payment has been made to
                      this region.
                    </FormHelperText>
                  </FormControl>
                </VStack>
                <VStack w="full">
                  <Button
                    w="full"
                    rounded="sm"
                    fontFamily="Proxima Nova"
                    fontWeight="600"
                    fontSize="18px"
                    type="submit"
                  >
                    Continue to payment
                  </Button>
                  <Button
                    w="full"
                    bg="#FAFAFA"
                    rounded="sm"
                    border="1px solid #EFEFEF"
                    color="#414141"
                    fontFamily="Proxima Nova"
                    fontWeight="600"
                    fontSize="18px"
                    onClick={() => setState(1)}
                  >
                    Back
                  </Button>
                </VStack>
              </VStack>
            </Box>
          </DrawerBody>
          <DrawerFooter
            padding="20px"
            borderTop="0.4px solid #CFCFCF"
          ></DrawerFooter>
        </DrawerContent>
      )}

      {state === 3 && (
        <DrawerContent>
          <DrawerHeader borderBottom="0.4px solid #CFCFCF">
            <HStack mt="10px" justifyContent="space-between">
              <VStack alignItems="flex-start" spacing={0}>
                <Text as="h1">
                  {cart.length === 1
                    ? cart[0].title
                    : cart.length - 1 === 1
                    ? `${cart[0].title} and ${cart.length - 1} other`
                    : `${cart[0].title} and ${cart.length - 1} others`}
                </Text>
                <Breadcrumb
                  spacing="8px"
                  separator={<BiChevronRight color="gray.500" />}
                >
                  <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink
                      fontWeight="400"
                      fontSize="15px"
                      fontFamily="Proxima Nova"
                      color="#CFCFCF"
                      href="#"
                    >
                      Shipping
                    </BreadcrumbLink>
                  </BreadcrumbItem>

                  <BreadcrumbItem>
                    <BreadcrumbLink
                      isCurrentPage
                      fontWeight="400"
                      fontSize="15px"
                      fontFamily="Proxima Nova"
                      color="#414141"
                      href="#"
                    >
                      Payment
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </Breadcrumb>
              </VStack>
              <DrawerCloseButton
                top="25px"
                right="20px"
                fontSize="18px"
                variant="ghost"
              />
            </HStack>
          </DrawerHeader>
          <DrawerBody>
            <Box
              as="form"
              w="full"
              h="full"
              onSubmit={(e: any) => {
                e.preventDefault()
                setState(4)
              }}
            >
              <VStack w="full" h="full" justifyContent="space-between">
                <VStack w="full">
                  <FormControl isRequired mt="20px">
                    <FormLabel
                      fontSize="15px"
                      fontWeight="600"
                      fontFamily="Proxima Nova"
                      color="#414141"
                    >
                      Full name
                    </FormLabel>

                    <HStack my="10px" w="full">
                      <Input
                        focusBorderColor="brand.purple.500"
                        type="text"
                        placeholder="First name"
                        name="payment.first_name"
                        value={form.payment?.first_name}
                        onChange={handleChange}
                        required
                      />
                      <Input
                        focusBorderColor="brand.purple.500"
                        type="text"
                        placeholder="Last name"
                        name="payment.last_name"
                        value={form.payment?.last_name}
                        onChange={handleChange}
                        required
                      />
                    </HStack>
                  </FormControl>
                  <FormControl isRequired mt="10px">
                    <FormLabel
                      fontSize="15px"
                      fontWeight="600"
                      fontFamily="Proxima Nova"
                      color="#414141"
                    >
                      Email address
                    </FormLabel>
                    <Input
                      focusBorderColor="brand.purple.500"
                      type="email"
                      required
                      placeholder="you@example.com"
                      name="payment.email"
                      value={form.payment?.email}
                      onChange={handleChange}
                    />
                  </FormControl>
                  <FormControl isRequired mt="10px">
                    <FormLabel
                      fontSize="15px"
                      fontWeight="600"
                      fontFamily="Proxima Nova"
                      color="#414141"
                    >
                      Phone Number
                    </FormLabel>
                    <HStack w="full">
                      <Input
                        w="30%"
                        focusBorderColor="brand.purple.500"
                        type="number"
                        value={+234}
                        readOnly
                        required
                      />
                      <Input
                        w="70%"
                        focusBorderColor="brand.purple.500"
                        type="number"
                        name="payment.phone"
                        value={form.payment?.phone}
                        onChange={handleChange}
                        required
                      />
                    </HStack>
                  </FormControl>
                </VStack>
                <VStack w="full">
                  <VStack w="full">
                    <HStack w="full" justifyContent="space-between">
                      <Text as="h2">Subtotal ({cart.length} items)</Text>
                      <Text as="h2">
                        ₦ {calculateTotalPrice(cart).toLocaleString()}
                      </Text>
                    </HStack>
                    <HStack w="full" justifyContent="space-between">
                      <Text as="h2">Shipping fee </Text>
                      <Text as="h2">₦ {deliveryFee.toLocaleString()}</Text>
                    </HStack>
                  </VStack>
                  <VStack w="full" py="20px" borderTop="0.4px solid #CFCFCF">
                    <Button
                      w="full"
                      rounded="sm"
                      fontFamily="Proxima Nova"
                      fontWeight="600"
                      fontSize="18px"
                      type="submit"
                    >
                      Review and pay
                    </Button>
                    <Button
                      w="full"
                      bg="#FAFAFA"
                      rounded="sm"
                      border="1px solid #EFEFEF"
                      color="#414141"
                      fontFamily="Proxima Nova"
                      fontWeight="600"
                      fontSize="18px"
                      onClick={() => setState(2)}
                    >
                      Back
                    </Button>
                  </VStack>
                </VStack>
              </VStack>
            </Box>
          </DrawerBody>
        </DrawerContent>
      )}
      {state === 4 && (
        <DrawerContent>
          <DrawerHeader borderBottom="0.4px solid #CFCFCF">
            <HStack
              p="0px 10px"
              mt="20px"
              alignItems="center"
              justifyContent="space-between"
            >
              <Text as="h2">Order Information</Text>
              <DrawerCloseButton
                top="31px"
                right="10px"
                fontSize="15px"
                variant="ghost"
              />
            </HStack>
          </DrawerHeader>
          <DrawerBody>
            <VStack alignItems="flex-start">
              <Text
                as="p"
                fontSize="18px"
                fontWeight="600"
                fontFamily="Proxima Nova"
                mt="20px"
                color="#414141"
              >
                Contact Information
              </Text>
              <Text
                as="p"
                fontSize="15px"
                fontWeight="400"
                fontFamily="Proxima Nova"
                textAlign="center"
                color="#414141"
              >
                {form.payment?.first_name} {form.payment?.last_name}
              </Text>
              <Text
                as="p"
                fontSize="15px"
                fontWeight="400"
                fontFamily="Proxima Nova"
                color="#414141"
              >
                {form.payment?.email}
              </Text>
              <Text
                as="p"
                fontSize="15px"
                fontWeight="400"
                fontFamily="Proxima Nova"
                color="#414141"
              >
                +234{form.payment?.phone}
              </Text>
            </VStack>
            <VStack alignItems="flex-start">
              <Text
                as="p"
                fontSize="18px"
                fontWeight="400"
                fontFamily="Proxima Nova"
                mt="40px"
                color="#414141"
              >
                Delivery Address
              </Text>
              <Text
                as="p"
                fontSize="15px"
                fontWeight="400"
                fontFamily="Proxima Nova"
                color="#414141"
                maxWidth="250px"
              >
                {form.shipping?.address}
              </Text>
            </VStack>
            <VStack mt="40px" pt="20px" borderTop="0.4px solid #CFCFCF">
              {cart?.map((item, i) => {
                return (
                  <HStack key={i} w="full" justifyContent="space-between">
                    <Text as="h2">
                      {item.title} x{item.quantity}
                    </Text>
                    <Text as="h2">₦ {item.price}</Text>
                  </HStack>
                )
              })}

              <HStack mt="10px" w="full" justifyContent="space-between">
                <Text as="span" color="#414141">
                  Shipping fee
                </Text>
                <Text as="span" color="#414141">
                  ₦ {deliveryFee.toLocaleString()}
                </Text>
              </HStack>
              <HStack w="full" mt="10px" justifyContent="space-between">
                <Text as="h2">Total</Text>
                <Text as="h2">
                  ₦ {(calculateTotalPrice(cart) + deliveryFee).toLocaleString()}
                </Text>
              </HStack>
            </VStack>
          </DrawerBody>
          <DrawerFooter pb="20px" borderTop="0.4px solid #CFCFCF">
            <VStack w="full">
              <FormControl>
                <FormHelperText
                  my="10px"
                  fontSize="15px"
                  fontWeight="400"
                  fontFamily="Proxima Nova"
                  color="#414141"
                  textAlign="center"
                >
                  Delivery takes 72 hours after payment has been made to this
                  region.
                </FormHelperText>
              </FormControl>
              <PaystackPaymentButton
                email={form.payment.email}
                amount={calculateTotalPrice(cart) + deliveryFee}
                setCart={setCart}
                cart={cart}
                form={form}
                setState={setState}
              />

              <Button
                w="full"
                bg="#FAFAFA"
                rounded="sm"
                border="1px solid #EFEFEF"
                color="#414141"
                fontFamily="Proxima Nova"
                fontWeight="600"
                fontSize="18px"
                onClick={() => setState(3)}
              >
                Back
              </Button>
            </VStack>
          </DrawerFooter>
        </DrawerContent>
      )}
      {state === 5 && (
        <DrawerContent>
          <DrawerHeader>
            <DrawerCloseButton
              top="10px"
              right="10px"
              fontSize="15px"
              variant="ghost"
            />
          </DrawerHeader>
          <DrawerBody
            pb="30px"
            as={Stack}
            justifyContent="center"
            alignItems="center"
          >
            <Img src="/assets/icons/success_cart.svg" alt="success" />
            <Text
              as="h1"
              fontSize={['20px', '25px']}
              fontWeight="600"
              color="#414141"
              fontFamily="Proxima Nova"
            >
              Payment Successful
            </Text>
            <Text
              maxW="350px"
              fontSize={['15px', '18px']}
              fontWeight="400"
              color="#414141"
              fontFamily="Proxima Nova"
              as="p"
              textAlign="center"
            >
              Thank you for joinng the perxels heroes. Delivery takes{' '}
              <Text as="span" fontWeight="600">
                72 hours
              </Text>{' '}
              to your region{' '}
            </Text>
            <Text
              mt="20px"
              color="brand.purple.500"
              fontWeight="600"
              fontFamily="Proxima Nova"
              as="span"
              maxW="350px"
              textAlign="center"
            >
              A copy of the recipt has been sent to your mail!
            </Text>
          </DrawerBody>
          <DrawerFooter></DrawerFooter>
        </DrawerContent>
      )}
    </Drawer>
  )
}
