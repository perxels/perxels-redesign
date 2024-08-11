export   const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number)
    const period = hours >= 12 ? 'pm' : 'am'
    const adjustedHours = hours % 12 || 12
    return `${adjustedHours}:${minutes.toString().padStart(2, '0')} ${period}`
  }
  export  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }
    return date.toLocaleDateString(undefined, options)
  }