import { FiInstagram, FiTwitter } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { RiFacebookBoxLine, RiLinkedinBoxLine } from 'react-icons/ri';

interface FooterSocialLink {
    name: string;
    url: string;
    icon: React.ElementType;
}

export const FooterSocialLinks: FooterSocialLink[] = [
    {
        name: 'Twitter',
        url: 'https://www.twitter.com/',
        icon: FiTwitter,
    },
    {
        name: 'Instagram',
        url: 'https://www.instagram.com/',
        icon: FiInstagram,
    },
    {
        name: 'LinkedIn',
        url: 'https://www.linkedin.com/',
        icon: RiLinkedinBoxLine,
    },
    {
        name: 'WhatsApp',
        url: 'https://www.whatsapp.com/',
        icon: FaWhatsapp,
    },
    {
        name: 'Facebook',
        url: 'https://www.facebook.com/',
        icon: RiFacebookBoxLine,
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