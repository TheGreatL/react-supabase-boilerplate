/**
 * Parses a duration string (e.g., '15m', '2h', '7d', '30s') into milliseconds.
 * Default unit is milliseconds if no unit is provided.
 */
export function parseDurationToMs(duration: string): number {
  const match = duration.match(/^(\d+)([smhd]?)$/);
  
  if (!match) {
    throw new Error(`Invalid duration format: ${duration}`);
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case 's':
      return value * 1000;
    case 'm':
      return value * 60 * 1000;
    case 'h':
      return value * 60 * 60 * 1000;
    case 'd':
      return value * 24 * 60 * 60 * 1000;
    default:
      return value;
  }
}
