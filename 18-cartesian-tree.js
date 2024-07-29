/**
 * Cartesian Tree Node
 * A Cartesian tree is a binary tree derived from a sequence of numbers.
 * It combines properties of a binary heap and a binary search tree.
 */
class CartesianNode {
  constructor(value, priority) {
    this.value = value; // The node's value (determines in-order traversal)
    this.priority = priority; // The node's priority (determines heap property)
    this.left = null; // Left child
    this.right = null; // Right child
  }
}

/**
 * Cartesian Tree implementation
 */
class CartesianTree {
  constructor() {
    this.root = null; // Root of the Cartesian tree
  }

  /**
   * Insert a new node into the Cartesian tree
   * @param {*} value - The value to insert
   * @param {number} priority - The priority of the value
   */
  insert(value, priority) {
    let newNode = new CartesianNode(value, priority);
    if (!this.root) {
      this.root = newNode;
      return;
    }

    this.root = this._insert(this.root, newNode);
  }

  /**
   * Recursive helper function to insert a node
   * @param {CartesianNode} node - The current node in the recursion
   * @param {CartesianNode} newNode - The new node to insert
   * @returns {CartesianNode} - The new root of the modified subtree
   */
  _insert(node, newNode) {
    if (!node) return newNode;

    if (newNode.value < node.value) {
      // Insert in left subtree
      node.left = this._insert(node.left, newNode);
      // Check heap property
      if (node.left.priority > node.priority) {
        return this.rotateRight(node);
      }
    } else {
      // Insert in right subtree
      node.right = this._insert(node.right, newNode);
      // Check heap property
      if (node.right.priority > node.priority) {
        return this.rotateLeft(node);
      }
    }

    return node;
  }

  /**
   * Perform a right rotation
   * @param {CartesianNode} y - The node to rotate
   * @returns {CartesianNode} - The new root of the rotated subtree
   */
  rotateRight(y) {
    let x = y.left;
    y.left = x.right;
    x.right = y;
    return x;
  }

  /**
   * Perform a left rotation
   * @param {CartesianNode} x - The node to rotate
   * @returns {CartesianNode} - The new root of the rotated subtree
   */
  rotateLeft(x) {
    let y = x.right;
    x.right = y.left;
    y.left = x;
    return y;
  }

  /**
   * Perform an inorder traversal of the Cartesian tree
   * @param {CartesianNode} node - The current node in the traversal
   */
  inorderTraversal(node = this.root) {
    if (node) {
      this.inorderTraversal(node.left);
      console.log(`Value: ${node.value}, Priority: ${node.priority}`);
      this.inorderTraversal(node.right);
    }
  }
}
//   The Cartesian tree maintains both BST property for values and heap property for priorities,
//  making it useful for various algorithms and data structures.
// Test Cartesian Tree
const ct = new CartesianTree();
[
  [5, 30],
  [2, 20],
  [6, 50],
  [1, 10],
  [4, 40],
  [3, 25],
].forEach(([val, pri]) => ct.insert(val, pri));
console.log("Cartesian Tree Inorder Traversal:");
ct.inorderTraversal();
