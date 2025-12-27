import { format, parseISO, isValid } from 'date-fns';

// Format date to readable string
export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
  if (!date) return 'N/A';
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return isValid(parsedDate) ? format(parsedDate, formatStr) : 'Invalid Date';
};

// Calculate days difference
export const getDaysDifference = (date1, date2) => {
  const diffTime = Math.abs(date2 - date1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Check if date is overdue
export const isOverdue = (scheduledDate, currentStage) => {
  if (!scheduledDate || currentStage === 'repaired') return false;
  return new Date(scheduledDate) < new Date();
};

// Get status color based on stage
export const getStageColor = (stage) => {
  const colors = {
    new: '#3b82f6',
    inProgress: '#f59e0b',
    repaired: '#10b981',
    scrap: '#ef4444'
  };
  return colors[stage] || '#6b7280';
};

// Generate random color for avatars
export const getRandomColor = () => {
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};
