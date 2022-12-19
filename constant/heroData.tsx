export interface HeroDataProps {
  title: string
  content: string
  image: string
  color: string
}

export const heroData: HeroDataProps[] = [
  {
    title: 'In-depth training and mentorship.',
    content:
      'With experienced designers who will not only teach you practically, but would also mentor you through.',
    image: '/assets/icons/chart.svg',
    color: 'brand.purple.100',
  },
  {
    title: 'Internship placement.',
    content:
      'At the end of the training you would be placed into an internship program where you get to use your design skills in a product team**',
    image: '/assets/icons/dekstop.svg',
    color: 'brand.yellow.100',
  },
  {
    title: 'Supportive design community.',
    content:
      'A fun & interactive community of designers from all over the world who are committed to helping each other grow.',
    image: '/assets/icons/flame.svg',
    color: 'brand.pink.100',
  },
]
