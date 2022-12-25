export interface hireCardContentProps {
  bg?: string
  title?: string
  description?: string
  icon?: string
  w?: string[]
  r?: string
}

export const hireCardContent: hireCardContentProps[] = [
  {
    title: 'UIUX Designers',
    description:
      'We have trained some of the best UIUX designers on the African continent, you can hire our trained designers with confidence.',
    icon: '/assets/images/hire/pencil.svg',
    bg: 'brand.purple.500',
  },
  {
    title: 'Software Developers',
    description:
      'In partnership with Schfordevs, a software development training school which is in our ecosystem, you can get vetted developers from here.',
    icon: '/assets/images/hire/cable.svg',
    bg: 'brand.yellow.500',
    w: ['300px', '300px', '300px', '350.37px'],
    r: '-1rem',
  },
  {
    title: 'Product Managers.',
    description:
      'Getting skilled product managers can’t be more easy with Enoverlab, a training institute also in our ecosystem.',
    icon: '/assets/images/hire/traffic.svg',
    bg: 'brand.pink.700',
    w: ['100px', '100px', '100px', '123.12px'],
    r: '2rem',
  },
]
