import { collection, doc, setDoc, getDocs } from 'firebase/firestore'
import { portalDb } from '../portalFirebaseConfig'

export const DEFAULT_SYLLABUS_TEMPLATES = [
  {
    id: 'ui-ux-foundation-14w',
    name: 'UI/UX Design Foundation Course',
    description:
      'Comprehensive 14-week UI/UX design course covering fundamentals to advanced concepts',
    totalWeeks: 14,
    totalDays: 28,
    classPattern: {
      sessionsPerWeek: 2,
      recommendedDays: [1, 3], // Monday, Wednesday
      totalSessions: 28,
    },
    weeks: [
      {
        id: 'week-1',
        weekNumber: 1,
        title: 'WEEK ONE - INTRODUCTION',
        order: 1,
        days: [
          {
            id: 'week-1-day-1',
            dayNumber: 1,
            title: 'Introduction to UI/UX Design and Figma',
            content: `• Difference between mobile and web screens\n• First design: Hero section\n• Minimum to do in first class is hero section\n• Delete the student project in class`,
            assignments: [
              'Recreate what was done in class and design another hero section project',
            ],
            duration: '2-3 hours',
            isPhysical: true,
            order: 1,
          },
          {
            id: 'week-1-day-2',
            dayNumber: 2,
            title: 'Advanced Sections and Color Theory',
            content: `• Evaluate students' assignments\n• Teach the student to create additional sections\n• Introduction to color theory`,
            assignments: ['Practice what was done in class'],
            duration: '2-3 hours',
            isPhysical: true,
            order: 2,
          },
        ],
      },
      // Add more weeks as needed from your existing DEFAULT_SYLLABUS
    ],
    isActive: true,
    version: '2.0.0',
  },
]

export const setupSyllabusTemplates = async () => {
  try {
    const templatesCollection = collection(portalDb, 'syllabusTemplates')
    const existingTemplates = await getDocs(templatesCollection)

    // Only create templates if they don't exist
    if (existingTemplates.empty) {
      for (const template of DEFAULT_SYLLABUS_TEMPLATES) {
        const templateRef = doc(templatesCollection, template.id)
        await setDoc(templateRef, {
          ...template,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      }
      console.log('Syllabus templates setup completed!')
    } else {
      console.log('Syllabus templates already exist')
    }
  } catch (error) {
    console.error('Error setting up syllabus templates:', error)
  }
}
