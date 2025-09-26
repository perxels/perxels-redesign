import { utils, writeFile } from 'xlsx'
import { saveAs } from 'file-saver'
import { flattenStudentData } from './exportHelpers'

export const exportToCSV = (students: any[], filters: any, toast: any) => {
  try {
    const flattenedData = flattenStudentData(students)

    // Enhanced CSV formatting with better handling
    const headers = Object.keys(flattenedData[0])

    // Create CSV content with proper formatting
    let csvContent = '\uFEFF' // UTF-8 BOM for Excel compatibility

    // Add headers
    csvContent +=
      headers.map((header) => `"${escapeCSVValue(header)}"`).join(',') + '\r\n'

    // Add data rows
    flattenedData.forEach((student) => {
      const row = headers.map((header) => {
        // const value = student[header]
        const value = student[header as keyof typeof student]
        return `"${escapeCSVValue(value)}"`
      })
      csvContent += row.join(',') + '\r\n'
    })

    // Create blob and download
    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;',
    })

    const timestamp = new Date().toISOString().split('T')[0]
    const filename = `students_export_${timestamp}.csv`

    saveAs(blob, filename)

    toast({
      title: 'CSV Export Successful!',
      description: `${students.length} student records downloaded`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  } catch (error) {
    console.error('CSV export error:', error)
    throw new Error('Failed to generate CSV file')
  }
}

export const exportToExcel = (students: any[], filters: any, toast: any) => {
  try {
    const flattenedData = flattenStudentData(students)

    // Create worksheet with enhanced formatting
    const worksheet = utils.json_to_sheet(flattenedData)

    // Set optimal column widths based on content
    const colWidths = [
      { wch: 28 }, // Student ID
      { wch: 25 }, // Full Name
      { wch: 30 }, // Email
      { wch: 15 }, // Phone
      { wch: 20 }, // Branch
      { wch: 12 }, // Role
      { wch: 15 }, // Cohort
      { wch: 20 }, // Class Plan
      { wch: 15 }, // Overall Status
      { wch: 15 }, // Total School Fee
      { wch: 15 }, // Total Submitted
      { wch: 15 }, // Total Approved
      { wch: 15 }, // Payment Count
      { wch: 20 }, // Profession
      { wch: 10 }, // Gender
      { wch: 30 }, // Class Outcome
      { wch: 35 }, // Why Class
      { wch: 15 }, // Total Sessions
      { wch: 12 }, // Check-ins
      { wch: 15 }, // Attendance Rate
      { wch: 20 }, // Created At
      { wch: 15 }, // Email Verified
      { wch: 20 }, // Registration Complete
      { wch: 20 }, // Onboarding Complete
      { wch: 15 }, // Terms Agreed
      { wch: 18 }, // First Payment Amount
      { wch: 18 }, // First Payment Status
      { wch: 20 }, // First Payment Date
    ]

    worksheet['!cols'] = colWidths

    // Create workbook with multiple sheets
    const workbook = utils.book_new()
    utils.book_append_sheet(workbook, worksheet, 'Students')

    // Add summary sheet
    const summaryData = generateSummaryData(students)
    const summarySheet = utils.json_to_sheet(summaryData)
    utils.book_append_sheet(workbook, summarySheet, 'Summary')

    // Add filters sheet
    const filtersData = Object.entries(filters).map(([key, value]) => ({
      Filter: key,
      Value: String(value),
    }))
    const filtersSheet = utils.json_to_sheet(
      filtersData.length > 0
        ? filtersData
        : [{ Filter: 'None', Value: 'All students' }],
    )
    utils.book_append_sheet(workbook, filtersSheet, 'Filters')

    // Generate filename
    const timestamp = new Date().toISOString().split('T')[0]
    const filename = `students_export_${timestamp}.xlsx`

    // Write file with enhanced options
    writeFile(workbook, filename, {
      compression: true,
      bookType: 'xlsx',
    })

    toast({
      title: 'Excel Export Successful!',
      description: `${students.length} student records downloaded with enhanced formatting`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  } catch (error) {
    console.error('Excel export error:', error)
    throw new Error('Failed to generate Excel file')
  }
}

// Helper function to escape CSV values
const escapeCSVValue = (value: any): string => {
  if (value === null || value === undefined || value === '') {
    return ''
  }

  const stringValue = String(value)
  // Escape double quotes by doubling them
  return stringValue.replace(/"/g, '""')
}

// Generate summary data for Excel
const generateSummaryData = (students: any[]) => {
  const totalStudents = students.length
  const paidStudents = students.filter((s) => s.owingStatus === 'Paid').length
  const owingStudents = students.filter((s) => s.owingStatus === 'Owing').length

  const totalFee = students.reduce(
    (sum, s) => sum + (s.schoolFeeInfo?.totalSchoolFee || 0),
    0,
  )
  const totalApproved = students.reduce(
    (sum, s) => sum + (s.schoolFeeInfo?.totalApproved || 0),
    0,
  )
  const totalOwing = totalFee - totalApproved

  return [
    { Metric: 'Total Students', Value: totalStudents },
    {
      Metric: 'Paid Students',
      Value: paidStudents,
      Percentage: `${((paidStudents / totalStudents) * 100).toFixed(1)}%`,
    },
    {
      Metric: 'Owing Students',
      Value: owingStudents,
      Percentage: `${((owingStudents / totalStudents) * 100).toFixed(1)}%`,
    },
    { Metric: 'Total School Fees', Value: `₦${totalFee.toLocaleString()}` },
    {
      Metric: 'Total Approved Payments',
      Value: `₦${totalApproved.toLocaleString()}`,
    },
    { Metric: 'Total Amount Owing', Value: `₦${totalOwing.toLocaleString()}` },
    {
      Metric: 'Collection Rate',
      Value: `${((totalApproved / totalFee) * 100).toFixed(1)}%`,
    },
    { Metric: 'Export Generated', Value: new Date().toLocaleString() },
  ]
}
