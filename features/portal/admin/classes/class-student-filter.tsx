import React, { useMemo } from 'react'
import {
  Box,
  VStack,
  HStack,
  Select,
  Text,
  Card,
  CardBody,
  SimpleGrid,
  Badge,
  Button,
  useBreakpointValue,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerCloseButton,
  useDisclosure,
} from '@chakra-ui/react'
import { usePortalAuth } from '../../../../hooks/usePortalAuth'
import { useRouter } from 'next/router'
import { useClasses } from '../../../../hooks/useClasses'
import {
  branchOptions,
  classPlans,
  paymentStatusOptions,
} from '../../../../constant/adminConstants'

interface ClassData {
  id: string
  cohortName: string
  startDate: Date
  endDate: Date
  createdBy: string
  createdAt: any
  status: 'active' | 'inactive' | 'completed'
  studentsCount: number
  branch?: string
  paymentStatus?: 'pending' | 'partial' | 'completed' | 'overdue'
}

interface FiltersState {
  class: string
  classPlan: string
  branch: string
  paymentStatus: string
}

function FilterControls({
  filters,
  onFilterChange,
  onClearAll,
  hasActiveFilters,
  getUniqueClasses,
}: {
  filters: FiltersState
  onFilterChange: (filterType: keyof FiltersState, value: string) => void
  onClearAll: () => void
  hasActiveFilters: boolean
  getUniqueClasses: () => string[]
}) {
  return (
    <VStack spacing={4} align="stretch">
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
        {/* Class Filter */}
        <Box>
          <Text fontSize="sm" fontWeight="medium" mb={2}>
            Class
          </Text>
          <Select
            placeholder="Select class"
            value={filters.class}
            onChange={(e) => onFilterChange('class', e.target.value)}
            bg="white"
          >
            {getUniqueClasses().map((className) => (
              <option key={className} value={className}>
                {className}
              </option>
            ))}
          </Select>
        </Box>
        {/* Class Plan Filter */}
        <Box>
          <Text fontSize="sm" fontWeight="medium" mb={2}>
            Class Plan
          </Text>
          <Select
            placeholder="Select class plan"
            value={filters.classPlan}
            onChange={(e) => onFilterChange('classPlan', e.target.value)}
            bg="white"
          >
            {classPlans.map((plan) => (
              <option key={plan} value={plan}>
                {plan}
              </option>
            ))}
          </Select>
        </Box>
        {/* Branch Filter */}
        <Box>
          <Text fontSize="sm" fontWeight="medium" mb={2}>
            Branch-type
          </Text>
          <Select
            value={filters.branch}
            onChange={(e) => onFilterChange('branch', e.target.value)}
            bg="white"
          >
            {branchOptions.map((branch) => (
              <option key={branch.value} value={branch.value}>
                {branch.label}
              </option>
            ))}
          </Select>
        </Box>
        {/* Payment Status Filter */}
        <Box>
          <Text fontSize="sm" fontWeight="medium" mb={2}>
            Payment Status
          </Text>
          <Select
            value={filters.paymentStatus}
            onChange={(e) => onFilterChange('paymentStatus', e.target.value)}
            bg="white"
          >
            {paymentStatusOptions.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </Select>
        </Box>
      </SimpleGrid>
      <HStack justifyContent="space-between" align="center">
        {/* Filter Status Indicators */}
        {hasActiveFilters && (
          <HStack spacing={2} flexWrap="wrap">
            {filters.class && (
              <Badge colorScheme="blue" variant="subtle">
                Class: {filters.class}
              </Badge>
            )}
            {filters.classPlan && (
              <Badge colorScheme="cyan" variant="subtle">
                Class Plan: {filters.classPlan}
              </Badge>
            )}
            {filters.branch !== 'all' && (
              <Badge colorScheme="green" variant="subtle">
                Branch:{' '}
                {branchOptions.find((b) => b.value === filters.branch)?.label}
              </Badge>
            )}
            {filters.paymentStatus !== 'all' && (
              <Badge colorScheme="purple" variant="subtle">
                Payment:{' '}
                {
                  paymentStatusOptions.find(
                    (p) => p.value === filters.paymentStatus,
                  )?.label
                }
              </Badge>
            )}
          </HStack>
        )}
        {/* Clear Filters */}
        {hasActiveFilters && (
          <HStack justifyContent="flex-end" cursor="pointer">
            <Text
              fontSize="sm"
              color="red.500"
              cursor="pointer"
              onClick={onClearAll}
              _hover={{ textDecoration: 'underline' }}
            >
              Clear all filters
            </Text>
          </HStack>
        )}
      </HStack>
    </VStack>
  )
}

export const ClassStudentFilter = () => {
  const { portalUser } = usePortalAuth()
  const router = useRouter()
  const isAdmin = portalUser?.role === 'admin'
  const { classes, loading, error } = useClasses()
  const isMobile = useBreakpointValue({ base: true, md: false })
  const { isOpen, onOpen, onClose } = useDisclosure()

  // Get filters from query string
  const filters: FiltersState = useMemo(() => {
    return {
      class: (router.query.class as string) || '',
      classPlan: (router.query.classPlan as string) || '',
      branch: (router.query.branch as string) || 'all',
      paymentStatus: (router.query.paymentStatus as string) || 'all',
    }
  }, [router.query])

  // Update URL with new filter values
  const updateFilters = (newFilters: Partial<FiltersState>) => {
    const updatedQuery = { ...router.query }
    Object.keys(newFilters).forEach((key) => {
      const filterKey = key as keyof FiltersState
      const value = newFilters[filterKey]
      if (value && value !== 'all') {
        updatedQuery[filterKey] = value
      } else {
        delete updatedQuery[filterKey]
      }
    })
    router.push({ pathname: router.pathname, query: updatedQuery }, undefined, {
      shallow: true,
    })
  }

  // Handle filter changes
  const handleFilterChange = (
    filterType: keyof FiltersState,
    value: string,
  ) => {
    updateFilters({ [filterType]: value })
  }

  // Clear all filters
  const clearAllFilters = () => {
    router.push(router.pathname, undefined, { shallow: true })
  }

  // Get unique values for class filter options
  const getUniqueClasses = () => {
    return Array.from(new Set(classes.map((c) => c.cohortName))).sort()
  }

  // Check if any filters are active
  const hasActiveFilters =
    Boolean(filters.class) ||
    Boolean(filters.classPlan) ||
    filters.branch !== 'all' ||
    filters.paymentStatus !== 'all'

  // Mobile: Drawer layout
  if (isMobile) {
    return (
      <VStack w="full" spacing={4} align="stretch" py={4}>
        <Button
          onClick={onOpen}
          colorScheme="gray"
          variant="outline"
          w="full"
          maxW="80px"
        >
          Filter
        </Button>

        {/* Filter Status Indicators for mobile */}
        {hasActiveFilters && (
          <HStack spacing={2} flexWrap="wrap">
            {filters.class && (
              <Badge colorScheme="blue" variant="subtle">
                Class: {filters.class}
              </Badge>
            )}
            {filters.branch !== 'all' && (
              <Badge colorScheme="green" variant="subtle">
                Branch:{' '}
                {branchOptions.find((b) => b.value === filters.branch)?.label}
              </Badge>
            )}
            {filters.paymentStatus !== 'all' && (
              <Badge colorScheme="purple" variant="subtle">
                Payment:{' '}
                {
                  paymentStatusOptions.find(
                    (p) => p.value === filters.paymentStatus,
                  )?.label
                }
              </Badge>
            )}
          </HStack>
        )}

        <Drawer
          isOpen={isOpen}
          placement="bottom"
          onClose={onClose}
          size="full"
        >
          <DrawerOverlay />
          <DrawerContent borderTopRadius="2xl">
            <DrawerCloseButton />
            <DrawerHeader>Filter Classes</DrawerHeader>
            <DrawerBody>
              <FilterControls
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearAll={clearAllFilters}
                hasActiveFilters={hasActiveFilters}
                getUniqueClasses={getUniqueClasses}
              />
              <Button colorScheme="blue" w="full" mt={6} onClick={onClose}>
                Apply Filters
              </Button>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </VStack>
    )
  }

  // Desktop: Keep original layout
  return (
    <VStack w="full" spacing={6} align="stretch">
      {/* Filters Section */}
      <Card bgColor="transparent" shadow="none" px={0}>
        <CardBody px={0}>
          <VStack spacing={4} align="stretch">
            <HStack justifyContent="flex-start" align="center">
              <Text fontSize="lg" fontWeight="semibold">
                Filter Classes
              </Text>
            </HStack>

            <FilterControls
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearAll={clearAllFilters}
              hasActiveFilters={hasActiveFilters}
              getUniqueClasses={getUniqueClasses}
            />
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  )
}
