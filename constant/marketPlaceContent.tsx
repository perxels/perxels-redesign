export interface MarketPlaceContent {
  id: number
  title: string
  price: string
  imgUrl: string
  link: string
}
export interface MarketPlaceProducts {
  id: number
  title: string
  price: string
  price_th: number
  desc: string
  colors: string[]
  size: string[]
  imgUrl: string
  hoverImage: string
}

export const marketPlaceContent: MarketPlaceContent[] = [
  {
    id: 1,
    title: 'Perxels pure cutton T-Shirt - Colour Purple',
    price: '₦3,000',
    imgUrl: '/assets/images/market-place/female-tshirt.jpg',
    link: '#',
  },
  {
    id: 2,
    title: 'Perxels pure cutton Hoodie - Colour Purple',
    price: '₦6,000',
    imgUrl: '/assets/images/market-place/hoodie-purple.jpg',
    link: '#',
  },
  {
    id: 3,
    title: 'Perxels pure cutton Hoodie - Colour Black',
    price: '₦10,000',
    imgUrl: '/assets/images/market-place/hoodie-black.jpg',
    link: '#',
  },
  {
    id: 4,
    title: 'Perxels pure cutton Tote Bag - Colour Purple',
    price: '₦3,000',
    imgUrl: '/assets/images/market-place/cutton-tote.jpg',
    link: '#',
  },
  {
    id: 5,
    title: 'Perxels pure cutton Hoodie - Colour Black',
    price: '₦10,000',
    imgUrl: '/assets/images/market-place/hoodie-black.jpg',
    link: '#',
  },
  {
    id: 6,
    title: 'Perxels pure cutton Hoodie - Colour Purple',
    price: '₦6,000',
    imgUrl: '/assets/images/market-place/hoodie-purple.jpg',
    link: '#',
  },
  {
    id: 7,
    title: 'Perxels pure cutton T-Shirt - Colour Purple',
    price: '₦3,000',
    imgUrl: '/assets/images/market-place/female-tshirt.jpg',
    link: '#',
  },
  {
    id: 8,
    title: 'Perxels pure cutton Hoodie - Colour Purple',
    price: '₦6,000',
    imgUrl: '/assets/images/market-place/hoodie-purple.jpg',
    link: '#',
  },
  {
    id: 9,
    title: 'Perxels pure cutton Hoodie - Colour Black',
    price: '₦10,000',
    imgUrl: '/assets/images/market-place/hoodie-black.jpg',
    link: '#',
  },
  {
    id: 10,
    title: 'Perxels pure cutton Tote Bag - Colour Purple',
    price: '₦3,000',
    imgUrl: '/assets/images/market-place/cutton-tote.jpg',
    link: '#',
  },
  {
    id: 11,
    title: 'Perxels pure cutton Hoodie - Colour Black',
    price: '₦10,000',
    imgUrl: '/assets/images/market-place/hoodie-black.jpg',
    link: '#',
  },
  {
    id: 12,
    title: 'Perxels pure cutton Hoodie - Colour Purple',
    price: '₦6,000',
    imgUrl: '/assets/images/market-place/hoodie-purple.jpg',
    link: '#',
  },
]

export const marketPlaceProducts: MarketPlaceProducts[] = [
  {
    id: 1,
    title: 'Perxels Face Cap',
    price: '₦5,000',
    price_th: 5000,
    desc: 'Introducing our range of stylish and comfortable face caps, perfect for any occasion! Made from high-quality materials, our face caps are designed to provide excellent sun protection and keep you cool and comfortable throughout the day.',
    colors: ['black', '#9966CC', '#3A86FF', '#FFBE0B', '#656D4A'],
    size: ['10', '20', '32'],
    imgUrl: '/assets/images/market-place/shirt.png',
    hoverImage: '/assets/images/market-place/facecap_hover.png',
  },
  {
    id: 2,
    title: 'Perxels Face Cap',
    price: '₦5,000',
    price_th: 5000,
    desc: 'Introducing our range of stylish and comfortable face caps, perfect for any occasion! Made from high-quality materials, our face caps are designed to provide excellent sun protection and keep you cool and comfortable throughout the day.',
    colors: ['black', '#9966CC', '#3A86FF', '#FFBE0B', '#656D4A'],
    size: ['10', '20', '32'],
    imgUrl: '/assets/images/market-place/shirt.png',
    hoverImage: '/assets/images/market-place/facecap_hover.png',
  },
  {
    id: 3,
    title: 'Perxels Face Cap',
    price: '₦5,000',
    price_th: 5000,
    desc: 'Introducing our range of stylish and comfortable face caps, perfect for any occasion! Made from high-quality materials, our face caps are designed to provide excellent sun protection and keep you cool and comfortable throughout the day.',
    colors: ['black', '#9966CC', '#3A86FF', '#FFBE0B', '#656D4A'],
    size: ['10', '20', '32'],
    imgUrl: '/assets/images/market-place/facecap.png',
    hoverImage: '/assets/images/market-place/facecap_hover.png',
  },
]
