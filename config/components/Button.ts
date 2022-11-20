import { ComponentStyleConfig } from '@chakra-ui/theme'

export const Button: ComponentStyleConfig = {
  baseStyle: {
    bg: '#34296B',
    fontWeight: '700',
    fontSize: ['0.853rem', '0.853rem', 'xl'],
    borderRadius: '10px',
    color: 'brand.white',
    px: '2.25rem',
    py: '0.875rem',
    _hover: {
      bg: 'brand.yellow.700',
      color: 'brand.purple.500',
      borderTopRightRadius: '10px',
      borderBottomLeftRadius: '10px',
    },
  },
  sizes: {
    sm: {
      fontSize: 'md',
      height: '34px',
    },
    lg: {
      fontSize: '2xl',
      height: '73px',
    }
  },
  variants: {
    link: {
      padding: 0,
      backgroundColor: 'transparent',
      _hover: {
        textDecoration: 'none',
        border: 'none',
      },
    },
    solid: {
      bg: 'brand.purple.500',
      fontWeight: '700',
      fontSize: ['0.853rem', '0.853rem', 'xl'],
      borderRadius: '10px',
      color: 'brand.white',
      px: '2.25rem',
      py: '0.875rem',
      transition: 'all 0.35s ease-in-out',
      _hover: {
        bg: 'brand.yellow.700',
        color: 'brand.purple.500',
        borderTopRightRadius: '10px',
        borderBottomLeftRadius: '10px',
        borderTopLeftRadius: '0',
        borderBottomRightRadius: '0',
      },
    },
    'solid-white': {
      bg: 'brand.white',
      color: 'brand.purple.500',
      fontWeight: '700',
      transition: 'all 0.35s ease-in-out',
      _hover: {
        bg: 'brand.yellow.700',
        color: 'brand.purple.500',
        borderTopRightRadius: '10px',
        borderBottomLeftRadius: '10px',
        borderTopLeftRadius: '0',
        borderBottomRightRadius: '0',
      },
    },
    'rounded-solid': {
      bg: 'brand.white',
      fontWeight: '700',
      fontSize: ['0.853rem', '0.853rem', 'xl'],
      borderRadius: '30px',
      color: 'brand.purple.500',
      px: '2.25rem',
      py: '0.875rem',
      transition: 'all 0.35s ease-in-out',
      _hover: {
        borderRadius: '30px',
        bg: 'brand.yellow.700',
      },
    },
    'rounded-solid-yellow-with-outline': {
      bg: 'brand.yellow.700',
      fontWeight: '700',
      fontSize: ['0.853rem', '0.853rem', 'xl'],
      borderRadius: '30px',
      color: 'brand.purple.500',
      px: '6.875rem',
      py: '1.75rem',
      transition: 'all 0.35s ease-in-out',
      position: 'relative',
      _hover: {
        borderRadius: '30px',
      },
      _before: {
        content: '""',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'calc(100% + 10px)',
        height: 'calc(100% + 10px)',
        borderRadius: '30px',
        borderWidth: '1px',
        borderColor: '#F3F3F3',
      }
    },
    subtle: (props) => {
      return {
        backgroundColor: `${props.colorScheme}.50`,
        color: `${props.colorScheme}.700`,
      }
    },
  },
}
