import { Timestamp } from 'firebase/firestore'

// Convert a single value that might be a Timestamp
export const toDate = (value: any): Date => {
  if (value instanceof Timestamp) {
    return value.toDate()
  }
  if (value instanceof Date) {
    return value
  }
  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value)
    if (!isNaN(date.getTime())) {
      return date
    }
  }
  console.warn('Unable to convert value to Date, using current date:', value)
  return new Date() // fallback
}

// Convert Firestore document with timestamps
export const convertDocWithTimestamps = (doc: any): any => {
  if (!doc) return doc

  const data = doc.data ? doc.data() : doc
  const id = doc.id

  const convertedData = Object.keys(data).reduce((acc, key) => {
    let value = data[key]

    // Handle Timestamp
    if (value instanceof Timestamp) {
      value = value.toDate()
    }
    // Handle arrays (like sessions, assignments)
    else if (Array.isArray(value)) {
      value = value.map((item) => {
        if (item instanceof Timestamp) {
          return item.toDate()
        }
        if (typeof item === 'object' && item !== null) {
          // Convert nested objects in arrays
          return Object.keys(item).reduce((objAcc, objKey) => {
            let objValue = item[objKey]
            if (objValue instanceof Timestamp) {
              objValue = objValue.toDate()
            }
            objAcc[objKey] = objValue
            return objAcc
          }, {} as any)
        }
        return item
      })
    }
    // Handle nested objects (like syllabus, schedule)
    else if (
      typeof value === 'object' &&
      value !== null &&
      !(value instanceof Date)
    ) {
      value = Object.keys(value).reduce((objAcc, objKey) => {
        let objValue = value[objKey]
        if (objValue instanceof Timestamp) {
          objValue = objValue.toDate()
        }
        objAcc[objKey] = objValue
        return objAcc
      }, {} as any)
    }

    acc[key] = value
    return acc
  }, {} as any)

  return {
    id,
    ...convertedData,
  }
}
