export function capitalizeFirstLetter(str: string): string {
  if (str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Utility function to normalize receiver names
export const normalizeReceiver = (receiver: string): string => {
  return receiver
    .toLowerCase() // Convert to lowercase
    .replace(/[0-9]/g, "") // Remove numbers
    .replace(/[^a-z\s]/g, "") // Remove special characters
    .trim()
    .split(" ")[0];
};
