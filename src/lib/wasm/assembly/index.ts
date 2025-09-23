@external("env", "console.log")
declare function log(message: string): void;

export function addStrings(x: string, y: string): string {
  log(x+y)
  return x + y
}
