export function capitalizeFirstLetter(str: string): string {
  if (str.length === 0) return str;

  const firstNonWhitespaceIndex = str.search(/\S/);
  if (firstNonWhitespaceIndex === -1) return str;

  return (
    str.slice(0, firstNonWhitespaceIndex) +
    str.charAt(firstNonWhitespaceIndex).toUpperCase() +
    str.slice(firstNonWhitespaceIndex + 1)
  );
}

// Utility function to normalize receiver names
export const normalizeReceiver = (receiver: string): string => {
  return receiver
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};
