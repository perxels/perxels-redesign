export interface portalInt {
    title: string;
    description: string;
    image: string;
    link: string;
    borderColor: string;
    textColor: string;
    buttonColor: string;
    buttText: string
}

export const PortalContent: portalInt[] = [
    {   
        image: '/assets/icons/portalIcon1.svg',
        title: "Online Class",
        description: "Get Onboarded as an online student into Perxels Design School",
        link: 'https://forms.gle/RVGVcr6deHoUFeYRA',
        borderColor: '#D5CDFF',
        textColor: '#D5CDFF',
        buttonColor: '#34296B',
        buttText: "Get Onboarded"
    },
    {   
        image: '/assets/icons/portalIcon2.svg',
        title: "Physical Class",
        description: "Get Onboarded as an online student into Perxels Design School",
        link: 'https://forms.gle/AX2WinUKRxmymGeL7',
        borderColor: '#FEF3AE',
        textColor: '#FEF3AE',
        buttonColor: '#F3D400',
        buttText: "Get Onboarded"
    },
    {   
        image: '/assets/icons/portalIcon3.svg',
        title: "Pay Balance",
        description: "Select this action when you want to pay the balance of your school fee",
        link: 'https://forms.gle/sXuRH2kgsaifcwhb8',
        borderColor: '#FF9CAE',
        textColor: '#FFCED7',
        buttonColor: '#FF9CAE',
        buttText: "Pay your balance"
    },
]