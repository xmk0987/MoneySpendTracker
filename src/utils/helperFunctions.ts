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

// Utility function to normalize payerNameOrTitle names
export const normalizePayerTitle = (payerNameOrTitle: string): string => {
  return payerNameOrTitle
    .toLowerCase()
    .replace(/[^a-zäöå\s0-9]/g, " ")
    .replace(/[0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};
