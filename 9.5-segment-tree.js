/**
 * Segment Tree Implementation
 *
 * @description
 * A Segment Tree is a tree data structure used for storing information about intervals,
 * or segments. It allows querying which of the stored segments contain a given point.
 *
 * @reasoning
 * Segment Trees are useful for range query problems, where we need to perform operations
 * on ranges of elements efficiently.
 *
 * @complexity
 * Time complexity:
 *   - Build: O(n)
 *   - Query: O(log n)
 *   - Update: O(log n)
 * Space complexity: O(n)
 */
class SegmentTree {
  constructor(arr) {
    this.n = arr.length;
    this.tree = new Array(4 * this.n).fill(0);
    this.build(arr, 0, 0, this.n - 1);
  }

  build(arr, node, start, end) {
    if (start === end) {
      this.tree[node] = arr[start];
      return;
    }
    let mid = Math.floor((start + end) / 2);
    this.build(arr, 2 * node + 1, start, mid);
    this.build(arr, 2 * node + 2, mid + 1, end);
    this.tree[node] = this.tree[2 * node + 1] + this.tree[2 * node + 2];
  }

  query(node, start, end, l, r) {
    if (l > end || r < start) return 0;
    if (l <= start && end <= r) return this.tree[node];
    let mid = Math.floor((start + end) / 2);
    let leftSum = this.query(2 * node + 1, start, mid, l, r);
    let rightSum = this.query(2 * node + 2, mid + 1, end, l, r);
    return leftSum + rightSum;
  }

  update(node, start, end, index, value) {
    if (start === end) {
      this.tree[node] = value;
      return;
    }
    let mid = Math.floor((start + end) / 2);
    if (index <= mid) {
      this.update(2 * node + 1, start, mid, index, value);
    } else {
      this.update(2 * node + 2, mid + 1, end, index, value);
    }
    this.tree[node] = this.tree[2 * node + 1] + this.tree[2 * node + 2];
  }

  rangeSum(l, r) {
    return this.query(0, 0, this.n - 1, l, r);
  }

  updateValue(index, value) {
    this.update(0, 0, this.n - 1, index, value);
  }

  /**
   * Find the maximum value in a given range
   *
   * @param {number} l - Left bound of the range
   * @param {number} r - Right bound of the range
   * @returns {number} Maximum value in the range
   *
   * @complexity
   * Time complexity: O(log n)
   * Space complexity: O(log n) for the recursive call stack
   */
  rangeMax(l, r) {
    return this.queryMax(0, 0, this.n - 1, l, r);
  }

  queryMax(node, start, end, l, r) {
    if (l > end || r < start) return -Infinity;
    if (l <= start && end <= r) return this.tree[node];
    let mid = Math.floor((start + end) / 2);
    let leftMax = this.queryMax(2 * node + 1, start, mid, l, r);
    let rightMax = this.queryMax(2 * node + 2, mid + 1, end, l, r);
    return Math.max(leftMax, rightMax);
  }

  // Modify the build and update methods to store max instead of sum
  build(arr, node, start, end) {
    if (start === end) {
      this.tree[node] = arr[start];
      return;
    }
    let mid = Math.floor((start + end) / 2);
    this.build(arr, 2 * node + 1, start, mid);
    this.build(arr, 2 * node + 2, mid + 1, end);
    this.tree[node] = Math.max(
      this.tree[2 * node + 1],
      this.tree[2 * node + 2]
    );
  }

  update(node, start, end, index, value) {
    if (start === end) {
      this.tree[node] = value;
      return;
    }
    let mid = Math.floor((start + end) / 2);
    if (index <= mid) {
      this.update(2 * node + 1, start, mid, index, value);
    } else {
      this.update(2 * node + 2, mid + 1, end, index, value);
    }
    this.tree[node] = Math.max(
      this.tree[2 * node + 1],
      this.tree[2 * node + 2]
    );
  }
}

// Example usage
let arr = [1, 3, 5, 7, 9, 11];
let segTree = new SegmentTree(arr);
console.log(segTree.rangeSum(1, 3)); // 15
segTree.updateValue(2, 10);
console.log(segTree.rangeSum(1, 3)); // 20
console.log(segTree.rangeMax(1, 3)); // 7
segTree.updateValue(2, 10);
console.log(segTree.rangeMax(1, 3)); // 10
