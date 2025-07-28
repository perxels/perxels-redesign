import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { AdminAuthGuard } from '../../../../components/PortalAuthGuard'
import { PortalAdminLayout } from '../../../../features/portal/admin/admin-layout'
import { Box, Table, Thead, Tbody, Tr, Th, Td, Spinner, Text, Button, VStack, HStack } from '@chakra-ui/react'
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore'
import { portalDb } from '../../../../portalFirebaseConfig'
import { getStudentsInCohort } from '../../../../lib/utils/attendance.utils'

const AdminAttendanceDetails = () => {
  const router = useRouter()
  const { attendanceId } = router.query
  const [attendance, setAttendance] = useState<any>(null)
  const [allStudents, setAllStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDetails = async () => {
      if (!attendanceId || typeof attendanceId !== 'string') return
      setLoading(true)
      
      try {
        // Fetch attendance record
        const attendanceRef = doc(portalDb, 'attendance', attendanceId)
        const attendanceSnap = await getDoc(attendanceRef)
        
        if (!attendanceSnap.exists()) {
          setAttendance(null)
          setAllStudents([])
          setLoading(false)
          return
        }
        
        const attendanceData = { id: attendanceSnap.id, ...attendanceSnap.data() } as any
        setAttendance(attendanceData)
        
        // Get all students in this cohort
        const studentsInCohort = await getStudentsInCohort(attendanceData.classId)
        
        // Fetch check-ins for this attendance
        const checkinsRef = collection(portalDb, 'attendance', attendanceId, 'checkins')
        const checkinsSnap = await getDocs(checkinsRef)
        const checkins = new Map()
        checkinsSnap.docs.forEach(doc => {
          checkins.set(doc.id, doc.data())
        })
        
        // Combine student data with check-in status
        const studentsWithStatus = studentsInCohort.map((student: any) => {
          const checkinData = checkins.get(student.id)
          return {
            studentId: student.id,
            studentName: student.fullName || student.id,
            checkedIn: checkinData?.checkedIn || false,
            checkInTime: checkinData?.checkInTime || null,
            status: checkinData?.checkedIn ? 'present' : 'absent'
          }
        })
        
        setAllStudents(studentsWithStatus)
      } catch (error) {
        console.error('Error fetching attendance details:', error)
        setAttendance(null)
        setAllStudents([])
      } finally {
        setLoading(false)
      }
    }
    
    fetchDetails()
  }, [attendanceId])

  return (
    <AdminAuthGuard>
      <PortalAdminLayout>
        <Box p={[2, 8]} px={[0]}>
          <Button mb={4} onClick={() => router.back()}>&larr; Back</Button>
          {loading ? (
            <Spinner size="lg" />
          ) : !attendance ? (
            <Text color="red.500">Attendance record not found.</Text>
          ) : (
            <>
              <Box
                bg="white"
                borderRadius="2xl"
                p={{ base: 4, md: 6 }}
                mb={8}
                w="full"
                maxW="420px"
              >
                <HStack align="flex-start" spacing={3} divider={<Box h="full" bg="gray.100" w="1px" />}>
                  <Box>
                    <Text color="gray.500" fontWeight="medium" fontSize="sm">Date</Text>
                    <Text fontWeight="bold" fontSize="lg" color="gray.800">{attendance.date}</Text>
                  </Box>
                  <Box>
                    <Text color="gray.500" fontWeight="medium" fontSize="sm">Class</Text>
                    <Text fontWeight="bold" fontSize="lg" color="gray.800">{attendance.classId}</Text>
                  </Box>
                  <Box>
                    <Text color="gray.500" fontWeight="medium" fontSize="sm">Code</Text>
                    <Text fontWeight="bold" fontSize="lg" color="gray.800">{attendance.code}</Text>
                  </Box>
                </HStack>
              </Box>
              {/* Mobile Layout */}
              <Box display={{ base: 'block', md: 'none' }}>
                {allStudents.length === 0 ? (
                  <Box bg="white" borderRadius="2xl" p={6} textAlign="center">
                    <Text fontSize="2xl" color="gray.400">😕</Text>
                    <Text color="gray.500" mt={2}>No students found for this session.</Text>
                  </Box>
                ) : (
                  <VStack spacing={3} align="stretch">
                    {allStudents.map((student, idx) => (
                      <Box
                        key={student.studentId}
                        bg="white"
                        borderRadius="lg"
                        p={4}
                        border="1px solid"
                        borderColor="gray.200"
                        boxShadow="sm"
                      >
                        <VStack spacing={3} align="stretch">
                          <Text fontWeight="semibold" color="gray.800" fontSize="md">
                            {student.studentName}
                          </Text>
                          
                          <HStack justify="space-between" align="center">
                            <Text color="gray.600" fontSize="sm">Status:</Text>
                            {student.status === 'present' ? (
                              <HStack spacing={2}>
                                <Box w={3} h={3} bg="green.500" borderRadius="full" />
                                <Text color="green.600" fontWeight="bold" fontSize="sm">Present</Text>
                              </HStack>
                            ) : (
                              <HStack spacing={2}>
                                <Box w={3} h={3} bg="red.500" borderRadius="full" />
                                <Text color="red.500" fontWeight="bold" fontSize="sm">Absent</Text>
                              </HStack>
                            )}
                          </HStack>
                          
                          {student.checkedIn && student.checkInTime && (
                            <HStack justify="space-between" align="center">
                              <Text color="gray.600" fontSize="sm">Check-in Time:</Text>
                              <Text fontFamily="mono" color="gray.500" fontSize="sm" bg="gray.100" px={2} py={1} borderRadius="sm">
                                {new Date(student.checkInTime.seconds
                                  ? student.checkInTime.seconds * 1000
                                  : student.checkInTime
                                ).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
                              </Text>
                            </HStack>
                          )}
                        </VStack>
                      </Box>
                    ))}
                  </VStack>
                )}
              </Box>

              {/* Desktop Layout */}
              <Box display={{ base: 'none', md: 'block' }} bg="white" borderRadius="2xl" p={6} overflowX="auto" w="full">
                <Table variant="simple" minW="600px">
                  <Thead bg="gray.50">
                    <Tr>
                      <Th fontSize="md" fontWeight="bold" color="gray.700" py={3}>Student Name</Th>
                      <Th fontSize="md" fontWeight="bold" color="gray.700" py={3}>Status</Th>
                      <Th fontSize="md" fontWeight="bold" color="gray.700" py={3}>Check-in Time</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {allStudents.length === 0 ? (
                      <Tr>
                        <Td colSpan={3} textAlign="center" py={8}>
                          <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                            <Text fontSize="2xl" color="gray.400">😕</Text>
                            <Text color="gray.500">No students found for this session.</Text>
                          </Box>
                        </Td>
                      </Tr>
                    ) : allStudents.map((student, idx) => (
                      <Tr key={student.studentId} bg={idx % 2 === 0 ? 'white' : 'gray.50'}>
                        <Td fontWeight="semibold" color="gray.800" py={3} fontSize="md">
                          {student.studentName}
                        </Td>
                        <Td py={3}>
                          {student.status === 'present' ? (
                            <Box as="span" display="inline-block">
                              <span style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                                <svg width="10" height="10" style={{ marginRight: 6 }}><circle cx="5" cy="5" r="5" fill="#38A169" /></svg>
                              </span>
                              <Text as="span" color="green.600" fontWeight="bold" fontSize="sm">Present</Text>
                            </Box>
                          ) : (
                            <Box as="span" display="inline-block">
                              <span style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                                <svg width="10" height="10" style={{ marginRight: 6 }}><circle cx="5" cy="5" r="5" fill="#E53E3E" /></svg>
                              </span>
                              <Text as="span" color="red.500" fontWeight="bold" fontSize="sm">Absent</Text>
                            </Box>
                          )}
                        </Td>
                        <Td py={3} fontFamily="mono" color="gray.500" fontSize="sm">
                          {student.checkedIn && student.checkInTime
                            ? new Date(student.checkInTime.seconds
                                ? student.checkInTime.seconds * 1000
                                : student.checkInTime
                              ).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
                            : '-'}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
              {/* TODO: Add export/download button */}
            </>
          )}
        </Box>
      </PortalAdminLayout>
    </AdminAuthGuard>
  )
}

export default AdminAttendanceDetails 