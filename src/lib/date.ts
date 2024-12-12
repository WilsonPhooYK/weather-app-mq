// Map month name to month number
const monthMap: { [key: string]: string } = {
  Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
  Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
};

/**
 * Formats a UNIX timestamp into a human-readable date string based on a provided timezone offset.
 * The format is: 'dd-mm-yyyy hh:mmam/pm'
 * 
 * @param dt - The UNIX timestamp (in seconds).
 * @param timezoneOffset - The timezone offset (in seconds) to adjust the time.
 * 
 * @returns A formatted date string in the format 'dd-mm-yyyy hh:mmam/pm' or the original UTC string if there's an error.
 */
export default function getFormattedLocaleDateTime(
  dt?: number, // UNIX timestamp in seconds
  timezoneOffset?: number // Timezone offset in seconds
) {
  if (dt === undefined || timezoneOffset === undefined) return '';

  // Calculate the date with timezone offset applied
  const date = new Date((dt + timezoneOffset) * 1000);
  
  // Eg: Wed, 11 Dec 2024 23:04:52 GMT
  const utcString = date.toUTCString();

  try {
    // dateTimeParts = 11 Dec 2024 23:04:52 GMT
    const dateTimeParts = (utcString.split(', ')[1] || '').split(' ');
    const day = dateTimeParts[0];
    const month = monthMap[dateTimeParts[1]];
    const year = dateTimeParts[2];

    // timeParts = 23:04:52
    const timeParts = dateTimeParts[3].split(':');
    let hourInt = Number.parseInt(timeParts[0]);
    if (Number.isNaN(hourInt)) {
      throw new Error('Invalid hour');
    }
    let ampm = 'am';
    const min =  timeParts[1].padStart(2, '0');

    // Handle 12 AM and 12 PM correctly
    if (hourInt === 0) {
      hourInt = 12;
      ampm = 'am';
    } else if (hourInt === 12) {
      ampm = 'pm';
    } else if (hourInt > 12) {
      hourInt -= 12;
      ampm = 'pm';
    }

    const utcFormattedString = `${day}-${month}-${year} ${hourInt}:${min}${ampm}`;
    return utcFormattedString;
  } catch (error) {
    console.error('Error formatting date:', error);
    // Fallback
    return utcString;
  }
}