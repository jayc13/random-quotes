export {};

declare global {
  var requestCounts: Map<string, number[]> | undefined;
  var cleanupInterval: NodeJS.Timeout;
}
