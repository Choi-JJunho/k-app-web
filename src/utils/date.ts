export const formatDate = (
  date: Date | string,
  format: 'YYYY-MM-DD' | 'MM-DD' | 'YYYY.MM.DD' | 'korean' = 'YYYY-MM-DD'
): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(d.getTime())) {
    throw new Error('Invalid date provided');
  }

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  switch (format) {
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`;
    case 'MM-DD':
      return `${month}-${day}`;
    case 'YYYY.MM.DD':
      return `${year}.${month}.${day}`;
    case 'korean':
      return `${year}년 ${Number(month)}월 ${Number(day)}일`;
    default:
      return `${year}-${month}-${day}`;
  }
};

export const parseDate = (dateString: string): Date | null => {
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
};

export const isToday = (date: Date | string): boolean => {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  
  return (
    targetDate.getFullYear() === today.getFullYear() &&
    targetDate.getMonth() === today.getMonth() &&
    targetDate.getDate() === today.getDate()
  );
};

export const isSameDate = (date1: Date | string, date2: Date | string): boolean => {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  
  return formatDate(d1) === formatDate(d2);
};

export const addDays = (date: Date | string, days: number): Date => {
  const d = typeof date === 'string' ? new Date(date) : new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

export const getDateRange = (
  startDate: Date | string,
  endDate: Date | string
): Date[] => {
  const start = typeof startDate === 'string' ? new Date(startDate) : new Date(startDate);
  const end = typeof endDate === 'string' ? new Date(endDate) : new Date(endDate);
  const dates: Date[] = [];
  
  let currentDate = new Date(start);
  
  while (currentDate <= end) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
};

export const getWeekRange = (date: Date | string = new Date()): { start: Date; end: Date } => {
  const d = typeof date === 'string' ? new Date(date) : new Date(date);
  const day = d.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  
  const start = new Date(d);
  start.setDate(d.getDate() - day); // Move to Sunday
  
  const end = new Date(start);
  end.setDate(start.getDate() + 6); // Move to Saturday
  
  return { start, end };
};

export const getMonthRange = (date: Date | string = new Date()): { start: Date; end: Date } => {
  const d = typeof date === 'string' ? new Date(date) : new Date(date);
  
  const start = new Date(d.getFullYear(), d.getMonth(), 1);
  const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  
  return { start, end };
};

export const getRelativeTimeString = (date: Date | string): string => {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - targetDate.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) {
    return '방금 전';
  } else if (diffMinutes < 60) {
    return `${diffMinutes}분 전`;
  } else if (diffHours < 24) {
    return `${diffHours}시간 전`;
  } else if (diffDays < 7) {
    return `${diffDays}일 전`;
  } else {
    return formatDate(targetDate, 'korean');
  }
};

export const validateDateRange = (
  startDate: string,
  endDate: string
): { isValid: boolean; error?: string } => {
  const start = parseDate(startDate);
  const end = parseDate(endDate);

  if (!start) {
    return { isValid: false, error: '시작 날짜가 유효하지 않습니다.' };
  }

  if (!end) {
    return { isValid: false, error: '종료 날짜가 유효하지 않습니다.' };
  }

  if (start > end) {
    return { isValid: false, error: '시작 날짜는 종료 날짜보다 이전이어야 합니다.' };
  }

  const maxRange = 90; // 90일 제한
  const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays > maxRange) {
    return { isValid: false, error: `날짜 범위는 최대 ${maxRange}일까지 가능합니다.` };
  }

  return { isValid: true };
};