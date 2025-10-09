import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
} from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'

const DeactivatedStudentAlert = () => {
  return (
    <div>
      <Box width={'70%'}>
        <Alert
          status="warning"
          borderRadius="md"
          mb={2}
          variant="subtle"
          flexDirection="column"
          alignItems="flex-start"
        >
          <Box display="flex" alignItems="center" mb={1}>
            <AlertIcon />
            <AlertTitle>Portal Deactivated!</AlertTitle>
          </Box>
          <AlertDescription mb={-2}>
            Your account has been deactivated. Kindly visit the Library section
            to see the reason. Thank you.
          </AlertDescription>
          <Box
            width={'100%'}
            display={'flex'}
            flexDirection="column"
            alignItems="flex-end"
          >
            <Link href={'/portal/dashboard/library'}>
              <Button size={'xs'} px={3}>
                View Details
              </Button>
            </Link>
          </Box>
        </Alert>
      </Box>
    </div>
  )
}

export default DeactivatedStudentAlert
