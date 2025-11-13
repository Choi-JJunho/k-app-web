import { describe, it, expect } from 'vitest';
import { formatDate, parseDate, isToday, isSameDate, addDays, getDateRange, getWeekRange } from './date';

describe('date utilities', () => {
  describe('formatDate', () => {
    it('should format Date object to YYYY-MM-DD', () => {
      const date = new Date('2025-01-15');
      expect(formatDate(date)).toBe('2025-01-15');
    });

    it('should handle string dates', () => {
      expect(formatDate('2025-01-15')).toBe('2025-01-15');
    });

    it('should format date to Korean format', () => {
      const date = new Date('2025-01-15');
      const result = formatDate(date, 'korean');
      expect(result).toContain('2025년');
      expect(result).toContain('1월');
      expect(result).toContain('15일');
    });

    it('should format date to YYYY.MM.DD', () => {
      const date = new Date('2025-01-15');
      expect(formatDate(date, 'YYYY.MM.DD')).toBe('2025.01.15');
    });
  });

  describe('parseDate', () => {
    it('should parse valid date string', () => {
      const result = parseDate('2025-01-15');
      expect(result).toBeInstanceOf(Date);
    });

    it('should return null for invalid date', () => {
      const result = parseDate('invalid');
      expect(result).toBeNull();
    });
  });

  describe('isToday', () => {
    it('should return true for today', () => {
      const today = new Date();
      expect(isToday(today)).toBe(true);
    });

    it('should return false for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isToday(yesterday)).toBe(false);
    });
  });

  describe('isSameDate', () => {
    it('should return true for same dates', () => {
      const date1 = new Date('2025-01-15');
      const date2 = new Date('2025-01-15');
      expect(isSameDate(date1, date2)).toBe(true);
    });

    it('should return false for different dates', () => {
      const date1 = new Date('2025-01-15');
      const date2 = new Date('2025-01-16');
      expect(isSameDate(date1, date2)).toBe(false);
    });
  });

  describe('addDays', () => {
    it('should add days to date', () => {
      const date = new Date('2025-01-15');
      const result = addDays(date, 5);
      expect(formatDate(result)).toBe('2025-01-20');
    });

    it('should subtract days with negative number', () => {
      const date = new Date('2025-01-15');
      const result = addDays(date, -5);
      expect(formatDate(result)).toBe('2025-01-10');
    });
  });

  describe('getDateRange', () => {
    it('should return array of dates between start and end', () => {
      const start = new Date('2025-01-15');
      const end = new Date('2025-01-17');
      const result = getDateRange(start, end);
      expect(result).toHaveLength(3);
    });
  });

  describe('getWeekRange', () => {
    it('should return start and end of week', () => {
      const date = new Date('2025-01-15');
      const result = getWeekRange(date);
      expect(result).toHaveProperty('start');
      expect(result).toHaveProperty('end');
      expect(result.start).toBeInstanceOf(Date);
      expect(result.end).toBeInstanceOf(Date);
    });
  });
});
