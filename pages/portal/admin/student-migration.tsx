import { useState } from 'react'
import {
  Box,
  Button,
  VStack,
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Card,
  CardHeader,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  HStack,
  Progress,
  useToast,
} from '@chakra-ui/react'
import { StudentActivationService } from '../../../lib/studentActivationService'

export default function StudentMigrationPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isPreviewing, setIsPreviewing] = useState(false)
  const [previewData, setPreviewData] = useState<any>(null)
  const [migrationResult, setMigrationResult] = useState<any>(null)
  const toast = useToast()

  const handlePreview = async () => {
    setIsPreviewing(true)
    try {
      const preview = await StudentActivationService.previewActivation()
      setPreviewData(preview)
      setMigrationResult(null)
    } catch (error) {
      toast({
        title: 'Preview failed',
        status: 'error',
        duration: 5000,
      })
    } finally {
      setIsPreviewing(false)
    }
  }

  const handleExecute = async () => {
    if (!previewData) return

    const confirmed = window.confirm(
      `CONFIRM STUDENT ACTIVATION\n\n` +
        `This will activate ${previewData.eligible} students.\n` +
        `This is a one-time migration. Continue?`,
    )

    if (!confirmed) return

    setIsLoading(true)
    try {
      const result = await StudentActivationService.activateEligibleStudents()
      setMigrationResult(result)

      if (result.success) {
        toast({
          title: 'Migration Successful',
          description: `Activated ${result.activated} students`,
          status: 'success',
          duration: 8000,
        })
      } else {
        toast({
          title: 'Migration Failed',
          description: result.errors.join(', '),
          status: 'error',
          duration: 8000,
        })
      }
    } catch (error) {
      toast({
        title: 'Unexpected Error',
        status: 'error',
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Working */}
      {/* <Box p={8} maxW="4xl" mx="auto">
        <VStack spacing={6} align="stretch">
          <Text fontSize="2xl" fontWeight="bold">
            Student Activation Migration
          </Text>

          <Alert status="info" borderRadius="md">
            <AlertIcon />
            <Box>
              <AlertTitle>One-Time Migration</AlertTitle>
              <AlertDescription>
                This will activate all students with role: 'student' and
                onboardingComplete: true. Uses their original createdAt date for
                studentActivatedAt.
              </AlertDescription>
            </Box>
          </Alert>

          <Card>
            <CardHeader>
              <Text fontSize="xl">Migration Control</Text>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Button
                  colorScheme="blue"
                  onClick={handlePreview}
                  isLoading={isPreviewing}
                  loadingText="Analyzing Students..."
                >
                  Preview Migration
                </Button>

                {previewData && (
                  <>
                    <HStack spacing={8} justify="center">
                      <Stat>
                        <StatLabel>Total Students</StatLabel>
                        <StatNumber>{previewData.totalStudents}</StatNumber>
                        <StatHelpText>Found in system</StatHelpText>
                      </Stat>
                      <Stat>
                        <StatLabel>Already Active</StatLabel>
                        <StatNumber color="green.500">
                          {previewData.alreadyActive}
                        </StatNumber>
                        <StatHelpText>No changes needed</StatHelpText>
                      </Stat>
                      <Stat>
                        <StatLabel>To Be Activated</StatLabel>
                        <StatNumber color="blue.500">
                          {previewData.eligible}
                        </StatNumber>
                        <StatHelpText>Will be updated</StatHelpText>
                      </Stat>
                    </HStack>

                    <Button
                      colorScheme="green"
                      onClick={handleExecute}
                      isLoading={isLoading}
                      loadingText="Activating Students..."
                      isDisabled={previewData.eligible === 0}
                    >
                      Execute Migration ({previewData.eligible} students)
                    </Button>
                  </>
                )}

                {isLoading && (
                  <Progress size="sm" isIndeterminate colorScheme="green" />
                )}
              </VStack>
            </CardBody>
          </Card>

          {migrationResult && (
            <Card>
              <CardHeader>
                <Text fontSize="xl">Migration Results</Text>
              </CardHeader>
              <CardBody>
                <VStack spacing={3} align="start">
                  <Text>
                    <strong>Status:</strong>{' '}
                    <Text
                      as="span"
                      color={migrationResult.success ? 'green.500' : 'red.500'}
                    >
                      {migrationResult.success ? 'SUCCESS' : 'FAILED'}
                    </Text>
                  </Text>
                  <Text>
                    <strong>Activated:</strong> {migrationResult.activated}{' '}
                    students
                  </Text>
                  <Text>
                    <strong>Skipped:</strong> {migrationResult.skipped} students
                  </Text>
                  <Text>
                    <strong>Duration:</strong> {migrationResult.duration}ms
                  </Text>
                  {migrationResult.errors.length > 0 && (
                    <Box>
                      <Text fontWeight="bold">Errors:</Text>
                      <Text color="red.500">
                        {migrationResult.errors.join(', ')}
                      </Text>
                    </Box>
                  )}
                </VStack>
              </CardBody>
            </Card>
          )}
        </VStack>
      </Box> */}

      {/* Placehoder */}
      <Box p={8} maxW="4xl" mx="auto">
        <Text fontSize="2xl" fontWeight="bold">
          Go Away... You shouldn&apos;t be on this page..
        </Text>
      </Box>
    </>
  )
}
