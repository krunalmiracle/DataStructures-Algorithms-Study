/**
 * Node class for Skip List
 */
class Node {
  constructor(value, level) {
    this.value = value;
    this.forward = new Array(level + 1).fill(null);
  }
}

/**
 * Skip List Data Structure
 * A Skip List is a probabilistic data structure that allows for fast search, insertion, and deletion operations.
 * It's an alternative to balanced trees and can achieve O(log n) average time complexity for these operations.
 */
class SkipList {
  constructor(maxLevel, p) {
    this.maxLevel = maxLevel;
    this.p = p;
    this.header = new Node(-1, maxLevel);
    this.level = 0;
  }

  /**
   * Generate a random level for a new node
   * @returns {number} - The level for the new node
   */
  randomLevel() {
    let lvl = 0;
    while (Math.random() < this.p && lvl < this.maxLevel) {
      lvl++;
    }
    return lvl;
  }

  /**
   * Insert a value into the Skip List
   * @param {*} value - The value to insert
   * @time Average case: O(log n), Worst case: O(n)
   */
  insert(value) {
    let update = new Array(this.maxLevel + 1).fill(null);
    let current = this.header;

    // Find the position to insert
    for (let i = this.level; i >= 0; i--) {
      while (current.forward[i] !== null && current.forward[i].value < value) {
        current = current.forward[i];
      }
      update[i] = current;
    }

    // Generate a random level for the new node
    let newLevel = this.randomLevel();

    // If the new level is greater than the current level, update the header
    if (newLevel > this.level) {
      for (let i = this.level + 1; i <= newLevel; i++) {
        update[i] = this.header;
      }
      this.level = newLevel;
    }

    // Create and insert the new node
    let newNode = new Node(value, newLevel);
    for (let i = 0; i <= newLevel; i++) {
      newNode.forward[i] = update[i].forward[i];
      update[i].forward[i] = newNode;
    }
  }

  /**
   * Search for a value in the Skip List
   * @param {*} value - The value to search for
   * @returns {boolean} - True if the value is found, false otherwise
   * @time Average case: O(log n), Worst case: O(n)
   */
  search(value) {
    let current = this.header;

    for (let i = this.level; i >= 0; i--) {
      while (current.forward[i] !== null && current.forward[i].value < value) {
        current = current.forward[i];
      }
    }

    current = current.forward[0];

    if (current !== null && current.value === value) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Delete a value from the Skip List
   * @param {*} value - The value to delete
   * @time Average case: O(log n), Worst case: O(n)
   */
  delete(value) {
    let update = new Array(this.maxLevel + 1).fill(null);
    let current = this.header;

    for (let i = this.level; i >= 0; i--) {
      while (current.forward[i] !== null && current.forward[i].value < value) {
        current = current.forward[i];
      }
      update[i] = current;
    }

    current = current.forward[0];

    if (current !== null && current.value === value) {
      for (let i = 0; i <= this.level; i++) {
        if (update[i].forward[i] !== current) {
          break;
        }
        update[i].forward[i] = current.forward[i];
      }

      while (this.level > 0 && this.header.forward[this.level] === null) {
        this.level--;
      }
    }
  }

  /**
   * Display the Skip List
   */
  display() {
    for (let i = 0; i <= this.level; i++) {
      let current = this.header.forward[i];
      console.log(`Level ${i}: `);
      while (current !== null) {
        process.stdout.write(`${current.value} `);
        current = current.forward[i];
      }
      console.log();
    }
  }
}

/**
 * Test function to demonstrate Skip List operations
 */
function testSkipList() {
  const sl = new SkipList(4, 0.5);

  console.log("Inserting elements:");
  [3, 6, 7, 9, 12, 19, 17, 26, 21, 25].forEach((val) => {
    sl.insert(val);
    console.log(`Inserted ${val}`);
  });

  console.log("\nSkip List structure:");
  sl.display();

  console.log("\nSearching for elements:");
  [19, 20].forEach((val) => {
    console.log(`Search ${val}: ${sl.search(val)}`);
  });

  console.log("\nDeleting element 19");
  sl.delete(19);

  console.log("\nUpdated Skip List structure:");
  sl.display();
}
// The Skip List provides an interesting alternative to balanced trees,
// offering similar average-case performance with a simpler implementation.
// Run the test function
testSkipList();
