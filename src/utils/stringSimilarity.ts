import * as _ from "lodash";

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

export function calculateSimilarityDiceCoefficient(
  string1: string,
  string2: string
): number {
  // the algorithm is based on https://en.wikipedia.org/wiki/Dice_coefficient
  // diceCoefficient = (2 * intersection) / (elemA + elemB)
  const set1: string[] = bigramSet(string1);
  const set2: string[] = bigramSet(string2);
  const dc = _.intersection(set1, set2);
  const result = (2 * dc.length) / (set1.length + set2.length);

  return result;
}

function bigramSet(str: string): string[] {
  const normalized = str.toLowerCase().replace(/\s+/g, "");
  const bigrams = new Set<string>();
  for (let i = 0; i < normalized.length - 1; i++) {
    bigrams.add(normalized.substring(i, i + 2));
  }
  return Array.from(bigrams);
}
