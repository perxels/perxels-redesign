// Old TimeParser
// export const parseSessionTime = (time: any): Date => {
//   try {
//     if (time && typeof time === 'object' && 'toDate' in time) {
//       return time.toDate()
//     }
//     if (typeof time === 'string' && time.includes('UTC+1')) {
//       return new Date(time.replace(' UTC+1', ''))
//     }
//     return new Date(time)
//   } catch (error) {
//     console.error('Error parsing time:', time, error)
//     return new Date()
//   }
// }

// New Time Parser COMPLETELY REPLACE
export const parseSessionTime = (time: any): Date => {
  try {
    if (!time) {
      console.warn('parseSessionTime: No time provided')
      return new Date()
    }

    // Case 1: Already a Date object
    if (time instanceof Date) {
      return time
    }

    // Case 2: Firestore Timestamp
    if (time && typeof time === 'object' && 'toDate' in time) {
      return time.toDate()
    }

    // Case 3: ISO 8601 string (PREFERRED FORMAT)
    if (typeof time === 'string' && time.includes('T')) {
      const date = new Date(time)
      if (!isNaN(date.getTime())) {
        return date
      }
    }

    // Case 4: Legacy format handling (UTC+1 etc.)
    if (typeof time === 'string') {
      // Try direct parsing first
      const directParse = new Date(time)
      if (!isNaN(directParse.getTime())) {
        return directParse
      }

      // Handle UTC+1 specifically
      if (time.includes('UTC+1')) {
        const cleanTime = time.replace(' UTC+1', '')
        const parsed = new Date(cleanTime + ' UTC+1') // Explicitly set timezone
        if (!isNaN(parsed.getTime())) {
          return parsed
        }
      }
    }

    // Case 5: Fallback with warning
    console.warn(
      'parseSessionTime: Unrecognized time format, using current time:',
      time,
    )
    return new Date()
  } catch (error) {
    console.error('parseSessionTime: Critical error parsing time:', time, error)
    return new Date()
  }
}
