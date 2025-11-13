import type { MealTimeType } from '@/types';

/**
 * Dining time labels in Korean
 */
export const DINING_TIME_LABELS: Record<MealTimeType, string> = {
  breakfast: '조식',
  lunch: '중식',
  dinner: '석식',
} as const;

/**
 * Default recommended daily calories
 */
export const RECOMMENDED_DAILY_CALORIES = 2200;

/**
 * API timeout in milliseconds
 */
export const API_TIMEOUT = 10000;

/**
 * Default cache/stale time for meals data (5 minutes)
 */
export const MEALS_STALE_TIME = 5 * 60 * 1000;

/**
 * Default cache/stale time for nutrition data (10 minutes)
 */
export const NUTRITION_STALE_TIME = 10 * 60 * 1000;

/**
 * Date range limits for nutrition queries (in days)
 */
export const MAX_DATE_RANGE_DAYS = 90;

/**
 * Retry configuration for API calls
 */
export const RETRY_CONFIG = {
  maxAttempts: 3,
  initialDelay: 1000,
  maxDelay: 5000,
} as const;

/**
 * App version and environment
 */
export const APP_VERSION = '0.1.0';
export const IS_DEV = import.meta.env.DEV;
export const IS_PROD = import.meta.env.PROD;
