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
      {
        name: 'Privacy Policy',
        url: '/policy',
      },
    ],
  },
  {
    title: 'Class Plans',
    links: [
      {
        name: 'Basic Class',
        url: '/online#basic-class',
      },
      {
        name: 'Advanced Class',
        url: '/online#advanced-class',
      },
      {
        name: 'Premium Class',
        url: '/online#premium-class',
      },
      {
        name: 'Private Class',
        url: '/private',
      },
      {
        name: 'Physical Class',
        url: '/physical'
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
        name: "Triangle Mall, Osapa London, Lekki ExpressWay. Lagos",
        url: ''
      },
      {
        name: 'perxels@gmail.com',
        url: 'mailto:perxels@gmail.com',
      },
      {
        name: '+2348135369680',
        url: 'tel:+2348135369680',
      },
      {
        name: 'Accreditation',
        url: 'https://www.actd.us/perxels/',
      },
     
    ],
  },
]
