// utils/syllabusTemplateApplicator.ts
import {
  collection,
  doc,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore'
import { CLASS_PLAN_CONFIGS } from '../constant/classPlans'
import { Syllabus } from '../types/syllabus.types'
import { calculateClassSchedule, calculateEndDate } from './scheduleCalculator'
import { portalDb } from '../portalFirebaseConfig'

export const applySyllabusToClassPlans = async (
  syllabus: Syllabus,
  classId: string,
  cohortName: string,
  startDate: Date,
  createdBy: string,
) => {
  const batch = writeBatch(portalDb)

  for (const classPlanKey of Object.keys(CLASS_PLAN_CONFIGS)) {
    const classPlanConfig =
      CLASS_PLAN_CONFIGS[classPlanKey as keyof typeof CLASS_PLAN_CONFIGS]

    // Calculate specific schedule for this class plan
    const scheduledDays = calculateClassSchedule({
      startDate: new Date(startDate),
      syllabus: syllabus,
      classPlan: classPlanKey,
    })

    const classPlanSyllabusData = {
      classId: classId,
      cohortName: cohortName.trim().toUpperCase(),
      classPlan: classPlanKey,
      baseSyllabusId: syllabus.id,
      syllabus: { ...syllabus }, // Deep copy to allow individual edits
      startDate: new Date(startDate),
      endDate: calculateEndDate(new Date(startDate), syllabus, classPlanKey),
      scheduledDays: scheduledDays,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: createdBy,
      isActive: true,
    }

    const classPlanSyllabusRef = doc(collection(portalDb, 'classPlanSyllabi'))
    batch.set(classPlanSyllabusRef, classPlanSyllabusData)
  }

  await batch.commit()
}
