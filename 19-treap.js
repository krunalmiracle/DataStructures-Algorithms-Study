/**
 * Treap Node
 * A Treap is a randomized binary search tree. It's a combination of a BST and a heap.
 */
class TreapNode {
  constructor(value) {
    this.value = value; // The node's value (BST property)
    this.priority = Math.random(); // Random priority (heap property)
    this.left = null; // Left child
    this.right = null; // Right child
  }
}

/**
 * Treap implementation
 */
class Treap {
  constructor() {
    this.root = null; // Root of the Treap
  }

  /**
   * Perform a right rotation
   * @param {TreapNode} y - The node to rotate
   * @returns {TreapNode} - The new root of the rotated subtree
   */
  rotateRight(y) {
    let x = y.left;
    y.left = x.right;
    x.right = y;
    return x;
  }

  /**
   * Perform a left rotation
   * @param {TreapNode} x - The node to rotate
   * @returns {TreapNode} - The new root of the rotated subtree
   */
  rotateLeft(x) {
    let y = x.right;
    x.right = y.left;
    y.left = x;
    return y;
  }

  /**
   * Insert a value into the Treap
   * @param {*} value - The value to insert
   */
  insert(value) {
    this.root = this._insert(this.root, value);
  }

  /**
   * Recursive helper function to insert a value
   * @param {TreapNode} node - The current node in the recursion
   * @param {*} value - The value to insert
   * @returns {TreapNode} - The new root of the modified subtree
   */
  _insert(node, value) {
    // If we've reached a null node, create a new node here
    if (!node) return new TreapNode(value);

    // Perform standard BST insert
    if (value < node.value) {
      // Insert into left subtree
      node.left = this._insert(node.left, value);
      // Check if heap property is violated
      if (node.left.priority > node.priority) {
        // Rotate right to fix the violation
        node = this.rotateRight(node);
      }
    } else {
      // Insert into right subtree
      node.right = this._insert(node.right, value);
      // Check if heap property is violated
      if (node.right.priority > node.priority) {
        // Rotate left to fix the violation
        node = this.rotateLeft(node);
      }
    }

    return node;
  }

  /**
   * Delete a value from the Treap
   * @param {*} value - The value to delete
   */
  delete(value) {
    this.root = this._delete(this.root, value);
  }

  /**
   * Recursive helper function to delete a value
   * @param {TreapNode} node - The current node in the recursion
   * @param {*} value - The value to delete
   * @returns {TreapNode} - The new root of the modified subtree
   */
  _delete(node, value) {
    if (!node) return null;

    if (value < node.value) {
      // Value is in left subtree
      node.left = this._delete(node.left, value);
    } else if (value > node.value) {
      // Value is in right subtree
      node.right = this._delete(node.right, value);
    } else {
      // Node to delete found
      // Case 1: Node is a leaf
      if (!node.left && !node.right) {
        return null;
      }
      // Case 2: Node has only one child
      if (!node.left) return node.right;
      if (!node.right) return node.left;

      // Case 3: Node has two children
      // Move the node down by rotating
      if (node.left.priority > node.right.priority) {
        node = this.rotateRight(node);
        node.right = this._delete(node.right, value);
      } else {
        node = this.rotateLeft(node);
        node.left = this._delete(node.left, value);
      }
    }
    return node;
  }

  /**
   * Search for a value in the Treap
   * @param {*} value - The value to search for
   * @returns {boolean} - True if the value is found, false otherwise
   */
  search(value) {
    return this._search(this.root, value);
  }

  /**
   * Recursive helper function to search for a value
   * @param {TreapNode} node - The current node in the recursion
   * @param {*} value - The value to search for
   * @returns {boolean} - True if the value is found, false otherwise
   */
  _search(node, value) {
    if (!node) return false;
    if (node.value === value) return true;
    if (value < node.value) return this._search(node.left, value);
    return this._search(node.right, value);
  }

  /**
   * Perform an inorder traversal of the Treap
   * @param {TreapNode} node - The current node in the traversal
   */
  inorderTraversal(node = this.root) {
    if (node) {
      this.inorderTraversal(node.left);
      console.log(
        `Value: ${node.value}, Priority: ${node.priority.toFixed(4)}`
      );
      this.inorderTraversal(node.right);
    }
  }
}
// This Treap implementation provides the following key features:
// Random Priorities: Each node is assigned a random priority when created. This randomness helps in maintaining balance.
// BST Property: The tree maintains the binary search tree property based on the node values.
// Heap Property: The tree also maintains a heap property based on the random priorities.
// Rotations: The rotateLeft and rotateRight functions are used to maintain the heap property after insertions and deletions.
// Insertion: The insert function adds a new value to the Treap.
// After standard BST insertion, it uses rotations to maintain the heap property based on priorities.
// Deletion: The delete function removes a value from the Treap. It handles three cases: leaf nodes, nodes with one child,
// and nodes with two children. For nodes with two children, it uses rotations to move the node down until it becomes a leaf, then removes it.
// Search: The search function looks for a value in the Treap, following the BST property.
// Inorder Traversal: The inorderTraversal function displays the Treap's contents in sorted order.
// The Treap's randomized nature provides good average-case performance for operations
// like insertion, deletion, and search, all of which have an expected time complexity of O(log n).
//  However, in the worst case (which is rare due to randomization), these operations can take O(n) time.
// The main advantage of a Treap is its simplicity compared to other self-balancing trees
// while still providing good average-case performance. The random priorities make it resistant to worst-case
// scenarios that can occur with deterministic data structures.
// Test Treap
const treap = new Treap();
[5, 2, 6, 1, 4, 3].forEach((val) => treap.insert(val));
console.log("Treap after insertions:");
treap.inorderTraversal();

console.log("\nSearching for 4:", treap.search(4));
console.log("Searching for 7:", treap.search(7));

console.log("\nDeleting 4");
treap.delete(4);
console.log("Treap after deletion:");
treap.inorderTraversal();
