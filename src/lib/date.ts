export default function getFormattedLocaleDateTime(date?: Date) {
  const locale = typeof navigator !== 'undefined' ? navigator.language : 'en-SG';

  return date?.toLocaleString(locale, {
    day: 'numeric',
    month: 'numeric',
    minute: 'numeric',
    hour: 'numeric',
    year: 'numeric',
    hour12: true,
  }).replace(/\//g, '-');
}