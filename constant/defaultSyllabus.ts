import { Syllabus } from '../types/syllabus.types'

export const DEFAULT_SYLLABUS: Omit<Syllabus, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'version'> = {
  name: 'UI/UX Design Foundation Course',
  description: 'Comprehensive 14-week UI/UX design course covering fundamentals to advanced concepts',
  totalWeeks: 14,
  totalDays: 28,
  isActive: true,
  weeks: [
    {
      id: 'week-1',
      weekNumber: 1,
      title: 'WEEK ONE',
      order: 1,
      days: [
        {
          id: 'week-1-day-1',
          dayNumber: 1,
          title: 'Introduction to UI/UX Design and the Figma Environment',
          content: `• Difference between mobile and web screens
• First design: Hero section (sometimes we can do to the third section for weekend student because they have three hours, and sometimes we might not because some people are slow in catching up)
• Minimum to do in first class is hero section
• Delete the student project in class`,
          assignments: ['Recreate what was done in class and design another hero section project'],
          duration: '2-3 hours',
          isPhysical: true,
          order: 1
        },
        {
          id: 'week-1-day-2',
          dayNumber: 2,
          title: 'Advanced Sections and Color Theory',
          content: `• Evaluate students' assignments
• Teach the student to create the third, fourth, and fifth sections of a webpage or the remaining section
• In some classes, they may be fast and we might need to teach them to add color`,
          assignments: ['Practice what was done in class'],
          duration: '2-3 hours',
          isPhysical: true,
          order: 2
        }
      ]
    },
    {
      id: 'week-2',
      weekNumber: 2,
      title: 'WEEK TWO',
      order: 2,
      days: [
        {
          id: 'week-2-day-1',
          dayNumber: 1,
          title: 'Principles of Icons, Pictures, Colors, and Gradients',
          content: `• Evaluate assignments
• Conduct a test (10mins): https://forms.gle/gqHhdVEbEPTDgSV66
• Principles of icons, adding pictures, colors, and gradients
• After this, teacher design Interject project in class
• Give the student the resources link: https://drive.google.com/drive/folders/1bDSdDLz0sx6GnAHA79BnGSMdNr0gqyqM
• Introduction to pie charts, graphs, and working with shadows (X, Y, Blur, Spread, Color, Opacity)
• Watch video
• Teach alignment principles`,
          assignments: ['Complete the Interject design at home'],
          duration: '2-3 hours',
          isPhysical: true,
          order: 1
        },
        {
          id: 'week-2-day-2',
          dayNumber: 2,
          title: 'Typography and Font Selection',
          content: `• Evaluate their work
• Different between serif and sans serif font: https://www.youtube.com/watch?v=ws0ANlC6Btg`,
          assignments: [],
          duration: '2-3 hours',
          isPhysical: true,
          order: 2
        }
      ]
    },
    {
      id: 'week-3',
      weekNumber: 3,
      title: 'WEEK THREE',
      order: 3,
      days: [
        {
          id: 'week-3-day-1',
          dayNumber: 1,
          title: 'Landing Page Design and Hero Section Principles',
          content: `• Evaluate assignments
• Begin designing a long landing page
• Principles of the hero section: https://youtu.be/L7Oj_syyTUA
• Students attempt the hero section in class and two other section (depending on the time at hand)
• Test on alignment`,
          assignments: ['Attempt three additional sections'],
          duration: '2-3 hours',
          isPhysical: true,
          order: 1
        },
        {
          id: 'week-3-day-2',
          dayNumber: 2,
          title: 'Hierarchy Introduction',
          content: `• Evaluate students' work
• Introduction to Hierarchy (Part 1)`,
          assignments: ['Complete the landing page by next week'],
          duration: '2-3 hours',
          isPhysical: true,
          order: 2
        }
      ]
    },
    {
      id: 'week-4',
      weekNumber: 4,
      title: 'WEEK FOUR',
      order: 4,
      days: [
        {
          id: 'week-4-day-1',
          dayNumber: 1,
          title: 'Hierarchy and Design Brief',
          content: `• Hierarchy (Part 2)
• Design brief
• Empathy definition
• Answer the 10 questions
• Section creation`,
          assignments: [
            'Name your startup',
            'Complete empathy questions (1-10)',
            'Create section for the new startup'
          ],
          duration: '2-3 hours',
          isPhysical: true,
          order: 1
        },
        {
          id: 'week-4-day-2',
          dayNumber: 2,
          title: 'Moodboard Creation',
          content: `• Evaluate question 2, 4, 6 and 8
• Evaluate their section
• Teach moodboard`,
          assignments: ['Come up with complete moodboard and proper labelling. No inspiration from graphical element'],
          duration: '2-3 hours',
          isPhysical: true,
          order: 2
        }
      ]
    },
    {
      id: 'week-5',
      weekNumber: 5,
      title: 'WEEK FIVE',
      order: 5,
      days: [
        {
          id: 'week-5-day-1',
          dayNumber: 1,
          title: 'Sketching and Wireframing',
          content: `• Principles of sketching
• Students sketch their ideas, focusing on layout flow
• Introduction to wireframing through video instruction
• Create hero section wireframe in class
• Teach font as well (No student should use inter or roboto or aria)
• You might advise student to use manrope just incase you don't have time or student find it difficult to download it in class`,
          assignments: ['Work on the hero section and two other sections in low fidelity'],
          duration: '2-3 hours',
          isPhysical: true,
          order: 1
        },
        {
          id: 'week-5-day-2',
          dayNumber: 2,
          title: 'Low-Fidelity Design Completion',
          content: `• Evaluate low-fidelity designs
• Introduction to fontshare.com`,
          assignments: ['Complete other sections low fidelity'],
          duration: '2-3 hours',
          isPhysical: true,
          order: 2
        }
      ]
    },
    {
      id: 'week-6',
      weekNumber: 6,
      title: 'WEEK SIX',
      order: 6,
      days: [
        {
          id: 'week-6-day-1',
          dayNumber: 1,
          title: 'Colors and Pictures Integration',
          content: `• Students work on low-fidelity designs for 1 hour (This is because most of them will have issues)
• Concept of colors and pictures
• Concept of picture
• Continue low-fidelity work in class`,
          assignments: ['Add colors and pictures to designs'],
          duration: '2-3 hours',
          isPhysical: true,
          order: 1
        },
        {
          id: 'week-6-day-2',
          dayNumber: 2,
          title: 'Vaccine App Introduction',
          content: `• Evaluate colors and pictures in students' designs
• Provide Vaccine App video`,
          assignments: ['Student should write out WhatsApp IA PDF according to the video'],
          duration: '2-3 hours',
          isPhysical: true,
          order: 2
        }
      ]
    },
    {
      id: 'week-7',
      weekNumber: 7,
      title: 'WEEK SEVEN',
      order: 7,
      days: [
        {
          id: 'week-7-day-1',
          dayNumber: 1,
          title: 'Information Architecture',
          content: `• New Project: Vaccine App
• Explain Information Architecture (IA)
• Work on IA using lemfi.com as a case study
• Students create their own IA
• Using chatgpt to craft information architecture`,
          assignments: ['Complete IA'],
          duration: '2-3 hours',
          isPhysical: true,
          order: 1
        },
        {
          id: 'week-7-day-2',
          dayNumber: 2,
          title: 'IA Evaluation and Completion',
          content: `• Evaluate IA (students must have a completed IA)`,
          assignments: [],
          duration: '2-3 hours',
          isPhysical: true,
          order: 2
        }
      ]
    },
    {
      id: 'week-8',
      weekNumber: 8,
      title: 'WEEK EIGHT',
      order: 8,
      days: [
        {
          id: 'week-8-day-1',
          dayNumber: 1,
          title: 'Free Workday and Resource Management',
          content: `• Free workday: Complete moodboards, proper labeling, and inspiration selection
• Provide videos on Freepik and CloudConvert`,
          assignments: [],
          duration: '2-3 hours',
          isPhysical: true,
          order: 1
        },
        {
          id: 'week-8-day-2',
          dayNumber: 2,
          title: 'Moodboard Evaluation',
          content: `• Evaluate moodboards`,
          assignments: ['Work on at least one homepage low-fidelity design'],
          duration: '2-3 hours',
          isPhysical: true,
          order: 2
        }
      ]
    },
    {
      id: 'week-9',
      weekNumber: 9,
      title: 'WEEK NINE',
      order: 9,
      days: [
        {
          id: 'week-9-day-1',
          dayNumber: 1,
          title: 'Design Systems and Low-Fidelity',
          content: `• Return to class
• Evaluate low-fidelity of homepage designs
• Introduction to Design Systems
• Student continue with low fidelity`,
          assignments: ['Complete all 7-page web screen in low fidelity'],
          duration: '2-3 hours',
          isPhysical: true,
          order: 1
        },
        {
          id: 'week-9-day-2',
          dayNumber: 2,
          title: 'Responsiveness and Mobile Design',
          content: `• Evaluate students' work
• Redesign poorly structured sections
• Provide video on responsiveness and mobile app design`,
          assignments: ['Work on responsiveness'],
          duration: '2-3 hours',
          isPhysical: true,
          order: 2
        }
      ]
    },
    {
      id: 'week-10',
      weekNumber: 10,
      title: 'WEEK TEN (ONLINE)',
      order: 10,
      days: [
        {
          id: 'week-10-day-1',
          dayNumber: 1,
          title: 'SaveUp Project Research',
          content: `• SaveUp project
• Research templates and PDFs`,
          assignments: ['Draft 10 open-ended and 10 closed-ended questions'],
          duration: '2-3 hours',
          isOnline: true,
          order: 1
        },
        {
          id: 'week-10-day-2',
          dayNumber: 2,
          title: 'Question Submission and Distribution',
          content: `• Submit all questions for evaluation
• Grant edit access (not just view) to info@perxels.org
• Send out questions by Monday night`,
          assignments: [],
          duration: '2-3 hours',
          isOnline: true,
          order: 2
        }
      ]
    },
    {
      id: 'week-11',
      weekNumber: 11,
      title: 'WEEK ELEVEN',
      order: 11,
      days: [
        {
          id: 'week-11-day-1',
          dayNumber: 1,
          title: 'User Research and Personas',
          content: `• Student progress reports
• Videos on User Persona, Empathy Map, and Affinity Mapping
• Introduction to Miro Tool`,
          assignments: [],
          duration: '2-3 hours',
          isOnline: true,
          order: 1
        },
        {
          id: 'week-11-day-2',
          dayNumber: 2,
          title: 'Feature Flow and Evaluation',
          content: `• Evaluate User Persona, Empathy Map, and Affinity Mapping
• Teach Feature Flow`,
          assignments: [],
          duration: '2-3 hours',
          isPhysical: true,
          order: 2
        }
      ]
    },
    {
      id: 'week-12',
      weekNumber: 12,
      title: 'WEEK TWELVE',
      order: 12,
      days: [
        {
          id: 'week-12-day-1',
          dayNumber: 1,
          title: 'Feature Flow and Product Teardown',
          content: `• Feature Flow & Product Teardown`,
          assignments: [],
          duration: '2-3 hours',
          isOnline: true,
          order: 1
        },
        {
          id: 'week-12-day-2',
          dayNumber: 2,
          title: 'Sketching Phase',
          content: `• First Day Sketching (70% completion)`,
          assignments: [],
          duration: '7 hours',
          isPhysical: true,
          order: 2
        }
      ]
    },
    {
      id: 'week-13',
      weekNumber: 13,
      title: 'WEEK THIRTEEN',
      order: 13,
      days: [
        {
          id: 'week-13-day-1',
          dayNumber: 1,
          title: 'Complete Sketching',
          content: `• Complete sketching (100%)`,
          assignments: [],
          duration: '2-3 hours',
          isOnline: true,
          order: 1
        },
        {
          id: 'week-13-day-2',
          dayNumber: 2,
          title: 'Low-Fidelity Design Begin',
          content: `• Begin low-fidelity designs (30%)`,
          assignments: [],
          duration: '7 hours',
          isPhysical: true,
          order: 2
        }
      ]
    },
    {
      id: 'week-14',
      weekNumber: 14,
      title: 'WEEK FOURTEEN',
      order: 14,
      days: [
        {
          id: 'week-14-day-1',
          dayNumber: 1,
          title: 'Usability Testing',
          content: `• Usability Testing`,
          assignments: [],
          duration: '2-3 hours',
          isOnline: true,
          order: 1
        },
        {
          id: 'week-14-day-2',
          dayNumber: 2,
          title: 'Portfolio and Celebration',
          content: `• Complete 100% low-fidelity designs
• Portfolio/Pizza Party`,
          assignments: [],
          duration: '2-3 hours',
          isPhysical: true,
          order: 2
        }
      ]
    }
  ]
}
