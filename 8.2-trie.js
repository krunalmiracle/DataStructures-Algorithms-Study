/**
 * Trie (Prefix Tree) Implementation
 *
 * @description
 * A Trie is a tree-like data structure used to store and retrieve strings.
 * Each node in the trie represents a character, and the path from the root
 * to a node represents a prefix of one or more strings.
 *
 * @reasoning
 * Tries are efficient for string-related operations, especially when dealing
 * with a large set of strings with common prefixes. They excel in prefix-based
 * searches and can be used for auto-completion, spell-checking, and more.
 *
 * @assumptions
 * - The strings contain only lowercase English letters (a-z).
 * - The end of a word is marked with a special property (isEndOfWord).
 *
 * @complexity
 * Time complexity:
 *   - Insertion: O(m), where m is the length of the string
 *   - Search: O(m), where m is the length of the string
 *   - Deletion: O(m), where m is the length of the string
 * Space complexity: O(n * m), where n is the number of strings and m is the average length of the strings
 */
class TrieNode {
  constructor() {
    // Initialize an object to store child nodes
    this.children = {};
    // Flag to mark the end of a word
    this.isEndOfWord = false;
  }
}

class Trie {
  constructor() {
    // Initialize the root node
    this.root = new TrieNode();
  }

  /**
   * Inserts a word into the trie
   * @param {string} word - The word to insert
   */
  insert(word) {
    let node = this.root;
    // Iterate through each character in the word
    for (let char of word) {
      // If the character doesn't exist, create a new node
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      // Move to the next node
      node = node.children[char];
    }
    // Mark the end of the word
    node.isEndOfWord = true;
  }

  /**
   * Searches for a word in the trie
   * @param {string} word - The word to search for
   * @returns {boolean} True if the word exists in the trie, false otherwise
   */
  search(word) {
    let node = this.root;
    // Traverse the trie following the characters of the word
    for (let char of word) {
      if (!node.children[char]) {
        return false;
      }
      node = node.children[char];
    }
    // Return true only if we've reached the end of a word
    return node.isEndOfWord;
  }

  /**
   * Checks if there is any word in the trie that starts with the given prefix
   * @param {string} prefix - The prefix to search for
   * @returns {boolean} True if there is any word with the given prefix, false otherwise
   */
  startsWith(prefix) {
    let node = this.root;
    // Traverse the trie following the characters of the prefix
    for (let char of prefix) {
      if (!node.children[char]) {
        return false;
      }
      node = node.children[char];
    }
    // If we've made it here, the prefix exists in the trie
    return true;
  }

  /**
   * Deletes a word from the trie
   * @param {string} word - The word to delete
   * @returns {boolean} True if the word was deleted, false if it wasn't found
   */
  delete(word) {
    return this._deleteHelper(this.root, word, 0);
  }

  _deleteHelper(node, word, index) {
    // Base case: we've processed all characters of the word
    if (index === word.length) {
      // If it's not the end of a word, nothing to delete
      if (!node.isEndOfWord) {
        return false;
      }
      // Mark it as not the end of a word
      node.isEndOfWord = false;
      // Return true if this node has no children, indicating it can be deleted
      return Object.keys(node.children).length === 0;
    }

    const char = word[index];
    // If the character doesn't exist in the trie, the word doesn't exist
    if (!node.children[char]) {
      return false;
    }

    // Recursively delete the rest of the word
    const shouldDeleteChild = this._deleteHelper(
      node.children[char],
      word,
      index + 1
    );

    // If the child should be deleted
    if (shouldDeleteChild) {
      delete node.children[char];
      // Return true if this node has no children and is not the end of another word
      return Object.keys(node.children).length === 0 && !node.isEndOfWord;
    }

    return false;
  }

  /**
   * Finds all words in the trie with the given prefix
   * @param {string} prefix - The prefix to search for
   * @returns {string[]} An array of words with the given prefix
   */
  autoComplete(prefix) {
    let node = this.root;
    // Traverse to the node representing the prefix
    for (let char of prefix) {
      if (!node.children[char]) {
        return [];
      }
      node = node.children[char];
    }
    // Collect all words starting from this node
    return this._collectWords(node, prefix);
  }

  _collectWords(node, prefix) {
    let words = [];
    if (node.isEndOfWord) {
      words.push(prefix);
    }
    for (let char in node.children) {
      words = words.concat(
        this._collectWords(node.children[char], prefix + char)
      );
    }
    return words;
  }

  /**
   * Finds the longest common prefix among all words in the trie
   * @returns {string} The longest common prefix
   */
  longestCommonPrefix() {
    let node = this.root;
    let prefix = "";
    // Traverse down the trie until we find a node with multiple children or end of word
    while (Object.keys(node.children).length === 1 && !node.isEndOfWord) {
      const char = Object.keys(node.children)[0];
      prefix += char;
      node = node.children[char];
    }
    return prefix;
  }
}

/**
 * Problem: Implement a spell checker using a Trie
 *
 * @description
 * Create a spell checker that can determine if a word is correctly spelled
 * and suggest corrections for misspelled words.
 *
 * @reasoning
 * A Trie is ideal for this scenario because:
 * 1. It provides fast lookups for whole words.
 * 2. It allows for efficient prefix matching, which is useful for suggesting corrections.
 * 3. It can handle a large dictionary of words efficiently.
 *
 * @assumptions
 * - We have a list of correctly spelled words to populate the trie.
 * - We'll suggest corrections by finding words with similar prefixes.
 *
 * @returns {Object} An object with methods to check spelling and get suggestions
 */
function createSpellChecker(dictionary) {
  const trie = new Trie();

  // Add all dictionary words to the trie
  for (let word of dictionary) {
    trie.insert(word.toLowerCase());
  }

  return {
    /**
     * Checks if a word is spelled correctly
     * @param {string} word - The word to check
     * @returns {boolean} True if the word is spelled correctly, false otherwise
     */
    checkSpelling: function (word) {
      return trie.search(word.toLowerCase());
    },

    /**
     * Gets spelling suggestions for a word
     * @param {string} word - The word to get suggestions for
     * @returns {string[]} An array of suggested correct spellings
     */
    getSuggestions: function (word) {
      word = word.toLowerCase();
      let suggestions = [];
      // Check if removing one character gives a valid word
      for (let i = 0; i < word.length; i++) {
        let suggestion = word.slice(0, i) + word.slice(i + 1);
        if (trie.search(suggestion)) {
          suggestions.push(suggestion);
        }
      }
      // Check if changing one character gives a valid word
      for (let i = 0; i < word.length; i++) {
        for (let j = 0; j < 26; j++) {
          let suggestion =
            word.slice(0, i) + String.fromCharCode(97 + j) + word.slice(i + 1);
          if (suggestion !== word && trie.search(suggestion)) {
            suggestions.push(suggestion);
          }
        }
      }
      // Check if adding one character gives a valid word
      for (let i = 0; i <= word.length; i++) {
        for (let j = 0; j < 26; j++) {
          let suggestion =
            word.slice(0, i) + String.fromCharCode(97 + j) + word.slice(i);
          if (trie.search(suggestion)) {
            suggestions.push(suggestion);
          }
        }
      }
      // Add auto-complete suggestions
      suggestions = suggestions.concat(trie.autoComplete(word.slice(0, 3)));
      // Remove duplicates and limit the number of suggestions
      return [...new Set(suggestions)].slice(0, 5);
    },
  };
}

// Example usage of the spell checker
const dictionary = ["apple", "banana", "cherry", "date", "elderberry"];
const spellChecker = createSpellChecker(dictionary);

console.log(spellChecker.checkSpelling("apple")); // true
console.log(spellChecker.checkSpelling("aple")); // false
console.log(spellChecker.getSuggestions("aple")); // ["apple"]
console.log(spellChecker.getSuggestions("banan")); // ["banana"]

// Demonstrate longest common prefix
const trieForLCP = new Trie();
trieForLCP.insert("flower");
trieForLCP.insert("flow");
trieForLCP.insert("flight");
console.log(trieForLCP.longestCommonPrefix()); // "fl"
