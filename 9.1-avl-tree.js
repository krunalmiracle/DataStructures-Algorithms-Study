/**
 * AVL Tree Node
 * An AVL tree is a self-balancing binary search tree where the difference
 * between heights of left and right subtrees cannot be more than one for all nodes.
 */
class AVLNode {
  constructor(value) {
    this.value = value; // The node's value
    this.left = null; // Left child
    this.right = null; // Right child
    this.height = 1; // Height of the node, used for balancing
  }
}

/**
 * AVL Tree implementation
 */
class AVLTree {
  constructor() {
    this.root = null; // Root of the AVL tree
  }

  /**
   * Get the height of a node
   * @param {AVLNode} node - The node to get the height of
   * @returns {number} - The height of the node, or 0 if the node is null
   */
  height(node) {
    return node ? node.height : 0;
  }

  /**
   * Calculate the balance factor of a node
   * @param {AVLNode} node - The node to calculate the balance factor for
   * @returns {number} - The balance factor (difference between left and right subtree heights)
   */
  balanceFactor(node) {
    return this.height(node.left) - this.height(node.right);
  }

  /**
   * Update the height of a node based on its children's heights
   * @param {AVLNode} node - The node to update the height for
   */
  updateHeight(node) {
    node.height = 1 + Math.max(this.height(node.left), this.height(node.right));
  }

  /**
   * Perform a right rotation
   * @param {AVLNode} y - The node to rotate
   * @returns {AVLNode} - The new root of the rotated subtree
   */
  rotateRight(y) {
    let x = y.left;
    let T2 = x.right;

    // Perform rotation
    x.right = y;
    y.left = T2;

    // Update heights
    this.updateHeight(y);
    this.updateHeight(x);

    // Return new root
    return x;
  }

  /**
   * Perform a left rotation
   * @param {AVLNode} x - The node to rotate
   * @returns {AVLNode} - The new root of the rotated subtree
   */
  rotateLeft(x) {
    let y = x.right;
    let T2 = y.left;

    // Perform rotation
    y.left = x;
    x.right = T2;

    // Update heights
    this.updateHeight(x);
    this.updateHeight(y);

    // Return new root
    return y;
  }

  /**
   * Insert a value into the AVL tree
   * @param {*} value - The value to insert
   */
  insert(value) {
    this.root = this._insert(this.root, value);
  }

  /**
   * Recursive helper function to insert a value
   * @param {AVLNode} node - The current node in the recursion
   * @param {*} value - The value to insert
   * @returns {AVLNode} - The new root of the modified subtree
   */
  _insert(node, value) {
    // Perform standard BST insert
    if (!node) return new AVLNode(value);

    if (value < node.value) {
      node.left = this._insert(node.left, value);
    } else if (value > node.value) {
      node.right = this._insert(node.right, value);
    } else {
      // Duplicate values are not allowed
      return node;
    }

    // Update height of current node
    this.updateHeight(node);

    // Get the balance factor to check if this node became unbalanced
    let balance = this.balanceFactor(node);

    // Left Heavy
    if (balance > 1) {
      if (value < node.left.value) {
        // Left Left Case
        return this.rotateRight(node);
      } else {
        // Left Right Case
        node.left = this.rotateLeft(node.left);
        return this.rotateRight(node);
      }
    }

    // Right Heavy
    if (balance < -1) {
      if (value > node.right.value) {
        // Right Right Case
        return this.rotateLeft(node);
      } else {
        // Right Left Case
        node.right = this.rotateRight(node.right);
        return this.rotateLeft(node);
      }
    }

    // Return the unchanged node pointer
    return node;
  }

  /**
   * Perform an inorder traversal of the AVL tree
   * @param {AVLNode} node - The current node in the traversal
   */
  inorderTraversal(node = this.root) {
    if (node) {
      this.inorderTraversal(node.left);
      console.log(`Value: ${node.value}, Height: ${node.height}`);
      this.inorderTraversal(node.right);
    }
  }

  /**
   * Find the kth smallest element in the AVL tree
   *
   * @param {number} k - The k value for kth smallest
   * @returns {number|null} The kth smallest value or null if not found
   *
   * @complexity
   * Time complexity: O(log n + k)
   * Space complexity: O(log n) for the recursive call stack
   */
  kthSmallest(k) {
    const result = { count: 0, value: null };
    this._kthSmallestHelper(this.root, k, result);
    return result.value;
  }

  _kthSmallestHelper(node, k, result) {
    if (!node) return;

    this._kthSmallestHelper(node.left, k, result);

    result.count++;
    if (result.count === k) {
      result.value = node.value;
      return;
    }

    this._kthSmallestHelper(node.right, k, result);
  }
}

//   This AVL tree implementation ensures that the tree remains balanced after each insertion,
//  maintaining a time complexity of O(log n) for insertions and searches.
// Test AVL Tree
const avl = new AVLTree();
[10, 20, 30, 40, 50, 25].forEach((val) => avl.insert(val));
console.log("AVL Tree Inorder Traversal:");
avl.inorderTraversal(); // Output: 10, 20, 25, 30, 40, 50
console.log(avl.kthSmallest(3)); // Output: 25
