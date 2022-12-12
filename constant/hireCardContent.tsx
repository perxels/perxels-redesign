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
    title: 'Designer Team',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. At adipiscing proin facilisis nulla ut suspendisse sit tempor.',
    icon: '/assets/images/hire/pencil.svg',
    bg: 'brand.purple.500',
  },
  {
    title: 'Development Team',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. At adipiscing proin facilisis nulla ut suspendisse sit tempor.',
    icon: '/assets/images/hire/cable.svg',
    bg: 'brand.yellow.500',
    w: ['300px', '300px', '300px', '350.37px'],
    r: '-1rem',
  },
  {
    title: 'Product Management Team',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. At adipiscing proin facilisis nulla ut suspendisse sit tempor.',
    icon: '/assets/images/hire/traffic.svg',
    bg: 'brand.pink.500',
    w: ['100px', '100px', '100px', '123.12px'],
    r: '2rem',
  },
]
