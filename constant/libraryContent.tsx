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
    tag: 'AMA Session',
    mainTitle: 'The ABC of UI/UX Design',
    subTitle: 'Elvis ObI',
    role: 'Lead product designer, E - Margination Studios Limited',
    url:'/assets/files/THE_ABC_OF_UIUX_DESIGN.pdf'
  },
  {
    bannerImage: '/assets/images/library/mini_banner_2.png',
    tag: 'AMA Session',
    mainTitle: 'The Best UIUX Design School In Nigeria',
    subTitle: 'Elvis ObI',
    role: 'Lead product designer, E - Margination Studios Limited',
    url:'/assets/files/THE_BEST_UIUX _DESIGN_SCHOOL_IN_NIGERIA.pdf'
  },
  {
    bannerImage: '/assets/images/library/mini_banner_3.png',
    tag: 'AMA Session',
    mainTitle: '5 Things To Know Before Transitioning Into UIUX Design',
    subTitle: 'Elvis ObI',
    role: 'Lead product designer, E - Margination Studios Limited',
    url:'/assets/files/THINGS_YOU_MUST_KNOW_BEFORE_YOU_TRANSITION_INTO_UIUX_DESIGN.pdf'
  },
  {
    bannerImage: '/assets/images/library/mini_banner_4.png',
    tag: 'AMA Session',
    mainTitle: 'The Ultimate Figma Interface Handbook',
    subTitle: 'Elvis ObI',
    role: 'Lead product designer, E - Margination Studios Limited',
    url:'/assets/files/THE_ULTIMATE_FIGMA_INTERFACE_HANDBOOK.pdf'
  },
  {
    bannerImage: '/assets/images/library/mini_banner_5.png',
    tag: 'AMA Session',
    mainTitle: 'UIUX Design Resume Template',
    subTitle: 'Elvis ObI',
    role: 'Lead product designer, E - Margination Studios Limited',
    url:'/assets/files/THE_ABC_OF_UIUX_DESIGN.pdf'
  },
]
