import React, { useState, useEffect } from 'react'
import {
  Box,
  HStack,
  VStack,
  Select,
  Button,
  Text,
  Spinner,
  useBreakpointValue,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerCloseButton,
  useDisclosure,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useClasses } from '../../../../hooks/useClasses'
import { branchOptions, classPlans } from '../../../../constant/adminConstants'

interface SchoolFeesFilterProps {
  onChange?: (filters: {
    branch: string
    classType: string
    classPlan: string
  }) => void
}

function FilterControls({
  branch,
  classType,
  classPlan,
  classOptions,
  loadingClasses,
  onChange,
  onReset,
  isMobile = false,
}: {
  branch: string
  classType: string
  classPlan: string
  classOptions: { value: string; label: string }[]
  loadingClasses: boolean
  onChange: (
    next: Partial<{ branch: string; classType: string; classPlan: string }>,
  ) => void
  onReset: () => void
  isMobile?: boolean
}) {
  const Container = isMobile ? VStack : HStack
  const containerProps = isMobile
    ? { spacing: 4, align: 'stretch' as const, w: 'full' }
    : { spacing: 6, align: 'flex-end' as const, flexWrap: 'wrap' as const }

  return (
    <Container {...containerProps}>
      <Box minW="180px">
        <Text fontSize="sm" color="gray.600" mb={1} fontWeight="medium">
          Branch
        </Text>
        <Select
          value={branch}
          onChange={(e) => onChange({ branch: e.target.value })}
          bg="gray.50"
          borderColor="gray.200"
          fontSize="md"
        >
          {branchOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
      </Box>
      <Box minW="180px">
        <Text fontSize="sm" color="gray.600" mb={1} fontWeight="medium">
          Class
        </Text>
        <Select
          value={classType}
          onChange={(e) => onChange({ classType: e.target.value })}
          bg="gray.50"
          borderColor="gray.200"
          fontSize="md"
          isDisabled={loadingClasses}
        >
          {loadingClasses ? (
            <option>Loading...</option>
          ) : (
            classOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))
          )}
        </Select>
      </Box>
      <Box minW="220px">
        <Text fontSize="sm" color="gray.600" mb={1} fontWeight="medium">
          Class Plan
        </Text>
        <Select
          value={classPlan}
          onChange={(e) => onChange({ classPlan: e.target.value })}
          placeholder="All Class Plans"
          bg="gray.50"
          borderColor="gray.200"
          fontSize="md"
        >
          {classPlans.map((plan) => (
            <option key={plan} value={plan}>
              {plan}
            </option>
          ))}
        </Select>
      </Box>
      <Button
        onClick={onReset}
        colorScheme="gray"
        variant="outline"
        alignSelf={isMobile ? 'flex-start' : 'flex-end'}
        mt={isMobile ? 2 : 0}
      >
        Reset
      </Button>
    </Container>
  )
}

export const SchoolFeesFilter = ({ onChange }: SchoolFeesFilterProps) => {
  const router = useRouter()
  // Initialize from search params if present
  const {
    branch: branchParam,
    classType: classTypeParam,
    classPlan: classPlanParam,
  } = router.query

  const [branch, setBranch] = useState(
    typeof branchParam === 'string' ? branchParam : 'all',
  )
  const [classType, setClassType] = useState(
    typeof classTypeParam === 'string' ? classTypeParam : 'all',
  )
  const [classPlan, setClassPlan] = useState(
    typeof classPlanParam === 'string' ? classPlanParam : '',
  )

  const { classes, loading: loadingClasses } = useClasses()
  const isMobile = useBreakpointValue({ base: true, md: false })
  const { isOpen, onOpen, onClose } = useDisclosure()

  // Transform classes data for select options
  const classOptions = [
    { value: 'all', label: 'All Classes' },
    ...classes.map((c) => ({ value: c.cohortName, label: c.cohortName })),
  ]

  // Sync filter state to URL search params
  useEffect(() => {
    const queryObj: Record<string, string> = {}
    if (branch && branch !== 'all') queryObj.branch = branch
    if (classType && classType !== 'all') queryObj.classType = classType
    if (classPlan) queryObj.classPlan = classPlan
    router.replace(
      {
        pathname: router.pathname,
        query: Object.keys(queryObj).length ? queryObj : undefined,
      },
      undefined,
      { shallow: true },
    )
    onChange?.({ branch, classType, classPlan })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branch, classType, classPlan])

  function handleChange(
    next: Partial<{ branch: string; classType: string; classPlan: string }>,
  ) {
    setBranch(next.branch ?? branch)
    setClassType(next.classType ?? classType)
    setClassPlan(next.classPlan ?? classPlan)
  }

  function handleReset() {
    setBranch('all')
    setClassType('all')
    setClassPlan('')
  }

  // Desktop: inline card, Mobile: Drawer
  if (isMobile) {
    return (
      <Box w="full" py={0} pb={4} px={2}>
        <Button
          onClick={onOpen}
          colorScheme="gray"
          variant="outline"
          w="full"
          maxW="80px"
          mb={2}
        >
          Filter
        </Button>
        <Drawer
          isOpen={isOpen}
          placement="bottom"
          onClose={onClose}
          size="full"
        >
          <DrawerOverlay />
          <DrawerContent borderTopRadius="2xl">
            <DrawerCloseButton />
            <DrawerHeader>Filter School Fees</DrawerHeader>
            <DrawerBody>
              <FilterControls
                branch={branch}
                classType={classType}
                classPlan={classPlan}
                classOptions={classOptions}
                loadingClasses={loadingClasses}
                onChange={handleChange}
                onReset={handleReset}
                isMobile={true}
              />
              <Button colorScheme="blue" w="full" mt={6} onClick={onClose}>
                Apply Filters
              </Button>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Box>
    )
  }

  // Desktop
  return (
    <Box w="full" py={0} pb={8} px={2}>
      <Box
        bg="white"
        borderRadius="xl"
        boxShadow="sm"
        p={{ base: 4, md: 6 }}
        w="full"
        maxW="100%"
      >
        <FilterControls
          branch={branch}
          classType={classType}
          classPlan={classPlan}
          classOptions={classOptions}
          loadingClasses={loadingClasses}
          onChange={handleChange}
          onReset={handleReset}
          isMobile={false}
        />
      </Box>
    </Box>
  )
}
