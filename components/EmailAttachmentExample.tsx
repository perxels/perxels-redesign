'use client'

import { useState } from 'react'
import { 
  Button, 
  Input, 
  FormLabel, 
  Textarea, 
  Select, 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Alert, 
  AlertIcon,
  useToast,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Divider
} from '@chakra-ui/react'

interface Attachment {
  filename: string
  content: string // base64
  contentType?: string
}

export function EmailAttachmentExample() {
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [html, setHtml] = useState('')
  const [emailType, setEmailType] = useState<'generic' | 'payment_receipt' | 'certificate' | 'course_materials'>('generic')
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null)
  const toast = useToast()

  // Additional fields for specific email types
  const [studentName, setStudentName] = useState('')
  const [amount, setAmount] = useState('')
  const [cohort, setCohort] = useState('')
  const [classPlan, setClassPlan] = useState('')
  const [courseName, setCourseName] = useState('')

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64 = e.target?.result as string
        const base64Content = base64.split(',')[1] // Remove data URL prefix
        
        const attachment: Attachment = {
          filename: file.name,
          content: base64Content,
          contentType: file.type,
        }
        
        setAttachments(prev => [...prev, attachment])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setResult(null)

    try {
      const payload: any = {
        type: emailType,
        to: email,
        subject,
        attachments,
      }

      // Add type-specific fields
      if (emailType === 'generic') {
        payload.html = html
      } else if (emailType === 'payment_receipt') {
        payload.studentName = studentName
        payload.amount = parseFloat(amount)
        payload.cohort = cohort
        payload.classPlan = classPlan
      } else if (emailType === 'certificate') {
        payload.studentName = studentName
        payload.courseName = courseName
      } else if (emailType === 'course_materials') {
        payload.studentName = studentName
        payload.courseName = courseName
      }

      const response = await fetch('/api/send-email-with-attachment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      setResult(data)
      
      if (data.success) {
        toast({
          title: 'Email sent successfully',
          description: data.message,
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
      } else {
        toast({
          title: 'Failed to send email',
          description: data.error,
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
    } catch (error) {
      setResult({
        success: false,
        error: 'Failed to send email',
      })
      toast({
        title: 'Error',
        description: 'Failed to send email',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box maxW="2xl" mx="auto" p={6}>
      <Card>
        <CardHeader>
          <Heading size="md">Send Email with Attachments</Heading>
          <Text color="gray.600" mt={2}>
            Test the email attachment functionality with different email types
          </Text>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4} align="stretch">
              {/* Email Type Selection */}
              <Box>
                <FormLabel>Email Type</FormLabel>
                <Select 
                  value={emailType} 
                  onChange={(e) => setEmailType(e.target.value as any)}
                >
                  <option value="generic">Generic Email</option>
                  <option value="payment_receipt">Payment Receipt</option>
                  <option value="certificate">Certificate</option>
                  <option value="course_materials">Course Materials</option>
                </Select>
              </Box>

              {/* Basic Fields */}
              <Box>
                <FormLabel>Email Address</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="recipient@example.com"
                  required
                />
              </Box>

              <Box>
                <FormLabel>Subject</FormLabel>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Email subject"
                  required
                />
              </Box>

              {/* Type-specific fields */}
              {emailType === 'generic' && (
                <Box>
                  <FormLabel>HTML Content</FormLabel>
                  <Textarea
                    value={html}
                    onChange={(e) => setHtml(e.target.value)}
                    placeholder="<p>Your HTML content here</p>"
                    rows={4}
                    required
                  />
                </Box>
              )}

              {emailType === 'payment_receipt' && (
                <HStack spacing={4}>
                  <Box flex={1}>
                    <FormLabel>Student Name</FormLabel>
                    <Input
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="John Doe"
                      required
                    />
                  </Box>
                  <Box flex={1}>
                    <FormLabel>Amount</FormLabel>
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="250000"
                      required
                    />
                  </Box>
                </HStack>
              )}

              {emailType === 'payment_receipt' && (
                <HStack spacing={4}>
                  <Box flex={1}>
                    <FormLabel>Cohort</FormLabel>
                    <Input
                      value={cohort}
                      onChange={(e) => setCohort(e.target.value)}
                      placeholder="Cohort 2024"
                      required
                    />
                  </Box>
                  <Box flex={1}>
                    <FormLabel>Class Plan</FormLabel>
                    <Input
                      value={classPlan}
                      onChange={(e) => setClassPlan(e.target.value)}
                      placeholder="Full Time"
                      required
                    />
                  </Box>
                </HStack>
              )}

              {(emailType === 'certificate' || emailType === 'course_materials') && (
                <HStack spacing={4}>
                  <Box flex={1}>
                    <FormLabel>Student Name</FormLabel>
                    <Input
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="John Doe"
                      required
                    />
                  </Box>
                  <Box flex={1}>
                    <FormLabel>Course Name</FormLabel>
                    <Input
                      value={courseName}
                      onChange={(e) => setCourseName(e.target.value)}
                      placeholder="UI/UX Design"
                      required
                    />
                  </Box>
                </HStack>
              )}

              {/* File Upload */}
              <Box>
                <FormLabel>Attachments</FormLabel>
                <Input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif,.webp"
                />
                <Text fontSize="sm" color="gray.500" mt={1}>
                  Supported formats: PDF, DOC, DOCX, TXT, PNG, JPG, JPEG, GIF, WEBP
                </Text>
              </Box>

              {/* Attachments List */}
              {attachments.length > 0 && (
                <Box>
                  <FormLabel>Selected Files:</FormLabel>
                  <VStack spacing={2} align="stretch">
                    {attachments.map((attachment, index) => (
                      <HStack key={index} justify="space-between" p={2} bg="gray.50" borderRadius="md">
                        <Text fontSize="sm">{attachment.filename}</Text>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeAttachment(index)}
                        >
                          Remove
                        </Button>
                      </HStack>
                    ))}
                  </VStack>
                </Box>
              )}

              <Divider />

              {/* Submit Button */}
              <Button 
                type="submit" 
                disabled={isLoading || attachments.length === 0} 
                colorScheme="blue"
                isLoading={isLoading}
                loadingText="Sending..."
              >
                Send Email
              </Button>
            </VStack>
          </form>

          {/* Result */}
          {result && (
            <Alert 
              status={result.success ? 'success' : 'error'} 
              mt={4}
            >
              <AlertIcon />
              <Text>
                {result.success ? result.message : result.error}
              </Text>
            </Alert>
          )}
        </CardBody>
      </Card>
    </Box>
  )
} 