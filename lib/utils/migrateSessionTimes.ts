// Time migration to ISO 8601 strings - Only need to run once
import { getDocs, collection, updateDoc, doc } from 'firebase/firestore'
import { parseSessionTime } from './timeParser'
import { portalDb } from '../../portalFirebaseConfig'

export async function migrateSessionTimes() {
  const sessionsRef = collection(portalDb, 'sessions')
  const snapshot = await getDocs(sessionsRef)

  const migrationPromises = snapshot.docs.map(async (docSnap) => {
    const session = docSnap.data()

    // Parse and convert to ISO strings
    const startsAtISO = parseSessionTime(session.startsAt).toISOString()
    const endsAtISO = parseSessionTime(session.endsAt).toISOString()

    // Only update if different
    if (session.startsAt !== startsAtISO || session.endsAt !== endsAtISO) {
      await updateDoc(doc(portalDb, 'sessions', docSnap.id), {
        startsAt: startsAtISO,
        endsAt: endsAtISO,
        migratedAt: new Date().toISOString(),
      })
      console.log(`Migrated session: ${docSnap.id}`)
    }
  })

  await Promise.all(migrationPromises)
  console.log('Session time migration completed')
}
