import React, { useEffect, useState } from 'react'
import { AdminAuthGuard } from '../../../../components/PortalAuthGuard'
import { PortalAdminLayout } from '../../../../features/portal/admin/admin-layout'
import { Box, Table, Thead, Tbody, Tr, Th, Td, Button, Spinner, Text, Select, VStack, HStack, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, useDisclosure, Flex } from '@chakra-ui/react'
import { CustomDatePicker } from '../../../../components'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { portalDb } from '../../../../portalFirebaseConfig'
import { Attendance } from '../../../../types/attendance.types'
import { useRouter } from 'next/router'
import { CreateAttendanceForm } from '../../../../components/admin/CreateAttendanceForm'
import { useActiveClasses } from '../../../../hooks/useClasses'
import { format } from 'date-fns'

const AdminAttendanceDashboard = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCohort, setSelectedCohort] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const { classes, loading: classesLoading } = useActiveClasses()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const router = useRouter()

  const fetchAttendance = async () => {
    setLoading(true)
    const q = query(
      collection(portalDb, 'attendance'),
      orderBy('date', 'desc'),
      orderBy('createdAt', 'desc')
    )
    const snapshot = await getDocs(q)
    const records = snapshot.docs.map(doc => ({ attendanceId: doc.id, ...doc.data() } as Attendance))
    setAttendanceRecords(records)
    setLoading(false)
  }
  
  useEffect(() => {
    fetchAttendance()
  }, [])



  // Filter logic
  const filteredRecords = attendanceRecords.filter(record => {
    return (
      (!selectedCohort || record.classId === selectedCohort) &&
      (!selectedDate || record.date === selectedDate)
    )
  })

  return (
    <AdminAuthGuard>
      <PortalAdminLayout>
        <Box p={[2, 8]} px={[0]}>
          <HStack mb={6} spacing={4} justifyContent="space-between">
            <Text fontSize={{ base: "xl", md: "2xl", lg: "2xl" }} fontWeight="bold">Attendance Records</Text>
            <Button colorScheme="purple" onClick={onOpen} isDisabled={classesLoading}>Create Attendance</Button>
          </HStack>
          <HStack mb={4} spacing={4}>
            {classesLoading ? (
              <Spinner size="sm" />
            ) : (
              <Select placeholder="Filter by class" value={selectedCohort} onChange={e => setSelectedCohort(e.target.value)} maxW="250px">
                {classes.map(cls => (
                  <option key={cls.cohortName} value={cls.cohortName}>{cls.cohortName}</option>
                ))}
              </Select>
            )}
            <CustomDatePicker
              name="selectedDate"
              value={selectedDate}
              onChange={(date) => setSelectedDate(date ? format(date, 'yyyy-MM-dd') : '')}
              width="200px"
              placeholder="Filter by date"
            />
          </HStack>
          {loading ? (
            <Spinner size="lg" />
          ) : (
            <>
              {/* Mobile Layout */}
              <Box display={{ base: 'block', md: 'none' }}>
                {filteredRecords.length === 0 ? (
                  <Box bg="white" borderRadius="md" boxShadow="sm" p={6} textAlign="center">
                    <Text color="gray.500">No attendance records found.</Text>
                  </Box>
                ) : (
                  <VStack spacing={3} align="stretch">
                    {filteredRecords.map(record => (
                      <Box
                        key={record.attendanceId}
                        bg="white"
                        borderRadius="md"
                        boxShadow="sm"
                        p={4}
                        border="1px solid"
                        borderColor="gray.200"
                      >
                        <VStack spacing={3} align="stretch">
                          <Flex justify="space-between" align="center">
                            <Text fontWeight="bold" color="gray.700">Date:</Text>
                            <Text>{record.date}</Text>
                          </Flex>
                          <Flex justify="space-between" align="center">
                            <Text fontWeight="bold" color="gray.700">Class:</Text>
                            <Text>{classes.find(cls => cls.cohortName === record.classId)?.cohortName || record.classId}</Text>
                          </Flex>
                          <Flex justify="space-between" align="center">
                            <Text fontWeight="bold" color="gray.700">Code:</Text>
                            <Text fontFamily="mono" fontSize="sm" bg="gray.100" px={2} py={1} borderRadius="sm">
                              {record.code}
                            </Text>
                          </Flex>
                          <Button 
                            colorScheme="purple" 
                            size="sm" 
                            onClick={() => router.push(`/portal/admin/attendance/${record.attendanceId}`)}
                            w="full"
                          >
                            View Details
                          </Button>
                        </VStack>
                      </Box>
                    ))}
                  </VStack>
                )}
              </Box>

              {/* Desktop Layout */}
              <Box display={{ base: 'none', md: 'block' }}>
                <Table variant="simple" bg="white" borderRadius="md" boxShadow="sm">
                  <Thead>
                    <Tr>
                      <Th>Date</Th>
                      <Th>Class</Th>
                      <Th>Code</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredRecords.length === 0 ? (
                      <Tr>
                        <Td colSpan={4} textAlign="center">No attendance records found.</Td>
                      </Tr>
                    ) : filteredRecords.map(record => (
                      <Tr key={record.attendanceId}>
                        <Td>{record.date}</Td>
                        <Td>{classes.find(cls => cls.cohortName === record.classId)?.cohortName || record.classId}</Td>
                        <Td>{record.code}</Td>
                        <Td>
                          <Button colorScheme="purple" size="sm" onClick={() => router.push(`/portal/admin/attendance/${record.attendanceId}`)}>
                            View Details
                          </Button>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </>
          )}
          <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Create Attendance for Today</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <CreateAttendanceForm activeClasses={classes.filter(cls => cls.status === 'active')} onCreated={fetchAttendance} />
              </ModalBody>
            </ModalContent>
          </Modal>
        </Box>
      </PortalAdminLayout>
    </AdminAuthGuard>
  )
}

export default AdminAttendanceDashboard 