import DOMPurify from "dompurify";

// Sanitize user input to prevent XSS attacks
export const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input);
};

// Rate limiting for login attempts
const loginAttempts: Record<string, { count: number; timestamp: number }> = {};
const MAX_ATTEMPTS = 5;
const BLOCK_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

export const checkLoginRateLimit = (ipAddress: string): boolean => {
  const now = Date.now();

  // Clean up expired blocks
  Object.keys(loginAttempts).forEach((ip) => {
    if (loginAttempts[ip].timestamp + BLOCK_DURATION < now) {
      delete loginAttempts[ip];
    }
  });

  // Check if IP is blocked
  if (loginAttempts[ipAddress]) {
    const attempt = loginAttempts[ipAddress];

    // If block duration hasn't expired and max attempts reached
    if (
      attempt.count >= MAX_ATTEMPTS &&
      attempt.timestamp + BLOCK_DURATION > now
    ) {
      return false; // IP is blocked
    }

    // Reset if block duration expired
    if (attempt.timestamp + BLOCK_DURATION < now) {
      loginAttempts[ipAddress] = { count: 1, timestamp: now };
      return true;
    }
  } else {
    // First attempt
    loginAttempts[ipAddress] = { count: 1, timestamp: now };
    return true;
  }

  return true; // IP is not blocked
};

export const incrementLoginAttempt = (ipAddress: string): void => {
  if (loginAttempts[ipAddress]) {
    loginAttempts[ipAddress].count += 1;
  } else {
    loginAttempts[ipAddress] = { count: 1, timestamp: Date.now() };
  }
};

export const resetLoginAttempts = (ipAddress: string): void => {
  delete loginAttempts[ipAddress];
};

// Get remaining time in seconds before login attempts reset
export const getLoginBlockTimeRemaining = (ipAddress: string): number => {
  if (!loginAttempts[ipAddress]) return 0;

  const now = Date.now();
  const expiryTime = loginAttempts[ipAddress].timestamp + BLOCK_DURATION;
  const remainingMs = Math.max(0, expiryTime - now);

  return Math.ceil(remainingMs / 1000); // Convert to seconds
};
