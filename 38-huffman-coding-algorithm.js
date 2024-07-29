/**
 * Huffman Coding Compression Algorithm
 */

// Node class for the Huffman tree
class Node {
  constructor(char, freq) {
    this.char = char; // Character
    this.freq = freq; // Frequency of the character
    this.left = null; // Left child
    this.right = null; // Right child
  }
}

// Priority Queue implementation for Huffman tree construction
class PriorityQueue {
  constructor() {
    this.queue = [];
  }

  enqueue(node) {
    // Add node to queue
    this.queue.push(node);
    // Sort queue based on frequency (ascending order)
    this.queue.sort((a, b) => a.freq - b.freq);
  }

  dequeue() {
    // Remove and return the node with lowest frequency
    return this.queue.shift();
  }

  size() {
    return this.queue.length;
  }
}

/**
 * Build the Huffman tree
 * @param {Object} freqMap - Frequency map of characters
 * @return {Node} - Root of the Huffman tree
 */
function buildHuffmanTree(freqMap) {
  let pq = new PriorityQueue();

  // Create leaf nodes for each character and add to priority queue
  for (let char in freqMap) {
    pq.enqueue(new Node(char, freqMap[char]));
  }

  // Build the Huffman tree
  while (pq.size() > 1) {
    // Get the two nodes with lowest frequencies
    let left = pq.dequeue();
    let right = pq.dequeue();

    // Create a new internal node with these two nodes as children
    // and frequency equal to the sum of the two nodes' frequencies
    let internalNode = new Node(null, left.freq + right.freq);
    internalNode.left = left;
    internalNode.right = right;

    // Add this internal node back to the priority queue
    pq.enqueue(internalNode);
  }

  // The remaining node is the root of the Huffman tree
  return pq.dequeue();
}

/**
 * Generate Huffman codes for each character
 * @param {Node} root - Root of the Huffman tree
 * @return {Object} - Map of characters to their Huffman codes
 */
function generateHuffmanCodes(root) {
  let codeMap = {};

  function traverse(node, code) {
    if (node.char) {
      // Leaf node: assign the current code to this character
      codeMap[node.char] = code;
    } else {
      // Internal node: traverse left and right children
      traverse(node.left, code + "0");
      traverse(node.right, code + "1");
    }
  }

  traverse(root, "");
  return codeMap;
}

/**
 * Huffman coding compression
 * @param {string} text - Input text to compress
 * @return {Object} - Compressed binary string and Huffman codes
 */
function huffmanCompress(text) {
  // Count frequency of each character
  let freqMap = {};
  for (let char of text) {
    freqMap[char] = (freqMap[char] || 0) + 1;
  }

  // Build Huffman tree
  let root = buildHuffmanTree(freqMap);

  // Generate Huffman codes
  let codeMap = generateHuffmanCodes(root);

  // Encode the text
  let encodedText = "";
  for (let char of text) {
    encodedText += codeMap[char];
  }

  return { encodedText, codeMap };
}

// Test the Huffman Coding Algorithm
let text = "this is an example for huffman encoding";
let compressed = huffmanCompress(text);

console.log("Original text:", text);
console.log("Compressed binary string:", compressed.encodedText);
console.log("Huffman Codes:", compressed.codeMap);

// This implementation of the Huffman Coding Compression Algorithm does the following:
// We define a Node class for the Huffman tree and a PriorityQueue class to assist in building the tree.
// The buildHuffmanTree function constructs the Huffman tree:
// It starts with leaf nodes for each character.
// It repeatedly combines the two nodes with the lowest frequencies until only one node (the root) remains.
// The generateHuffmanCodes function traverses the Huffman tree to generate the code for each character:
// It assigns '0' for left branches and '1' for right branches.
// The main huffmanCompress function:
// Counts the frequency of each character in the input text.
// Builds the Huffman tree.
// Generates the Huffman codes.
// Encodes the text using these codes.
// We test the algorithm with a sample text and print the compressed binary string and the Huffman codes.
// Huffman Coding is particularly useful for lossless data compression, especially when some characters appear much more frequently than others in the input.
