/**
 * Fenwick Tree (Binary Indexed Tree) Implementation
 *
 * @description
 * A Fenwick Tree or Binary Indexed Tree is a data structure that can efficiently update
 * elements and calculate prefix sums in a table of numbers.
 *
 * @reasoning
 * Fenwick Trees are particularly useful for problems involving range sum queries and
 * point updates in an array.
 *
 * @complexity
 * Time complexity: O(log n) for both update and query operations
 * Space complexity: O(n)
 */
// The Fenwick Tree provides efficient updates and range sum queries with O(log n) time complexity,
// while being more space-efficient than a Segment Tree for certain types of problems.
// These data structures demonstrate advanced techniques for handling range queries and updates:
// The Segment Tree is versatile and can be adapted for various range query problems beyond just sum queries
//  (e.g., minimum, maximum, GCD). It's particularly useful when you need to perform more complex operations over ranges.
// The Fenwick Tree (Binary Indexed Tree) is more space-efficient and often simpler to implement than a Segment Tree
//  for problems involving cumulative operations like sum or XOR. It's particularly efficient for problems
//  that require frequent updates and cumulative sum queries.
// Both structures are commonly used in competitive programming and are crucial for solving
// problems involving range queries efficiently. They showcase how clever data structuring can dramatically
// improve the efficiency of certain operations on arrays or sequences.
// These data structures are particularly useful in scenarios such as:
// Calculating cumulative statistics over ranges in large datasets
// Efficiently updating values and querying ranges in dynamic sequences
// Solving problems involving prefix sums or difference arrays
// Implementing algorithms that require fast range updates and queries
class FenwickTree {
  constructor(n) {
    this.size = n;
    this.tree = new Array(n + 1).fill(0); // 1-indexed array
  }

  // Update the value at index by delta
  update(index, delta) {
    index++; // Convert to 1-indexed
    while (index <= this.size) {
      this.tree[index] += delta;
      index += index & -index; // Move to the next relevant index
    }
  }

  // Get the sum from index 1 to index (inclusive)
  query(index) {
    let sum = 0;
    index++; // Convert to 1-indexed
    while (index > 0) {
      sum += this.tree[index];
      index -= index & -index; // Move to the parent
    }
    return sum;
  }

  // Get the sum from left to right (inclusive)
  rangeQuery(left, right) {
    return this.query(right) - this.query(left - 1);
  }

  // Find the smallest index with a given cumulative sum
  findSmallestIndex(sum) {
    let index = 0;
    let bitMask = 1 << Math.floor(Math.log2(this.size));

    while (bitMask !== 0) {
      let tIndex = index + bitMask;
      bitMask >>= 1;

      if (tIndex > this.size) continue;

      if (sum > this.tree[tIndex]) {
        index = tIndex;
        sum -= this.tree[tIndex];
      }
    }

    return sum === 0 ? index : -1;
  }

  /**
   * Get the sum of elements from 1 to index
   * @param {number} index - Upper bound of the range (1-based)
   * @returns {number} - Sum of elements
   * @time O(log n)
   */
  sum(index) {
    let sum = 0;
    while (index > 0) {
      sum += this.tree[index];
      index -= index & -index; // Move to the parent
    }
    return sum;
  }

  /**
   * Get the sum of elements in a range
   * @param {number} left - Left bound of the range (1-based)
   * @param {number} right - Right bound of the range (1-based)
   * @returns {number} - Sum of elements in the range
   * @time O(log n)
   */
  rangeSum(left, right) {
    return this.sum(right) - this.sum(left - 1);
  }
}

// Example usage
let fenwick = new FenwickTree(10);
[3, 2, -1, 6, 5, 4, -3, 3, 7, 2].forEach((val, idx) =>
  fenwick.update(idx, val)
);
console.log("Sum of first 5 elements:", fenwick.query(4)); // 15
console.log("Sum of elements 3 to 7:", fenwick.rangeQuery(2, 6)); // 11
console.log("Smallest index with sum 10:", fenwick.findSmallestIndex(10)); // 3
console.log("Sum of range [1, 3]:", fenwick.rangeSum(1, 3));
console.log("Sum of range [2, 5]:", fenwick.rangeSum(2, 5));

console.log("\nUpdating index 3 to 6");
fenwick.update(3, 6 - arr[2]); // Update the difference

console.log("Sum of range [1, 3] aftker update:", fenwick.rangeSum(1, 3));
console.log("Sum of range [2, 5] after update:", fenwick.rangeSum(2, 5));
