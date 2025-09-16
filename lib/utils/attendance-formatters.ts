import { format } from 'date-fns'

export const formatDate = (dateValue: any): string => {
  if (!dateValue) return 'N/A'
  
  try {
    let date: Date
    
    // Handle Firestore Timestamp objects
    if (dateValue && typeof dateValue === 'object' && dateValue.seconds) {
      date = new Date(dateValue.seconds * 1000)
    } else if (dateValue.toDate && typeof dateValue.toDate === 'function') {
      date = dateValue.toDate()
    } else {
      date = new Date(dateValue)
    }
    
    // Check if date is valid
    if (isNaN(date.getTime())) return 'N/A'
    
    return format(date, 'MMM dd, yyyy')
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'N/A'
  }
}

export const formatTime = (dateValue: any): string => {
  if (!dateValue) return 'N/A'
  
  try {
    let date: Date
    
    // Handle Firestore Timestamp objects
    if (dateValue && typeof dateValue === 'object' && dateValue.seconds) {
      date = new Date(dateValue.seconds * 1000)
    } else if (dateValue.toDate && typeof dateValue.toDate === 'function') {
      date = dateValue.toDate()
    } else {
      date = new Date(dateValue)
    }
    
    // Check if date is valid
    if (isNaN(date.getTime())) return 'N/A'
    
    return format(date, 'HH:mm')
  } catch (error) {
    console.error('Error formatting time:', error)
    return 'N/A'
  }
}

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'green'
    case 'expired': return 'red'
    case 'open': return 'blue'
    case 'closed': return 'gray'
    case 'cancelled': return 'red'
    default: return 'gray'
  }
}
