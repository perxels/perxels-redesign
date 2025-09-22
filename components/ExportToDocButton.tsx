import React, { useState } from 'react'
import { Button, useToast } from '@chakra-ui/react'
import { HiDownload } from 'react-icons/hi'

interface ExportToDocButtonProps {
  data: any[]
  fileName: string
  title: string
  dataType: 'sessions' | 'students' | 'dailyCodes' | 'reports'
  isLoading?: boolean
}

export const ExportToDocButton: React.FC<ExportToDocButtonProps> = ({
  data,
  fileName,
  title,
  dataType,
  isLoading = false,
}) => {
  const [exporting, setExporting] = useState(false)
  const toast = useToast()

  const exportToDocx = async () => {
    if (data.length === 0) {
      toast({
        title: 'No data to export',
        status: 'warning',
        duration: 3000,
      })
      return
    }

    setExporting(true)

    try {
      // Dynamically import the docx library
      const {
        Document,
        Paragraph,
        Table,
        TableRow,
        TableCell,
        TextRun,
        HeadingLevel,
        Packer,
        WidthType,
      } = await import('docx')

      // Get table headers and rows based on data type
      const { headers, rows } = generateTableData(data, dataType)

      // Create table rows
      const tableRows = [
        // Header row
        new TableRow({
          children: headers.map(
            (header) =>
              new TableCell({
                children: [
                  new Paragraph({
                    children: [new TextRun({ text: header, bold: true })],
                  }),
                ],
                shading: { fill: 'D3D3D3' }, // Light gray background for headers
              }),
          ),
        }),
        // Data rows
        ...rows.map(
          (row) =>
            new TableRow({
              children: row.map(
                (cell) =>
                  new TableCell({
                    children: [new Paragraph({ text: cell })],
                  }),
              ),
            }),
        ),
      ]

      // Create document
      const doc = new Document({
        title: title,
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                text: title,
                heading: HeadingLevel.HEADING_1,
              }),
              new Paragraph({
                text: `Generated on: ${new Date().toLocaleDateString()}`,
              }),
              new Paragraph({}),
              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: tableRows,
              }),
            ],
          },
        ],
      })

      // Generate and download
      const blob = await Packer.toBlob(doc)
      saveAs(blob, `${fileName}.docx`)

      toast({
        title: 'Export successful',
        description: 'Document downloaded successfully',
        status: 'success',
        duration: 3000,
      })
    } catch (error) {
      console.error('Export error:', error)
      toast({
        title: 'Export failed',
        description: 'Failed to generate document',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setExporting(false)
    }
  }

  // Helper function to generate table data based on type
  const generateTableData = (data: any[], type: string) => {
    switch (type) {
      case 'sessions':
        return {
          headers: [
            'Date',
            'Cohort',
            'Plan',
            'Time',
            'Status',
            'Created By',
            'Session ID',
          ],
          rows: data.map((session) => [
            session.date || 'N/A',
            session.cohortId || 'N/A',
            session.planId || 'N/A',
            `${formatTime(session.startsAt)} - ${formatTime(session.endsAt)}`,
            session.status || 'N/A',
            session.createdBy || 'System',
            session.sessionId?.substring(0, 8) + '...' || 'N/A',
          ]),
        }

      case 'students':
        return {
          headers: [
            'Student Name',
            'Email',
            'Cohort',
            'Plan',
            'Total Sessions',
            'Check-ins',
            'Attendance Rate',
          ],
          rows: data.map((student) => [
            student.fullName || student.email || 'Unknown',
            student.email || 'N/A',
            student.schoolFeeInfo?.cohort || 'N/A',
            student.schoolFeeInfo?.classPlan || 'N/A',
            student.totalSessions?.toString() || '0',
            student.checkIns?.toString() || '0',
            student.totalSessions > 0
              ? `${((student.checkIns / student.totalSessions) * 100).toFixed(
                  1,
                )}%`
              : '0%',
          ]),
        }

      case 'dailyCodes':
        return {
          headers: ['Date', 'Code', 'Status', 'Created At'],
          rows: data.map((code) => [
            code.date || 'N/A',
            code.code || 'N/A',
            code.status || 'N/A',
            code.createdAt
              ? new Date(code.createdAt).toLocaleDateString()
              : 'N/A',
          ]),
        }

      case 'reports':
        return {
          headers: [
            'Date',
            'Cohort',
            'Plan',
            'Total Students',
            'Present',
            'Attendance Rate',
          ],
          rows: data.map((report) => [
            report.date || 'N/A',
            report.cohortId || report.cohort || 'N/A',
            report.planId || report.plan || 'N/A',
            report.totalStudents?.toString() || '0',
            report.presentCount?.toString() || '0',
            report.attendanceRate
              ? `${report.attendanceRate.toFixed(1)}%`
              : '0%',
          ]),
        }

      default:
        // Generic fallback - use object keys as headers
        const headers = Object.keys(data[0] || {})
        return {
          headers,
          rows: data.map((item) =>
            headers.map((header) =>
              typeof item[header] === 'object'
                ? JSON.stringify(item[header])
                : String(item[header] || 'N/A'),
            ),
          ),
        }
    }
  }

  const formatTime = (timeString: string) => {
    if (!timeString) return 'N/A'
    return new Date(timeString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <Button
      leftIcon={<HiDownload />}
      onClick={exportToDocx}
      isLoading={isLoading || exporting}
      isDisabled={data.length === 0}
      size="sm"
      colorScheme="blue"
      variant="outline"
    >
      {exporting ? 'Exporting...' : 'Export to Word'}
    </Button>
  )
}
