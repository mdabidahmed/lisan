import type { ProgressOverviewData, RequestOptions } from '@/types';

import { apiClient } from '../client';
import type {
  DueWordsInput,
  ProgressOverviewInput,
  SaveProgressInput,
  SaveProgressResult,
} from '../types';

export function getProgressOverview(
  input: ProgressOverviewInput,
  options?: RequestOptions,
): Promise<ProgressOverviewData> {
  return apiClient.post<ProgressOverviewData>('/progress/overview', input, options);
}

export function getDueWords(input: DueWordsInput, options?: RequestOptions): Promise<string[]> {
  return apiClient.post<string[]>('/progress/due', input, options);
}

/** Write-through for a future backend; the durable copy still lives in `progressStore`. */
export function saveProgress(
  input: SaveProgressInput,
  options?: RequestOptions,
): Promise<SaveProgressResult> {
  return apiClient.post<SaveProgressResult>('/progress', input, options);
}
