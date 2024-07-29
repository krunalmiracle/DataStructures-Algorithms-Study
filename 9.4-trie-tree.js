/**
 * Trie (Prefix Tree) Implementation
 *
 * @description
 * A trie is a tree-like data structure used to store and retrieve strings efficiently.
 * It's particularly useful for prefix-based operations.
 *
 * @reasoning
 * Tries provide fast lookups and insertions for string data, especially when dealing
 * with large datasets with many common prefixes.
 *
 * @complexity
 * Time complexity: O(m) for insert and search, where m is the length of the string
 * Space complexity: O(n * m), where n is the number of strings and m is the average length
 */
class TrieNode {
  constructor() {
    this.children = new Map();
    this.isEndOfWord = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word) {
    let node = this.root;
    for (let char of word) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char);
    }
    node.isEndOfWord = true;
  }

  search(word) {
    let node = this.root;
    for (let char of word) {
      if (!node.children.has(char)) {
        return false;
      }
      node = node.children.get(char);
    }
    return node.isEndOfWord;
  }

  startsWith(prefix) {
    let node = this.root;
    for (let char of prefix) {
      if (!node.children.has(char)) {
        return false;
      }
      node = node.children.get(char);
    }
    return true;
  }

  /**
   * Find all words in the trie with a given prefix
   *
   * @param {string} prefix - The prefix to search for
   * @returns {string[]} Array of words with the given prefix
   *
   * @complexity
   * Time complexity: O(p + n), where p is the length of the prefix and n is the number of nodes in the subtrie
   * Space complexity: O(m), where m is the total length of all matching words
   */
  findWordsWithPrefix(prefix) {
    let node = this.root;
    for (let char of prefix) {
      if (!node.children.has(char)) {
        return [];
      }
      node = node.children.get(char);
    }
    return this._findAllWords(node, prefix);
  }

  _findAllWords(node, prefix) {
    let results = [];
    if (node.isEndOfWord) {
      results.push(prefix);
    }
    for (let [char, childNode] of node.children) {
      results = results.concat(this._findAllWords(childNode, prefix + char));
    }
    return results;
  }
}

// Example usage
let trie = new Trie();
["apple", "app", "apricot", "banana"].forEach((word) => trie.insert(word));
console.log(trie.search("app")); // true
console.log(trie.startsWith("ban")); // true
console.log(trie.findWordsWithPrefix("app")); // ["app", "apple", "appeal"]
