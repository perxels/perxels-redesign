export interface MarketPlaceProductsProps {
  id: number
  title: string
  price: string
  price_th: number
  desc: string
  colors: string[]
  size: number[]
  imgUrl: string
  hoverImage: string
}

export const deliveryFee = 2000
export const productScriptUrl =
  'https://script.google.com/macros/s/AKfycbx9DjAuNLrQ2G8wcxLlh70j9gv7JJ3jSu5OGMc2UwJxfSyGpr0y6Tb_fEBrfWHT0T7H/exec'
export const paystackKey = 'pk_test_ccd9d31670a4e4be4917412334639e338067d4be'

export const marketPlaceProducts: MarketPlaceProductsProps[] = [
  {
    id: 1,
    title: 'Perxels Shirt',
    price: '5,000',
    price_th: 5000,
    desc: 'Introducing our range of stylish and comfortable face caps, perfect for any occasion! Made from high-quality materials, our face caps are designed to provide excellent sun protection and keep you cool and comfortable throughout the day.',
    colors: ['black', '#9966CC', '#3A86FF', '#FFBE0B', '#656D4A'],
    size: [10, 20, 32],
    imgUrl: '/assets/images/market-place/shirt.png',
    hoverImage: '/assets/images/market-place/facecap_hover.png',
  },
  {
    id: 2,
    title: 'Perxels Shirt',
    price: '5,000',
    price_th: 5000,
    desc: 'Introducing our range of stylish and comfortable face caps, perfect for any occasion! Made from high-quality materials, our face caps are designed to provide excellent sun protection and keep you cool and comfortable throughout the day.',
    colors: ['black', '#9966CC', '#3A86FF', '#FFBE0B', '#656D4A'],
    size: [10, 20, 32],
    imgUrl: '/assets/images/market-place/shirt.png',
    hoverImage: '/assets/images/market-place/facecap_hover.png',
  },
  {
    id: 3,
    title: 'Perxels Face Cap',
    price: '5,000',
    price_th: 5000,
    desc: 'Introducing our range of stylish and comfortable face caps, perfect for any occasion! Made from high-quality materials, our face caps are designed to provide excellent sun protection and keep you cool and comfortable throughout the day.',
    colors: ['black', '#9966CC', '#3A86FF', '#FFBE0B', '#656D4A'],
    size: [10, 20, 32],
    imgUrl: '/assets/images/market-place/facecap.png',
    hoverImage: '/assets/images/market-place/facecap_hover.png',
  },
  {
    id: 4,
    title: 'Perxels Face Cap',
    price: '5,000',
    price_th: 5000,
    desc: 'Introducing our range of stylish and comfortable face caps, perfect for any occasion! Made from high-quality materials, our face caps are designed to provide excellent sun protection and keep you cool and comfortable throughout the day.',
    colors: ['black', '#9966CC', '#3A86FF', '#FFBE0B', '#656D4A'],
    size: [10, 20, 32],
    imgUrl: '/assets/images/market-place/facecap.png',
    hoverImage: '/assets/images/market-place/facecap_hover.png',
  },
  {
    id: 5,
    title: 'Perxels Face Cap',
    price: '5,000',
    price_th: 5000,
    desc: 'Introducing our range of stylish and comfortable face caps, perfect for any occasion! Made from high-quality materials, our face caps are designed to provide excellent sun protection and keep you cool and comfortable throughout the day.',
    colors: ['black', '#9966CC', '#3A86FF', '#FFBE0B', '#656D4A'],
    size: [10, 20, 32],
    imgUrl: '/assets/images/market-place/facecap.png',
    hoverImage: '/assets/images/market-place/facecap_hover.png',
  },
  {
    id: 6,
    title: 'Perxels Face Cap',
    price: '5,000',
    price_th: 5000,
    desc: 'Introducing our range of stylish and comfortable face caps, perfect for any occasion! Made from high-quality materials, our face caps are designed to provide excellent sun protection and keep you cool and comfortable throughout the day.',
    colors: ['black', '#9966CC', '#3A86FF', '#FFBE0B', '#656D4A'],
    size: [10, 20, 32],
    imgUrl: '/assets/images/market-place/facecap.png',
    hoverImage: '/assets/images/market-place/facecap_hover.png',
  },
]
