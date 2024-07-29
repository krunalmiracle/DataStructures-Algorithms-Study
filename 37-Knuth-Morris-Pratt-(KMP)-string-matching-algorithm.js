/**
 * Knuth-Morris-Pratt (KMP) String Matching Algorithm
 */

/**
 * Compute the Longest Proper Prefix which is also Suffix (LPS) array
 * @param {string} pattern - The pattern string
 * @return {number[]} - The LPS array
 */
function computeLPSArray(pattern) {
  let length = 0; // Length of the previous longest prefix suffix
  let i = 1;
  let lps = new Array(pattern.length).fill(0);

  // Calculate lps[i] for i = 1 to pattern.length-1
  while (i < pattern.length) {
    if (pattern[i] === pattern[length]) {
      // If there is a match, increment length and assign to lps[i]
      length++;
      lps[i] = length;
      i++;
    } else {
      if (length !== 0) {
        // If there is no match, but we had some matches before,
        // we check for shorter prefixes
        length = lps[length - 1];
      } else {
        // If there is no match and no previous matches,
        // we move to the next character in the pattern
        lps[i] = 0;
        i++;
      }
    }
  }
  return lps;
}

/**
 * Implements the KMP algorithm for string matching
 * @param {string} text - The text to search in
 * @param {string} pattern - The pattern to search for
 * @return {number[]} - An array of starting indices where the pattern is found in the text
 */
function KMPSearch(text, pattern) {
  let matches = [];
  let lps = computeLPSArray(pattern);

  let i = 0; // Index for text
  let j = 0; // Index for pattern

  while (i < text.length) {
    if (pattern[j] === text[i]) {
      i++;
      j++;
    }

    if (j === pattern.length) {
      // Pattern found, add the starting index to matches
      matches.push(i - j);
      // Move pattern index back to the position indicated by LPS
      j = lps[j - 1];
    } else if (i < text.length && pattern[j] !== text[i]) {
      if (j !== 0) {
        // Mismatch after some matches, move pattern index back
        j = lps[j - 1];
      } else {
        // Mismatch at the beginning of pattern, move text index forward
        i++;
      }
    }
  }

  return matches;
}

// Test the KMP Algorithm
let text = "ABABDABACDABABCABAB";
let pattern = "ABABCABAB";

let matches = KMPSearch(text, pattern);

if (matches.length > 0) {
  console.log(`Pattern found at indices: ${matches.join(", ")}`);
} else {
  console.log("Pattern not found in the text.");
}

// This implementation of the Knuth-Morris-Pratt (KMP) Algorithm does the following:
// We first implement the computeLPSArray function, which computes the Longest Proper Prefix
// which is also Suffix (LPS) array for the pattern. This array is crucial for the efficiency of the KMP algorithm.
// The KMPSearch function implements the main KMP algorithm:
// We start by computing the LPS array for the pattern.
// We then iterate through the text, comparing characters with the pattern.
// If we find a match, we move both text and pattern indices forward.
// If we complete a full pattern match, we add the starting index to our matches array and move the pattern
// index back based on the LPS array.
// If we find a mismatch after some matches, we use the LPS array to skip redundant comparisons.
// If we find a mismatch at the beginning of the pattern, we simply move to the next character in the text.
// We test the algorithm with a sample text and pattern, printing out the indices where the pattern is found.
// The KMP Algorithm is particularly efficient for string matching, especially when the pattern might
// appear multiple times in the text or when the pattern has repeating subpatterns.
// It has a time complexity of O(n+m) where n is the length of the text and m is the length of the pattern,
// which is more efficient than the naive O(nm) approach, especially for long texts and patterns.
