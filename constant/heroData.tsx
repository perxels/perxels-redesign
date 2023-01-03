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

export const speakerHeroData: HeroDataProps[] = [
  {
    title: 'Make Impact',
    content:
      'By sharing a bit of your knowledge and experience, you are impacting the lives of many upcoming designers and tech talents',
    image: '/assets/icons/chart.svg',
    color: 'brand.purple.100',
  },
  {
    title: 'Improve industry standard',
    content:
      'Your contribution will help to improve the design industry standard in Nigeria and beyond as young designers would learn what is right early',
    image: '/assets/icons/dekstop.svg',
    color: 'brand.yellow.100',
  },
  {
    title: 'Expand your personal brand',
    content:
      'Being a speaker helps you grow your personal brand beyond your primary network, and this can ultimately help you access opportunities both locally and internationally',
    image: '/assets/icons/flame.svg',
    color: 'brand.pink.100',
  },
]
