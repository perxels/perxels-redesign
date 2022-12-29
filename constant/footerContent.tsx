import { AiFillInstagram } from 'react-icons/ai';
import { FaFacebookF, FaLinkedin, FaTwitter, FaWhatsapp } from 'react-icons/fa';
interface FooterSocialLink {
    name: string;
    url: string;
    icon: React.ElementType;
}

export const FooterSocialLinks: FooterSocialLink[] = [
    {
        name: 'Twitter',
        url: 'https://www.twitter.com/',
        icon: FaTwitter,
    },
    {
        name: 'Instagram',
        url: 'https://www.instagram.com/',
        icon: AiFillInstagram,
    },
    {
        name: 'LinkedIn',
        url: 'https://www.linkedin.com/',
        icon: FaLinkedin,
    },
    {
        name: 'Facebook',
        url: 'https://www.facebook.com/',
        icon: FaFacebookF,
    }
];

export const links = [
    {
        title: 'Services',
        links: [
            {
                name: 'Testimonies',
                url: '#',
            },
            {
                name: 'Student Works',
                url: '#',
            },
            {
                name: 'Events',
                url: '#',
            },
            {
                name: 'Hire',
                url: '#',
            },
            {
                name: 'Be a Partner',
                url: '#',
            }
        ],
    },
    {
        title: 'Class Plans',
        links: [
            {
                name: 'Basic Class',
                url: '#',
            },
            {
                name: 'Advanced Class',
                url: '#',
            },
            {
                name: 'Premium Class',
                url: '#',
            },
            {
                name: 'International',
                url: '#',
            },
            {
                name: 'Community',
                url: '#',
            }
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
                name: '+234 801 234 5678',
                url: 'tel:+234 801 234 5678',
            }
        ],
    }
]