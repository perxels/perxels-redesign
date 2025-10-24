import { Box, Text, Badge, Spinner } from '@chakra-ui/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState, useCallback, useEffect } from 'react'
import { useStudentNotifications } from '../../../hooks/useStudentNotifications'

const sidebarItems = [
  {
    label: 'Home',
    icon: '/assets/icons/home.svg',
    href: '/portal/dashboard',
  },
  {
    label: 'Sch fee',
    icon: '/assets/icons/wallet.svg',
    href: '/portal/dashboard/school-fees',
  },
  {
    label: 'Attendance',
    icon: '/assets/icons/graph.svg',
    href: '/portal/dashboard/attendance-v2',
  },
  {
    label: 'Library',
    icon: '/assets/icons/video.svg',
    href: '/portal/dashboard/library',
  },
  {
    label: 'Message',
    icon: '/assets/icons/notification.svg',
    href: '/portal/dashboard/messages',
  },
]

export const DashboardSidebar = () => {
  const { unreadCount } = useStudentNotifications()
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
      if (router.pathname === href) return // Already on the page

      setLoadingItem(label)

      try {
        // Add a small delay to show loading state for better UX
        await new Promise((resolve) => setTimeout(resolve, 100))

        // Use router.push for programmatic navigation with error handling
        await router.push(href)
      } catch (error) {
        console.error(`Navigation error to ${href}:`, error)
        // Fallback to regular link navigation
        window.location.href = href
      } finally {
        setLoadingItem(null)
      }
    },
    [router],
  )

  // Add keyboard navigation support
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
      alignItems="center"
      gap={8}
      py={8}
      mx={'auto'}
      overflowY="auto"
    >
      {sidebarItems.map((item) => {
        const isActive = router.pathname === item.href
        const isHomeActive =
          item.href === '/portal/dashboard' &&
          router.pathname === '/portal/dashboard'
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
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  }
                : {}
            }
            _active={
              !isLoading
                ? {
                    bg: 'rgba(255, 255, 255, 0.2)',
                    transform: 'translateY(0px)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                  }
                : {}
            }
            _before={
              isActive || isHomeActive
                ? {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '4px',
                    height: '60%',
                    bg: 'white',
                    borderRadius: '0 4px 4px 0',
                  }
                : undefined
            }
            onClick={() =>
              !isLoading && handleNavigation(item.href, item.label)
            }
            onKeyPress={(e) => handleKeyPress(e, item.href, item.label)}
            tabIndex={0}
            role="button"
            aria-label={`Navigate to ${item.label}`}
            aria-pressed={isActive || isHomeActive}
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
                  priority={item.label === 'Home'} // Prioritize home icon
                  style={{
                    filter:
                      isActive || isHomeActive
                        ? 'brightness(1.2)'
                        : 'brightness(1)',
                    transition: 'filter 0.2s ease-in-out',
                  }}
                />
              )}
              {item.label === 'Message' && unreadCount > 0 && !isLoading && (
                <Badge
                  position="absolute"
                  top="-8px"
                  right="-8px"
                  colorScheme="red"
                  borderRadius="full"
                  minW="20px"
                  h="20px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="12px"
                  fontWeight="bold"
                  animation={unreadCount > 0 ? 'pulse 2s infinite' : undefined}
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
              )}
            </Box>
            <Text
              fontSize="1.25rem"
              fontWeight={isActive || isHomeActive ? 'bold' : 'medium'}
              color="brand.white"
              textAlign="center"
              transition="all 0.2s ease-in-out"
              opacity={isActive || isHomeActive ? 1 : 0.9}
            >
              {isLoading ? 'Loading...' : item.label}
            </Text>
          </Box>
        )
      })}
    </Box>
  )
}
