import * as XLSX from 'xlsx'

export const generateQuestionTemplate = () => {
  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new()

  // Sample data matching your spreadsheet structure
  const sampleData = [
    [
      'Question Text',
      'Option 1',
      'Option 2',
      'Option 3',
      'Option 4',
      'Option 5',
      'Correct Answer',
      'Type',
    ],
    [
      'What is the main purpose of a wireframe?',
      'To finalize the visual design',
      'To show basic layout and structure',
      'To test typography choices',
      'To demonstrate high-resolution graphics',
      'Final pixel-perfect design',
      2,
      'Objective',
    ],
    [
      'Which best describes a low-fidelity wireframe?',
      'Includes detailed visuals',
      'Uses placeholder content',
      'Fully interactive prototype',
      'High-resolution mockup',
      'Final pixel-perfect design',
      2,
      'Objective',
    ],
    // Add more sample rows as needed
  ]

  const worksheet = XLSX.utils.aoa_to_sheet(sampleData)

  // Set column widths
  const colWidths = [
    { wch: 40 }, // Question Text
    { wch: 25 }, // Option 1
    { wch: 25 }, // Option 2
    { wch: 25 }, // Option 3
    { wch: 25 }, // Option 4
    { wch: 25 }, // Option 5
    { wch: 15 }, // Correct Answer
    { wch: 15 }, // Type
  ]
  worksheet['!cols'] = colWidths

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Questions Template')

  // Generate and download the file
  XLSX.writeFile(workbook, 'question-template.xlsx')
}
