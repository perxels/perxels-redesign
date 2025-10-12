export interface BulkQuestion {
  questionText: string
  options: string[]
  correctAnswer: string
  points: number
  order: number
  type?: string
}

export interface ParsingResult {
  questions: BulkQuestion[]
  errors: string[]
  warnings: string[]
}

export class BulkQuestionParser {
  static parseExcelData(data: any[][]): ParsingResult {
    const questions: BulkQuestion[] = []
    const errors: string[] = []
    const warnings: string[] = []

    // Skip header row (row 0) and start from row 1
    for (let i = 1; i < data.length; i++) {
      const row = data[i]

      // Skip empty rows
      if (!row || row.every((cell) => !cell || cell.toString().trim() === '')) {
        continue
      }

      try {
        const question = this.parseQuestionRow(row, i + 1)
        if (question) {
          questions.push(question)
        }
      } catch (error) {
        errors.push(
          `Row ${i + 1}: ${
            error instanceof Error ? error.message : 'Invalid format'
          }`,
        )
      }
    }

    return { questions, errors, warnings }
  }

  private static parseQuestionRow(
    row: any[],
    rowNumber: number,
  ): BulkQuestion | null {
    // Validate required columns
    if (!row[0] || !row[1]) {
      throw new Error('Question text and Option 1 are required')
    }

    const questionText = row[0].toString().trim()
    if (!questionText) {
      throw new Error('Question text is required')
    }

    // Extract options (columns 1-5 for Option 1 to Option 5)
    const options: string[] = []
    for (let j = 1; j <= 5; j++) {
      if (row[j] && row[j].toString().trim()) {
        options.push(row[j].toString().trim())
      }
    }

    if (options.length < 2) {
      throw new Error('At least 2 options are required')
    }

    // Get correct answer (column 6)
    const answerIndex = parseInt(row[6])
    if (isNaN(answerIndex) || answerIndex < 1 || answerIndex > options.length) {
      throw new Error(
        `Correct answer must be a number between 1 and ${options.length}`,
      )
    }

    const correctAnswer = options[answerIndex - 1] // Convert to 0-based index

    // Get question type (column 7) - default to Objective
    const type = row[7]?.toString().trim() || 'Objective'

    return {
      questionText,
      options,
      correctAnswer,
      points: 1, // Default points, can be customized
      order: rowNumber - 1, // 0-based order
      type,
    }
  }

  static validateQuestions(questions: BulkQuestion[]): {
    isValid: boolean
    errors: string[]
  } {
    const errors: string[] = []

    if (questions.length === 0) {
      errors.push('No valid questions found in the file')
    }

    questions.forEach((question, index) => {
      if (!question.questionText.trim()) {
        errors.push(`Question ${index + 1}: Question text is empty`)
      }

      if (question.options.length < 2) {
        errors.push(`Question ${index + 1}: At least 2 options are required`)
      }

      if (!question.correctAnswer) {
        errors.push(`Question ${index + 1}: Correct answer is required`)
      }

      // Check for duplicate options
      const uniqueOptions = new Set(
        question.options.map((opt) => opt.toLowerCase().trim()),
      )
      if (uniqueOptions.size !== question.options.length) {
        errors.push(`Question ${index + 1}: Duplicate options found`)
      }

      // Verify correct answer exists in options
      if (!question.options.includes(question.correctAnswer)) {
        errors.push(
          `Question ${index + 1}: Correct answer must match one of the options`,
        )
      }
    })

    return {
      isValid: errors.length === 0,
      errors,
    }
  }
}
