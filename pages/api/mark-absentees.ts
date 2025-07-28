import type { NextApiRequest, NextApiResponse } from 'next'
import { getFirestore } from 'firebase-admin/firestore'
import { initializeApp, cert, getApps } from 'firebase-admin/app'

// Initialize Firebase Admin SDK
if (!getApps().length) {
  initializeApp({
    credential: cert({
      // Use env vars or Vercel secrets for these
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\n/g, '\n'),
    }),
  })
}
const db = getFirestore()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 1. Find today's attendance sessions
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    const todayStr = `${year}-${month}-${day}`

    const attendanceSnap = await db.collection('attendance').get()
    const batch = db.batch()
    let updatedCount = 0

    for (const attendanceDoc of attendanceSnap.docs) {
      const attendanceData = attendanceDoc.data()
      if (attendanceData.date !== todayStr) continue

      // 2. For each session, get all checkins
      const checkinsSnap = await attendanceDoc.ref.collection('checkins').get()
      for (const checkinDoc of checkinsSnap.docs) {
        const checkinData = checkinDoc.data()
        if (!checkinData.checkedIn) {
          // 3. Mark as absent
          batch.update(checkinDoc.ref, { checkedIn: false, status: 'absent' })
          updatedCount++
        }
      }
    }

    await batch.commit()
    res.status(200).json({ success: true, updatedCount })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, error: (error as Error).message })
  }
}