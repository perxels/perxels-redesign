import React, { useState } from 'react'
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
  Text,
  HStack,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Grid,
  Card,
  CardBody,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Alert,
  AlertIcon,
} from '@chakra-ui/react'
import { CreateDailyCodeForm } from '../../../../components/admin/CreateDailyCodeForm'
import { CreateSessionForm } from '../../../../components/admin/CreateSessionForm'
import { BulkActionsComponent } from '../../../../components/admin/BulkActions'
import { DailyCodesTable } from '../../../../components/admin/DailyCodesTable'
import { SessionsTable } from '../../../../components/admin/SessionsTable'
import { AttendanceReports } from '../../../../components/admin/AttendanceReports'
import {
  useAttendanceData,
  useBulkOperations,
} from '../../../../hooks/useAttendanceData'
import { useActiveClasses } from '../../../../hooks/useClasses'
import { AttendanceFilters } from '../../../../types/attendance-v2.types'
import { classPlans } from '../../../../constant/adminConstants'

const AttendanceDashboard = () => {
  const [activeTab, setActiveTab] = useState(0)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [globalFilters, setGlobalFilters] = useState<AttendanceFilters>({
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      end: new Date().toISOString().split('T')[0],
    },
  })

  const { classes, loading: classesLoading } = useActiveClasses()
  const { dailyCodes, sessions, loading, refetch } =
    useAttendanceData(globalFilters)
  const { handleBulkDelete, handleBulkExpire } = useBulkOperations(
    activeTab,
    selectedItems,
    () => {
      setSelectedItems([])
      refetch()
    },
  )

  const {
    isOpen: isDailyCodeOpen,
    onOpen: onDailyCodeOpen,
    onClose: onDailyCodeClose,
  } = useDisclosure()
  const {
    isOpen: isSessionOpen,
    onOpen: onSessionOpen,
    onClose: onSessionClose,
  } = useDisclosure()

  const clearAllFilters = () => {
    setGlobalFilters({
      dateRange: {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
        end: new Date().toISOString().split('T')[0],
      },
    })
  }

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      const items =
        activeTab === 0
          ? dailyCodes.map((code) => code.date)
          : sessions.map((session) => session.sessionId)
      setSelectedItems(items)
    } else {
      setSelectedItems([])
    }
  }

  const handleItemSelect = (itemId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedItems((prev) => [...prev, itemId])
    } else {
      setSelectedItems((prev) => prev.filter((id) => id !== itemId))
    }
  }

  return (
    <Box width={'100%'}>
      {/* <Box p={[2, 8]} px={[0]}> */}
      <HStack mb={6} spacing={4} justifyContent="space-between">
        <Text fontSize={{ base: 'xl', md: '2xl', lg: '2xl' }} fontWeight="bold">
          Attendance Management
        </Text>
        <HStack spacing={3}>
          <Button
            colorScheme="purple"
            variant="outline"
            onClick={onDailyCodeOpen}
          >
            Create Daily Code
          </Button>
          <Button colorScheme="blue" onClick={onSessionOpen}>
            Create Sessions
          </Button>
        </HStack>
      </HStack>

      {/* Global Filters */}
      <Card bg="white" shadow="sm" borderRadius="lg" mb={6}>
        <CardBody p={6}>
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between" align="center">
              <Text fontSize="lg" fontWeight="semibold" color="gray.700">
                Filters
              </Text>
              <Button
                size="sm"
                variant="outline"
                colorScheme="gray"
                onClick={clearAllFilters}
              >
                Clear All Filters
              </Button>
            </HStack>

            <Grid
              templateColumns={{
                base: '1fr',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(4, 1fr)',
              }}
              gap={4}
            >
              {/* Date Range */}
              <FormControl>
                <FormLabel fontSize="sm" fontWeight="medium">
                  Start Date
                </FormLabel>
                <Input
                  type="date"
                  value={globalFilters.dateRange?.start || ''}
                  onChange={(e) =>
                    setGlobalFilters((prev) => ({
                      ...prev,
                      dateRange: {
                        start: e.target.value,
                        end:
                          prev.dateRange?.end ||
                          new Date().toISOString().split('T')[0],
                      },
                    }))
                  }
                  bg="white"
                  size="sm"
                />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm" fontWeight="medium">
                  End Date
                </FormLabel>
                <Input
                  type="date"
                  value={globalFilters.dateRange?.end || ''}
                  onChange={(e) =>
                    setGlobalFilters((prev) => ({
                      ...prev,
                      dateRange: {
                        start:
                          prev.dateRange?.start ||
                          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                            .toISOString()
                            .split('T')[0],
                        end: e.target.value,
                      },
                    }))
                  }
                  bg="white"
                  size="sm"
                />
              </FormControl>

              {/* Cohort Filter */}
              <FormControl>
                <FormLabel fontSize="sm" fontWeight="medium">
                  Cohort
                </FormLabel>
                <Select
                  value={globalFilters.cohortId || ''}
                  onChange={(e) =>
                    setGlobalFilters((prev) => ({
                      ...prev,
                      cohortId: e.target.value || undefined,
                    }))
                  }
                  placeholder="All Cohorts"
                  bg="white"
                  size="sm"
                >
                  <option value="">All Cohorts</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.cohortName}>
                      {cls.cohortName}
                    </option>
                  ))}
                </Select>
              </FormControl>

              {/* Class Plan Filter */}
              <FormControl>
                <FormLabel fontSize="sm" fontWeight="medium">
                  Class Plan
                </FormLabel>
                <Select
                  value={globalFilters.planId || ''}
                  onChange={(e) =>
                    setGlobalFilters((prev) => ({
                      ...prev,
                      planId: e.target.value || undefined,
                    }))
                  }
                  placeholder="All Plans"
                  bg="white"
                  size="sm"
                >
                  <option value="">All Plans</option>
                  {classPlans.map((plan) => (
                    <option key={plan} value={plan}>
                      {plan}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </VStack>
        </CardBody>
      </Card>

      <BulkActionsComponent
        selectedItems={selectedItems}
        activeTab={activeTab}
        onBulkDelete={handleBulkDelete}
        onBulkExpire={handleBulkExpire}
      />

      <Tabs index={activeTab} onChange={setActiveTab}>
        <TabList>
          <Tab>Daily Codes</Tab>
          <Tab>Sessions</Tab>
          <Tab>Reports</Tab>
        </TabList>

        <TabPanels>
          <TabPanel px={0}>
            <DailyCodesTable
              dailyCodes={dailyCodes}
              loading={loading}
              selectedItems={selectedItems}
              onSelectAll={handleSelectAll}
              onItemSelect={handleItemSelect}
              onRefresh={refetch}
            />
          </TabPanel>

          <TabPanel px={0}>
            <SessionsTable
              sessions={sessions}
              loading={loading}
              selectedItems={selectedItems}
              onSelectAll={handleSelectAll}
              onItemSelect={handleItemSelect}
              onRefresh={refetch}
            />
          </TabPanel>

          <TabPanel px={0}>
            <AttendanceReports globalFilters={globalFilters} />
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Modal isOpen={isDailyCodeOpen} onClose={onDailyCodeClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Daily Attendance Code</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CreateDailyCodeForm
              onCreated={refetch}
              onClose={onDailyCodeClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={isSessionOpen} onClose={onSessionClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Class Sessions</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CreateSessionForm onCreated={refetch} onClose={onSessionClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
      {/* </Box> */}
    </Box>
  )
}

export default AttendanceDashboard
