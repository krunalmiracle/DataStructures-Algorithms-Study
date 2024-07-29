/**
 * HashTable Implementation
 *
 * @description
 * A HashTable is a data structure that implements an associative array abstract data type,
 * a structure that can map keys to values. It uses a hash function to compute an index
 * into an array of buckets or slots, from which the desired value can be found.
 *
 * @reasoning
 * HashTables provide average-case constant time complexity for basic operations
 * (insertion, deletion, and search), making them highly efficient for many applications.
 *
 * @assumptions
 * - Keys are strings (can be adapted for other types).
 * - The hash function provides a relatively uniform distribution of keys.
 * - The table can dynamically resize to maintain performance as the number of elements grows.
 *
 * @complexity
 * Average case time complexity: O(1) for insertion, deletion, and search.
 * Worst case (all keys collide): O(n) for insertion, deletion, and search.
 * Space complexity: O(n), where n is the number of key-value pairs stored.
 */
class HashTable {
  /**
   * Constructor for the HashTable class
   * @param {number} size - Initial size of the hash table
   * @param {function} hashFunction - Custom hash function (optional)
   */
  constructor(size = 53, hashFunction = null) {
    // Initialize the table with an array of the specified size
    this.table = new Array(size);
    // Set the hash function (use default if none provided)
    this.hashFunction = hashFunction || this.defaultHash;
    // Keep track of the number of items in the table
    this.count = 0;
    // Set load factor threshold for resizing
    this.loadFactor = 0.7;
  }

  /**
   * Default hash function using the simple modulo technique
   * @param {string} key - The key to hash
   * @returns {number} The hash value
   */
  defaultHash(key) {
    let total = 0;
    // Sum the character codes of each character in the key
    for (let i = 0; i < key.length; i++) {
      total += key.charCodeAt(i);
    }
    // Return the sum modulo the table size
    return total % this.table.length;
  }

  /**
   * Inserts a key-value pair into the hash table
   * @param {string} key - The key to insert
   * @param {*} value - The value associated with the key
   */
  insert(key, value) {
    // Get the index for this key
    const index = this.hashFunction(key);
    // If the slot is empty, create a new array (for chaining)
    if (!this.table[index]) {
      this.table[index] = [];
    }
    // Add the key-value pair to the chain
    this.table[index].push([key, value]);
    // Increment the count
    this.count++;
    // Check if we need to resize
    if (this.count / this.table.length > this.loadFactor) {
      this.resize();
    }
  }

  /**
   * Retrieves the value associated with a given key
   * @param {string} key - The key to search for
   * @returns {*} The value associated with the key, or undefined if not found
   */
  search(key) {
    const index = this.hashFunction(key);
    if (this.table[index]) {
      // Search the chain for the key
      for (let pair of this.table[index]) {
        if (pair[0] === key) {
          return pair[1];
        }
      }
    }
    // Key not found
    return undefined;
  }

  /**
   * Deletes a key-value pair from the hash table
   * @param {string} key - The key to delete
   * @returns {boolean} True if the key was found and deleted, false otherwise
   */
  delete(key) {
    const index = this.hashFunction(key);
    if (this.table[index]) {
      for (let i = 0; i < this.table[index].length; i++) {
        if (this.table[index][i][0] === key) {
          // Remove the key-value pair from the chain
          this.table[index].splice(i, 1);
          this.count--;
          return true;
        }
      }
    }
    // Key not found
    return false;
  }

  /**
   * Resizes the hash table when the load factor threshold is exceeded
   */
  resize() {
    // Double the size of the table
    const newSize = this.table.length * 2;
    const oldTable = this.table;
    // Create a new table with the new size
    this.table = new Array(newSize);
    this.count = 0;

    // Rehash all existing elements into the new table
    for (let bucket of oldTable) {
      if (bucket) {
        for (let [key, value] of bucket) {
          this.insert(key, value);
        }
      }
    }
  }
}

/**
 * LinearProbingHashTable class implementing open addressing with linear probing
 *
 * @description
 * This class extends the HashTable class to implement open addressing with linear probing
 * for collision resolution.
 *
 * @reasoning
 * Linear probing can provide better cache performance than chaining in some cases,
 * as it keeps elements in contiguous memory locations.
 *
 * @assumptions
 * - The hash function distributes keys uniformly across the table.
 * - The table size is prime to reduce clustering.
 * - The load factor is kept below a certain threshold to maintain performance.
 */
class LinearProbingHashTable extends HashTable {
  /**
   * Inserts a key-value pair using linear probing for collision resolution
   * @param {string} key - The key to insert
   * @param {*} value - The value associated with the key
   */
  insert(key, value) {
    let index = this.hashFunction(key);
    // Probe until an empty slot or the key is found
    while (this.table[index] !== undefined) {
      if (this.table[index][0] === key) {
        // Update existing key
        this.table[index][1] = value;
        return;
      }
      // Linear probing
      index = (index + 1) % this.table.length;
    }
    // Insert the key-value pair
    this.table[index] = [key, value];
    this.count++;
    // Check if we need to resize
    if (this.count / this.table.length > this.loadFactor) {
      this.resize();
    }
  }

  /**
   * Searches for a key using linear probing
   * @param {string} key - The key to search for
   * @returns {*} The value associated with the key, or undefined if not found
   */
  search(key) {
    let index = this.hashFunction(key);
    while (this.table[index] !== undefined) {
      if (this.table[index][0] === key) {
        return this.table[index][1];
      }
      index = (index + 1) % this.table.length;
    }
    return undefined;
  }

  /**
   * Deletes a key-value pair using linear probing
   * @param {string} key - The key to delete
   * @returns {boolean} True if the key was found and deleted, false otherwise
   */
  delete(key) {
    let index = this.hashFunction(key);
    while (this.table[index] !== undefined) {
      if (this.table[index][0] === key) {
        // Mark the slot as deleted
        this.table[index] = undefined;
        this.count--;
        // Rehash the cluster
        index = (index + 1) % this.table.length;
        while (this.table[index] !== undefined) {
          let [k, v] = this.table[index];
          this.table[index] = undefined;
          this.count--;
          this.insert(k, v);
          index = (index + 1) % this.table.length;
        }
        return true;
      }
      index = (index + 1) % this.table.length;
    }
    return false;
  }
}

/**
 * QuadraticProbingHashTable class implementing open addressing with quadratic probing
 *
 * @description
 * This class extends the HashTable class to implement open addressing with quadratic probing
 * for collision resolution.
 *
 * @reasoning
 * Quadratic probing helps reduce primary clustering that can occur with linear probing,
 * potentially leading to better performance in certain scenarios.
 *
 * @assumptions
 * - The hash function distributes keys uniformly across the table.
 * - The table size is chosen to ensure that all table slots can be probed.
 * - The load factor is kept below a certain threshold to maintain performance.
 */
class QuadraticProbingHashTable extends HashTable {
  /**
   * Inserts a key-value pair using quadratic probing for collision resolution
   * @param {string} key - The key to insert
   * @param {*} value - The value associated with the key
   */
  insert(key, value) {
    let index = this.hashFunction(key);
    let i = 1;
    while (this.table[index] !== undefined) {
      if (this.table[index][0] === key) {
        // Update existing key
        this.table[index][1] = value;
        return;
      }
      // Quadratic probing
      index = (index + i * i) % this.table.length;
      i++;
    }
    // Insert the key-value pair
    this.table[index] = [key, value];
    this.count++;
    // Check if we need to resize
    if (this.count / this.table.length > this.loadFactor) {
      this.resize();
    }
  }

  /**
   * Searches for a key using quadratic probing
   * @param {string} key - The key to search for
   * @returns {*} The value associated with the key, or undefined if not found
   */
  search(key) {
    let index = this.hashFunction(key);
    let i = 1;
    while (this.table[index] !== undefined) {
      if (this.table[index][0] === key) {
        return this.table[index][1];
      }
      index = (index + i * i) % this.table.length;
      i++;
    }
    return undefined;
  }

  /**
   * Deletes a key-value pair using quadratic probing
   * @param {string} key - The key to delete
   * @returns {boolean} True if the key was found and deleted, false otherwise
   */
  delete(key) {
    let index = this.hashFunction(key);
    let i = 1;
    while (this.table[index] !== undefined) {
      if (this.table[index][0] === key) {
        // Mark the slot as deleted
        this.table[index] = undefined;
        this.count--;
        // Rehash the cluster
        index = (index + i * i) % this.table.length;
        i++;
        while (this.table[index] !== undefined) {
          let [k, v] = this.table[index];
          this.table[index] = undefined;
          this.count--;
          this.insert(k, v);
          index = (index + i * i) % this.table.length;
          i++;
        }
        return true;
      }
      index = (index + i * i) % this.table.length;
      i++;
    }
    return false;
  }
}

/**
 * DoubleHashingHashTable class implementing open addressing with double hashing
 *
 * @description
 * This class extends the HashTable class to implement open addressing with double hashing
 * for collision resolution.
 *
 * @reasoning
 * Double hashing provides a more uniform probing sequence than linear or quadratic probing,
 * which can lead to better distribution of keys and potentially better performance.
 *
 * @assumptions
 * - Two independent hash functions are available that distribute keys uniformly.
 * - The second hash function never evaluates to zero.
 * - The table size is prime to ensure all slots can be probed.
 */
class DoubleHashingHashTable extends HashTable {
  /**
   * Constructor for the DoubleHashingHashTable class
   * @param {number} size - Initial size of the hash table
   * @param {function} hashFunction1 - First hash function
   * @param {function} hashFunction2 - Second hash function
   */
  constructor(size = 53, hashFunction1 = null, hashFunction2 = null) {
    super(size, hashFunction1);
    this.hashFunction2 = hashFunction2 || this.defaultHash2;
  }

  /**
   * Second hash function for double hashing
   * @param {string} key - The key to hash
   * @returns {number} The hash value
   */
  defaultHash2(key) {
    let total = 0;
    for (let i = 0; i < key.length; i++) {
      total += key.charCodeAt(i) * (i + 1);
    }
    return (total % (this.table.length - 1)) + 1;
  }

  /**
   * Inserts a key-value pair using double hashing for collision resolution
   * @param {string} key - The key to insert
   * @param {*} value - The value associated with the key
   */
  insert(key, value) {
    let index = this.hashFunction(key);
    let step = this.hashFunction2(key);
    let i = 0;
    while (this.table[index] !== undefined) {
      if (this.table[index][0] === key) {
        // Update existing key
        this.table[index][1] = value;
        return;
      }
      // Double hashing
      index = (index + i * step) % this.table.length;
      i++;
    }
    // Insert the key-value pair
    this.table[index] = [key, value];
    this.count++;
    // Check if we need to resize
    if (this.count / this.table.length > this.loadFactor) {
      this.resize();
    }
  }

  /**
   * Searches for a key using double hashing
   * @param {string} key - The key to search for
   * @returns {*} The value associated with the key, or undefined if not found
   */
  search(key) {
    let index = this.hashFunction(key);
    let step = this.hashFunction2(key);
    let i = 0;
    while (this.table[index] !== undefined) {
      if (this.table[index][0] === key) {
        return this.table[index][1];
      }
      index = (index + i * step) % this.table.length;
      i++;
    }
    return undefined;
  }

  /**
   * Deletes a key-value pair using double hashing
   * @param {string} key - The key to delete
   * @returns {boolean} True if the key was found and deleted, false otherwise
   */
  delete(key) {
    let index = this.hashFunction(key);
    let step = this.hashFunction2(key);
    let i = 0;
    while (this.table[index] !== undefined) {
      if (this.table[index][0] === key) {
        // Mark the slot as deleted
        this.table[index] = undefined;
        this.count--;
        // Rehash the cluster
        index = (index + i * step) % this.table.length;
        i++;
        while (this.table[index] !== undefined) {
          let [k, v] = this.table[index];
          this.table[index] = undefined;
          this.count--;
          this.insert(k, v);
          index = (index + i * step) % this.table.length;
          i++;
        }
        return true;
      }
      index = (index + i * step) % this.table.length;
      i++;
    }
    return false;
  }
}

/**
 * BloomFilter Implementation
 *
 * @description
 * A Bloom filter is a space-efficient probabilistic data structure that is used to test whether an element is a member of a set.
 * False positive matches are possible, but false negatives are not – in other words, a query returns either "possibly in set" or "definitely not in set".
 *
 * @reasoning
 * Bloom filters are useful when you need to quickly check if an element might be in a set, and where a small false positive rate is acceptable.
 * They are much more space-efficient than hash tables for large sets.
 *
 * @assumptions
 * - The hash functions used are independent and distribute elements uniformly.
 * - The desired false positive rate and expected number of elements are known in advance.
 *
 * @complexity
 * Time complexity: O(k) for both insertion and search, where k is the number of hash functions.
 * Space complexity: O(m), where m is the size of the bit array.
 */
class BloomFilter {
  /**
   * Constructor for the BloomFilter class
   * @param {number} size - The size of the bit array
   * @param {number} numHashes - The number of hash functions to use
   */
  constructor(size, numHashes) {
    // Initialize the bit array with all bits set to 0
    this.size = size;
    this.bitArray = new Array(size).fill(0);
    this.numHashes = numHashes;
  }

  /**
   * Adds an element to the Bloom filter
   * @param {string} element - The element to add
   */
  add(element) {
    // For each hash function, set the corresponding bit to 1
    for (let i = 0; i < this.numHashes; i++) {
      const index = this.hash(element, i);
      this.bitArray[index] = 1;
    }
  }

  /**
   * Checks if an element might be in the set
   * @param {string} element - The element to check
   * @returns {boolean} True if the element might be in the set, false if it's definitely not
   */
  mightContain(element) {
    // Check if all corresponding bits are set to 1
    for (let i = 0; i < this.numHashes; i++) {
      const index = this.hash(element, i);
      if (this.bitArray[index] === 0) {
        return false;
      }
    }
    return true;
  }

  /**
   * Hash function for the Bloom filter
   * @param {string} element - The element to hash
   * @param {number} seed - A seed value to generate different hash functions
   * @returns {number} The hash value
   */
  hash(element, seed) {
    let hash = 0;
    for (let i = 0; i < element.length; i++) {
      hash = (hash * seed + element.charCodeAt(i)) % this.size;
    }
    return hash;
  }
}

/**
 * Problem: Implement a simple spell checker using a Bloom filter
 *
 * @description
 * Create a spell checker that can quickly determine if a word might be correctly spelled.
 * Use a Bloom filter to store a dictionary of correctly spelled words.
 *
 * @reasoning
 * A Bloom filter is ideal for this scenario because:
 * 1. It's space-efficient for storing large dictionaries.
 * 2. It provides fast lookups.
 * 3. False positives (indicating a misspelled word might be correct) are acceptable,
 *    as we can do a secondary check if needed.
 *
 * @assumptions
 * - We have a list of correctly spelled words to populate the filter.
 * - The rate of false positives is acceptable for the application.
 *
 * @returns {Object} An object with methods to add words and check spelling
 */
function createSpellChecker(dictionaryWords) {
  // Create a Bloom filter with appropriate size and number of hash functions
  // These values should be tuned based on the expected dictionary size and desired false positive rate
  const bloomFilter = new BloomFilter(100000, 5);

  // Add all dictionary words to the Bloom filter
  for (let word of dictionaryWords) {
    bloomFilter.add(word.toLowerCase());
  }

  return {
    /**
     * Checks if a word might be spelled correctly
     * @param {string} word - The word to check
     * @returns {boolean} True if the word might be spelled correctly, false if it's definitely misspelled
     */
    checkSpelling: function (word) {
      return bloomFilter.mightContain(word.toLowerCase());
    },

    /**
     * Adds a new word to the dictionary
     * @param {string} word - The word to add
     */
    addWord: function (word) {
      bloomFilter.add(word.toLowerCase());
    },
  };
}

// Example usage of the spell checker
const dictionary = ["apple", "banana", "cherry", "date", "elderberry"];
const spellChecker = createSpellChecker(dictionary);

console.log(spellChecker.checkSpelling("apple")); // true
console.log(spellChecker.checkSpelling("aple")); // false
console.log(spellChecker.checkSpelling("banana")); // true
spellChecker.addWord("grape");
console.log(spellChecker.checkSpelling("grape")); // true

/**
 * LRU Cache Implementation using a Hash Table and Doubly Linked List
 *
 * @description
 * This class implements a Least Recently Used (LRU) cache using a hash table for fast access
 * and a doubly linked list to maintain the order of elements. It provides constant time
 * complexity for both get and put operations.
 *
 * @reasoning
 * LRU caches are useful for managing limited resources where we want to keep the most recently
 * accessed items and discard the least recently used when the cache reaches capacity. The
 * combination of a hash table and doubly linked list allows for O(1) time complexity for both
 * access and update operations.
 *
 * @assumptions
 * - The cache has a fixed capacity.
 * - Keys are unique and hashable.
 * - Both time and space efficiency are important, with a slight preference for time efficiency.
 *
 * @complexity
 * Time complexity: O(1) for both get and put operations.
 * Space complexity: O(capacity), where capacity is the maximum number of items in the cache.
 *
 * @algorithm
 * 1. Maintain a hash table mapping keys to nodes in the doubly linked list.
 * 2. Maintain a doubly linked list to keep track of the order of elements.
 * 3. For get operation:
 *    a. If the key exists in the hash table:
 *       - Remove the corresponding node from its current position in the list.
 *       - Move the node to the front of the list (most recently used).
 *       - Return the value associated with the key.
 *    b. If the key doesn't exist, return undefined or a specified default value.
 * 4. For put operation:
 *    a. If the key already exists:
 *       - Update its value.
 *       - Move the corresponding node to the front of the list.
 *    b. If the key doesn't exist:
 *       - If the cache is at capacity, remove the least recently used item (tail of the list).
 *       - Create a new node and add it to the front of the list.
 *       - Add the key-node pair to the hash table.
 * 5. Ensure that the cache size never exceeds the specified capacity.
 *
 * @returns {Object} An instance of the LRUCache with methods for get and put operations.
 */
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
    this.head = new Node(0, 0);
    this.tail = new Node(0, 0);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  get(key) {
    if (this.cache.has(key)) {
      const node = this.cache.get(key);
      this.removeNode(node);
      this.addToFront(node);
      return node.value;
    }
    return undefined;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      const node = this.cache.get(key);
      node.value = value;
      this.removeNode(node);
      this.addToFront(node);
    } else {
      if (this.cache.size >= this.capacity) {
        const leastUsed = this.tail.prev;
        this.removeNode(leastUsed);
        this.cache.delete(leastUsed.key);
      }
      const newNode = new Node(key, value);
      this.addToFront(newNode);
      this.cache.set(key, newNode);
    }
  }

  removeNode(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  addToFront(node) {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next.prev = node;
    this.head.next = node;
  }
}

class Node {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

/**
 * Test function for the HashTable implementation
 *
 * @description
 * This function demonstrates the usage of the HashTable class by performing
 * various operations and printing the results.
 *
 * @reasoning
 * Testing is crucial to ensure that the implemented data structure behaves correctly
 * under different scenarios, including edge cases.
 *
 * @algorithm
 * 1. Create a new HashTable instance.
 * 2. Insert several key-value pairs.
 * 3. Retrieve and print values for existing and non-existing keys.
 * 4. Delete a key-value pair and verify the deletion.
 * 5. Attempt to delete a non-existing key.
 *
 * @returns {void}
 */
function testHashTable() {
  console.log("Testing HashTable Implementation");
  const ht = new HashTable();

  ht.insert("name", "John Doe");
  ht.insert("age", 30);
  ht.insert("city", "New York");

  console.log("Name:", ht.search("name")); // Expected: John Doe
  console.log("Age:", ht.search("age")); // Expected: 30
  console.log("City:", ht.search("city")); // Expected: New York
  console.log("Country:", ht.search("country")); // Expected: undefined

  console.log("Deleting 'age':", ht.delete("age")); // Expected: true
  console.log("Age after deletion:", ht.search("age")); // Expected: undefined

  console.log("Deleting non-existing key:", ht.delete("country")); // Expected: false
}

/**
 * Test function for the LRU Cache implementation
 *
 * @description
 * This function demonstrates the usage of the LRUCache class by performing
 * various operations and printing the results.
 *
 * @reasoning
 * Testing the LRU Cache implementation ensures that it correctly maintains
 * the least recently used order and respects the capacity limit.
 *
 * @algorithm
 * 1. Create a new LRUCache instance with a specified capacity.
 * 2. Insert several key-value pairs, some exceeding the capacity.
 * 3. Retrieve values, demonstrating the caching behavior.
 * 4. Update existing values and observe the order change.
 *
 * @returns {void}
 */
function testLRUCache() {
  console.log("\nTesting LRU Cache Implementation");
  const cache = new LRUCache(2);

  cache.put(1, 1);
  cache.put(2, 2);
  console.log(cache.get(1)); // Expected: 1
  cache.put(3, 3); // This should evict key 2
  console.log(cache.get(2)); // Expected: undefined
  cache.put(4, 4); // This should evict key 1
  console.log(cache.get(1)); // Expected: undefined
  console.log(cache.get(3)); // Expected: 3
  console.log(cache.get(4)); // Expected: 4
}

// Run the test functions
testHashTable();
testLRUCache();
