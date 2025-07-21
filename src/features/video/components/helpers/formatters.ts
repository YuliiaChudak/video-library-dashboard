import { format, formatDistanceToNow } from 'date-fns';

export function formatDate(
  date: string | Date,
  formatType: 'short' | 'long' | 'relative' = 'short'
) {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  switch (formatType) {
    case 'short':
      return format(dateObj, 'MMM dd, yyyy');
    case 'long':
      return format(dateObj, 'MMMM dd, yyyy');
    case 'relative':
      return formatDistanceToNow(dateObj, { addSuffix: true });
    default:
      return format(dateObj, 'MMM dd, yyyy');
  }
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function formatViews(views: number): string {
  if (views < 1000) {
    return views.toString();
  }

  if (views < 1000000) {
    return `${(views / 1000).toFixed(1)}K`;
  }

  if (views < 1000000000) {
    return `${(views / 1000000).toFixed(1)}M`;
  }

  return `${(views / 1000000000).toFixed(1)}B`;
}

export function formatCompactNumber(num: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(num);
}
