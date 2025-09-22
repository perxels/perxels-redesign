import { Box, Text, Spinner } from '@chakra-ui/react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useState, useCallback, useEffect } from 'react'

const sidebarItems = [
  {
    label: 'Dashboard',
    icon: '/assets/icons/home.svg',
    href: '/portal/facilitator/dashboard',
  },
  {
    label: 'Attendance',
    icon: '/assets/icons/attandance.svg',
    href: '/portal/facilitator/attendance',
  },
  {
    label: 'Students',
    icon: '/assets/icons/students.svg',
    href: '/portal/facilitator/students',
  },
  {
    label: 'Tests',
    icon: '/assets/icons/test.svg',
    href: '/portal/facilitator/tests',
  },
  {
    label: 'Performance',
    icon: '/assets/icons/graph.svg',
    href: '/portal/facilitator/performance',
  },
]

export const FacilitatorSidebar = () => {
  const router = useRouter()
  const [loadingItem, setLoadingItem] = useState<string | null>(null)
  const [iconsLoaded, setIconsLoaded] = useState<Record<string, boolean>>({})

  // Preload icons for better performance
  useEffect(() => {
    const preloadIcons = async () => {
      try {
        const iconPromises = sidebarItems.map(async (item) => {
          try {
            const img = new window.Image()
            img.src = item.icon
            await new Promise((resolve, reject) => {
              img.onload = resolve
              img.onerror = reject
            })
            setIconsLoaded((prev) => ({ ...prev, [item.label]: true }))
          } catch (error) {
            console.warn(`Failed to preload icon for ${item.label}:`, error)
            setIconsLoaded((prev) => ({ ...prev, [item.label]: false }))
          }
        })

        await Promise.allSettled(iconPromises)
      } catch (error) {
        console.error('Failed to preload sidebar icons:', error)
      }
    }

    preloadIcons()
  }, [])

  const handleNavigation = useCallback(
    async (href: string, label: string) => {
      if (router.pathname === href) return

      setLoadingItem(label)

      try {
        await new Promise((resolve) => setTimeout(resolve, 100))
        await router.push(href)
      } catch (error) {
        console.error(`Navigation error to ${href}:`, error)
        window.location.href = href
      } finally {
        setLoadingItem(null)
      }
    },
    [router],
  )

  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent, href: string, label: string) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        handleNavigation(href, label)
      }
    },
    [handleNavigation],
  )

  return (
    <Box
      h="100vh"
      w="20rem"
      bgColor="brand.purple.500"
      color="white"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
      overflowY="auto"
      alignItems="center"
      gap={8}
      py={8}
    >
      {sidebarItems.map((item) => {
        const isActive = router.pathname === item.href
        const isHomeActive =
          item.href === '/portal/facilitator/dashboard' &&
          router.pathname === '/portal/facilitator/dashboard'
        const isLoading = loadingItem === item.label
        const isIconLoaded = iconsLoaded[item.label]

        return (
          <Box
            key={item.label}
            display="flex"
            cursor={isLoading ? 'not-allowed' : 'pointer'}
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            gap="1rem"
            p="1rem"
            position="relative"
            borderRadius="xl"
            transition="all 0.2s ease-in-out"
            bg={
              isActive || isHomeActive
                ? 'rgba(255, 255, 255, 0.15)'
                : 'transparent'
            }
            _hover={
              !isLoading
                ? {
                    bg: 'rgba(255, 255, 255, 0.1)',
                    transform: 'translateY(-2px)',
                  }
                : {}
            }
            onClick={() =>
              !isLoading && handleNavigation(item.href, item.label)
            }
            onKeyPress={(e) => handleKeyPress(e, item.href, item.label)}
            tabIndex={0}
            role="button"
            aria-label={`Navigate to ${item.label}`}
            opacity={isLoading ? 0.7 : 1}
          >
            <Box position="relative">
              {isLoading ? (
                <Spinner size="md" color="white" />
              ) : !isIconLoaded ? (
                <Box
                  w="48px"
                  h="48px"
                  bg="rgba(255, 255, 255, 0.1)"
                  borderRadius="md"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Spinner size="sm" color="white" />
                </Box>
              ) : (
                <Image
                  src={item.icon}
                  alt={item.label}
                  width={48}
                  height={48}
                  priority={item.label === 'Dashboard'}
                  style={{
                    filter:
                      isActive || isHomeActive
                        ? 'brightness(1.2)'
                        : 'brightness(1)',
                  }}
                />
              )}
            </Box>
            <Text
              fontSize="1.25rem"
              fontWeight={isActive || isHomeActive ? 'bold' : 'medium'}
              color="brand.white"
            >
              {isLoading ? 'Loading...' : item.label}
            </Text>
          </Box>
        )
      })}
    </Box>
  )
}
