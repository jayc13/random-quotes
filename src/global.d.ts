export {};

declare global {
  var requestCounts: Map<string, number[]> | undefined;
}
