// Collection of UB-themed adjectives and nouns
const adjectives = [
  'Blue', 'Bold', 'Bright', 'Bullish', 'Charging', 'Daring',
  'Dynamic', 'Electric', 'Fierce', 'Gritty', 'Mighty', 'Northern',
  'Powerful', 'Quick', 'Royal', 'Spirited', 'Strong', 'Swift',
  'Valiant', 'Victorious'
];

const nouns = [
  'Bull', 'Buffalo', 'Champion', 'Horns', 'Runner', 'Scholar',
  'Victor', 'Spark', 'Thunder', 'Trailblazer', 'Pioneer', 'Leader',
  'Achiever', 'Wolf', 'Bison', 'Maverick', 'Spark', 'Flame',
  'Hero', 'Titan'
];

/**
 * Generates a random UB-themed anonymous handle
 * 
 * @returns A string in the format "Adjective+Noun+Number"
 */
export function generateRandomHandle(): string {
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomNumber = Math.floor(1000 + Math.random() * 9000); // 4-digit number
  
  return `${randomAdjective}${randomNoun}${randomNumber}`;
}

/**
 * Checks if the generated handle follows our pattern
 * Useful to validate handles that come from storage
 */
export function isValidHandle(handle: string): boolean {
  // Handle should match pattern of adjective + noun + 4 digits
  const handleRegex = /^[A-Z][a-z]+[A-Z][a-z]+\d{4}$/;
  return handleRegex.test(handle);
} 