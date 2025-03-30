export {};

declare global {
  const requestCounts: Map<string, number[]> | undefined;
  const cleanupInterval: NodeJS.Timeout;
}
