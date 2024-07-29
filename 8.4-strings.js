/**
 * String Algorithms and Problems
 */

/**
 * Brute Force Pattern Matching
 *
 * @description
 * Searches for occurrences of a pattern within a text using a simple brute force approach.
 *
 * @reasoning
 * While not efficient for large texts, brute force is simple to implement and works well for small inputs.
 *
 * @complexity
 * Time complexity: O(n*m), where n is the length of the text and m is the length of the pattern
 * Space complexity: O(1)
 *
 * @param {string} text - The text to search in
 * @param {string} pattern - The pattern to search for
 * @returns {number[]} An array of starting indices where the pattern is found
 */
function bruteForcePatternMatch(text, pattern) {
  const result = [];
  for (let i = 0; i <= text.length - pattern.length; i++) {
    let match = true;
    for (let j = 0; j < pattern.length; j++) {
      if (text[i + j] !== pattern[j]) {
        match = false;
        break;
      }
    }
    if (match) result.push(i);
  }
  return result;
}

/**
 * Rabin-Karp Pattern Matching Algorithm
 *
 * @description
 * Uses rolling hash to efficiently search for occurrences of a pattern within a text.
 *
 * @reasoning
 * Rabin-Karp uses hashing to compare substrings, allowing for faster comparisons in most cases.
 *
 * @complexity
 * Average case time complexity: O(n+m), where n is the length of the text and m is the length of the pattern
 * Worst case time complexity: O(n*m)
 * Space complexity: O(1)
 *
 * @param {string} text - The text to search in
 * @param {string} pattern - The pattern to search for
 * @returns {number[]} An array of starting indices where the pattern is found
 */
function rabinKarp(text, pattern) {
  const BASE = 256; // Assuming ASCII characters
  const PRIME = 101; // A prime number for hash calculation
  const result = [];
  const m = pattern.length;
  const n = text.length;
  let patternHash = 0;
  let textHash = 0;
  let h = 1;

  // Calculate h = BASE^(m-1) % PRIME
  for (let i = 0; i < m - 1; i++) {
    h = (h * BASE) % PRIME;
  }

  // Calculate initial hash values
  for (let i = 0; i < m; i++) {
    patternHash = (BASE * patternHash + pattern.charCodeAt(i)) % PRIME;
    textHash = (BASE * textHash + text.charCodeAt(i)) % PRIME;
  }

  // Slide pattern over text
  for (let i = 0; i <= n - m; i++) {
    if (patternHash === textHash) {
      let match = true;
      for (let j = 0; j < m; j++) {
        if (text[i + j] !== pattern[j]) {
          match = false;
          break;
        }
      }
      if (match) result.push(i);
    }

    // Calculate hash for next window
    if (i < n - m) {
      textHash =
        (BASE * (textHash - text.charCodeAt(i) * h) + text.charCodeAt(i + m)) %
        PRIME;
      if (textHash < 0) textHash += PRIME;
    }
  }

  return result;
}

/**
 * Knuth-Morris-Pratt (KMP) Pattern Matching Algorithm
 *
 * @description
 * Uses a prefix function to efficiently search for occurrences of a pattern within a text.
 *
 * @reasoning
 * KMP improves efficiency by avoiding unnecessary comparisons based on previously matched characters.
 *
 * @complexity
 * Time complexity: O(n+m), where n is the length of the text and m is the length of the pattern
 * Space complexity: O(m)
 *
 * @param {string} text - The text to search in
 * @param {string} pattern - The pattern to search for
 * @returns {number[]} An array of starting indices where the pattern is found
 */
function kmp(text, pattern) {
  const computeLPS = (pattern) => {
    const lps = [0];
    let len = 0;
    let i = 1;
    while (i < pattern.length) {
      if (pattern[i] === pattern[len]) {
        len++;
        lps[i] = len;
        i++;
      } else if (len !== 0) {
        len = lps[len - 1];
      } else {
        lps[i] = 0;
        i++;
      }
    }
    return lps;
  };

  const lps = computeLPS(pattern);
  const result = [];
  let i = 0,
    j = 0;

  while (i < text.length) {
    if (pattern[j] === text[i]) {
      i++;
      j++;
    }
    if (j === pattern.length) {
      result.push(i - j);
      j = lps[j - 1];
    } else if (i < text.length && pattern[j] !== text[i]) {
      if (j !== 0) {
        j = lps[j - 1];
      } else {
        i++;
      }
    }
  }

  return result;
}

/**
 * Longest Common Substring
 *
 * @description
 * Finds the longest substring that is present in both input strings.
 *
 * @reasoning
 * Uses dynamic programming to efficiently compute the longest common substring.
 *
 * @complexity
 * Time complexity: O(n*m), where n and m are the lengths of the input strings
 * Space complexity: O(n*m)
 *
 * @param {string} str1 - First input string
 * @param {string} str2 - Second input string
 * @returns {string} The longest common substring
 */
function longestCommonSubstring(str1, str2) {
  const dp = Array(str1.length + 1)
    .fill()
    .map(() => Array(str2.length + 1).fill(0));
  let maxLength = 0;
  let endIndex = 0;

  for (let i = 1; i <= str1.length; i++) {
    for (let j = 1; j <= str2.length; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
        if (dp[i][j] > maxLength) {
          maxLength = dp[i][j];
          endIndex = i - 1;
        }
      }
    }
  }

  return str1.slice(endIndex - maxLength + 1, endIndex + 1);
}

/**
 * Edit Distance (Levenshtein Distance)
 *
 * @description
 * Computes the minimum number of single-character edits (insertions, deletions, or substitutions)
 * required to change one string into another.
 *
 * @reasoning
 * Uses dynamic programming to efficiently compute the edit distance between two strings.
 *
 * @complexity
 * Time complexity: O(n*m), where n and m are the lengths of the input strings
 * Space complexity: O(n*m)
 *
 * @param {string} str1 - First input string
 * @param {string} str2 - Second input string
 * @returns {number} The edit distance between the two strings
 */
function editDistance(str1, str2) {
  const dp = Array(str1.length + 1)
    .fill()
    .map(() => Array(str2.length + 1).fill(0));

  for (let i = 0; i <= str1.length; i++) {
    for (let j = 0; j <= str2.length; j++) {
      if (i === 0) {
        dp[i][j] = j;
      } else if (j === 0) {
        dp[i][j] = i;
      } else if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }

  return dp[str1.length][str2.length];
}

/**
 * Palindrome Detection
 *
 * @description
 * Checks if a given string is a palindrome (reads the same forwards and backwards).
 *
 * @reasoning
 * Uses two pointers moving from both ends towards the center to efficiently check for palindrome property.
 *
 * @complexity
 * Time complexity: O(n), where n is the length of the string
 * Space complexity: O(1)
 *
 * @param {string} str - The input string to check
 * @returns {boolean} True if the string is a palindrome, false otherwise
 */
function isPalindrome(str) {
  let left = 0;
  let right = str.length - 1;

  while (left < right) {
    if (str[left] !== str[right]) {
      return false;
    }
    left++;
    right--;
  }

  return true;
}

/**
 * String Compression
 *
 * @description
 * Compresses a string by replacing repeated characters with the character followed by the count of repetitions.
 *
 * @reasoning
 * Iterates through the string once, keeping track of consecutive character counts.
 *
 * @complexity
 * Time complexity: O(n), where n is the length of the string
 * Space complexity: O(n) in the worst case (no compression)
 *
 * @param {string} str - The input string to compress
 * @returns {string} The compressed string
 */
function compressString(str) {
  let compressed = "";
  let count = 1;

  for (let i = 1; i <= str.length; i++) {
    if (i < str.length && str[i] === str[i - 1]) {
      count++;
    } else {
      compressed += str[i - 1] + (count > 1 ? count : "");
      count = 1;
    }
  }

  return compressed.length < str.length ? compressed : str;
}

// Example usage
console.log(bruteForcePatternMatch("ABABDABACDABABCABAB", "ABABCABAB"));
console.log(rabinKarp("ABABDABACDABABCABAB", "ABABCABAB"));
console.log(kmp("ABABDABACDABABCABAB", "ABABCABAB"));
console.log(longestCommonSubstring("ABCDGH", "ACDGHR"));
console.log(editDistance("kitten", "sitting"));
console.log(isPalindrome("racecar"));
console.log(compressString("AABBBCCCC"));

/**
 * Longest Palindromic Substring
 *
 * @description
 * Finds the longest palindromic substring in a given string.
 *
 * @reasoning
 * Uses the expand around center technique, which checks palindromes by expanding from each possible center.
 *
 * @complexity
 * Time complexity: O(n^2), where n is the length of the string
 * Space complexity: O(1)
 *
 * @param {string} s - The input string
 * @returns {string} The longest palindromic substring
 */
function longestPalindromicSubstring(s) {
  if (s.length < 2) return s;

  let start = 0,
    maxLength = 1;

  function expandAroundCenter(left, right) {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      left--;
      right++;
    }
    return right - left - 1;
  }

  for (let i = 0; i < s.length; i++) {
    let len1 = expandAroundCenter(i, i);
    let len2 = expandAroundCenter(i, i + 1);
    let len = Math.max(len1, len2);
    if (len > maxLength) {
      start = i - Math.floor((len - 1) / 2);
      maxLength = len;
    }
  }

  return s.substring(start, start + maxLength);
}

console.log(longestPalindromicSubstring("babad")); // "bab" or "aba"

/**
 * Implement strStr() (Needle in a Haystack)
 *
 * @description
 * Finds the index of the first occurrence of needle in haystack.
 *
 * @reasoning
 * Uses the KMP algorithm for efficient substring matching.
 *
 * @complexity
 * Time complexity: O(n + m), where n is the length of haystack and m is the length of needle
 * Space complexity: O(m) for the LPS array
 *
 * @param {string} haystack - The string to search in
 * @param {string} needle - The substring to search for
 * @returns {number} The index of the first occurrence of needle in haystack, or -1 if not found
 */
function strStr(haystack, needle) {
  if (needle === "") return 0;

  const computeLPS = (pattern) => {
    const lps = [0];
    let len = 0;
    let i = 1;
    while (i < pattern.length) {
      if (pattern[i] === pattern[len]) {
        len++;
        lps[i] = len;
        i++;
      } else if (len !== 0) {
        len = lps[len - 1];
      } else {
        lps[i] = 0;
        i++;
      }
    }
    return lps;
  };

  const lps = computeLPS(needle);
  let i = 0,
    j = 0;

  while (i < haystack.length) {
    if (needle[j] === haystack[i]) {
      i++;
      j++;
    }
    if (j === needle.length) {
      return i - j;
    } else if (i < haystack.length && needle[j] !== haystack[i]) {
      if (j !== 0) {
        j = lps[j - 1];
      } else {
        i++;
      }
    }
  }

  return -1;
}

console.log(strStr("hello", "ll")); // 2
console.log(strStr("aaaaa", "bba")); // -1

/**
 * Group Anagrams
 *
 * @description
 * Groups anagrams from an array of strings.
 *
 * @reasoning
 * Uses a hash map with sorted strings as keys to group anagrams efficiently.
 *
 * @complexity
 * Time complexity: O(n * k log k), where n is the number of strings and k is the maximum length of a string
 * Space complexity: O(n * k)
 *
 * @param {string[]} strs - An array of strings
 * @returns {string[][]} An array of grouped anagrams
 */
function groupAnagrams(strs) {
  const anagramMap = new Map();

  for (let str of strs) {
    const sortedStr = str.split("").sort().join("");
    if (!anagramMap.has(sortedStr)) {
      anagramMap.set(sortedStr, []);
    }
    anagramMap.get(sortedStr).push(str);
  }

  return Array.from(anagramMap.values());
}

console.log(groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"]));
// [["eat","tea","ate"],["tan","nat"],["bat"]]

/**
 * Longest Repeating Character Replacement
 *
 * @description
 * Finds the length of the longest substring containing the same letter after at most k replacements.
 *
 * @reasoning
 * Uses a sliding window approach with a character frequency map to track the most frequent character.
 *
 * @complexity
 * Time complexity: O(n), where n is the length of the string
 * Space complexity: O(1), as the character set is limited
 *
 * @param {string} s - The input string
 * @param {number} k - The maximum number of replacements allowed
 * @returns {number} The length of the longest valid substring
 */
function characterReplacement(s, k) {
  let maxLength = 0;
  let maxCount = 0;
  let start = 0;
  const charCount = new Array(26).fill(0);

  for (let end = 0; end < s.length; end++) {
    charCount[s.charCodeAt(end) - 65]++;
    maxCount = Math.max(maxCount, charCount[s.charCodeAt(end) - 65]);

    while (end - start + 1 - maxCount > k) {
      charCount[s.charCodeAt(start) - 65]--;
      start++;
    }

    maxLength = Math.max(maxLength, end - start + 1);
  }

  return maxLength;
}

console.log(characterReplacement("ABAB", 2)); // 4
console.log(characterReplacement("AABABBA", 1)); // 4
