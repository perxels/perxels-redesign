export function formatTime(dateTimeString:string) {
    if(!dateTimeString) return;
    const date = new Date(dateTimeString);
  
    // Format time
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert 24-hour to 12-hour format
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  
    return `${formattedHours}:${formattedMinutes}${period}`;
  }

  
  export function formatDate(dateTimeString:string) {
    if(!dateTimeString) return;
    const date = new Date(dateTimeString);
  
  
  // Format day with suffix
  const day: number = date.getDate();
  const suffix = (day: number): string => {
    if (day > 3 && day < 21) return 'th'; // Handles 4-20
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };
  const formattedDay = `${day}${suffix(day)}`;

  // Format month
  const months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const month: string = months[date.getMonth()];

  // Format year
  const year: number = date.getFullYear();

  return `${formattedDay} ${month} ${year}`;
}
