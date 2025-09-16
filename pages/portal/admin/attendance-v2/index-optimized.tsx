import React, { useState } from 'react'
import { AdminAuthGuard } from '../../../../components/PortalAuthGuard'
import { PortalAdminLayout } from '../../../../features/portal/admin/admin-layout'
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
import { AttendanceFiltersComponent } from '../../../../components/admin/AttendanceFilters'
import { BulkActionsComponent } from '../../../../components/admin/BulkActions'
import { DailyCodesTable } from '../../../../components/admin/DailyCodesTable'
import { SessionsTable } from '../../../../components/admin/SessionsTable'
import {
  useAttendanceData,
  useBulkOperations,
} from '../../../../hooks/useAttendanceData'
import { useActiveClasses } from '../../../../hooks/useClasses'
import { AttendanceFilters } from '../../../../types/attendance-v2.types'

const EnhancedAttendanceDashboard = () => {
  const [activeTab, setActiveTab] = useState(0)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [filters, setFilters] = useState<AttendanceFilters>({})

  const { classes, loading: classesLoading } = useActiveClasses()
  const { dailyCodes, sessions, loading, refetch } = useAttendanceData(filters)
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
    <AdminAuthGuard>
      <PortalAdminLayout>
        <Box p={[2, 8]} px={[0]}>
          <HStack mb={6} spacing={4} justifyContent="space-between">
            <Text
              fontSize={{ base: 'xl', md: '2xl', lg: '2xl' }}
              fontWeight="bold"
            >
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

          <AttendanceFiltersComponent
            filters={filters}
            onFiltersChange={setFilters}
            classes={classes}
            classesLoading={classesLoading}
          />

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
                <Box bg="white" p={6} borderRadius="lg" boxShadow="sm">
                  <Text fontSize="lg" fontWeight="bold" mb={4}>
                    Attendance Reports
                  </Text>
                  <Alert status="info" borderRadius="md">
                    <AlertIcon />
                    <Text fontSize="sm">
                      Reports feature coming soon. Export functionality will be
                      available here.
                    </Text>
                  </Alert>
                </Box>
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
                <CreateSessionForm
                  onCreated={refetch}
                  onClose={onSessionClose}
                />
              </ModalBody>
            </ModalContent>
          </Modal>
        </Box>
      </PortalAdminLayout>
    </AdminAuthGuard>
  )
}

export default EnhancedAttendanceDashboard
