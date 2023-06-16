import { AiFillInstagram } from 'react-icons/ai'
import {
  FaFacebookF,
  FaLinkedin,
  FaTwitter,
  FaWhatsapp,
  FaYoutube,
} from 'react-icons/fa'
interface FooterSocialLink {
  name: string
  url: string
  icon: React.ElementType
}

export const FooterSocialLinks: FooterSocialLink[] = [
  {
    name: 'Twitter',
    url: 'https://twitter.com/perxels',
    icon: FaTwitter,
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/perxels/',
    icon: AiFillInstagram,
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/company/perxels/',
    icon: FaLinkedin,
  },
  {
    name: 'Youtube',
    url: 'https://www.youtube.com/channel/UCmcEhILeheJi6s_nEqrIF_Q',
    icon: FaYoutube,
  },
]

export const links = [
  {
    title: 'Services',
    links: [
      {
        name: 'Testimonials',
        url: '/testimonials',
      },
      {
        name: 'Student Projects',
        url: '/studentprojects',
      },
      {
        name: 'Events',
        url: '/event',
      },
      {
        name: 'Hire',
        url: '/hire',
      },
      {
        name: 'Be a Partner',
        url: '/partners',
      },
    ],
  },
  {
    title: 'Class Plans',
    links: [
      {
        name: 'Basic Class',
        url: '/enrol#basic-class',
      },
      {
        name: 'Advanced Class',
        url: '/enrol#advanced-class',
      },
      {
        name: 'Premium Class',
        url: '/enrol#premium-class',
      },
      {
        name: 'Private Class',
        url: '/private',
      },
      {
        name: 'International Class',
        url: '/international',
      },
      {
        name: 'Community',
        url: 'https://chat.whatsapp.com/E6mQm7lHo412WAOOMP0Bwt',
      },
    ],
  },
  {
    title: 'Contact Us',
    links: [
      {
        name: 'perxels@gmail.com',
        url: 'mailto:perxels@gmail.com',
      },
      {
        name: '+2348135369680',
        url: 'tel:+2348135369680',
      },
    ],
  },
]
