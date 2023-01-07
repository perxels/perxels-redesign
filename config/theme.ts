import { extendTheme } from '@chakra-ui/react'

import { colors } from './color'
import { Button } from './components/Button'

export const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'brand.white',
        color: 'brand.purple.500',
        fontSize: '1rem',
      },
      a: {
        color: 'brand.purple.500',
      },
      button: {
        _focus: {
          outline: 'none',
        },
      },
      'h1, h2, h3, h4, h5, h6': {
        color: 'brand.purple.500',
        fontWeight: '700',
      },
      '.nested-scope-list': {
        ol: {
          counterReset: 'item',
        },
        'li > ul': {
          paddingLeft: '30px',
        },
        'ol > li': {
          display: 'block',
          indentStyle: 'inherit',
        },
        'ol > li:before': {
          content: `counters(item, ". ") ". "`,
          counterIncrement: 'item',
        },
      },
    },
  },
  fonts: {
    body: 'Proxima Nova, sans-serif',
    heading: 'Proxima Nova, sans-serif',
    inter: 'Inter, sans-serif',
  },
  colors: colors,
  sizes: {
    gutter: {
      sm: '10px',
      md: '20px',
    },
    // layout: {
    //   pageHeader: "60px",
    //   contentHeader: "65px",
    //   stickyHeaderTop: "50px",
    //   stickyContentTop: "135px",
    // },
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.8rem',
    md: '0.875rem',
    lg: '1rem',
    xl: '1.125rem',
    '2xl': '1.25rem',
    '3xl': '1.5rem',
    '4xl': '1.875rem',
    '5xl': '1.923rem',
    '6xl': '2.084rem',
    '7xl': '3.125rem',
    '8xl': '3.75rem',
    '9xl': '4.375rem',
    '1xxl': '5.168rem',
    '2xxl': '4rem',
  },
  components: {
    Button,
    // Card,
    // Modal,
    // Spinner: Spinner as any,
    // Tabs,
    // Text,
    // ...Form,
  },
})
