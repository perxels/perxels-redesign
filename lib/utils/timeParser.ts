export const parseSessionTime = (time: any): Date => {
  try {
    if (time && typeof time === 'object' && 'toDate' in time) {
      return time.toDate()
    }
    if (typeof time === 'string' && time.includes('UTC+1')) {
      return new Date(time.replace(' UTC+1', ''))
    }
    return new Date(time)
  } catch (error) {
    console.error('Error parsing time:', time, error)
    return new Date()
  }
}
