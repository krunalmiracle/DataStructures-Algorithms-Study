/**
 * B+tree Node
 * Represents a single node in the B+tree structure
 */
class BPlusTreeNode {
  constructor(isLeaf = false) {
    this.keys = []; // Array to store keys in the node
    this.childPointers = []; // Array to store pointers to child nodes (for internal nodes) or data (for leaf nodes)
    this.isLeaf = isLeaf; // Boolean flag to indicate if this is a leaf node
    this.nextLeaf = null; // Pointer to the next leaf node (only for leaf nodes)
  }
}

/**
 * B+tree Data Structure
 * A self-balancing tree structure optimized for systems that read and write large blocks of data
 */
class BPlusTree {
  constructor(minimumDegree) {
    this.root = null; // Root node of the B+tree
    this.minimumDegree = minimumDegree; // Minimum degree of the B+tree (determines node capacity)
    this.maxKeysPerNode = 2 * minimumDegree - 1; // Maximum number of keys a node can hold
  }

  /**
   * Search for a key in the B+tree
   * @param {*} keyToFind - The key to search for
   * @returns {*} - The associated data if the key is found, null otherwise
   */
  search(keyToFind) {
    // If the tree is empty, the key is not present
    if (this.root === null) {
      return null;
    }
    // Start the search from the root node
    return this._recursiveSearch(this.root, keyToFind);
  }

  /**
   * Recursive helper function to search for a key
   * @param {BPlusTreeNode} currentNode - The current node being examined
   * @param {*} keyToFind - The key to search for
   * @returns {*} - The associated data if the key is found, null otherwise
   */
  _recursiveSearch(currentNode, keyToFind) {
    let keyIndex = 0;
    while (
      keyIndex < currentNode.keys.length &&
      keyToFind > currentNode.keys[keyIndex]
    ) {
      keyIndex++;
    }

    if (currentNode.isLeaf) {
      // If we're at a leaf, check if we found an exact match
      if (
        keyIndex < currentNode.keys.length &&
        keyToFind === currentNode.keys[keyIndex]
      ) {
        return currentNode.childPointers[keyIndex]; // Return the associated data
      }
      return null; // Key not found
    }

    // If it's not a leaf, recurse to the appropriate child node
    return this._recursiveSearch(
      currentNode.childPointers[keyIndex],
      keyToFind
    );
  }

  /**
   * Insert a key-value pair into the B+tree
   * @param {*} keyToInsert - The key to insert
   * @param {*} valueToInsert - The value associated with the key
   */
  insert(keyToInsert, valueToInsert) {
    // If the tree is empty, create a new root node
    if (this.root === null) {
      this.root = new BPlusTreeNode(true);
      this.root.keys.push(keyToInsert);
      this.root.childPointers.push(valueToInsert);
    } else {
      // If the root is full, the tree grows in height
      if (this.root.keys.length === this.maxKeysPerNode) {
        let newRoot = new BPlusTreeNode(false);
        newRoot.childPointers.push(this.root);
        this._splitChild(newRoot, 0);
        this.root = newRoot;
      }
      // Insert the key-value pair into the non-full root
      this._insertNonFull(this.root, keyToInsert, valueToInsert);
    }
  }

  /**
   * Helper function to split a full child of a node
   * @param {BPlusTreeNode} parentNode - The parent node
   * @param {number} childIndex - Index of the child to be split
   */
  _splitChild(parentNode, childIndex) {
    let childNode = parentNode.childPointers[childIndex];
    let newNode = new BPlusTreeNode(childNode.isLeaf);

    parentNode.childPointers.splice(childIndex + 1, 0, newNode);
    parentNode.keys.splice(
      childIndex,
      0,
      childNode.keys[this.minimumDegree - 1]
    );

    newNode.keys = childNode.keys.splice(this.minimumDegree - 1);

    if (!childNode.isLeaf) {
      // For internal nodes, move half of the children to the new node
      newNode.childPointers = childNode.childPointers.splice(
        this.minimumDegree
      );
    } else {
      // For leaf nodes, copy the last key to the parent and link the leaves
      newNode.childPointers = childNode.childPointers.splice(
        this.minimumDegree - 1
      );
      newNode.nextLeaf = childNode.nextLeaf;
      childNode.nextLeaf = newNode;
    }
  }

  /**
   * Helper function to insert a key-value pair into a non-full node
   * @param {BPlusTreeNode} currentNode - The node to insert into
   * @param {*} keyToInsert - The key to insert
   * @param {*} valueToInsert - The value associated with the key
   */
  _insertNonFull(currentNode, keyToInsert, valueToInsert) {
    let keyIndex = currentNode.keys.length - 1;

    if (currentNode.isLeaf) {
      // Insert into leaf node
      currentNode.keys.push(null);
      currentNode.childPointers.push(null);
      while (keyIndex >= 0 && keyToInsert < currentNode.keys[keyIndex]) {
        currentNode.keys[keyIndex + 1] = currentNode.keys[keyIndex];
        currentNode.childPointers[keyIndex + 1] =
          currentNode.childPointers[keyIndex];
        keyIndex--;
      }
      currentNode.keys[keyIndex + 1] = keyToInsert;
      currentNode.childPointers[keyIndex + 1] = valueToInsert;
    } else {
      // Insert into internal node
      while (keyIndex >= 0 && keyToInsert < currentNode.keys[keyIndex]) {
        keyIndex--;
      }
      keyIndex++;
      if (
        currentNode.childPointers[keyIndex].keys.length === this.maxKeysPerNode
      ) {
        this._splitChild(currentNode, keyIndex);
        if (keyToInsert > currentNode.keys[keyIndex]) {
          keyIndex++;
        }
      }
      this._insertNonFull(
        currentNode.childPointers[keyIndex],
        keyToInsert,
        valueToInsert
      );
    }
  }

  /**
   * Perform an inorder traversal of the B+tree
   */
  inorderTraversal() {
    this._recursiveInorderTraversal(this.root);
  }

  /**
   * Recursive helper function for inorder traversal
   * @param {BPlusTreeNode} currentNode - The current node in the traversal
   */
  _recursiveInorderTraversal(currentNode) {
    if (currentNode) {
      if (currentNode.isLeaf) {
        // For leaf nodes, print all key-value pairs
        for (let i = 0; i < currentNode.keys.length; i++) {
          console.log(
            `${currentNode.keys[i]}: ${currentNode.childPointers[i]}`
          );
        }
      } else {
        // For internal nodes, recurse on children
        for (let i = 0; i < currentNode.keys.length; i++) {
          this._recursiveInorderTraversal(currentNode.childPointers[i]);
          console.log(currentNode.keys[i]);
        }
        this._recursiveInorderTraversal(
          currentNode.childPointers[currentNode.keys.length]
        );
      }
    }
  }

  /**
   * Perform a range query on the B+tree
   * @param {*} startKey - The lower bound of the range (inclusive)
   * @param {*} endKey - The upper bound of the range (inclusive)
   * @returns {Array} - An array of key-value pairs within the specified range
   */
  rangeQuery(startKey, endKey) {
    let result = [];
    let leafNode = this._findLeafNode(this.root, startKey);

    while (leafNode !== null) {
      for (let i = 0; i < leafNode.keys.length; i++) {
        if (leafNode.keys[i] >= startKey && leafNode.keys[i] <= endKey) {
          result.push({
            key: leafNode.keys[i],
            value: leafNode.childPointers[i],
          });
        }
        if (leafNode.keys[i] > endKey) {
          return result;
        }
      }
      leafNode = leafNode.nextLeaf;
    }

    return result;
  }

  /**
   * Helper function to find the leaf node where a key should be located
   * @param {BPlusTreeNode} currentNode - The current node in the search
   * @param {*} keyToFind - The key to search for
   * @returns {BPlusTreeNode} - The leaf node where the key should be located
   */
  _findLeafNode(currentNode, keyToFind) {
    if (currentNode.isLeaf) {
      return currentNode;
    }

    let keyIndex = 0;
    while (
      keyIndex < currentNode.keys.length &&
      keyToFind > currentNode.keys[keyIndex]
    ) {
      keyIndex++;
    }

    return this._findLeafNode(currentNode.childPointers[keyIndex], keyToFind);
  }
}

// Test B+tree
const bPlusTree = new BPlusTree(3); // Minimum degree 3
[3, 7, 1, 5, 11, 17, 13, 2, 19, 23].forEach((value, index) =>
  bPlusTree.insert(value, `data${index}`)
);
console.log("B+tree inorder traversal:");
bPlusTree.inorderTraversal();

console.log("\nB+tree range query (5 to 15):");
console.log(bPlusTree.rangeQuery(5, 15));
