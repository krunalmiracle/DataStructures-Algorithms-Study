// File: BinarySearchTree.js

class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null;
  }

  /**
   * Insertion Operation
   *
   * Reasoning:
   * Insertion maintains the BST property: for each node, all elements in its left subtree
   * are smaller, and all elements in its right subtree are larger.
   *
   * Assumptions:
   * - The inserted value is unique (no duplicate values in the tree).
   * - The tree remains balanced enough to maintain efficiency (not guaranteed in basic BST).
   *
   * Algorithm:
   * 1. If the tree is empty, create a new node as the root.
   * 2. Otherwise, recursively traverse the tree:
   *    - If the value is less than the current node, go to the left child.
   *    - If the value is greater than the current node, go to the right child.
   * 3. When a null position is reached, insert the new node there.
   *
   * Time Complexity: O(h) where h is the height of the tree. In a balanced tree, this is O(log n).
   * Space Complexity: O(h) due to the recursive call stack.
   */
  insert(data) {
    this.root = this._insertRecursive(this.root, data);
  }

  _insertRecursive(node, data) {
    if (node === null) {
      return new Node(data);
    }

    if (data < node.data) {
      node.left = this._insertRecursive(node.left, data);
    } else if (data > node.data) {
      node.right = this._insertRecursive(node.right, data);
    }

    return node;
  }

  /**
   * Search Operation
   *
   * Reasoning:
   * Searching in a BST is efficient due to its ordered structure, allowing us to
   * eliminate half of the remaining nodes at each step.
   *
   * Assumptions:
   * - The BST property is maintained (left subtree < node < right subtree).
   *
   * Algorithm:
   * 1. Start at the root.
   * 2. If the tree is empty or the value is found, return.
   * 3. If the value is less than the current node, search in the left subtree.
   * 4. If the value is greater than the current node, search in the right subtree.
   * 5. Repeat steps 2-4 until the value is found or a leaf is reached.
   *
   * Time Complexity: O(h) where h is the height of the tree. In a balanced tree, this is O(log n).
   * Space Complexity: O(h) for recursive implementation due to the call stack.
   */
  search(data) {
    return this._searchRecursive(this.root, data);
  }

  _searchRecursive(node, data) {
    if (node === null || node.data === data) {
      return node;
    }

    if (data < node.data) {
      return this._searchRecursive(node.left, data);
    }
    return this._searchRecursive(node.right, data);
  }

  /**
   * In-order Traversal
   *
   * Reasoning:
   * In-order traversal visits nodes in ascending order in a BST, useful for
   * sorted output and range queries.
   *
   * Assumptions:
   * - The entire tree needs to be traversed.
   *
   * Algorithm:
   * 1. Recursively traverse the left subtree.
   * 2. Visit the current node.
   * 3. Recursively traverse the right subtree.
   *
   * Time Complexity: O(n) where n is the number of nodes in the tree.
   * Space Complexity: O(h) due to the recursive call stack, where h is the height of the tree.
   */
  inOrderTraversal() {
    const result = [];
    this._inOrderRecursive(this.root, result);
    return result;
  }

  _inOrderRecursive(node, result) {
    if (node !== null) {
      this._inOrderRecursive(node.left, result);
      result.push(node.data);
      this._inOrderRecursive(node.right, result);
    }
  }
}

// Example usage
const bst = new BinarySearchTree();
bst.insert(50);
bst.insert(30);
bst.insert(70);
bst.insert(20);
bst.insert(40);
bst.insert(60);
bst.insert(80);

console.log("In-order traversal:", bst.inOrderTraversal());
console.log("Search for 40:", bst.search(40) ? "Found" : "Not Found");
console.log("Search for 90:", bst.search(90) ? "Found" : "Not Found");
