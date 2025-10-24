export const SYLLABUS_TEMPLATES = {
  'ui-ux-foundation': {
    id: 'ui-ux-foundation',
    name: 'UI/UX Design Foundation Course',
    description:
      'Comprehensive 14-week UI/UX design course covering fundamentals to advanced concepts',
    totalWeeks: 14,
    totalDays: 28,
    defaultDuration: 14, // weeks
    weeks: [
      {
        id: 'week-1',
        weekNumber: 1,
        title: 'WEEK ONE - INTRODUCTION TO UI/UX DESIGN',
        order: 1,
        days: [
          {
            id: 'week-1-day-1',
            dayNumber: 1,
            title: 'Introduction to UI/UX Design and Figma',
            content: `• Understanding UI vs UX Design\n• Introduction to Design Thinking\n• Figma workspace overview\n• Creating your first design: Hero section\n• Mobile vs Web screen differences`,
            assignments: [
              'Recreate the hero section designed in class',
              'Design another hero section for a different product',
            ],
            resources: [
              'Figma basics tutorial',
              'Design thinking principles guide',
            ],
            duration: '2-3 hours',
            isOnline: true,
            isPhysical: true,
            order: 1,
          },
          {
            id: 'week-1-day-2',
            dayNumber: 2,
            title: 'Advanced Sections and Color Theory',
            content: `• Review and evaluate student assignments\n• Creating additional website sections\n• Introduction to color theory and psychology\n• Color palettes and accessibility`,
            assignments: [
              'Practice creating multiple sections for a website',
              'Create 3 different color palettes for your design',
            ],
            resources: ['Color theory guide', 'Accessibility contrast checker'],
            duration: '2-3 hours',
            isOnline: true,
            isPhysical: true,
            order: 2,
          },
        ],
      },
      // Add remaining 13 weeks following the same pattern...
    ],
  },
} as const
