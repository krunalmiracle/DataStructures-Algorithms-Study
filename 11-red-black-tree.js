/**
 * Red-Black Tree Implementation
 *
 * @description
 * A Red-Black tree is a self-balancing binary search tree where each node has an extra bit for
 * denoting the color of the node, either red or black.
 *
 * @reasoning
 * Red-Black trees provide faster insertion and removal operations than AVL trees as they allow
 * more imbalance.
 *
 * @complexity
 * Time complexity: O(log n) for search, insert, and delete operations
 * Space complexity: O(n)
 */

class RBNode {
  constructor(key, color = "RED") {
    this.key = key; // The key stored in the node
    this.color = color; // Color of the node (RED or BLACK)
    this.left = null; // Left child
    this.right = null; // Right child
    this.parent = null; // Parent node
  }
}

class RedBlackTree {
  constructor() {
    this.root = null; // Root of the tree
  }

  // Left rotate the subtree rooted with x
  rotateLeft(x) {
    let y = x.right;
    x.right = y.left;
    if (y.left) y.left.parent = x;
    y.parent = x.parent;
    if (!x.parent) this.root = y;
    else if (x === x.parent.left) x.parent.left = y;
    else x.parent.right = y;
    y.left = x;
    x.parent = y;
  }

  // Right rotate the subtree rooted with x
  rotateRight(x) {
    let y = x.left;
    x.left = y.right;
    if (y.right) y.right.parent = x;
    y.parent = x.parent;
    if (!x.parent) this.root = y;
    else if (x === x.parent.right) x.parent.right = y;
    else x.parent.left = y;
    y.right = x;
    x.parent = y;
  }

  // Insert a key into the tree
  insert(key) {
    let node = new RBNode(key);
    let parent = null;
    let current = this.root;

    // Find the parent node
    while (current) {
      parent = current;
      if (node.key < current.key) current = current.left;
      else current = current.right;
    }

    // Set the parent of the new node
    node.parent = parent;
    if (!parent) this.root = node;
    else if (node.key < parent.key) parent.left = node;
    else parent.right = node;

    // Fix the tree to maintain Red-Black properties
    this.fixInsert(node);
  }

  // Fix the Red-Black Tree after insertion
  fixInsert(node) {
    while (node.parent && node.parent.color === "RED") {
      if (node.parent === node.parent.parent.left) {
        let uncle = node.parent.parent.right;
        if (uncle && uncle.color === "RED") {
          // Case 1: Uncle is red
          node.parent.color = "BLACK";
          uncle.color = "BLACK";
          node.parent.parent.color = "RED";
          node = node.parent.parent;
        } else {
          if (node === node.parent.right) {
            // Case 2: Uncle is black and node is a right child
            node = node.parent;
            this.rotateLeft(node);
          }
          // Case 3: Uncle is black and node is a left child
          node.parent.color = "BLACK";
          node.parent.parent.color = "RED";
          this.rotateRight(node.parent.parent);
        }
      } else {
        // Same as above, with "left" and "right" exchanged
        let uncle = node.parent.parent.left;
        if (uncle && uncle.color === "RED") {
          node.parent.color = "BLACK";
          uncle.color = "BLACK";
          node.parent.parent.color = "RED";
          node = node.parent.parent;
        } else {
          if (node === node.parent.left) {
            node = node.parent;
            this.rotateRight(node);
          }
          node.parent.color = "BLACK";
          node.parent.parent.color = "RED";
          this.rotateLeft(node.parent.parent);
        }
      }
    }
    this.root.color = "BLACK";
  }

  // Search for a key in the tree
  search(key, node = this.root) {
    if (!node || key === node.key) return node;
    if (key < node.key) return this.search(key, node.left);
    return this.search(key, node.right);
  }

  /**
   * Perform an inorder traversal of the tree
   * @param {Node} node - The current node in the traversal
   */
  inorderTraversal(node) {
    if (node !== null) {
      this.inorderTraversal(node.left);
      console.log(`${node.data} (${node.color})`);
      this.inorderTraversal(node.right);
    }
  }
}

// Example usage
let rbTree = new RedBlackTree();
[7, 3, 18, 10, 22, 8, 11, 26].forEach((key) => rbTree.insert(key));
console.log("Inorder traversal of the Red-Black Tree:");
rbt.inorderTraversal(rbt.root);
console.log(rbTree.search(11) ? "Found 11" : "Not found 11");
console.log(rbTree.search(15) ? "Found 15" : "Not found 15");
