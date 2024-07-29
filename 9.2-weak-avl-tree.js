/**
 * WAVL Tree Node
 * A Weak AVL tree is a variant of AVL tree with relaxed balance conditions,
 * allowing for fewer rotations during insertions and deletions.
 */
class WAVLNode {
  constructor(value) {
    this.value = value; // The node's value
    this.left = null; // Left child
    this.right = null; // Right child
    this.rank = 0; // Rank of the node, used for balancing
  }
}

/**
 * WAVL Tree implementation
 */
class WAVLTree {
  constructor() {
    this.root = null; // Root of the WAVL tree
  }

  /**
   * Get the rank of a node
   * @param {WAVLNode} node - The node to get the rank of
   * @returns {number} - The rank of the node, or -1 if the node is null
   */
  rank(node) {
    return node ? node.rank : -1;
  }

  /**
   * Insert a value into the WAVL tree
   * @param {*} value - The value to insert
   */
  insert(value) {
    this.root = this._insert(this.root, value);
  }

  /**
   * Recursive helper function to insert a value
   * @param {WAVLNode} node - The current node in the recursion
   * @param {*} value - The value to insert
   * @returns {WAVLNode} - The new root of the modified subtree
   */
  _insert(node, value) {
    // Perform standard BST insert
    if (!node) return new WAVLNode(value);

    if (value < node.value) {
      node.left = this._insert(node.left, value);
    } else if (value > node.value) {
      node.right = this._insert(node.right, value);
    } else {
      // Duplicate values are not allowed
      return node;
    }

    // Rebalance the tree
    return this.rebalance(node);
  }

  /**
   * Rebalance the WAVL tree after insertion
   * @param {WAVLNode} node - The node to rebalance
   * @returns {WAVLNode} - The new root of the rebalanced subtree
   */
  rebalance(node) {
    let leftRank = this.rank(node.left);
    let rightRank = this.rank(node.right);

    // Check if the node violates the WAVL conditions
    if (node.rank - leftRank > 2 || node.rank - rightRank > 2) {
      // Demote the node
      node.rank--;
      if (leftRank > rightRank) {
        // Left child is higher, rotate right
        return this.rotateRight(node);
      } else {
        // Right child is higher, rotate left
        return this.rotateLeft(node);
      }
    }

    // Check if the node needs promotion
    if (node.rank - leftRank === 0 || node.rank - rightRank === 0) {
      node.rank++;
    }

    return node;
  }

  /**
   * Perform a right rotation
   * @param {WAVLNode} y - The node to rotate
   * @returns {WAVLNode} - The new root of the rotated subtree
   */
  rotateRight(y) {
    let x = y.left;
    y.left = x.right;
    x.right = y;
    // Update ranks
    y.rank = Math.min(this.rank(y.left), this.rank(y.right)) + 1;
    x.rank = Math.min(this.rank(x.left), y.rank) + 1;
    return x;
  }

  /**
   * Perform a left rotation
   * @param {WAVLNode} x - The node to rotate
   * @returns {WAVLNode} - The new root of the rotated subtree
   */
  rotateLeft(x) {
    let y = x.right;
    x.right = y.left;
    y.left = x;
    // Update ranks
    x.rank = Math.min(this.rank(x.left), this.rank(x.right)) + 1;
    y.rank = Math.min(this.rank(y.right), x.rank) + 1;
    return y;
  }

  /**
   * Perform an inorder traversal of the WAVL tree
   * @param {WAVLNode} node - The current node in the traversal
   */
  inorderTraversal(node = this.root) {
    if (node) {
      this.inorderTraversal(node.left);
      console.log(`Value: ${node.value}, Rank: ${node.rank}`);
      this.inorderTraversal(node.right);
    }
  }
}
//   The WAVL tree maintains balance with fewer rotations than an AVL tree,
// potentially offering better performance for insertions and deletions.
// Test WAVL Tree
const wavl = new WAVLTree();
[10, 20, 30, 40, 50, 25].forEach((val) => wavl.insert(val));
console.log("WAVL Tree Inorder Traversal:");
wavl.inorderTraversal();
