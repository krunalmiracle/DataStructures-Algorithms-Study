/**
 * B-tree Implementation
 *
 * @description
 * A B-tree is a self-balancing tree data structure that maintains sorted data and allows
 * searches, sequential access, insertions, and deletions in logarithmic time.
 *
 * @reasoning
 * B-trees are particularly useful for storage systems that read and write large blocks of data,
 * such as databases and file systems.
 *
 * @complexity
 * Time complexity: O(log n) for search, insert, and delete operations
 * Space complexity: O(n)
 */

class BTreeNode {
  constructor(leaf = false) {
    this.leaf = leaf; // Boolean indicating if this is a leaf node
    this.keys = []; // Array to store the keys
    this.children = []; // Array to store child nodes
  }
}

class BTree {
  constructor(t) {
    this.root = new BTreeNode(true); // Create the root node
    this.t = t; // Minimum degree (defines the range for number of keys)
  }

  // Search a key in the B-tree
  search(k, node = this.root) {
    let i = 0;
    // Find the first key greater than or equal to k
    while (i < node.keys.length && k > node.keys[i]) {
      i++;
    }
    // If the found key is equal to k, return this node
    if (i < node.keys.length && k === node.keys[i]) {
      return node;
    }
    // If key is not found and this is a leaf node, return null
    if (node.leaf) {
      return null;
    }
    // Recur to the appropriate child
    return this.search(k, node.children[i]);
  }

  // Insert a key in the B-tree
  insert(k) {
    let root = this.root;
    // If root is full, create a new root
    if (root.keys.length === 2 * this.t - 1) {
      let newRoot = new BTreeNode();
      this.root = newRoot;
      newRoot.children.push(root);
      this.splitChild(newRoot, 0);
      this.insertNonFull(newRoot, k);
    } else {
      this.insertNonFull(root, k);
    }
  }

  // Insert a key in a non-full node
  insertNonFull(node, k) {
    let i = node.keys.length - 1;
    // If this is a leaf node
    if (node.leaf) {
      // Find the location of new key to be inserted
      node.keys.push(null);
      while (i >= 0 && k < node.keys[i]) {
        node.keys[i + 1] = node.keys[i];
        i--;
      }
      // Insert the new key at found location
      node.keys[i + 1] = k;
    } else {
      // Find the child which is going to have the new key
      while (i >= 0 && k < node.keys[i]) {
        i--;
      }
      i++;
      // If the child is full, split it
      if (node.children[i].keys.length === 2 * this.t - 1) {
        this.splitChild(node, i);
        if (k > node.keys[i]) {
          i++;
        }
      }
      this.insertNonFull(node.children[i], k);
    }
  }

  // Split the child of a node
  splitChild(parent, i) {
    let t = this.t;
    let child = parent.children[i];
    let newChild = new BTreeNode(child.leaf);

    // Insert the middle key of child in parent
    parent.keys.splice(i, 0, child.keys[t - 1]);
    parent.children.splice(i + 1, 0, newChild);

    // Copy the last (t-1) keys of child to newChild
    newChild.keys = child.keys.splice(t, t - 1);

    // Copy the last t children of child to newChild
    if (!child.leaf) {
      newChild.children = child.children.splice(t, t);
    }
  }
}

// Example usage
let bTree = new BTree(3);
[10, 20, 5, 6, 12, 30, 7, 17].forEach((k) => bTree.insert(k));
console.log(bTree.search(6) ? "Found 6" : "Not found 6");
console.log(bTree.search(15) ? "Found 15" : "Not found 15");
