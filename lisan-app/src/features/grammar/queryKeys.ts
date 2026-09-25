export const grammarKeys = {
  all: ['grammar'] as const,
  detail: (lessonId: string) => ['grammar', 'detail', lessonId] as const,
};
