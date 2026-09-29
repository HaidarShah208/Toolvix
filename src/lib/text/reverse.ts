import { graphemes, splitLines } from "./segment";

export type ReverseMode = "characters" | "words" | "each-word" | "lines";

function reverseGraphemes(text: string): string {
  return graphemes(text).reverse().join("");
}

/**
 * Reverses text. Character reversal works on grapheme clusters so emoji,
 * flags and accented letters survive intact; CRLF stays together.
 */
export function reverseText(text: string, mode: ReverseMode): string {
  switch (mode) {
    case "characters":
      return reverseGraphemes(text);
    case "words":
      // Reverse the order of words on each line, keeping the spacing between them.
      return splitLines(text)
        .map((line) => line.split(/(\s+)/).reverse().join(""))
        .join("\n");
    case "each-word":
      return splitLines(text)
        .map((line) =>
          line
            .split(/(\s+)/)
            .map((token) => (/^\s*$/.test(token) ? token : reverseGraphemes(token)))
            .join(""),
        )
        .join("\n");
    case "lines":
      return splitLines(text).reverse().join("\n");
  }
}
