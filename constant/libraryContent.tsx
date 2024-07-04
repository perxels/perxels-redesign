export interface libraryCardContentProps {
  bannerImage?: string
  url?: string
  tag: string
  mainTitle: string
  subTitle: string
  role: string
  data?: string[][] | null
}

export const libraryCardContent: libraryCardContentProps[] = [
  {
    bannerImage: '/assets/images/library/mini_banner_1.png',
    tag: 'E-Book',
    mainTitle: 'The ABC of UI/UX Design',
    subTitle: '',
    role: 'Learn the essentials of User Interface and User Experience Design with this ebook. Recomended for beginners!',
    url: '/assets/files/THE_ABC_OF_UIUX_DESIGN.pdf',
  },
  {
    bannerImage: '/assets/images/library/mini_banner_2.png',
    tag: 'E-Book',
    mainTitle: 'The Best UIUX Design School In Nigeria',
    subTitle: '',
    role: 'Learn about the best UIUX Design school currently in Nigeria. Unlock your potential!',
    url: '/assets/files/THE_BEST_UIUX _DESIGN_SCHOOL_IN_NIGERIA.pdf',
  },
  {
    bannerImage: '/assets/images/library/mini_banner_3.png',
    tag: 'E-Book',
    mainTitle: '5 Things To Know Before Transitioning Into UIUX Design',
    subTitle: '',
    role: "Transition smoothly with '5 Things You Must Know Before UIUX Design' – essential insights for aspiring designers",
    url: '/assets/files/THINGS_YOU_MUST_KNOW_BEFORE_YOU_TRANSITION_INTO_UIUX_DESIGN.pdf',
  },
  {
    bannerImage: '/assets/images/library/mini_banner_4.png',
    tag: 'E-Book',
    mainTitle: 'The Ultimate Figma Interface Handbook',
    subTitle: '',
    role: "Get Familiar with the Interface of Figma' – your guide to navigating design with ease",
    url: '/assets/files/THE_ULTIMATE_FIGMA_INTERFACE_HANDBOOK.pdf',
  },
  {
    bannerImage: '/assets/images/library/mini_banner_5.png',
    tag: 'E-Book',
    mainTitle: 'UIUX Design Resume Template',
    subTitle: '',
    role: '',
    url: '/assets/files/THE_ABC_OF_UIUX_DESIGN.pdf',
  },
]
