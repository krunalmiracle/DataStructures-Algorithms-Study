// File: LinkedList.js

class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }

  /**
   * Insertion Algorithm
   *
   * Reasoning:
   * The insertion algorithm adds a new element to the end of the list. This approach
   * maintains the order of elements as they are inserted, which is often desirable
   * in many applications.
   *
   * Assumptions:
   * - The list can grow indefinitely (no size limit).
   * - Insertion at the end is acceptable (as opposed to insertion at the beginning or at a specific position).
   *
   * Algorithm:
   * 1. Create a new node with the given data.
   * 2. If the list is empty, set the new node as the head.
   * 3. Otherwise, traverse to the end of the list.
   * 4. Set the new node as the next node of the last node.
   *
   * Time Complexity: O(n), where n is the number of nodes in the list.
   * Space Complexity: O(1)
   */
  insert(data) {
    let newNode = new Node(data);

    if (!this.head) {
      this.head = newNode;
      return;
    }

    let current = this.head;
    while (current.next) {
      current = current.next;
    }

    current.next = newNode;
  }

  /**
   * Deletion Algorithm
   *
   * Reasoning:
   * The deletion algorithm removes the first occurrence of a given value. This is useful
   * when we want to maintain the relative order of remaining elements after deletion.
   *
   * Assumptions:
   * - Only the first occurrence of the value should be deleted.
   * - If the value doesn't exist, the list remains unchanged.
   *
   * Algorithm:
   * 1. If the list is empty, do nothing.
   * 2. If the head node is to be deleted, set the next node as the new head.
   * 3. Otherwise, traverse the list to find the node to delete.
   * 4. Update the next pointer of the previous node to skip the node to be deleted.
   *
   * Time Complexity: O(n), where n is the number of nodes in the list.
   * Space Complexity: O(1)
   */
  delete(data) {
    if (!this.head) {
      return;
    }

    if (this.head.data === data) {
      this.head = this.head.next;
      return;
    }

    let current = this.head;
    while (current.next) {
      if (current.next.data === data) {
        current.next = current.next.next;
        return;
      }
      current = current.next;
    }
  }

  /**
   * Search Algorithm
   *
   * Reasoning:
   * The search algorithm checks if a given value exists in the list. This is fundamental
   * for many operations that depend on finding specific elements.
   *
   * Assumptions:
   * - The search stops at the first occurrence of the value.
   * - The entire list needs to be traversed in the worst case.
   *
   * Algorithm:
   * 1. Start from the head of the list.
   * 2. Traverse the list and check each node's data.
   * 3. If the data is found, return true.
   * 4. If the end of the list is reached without finding the data, return false.
   *
   * Time Complexity: O(n), where n is the number of nodes in the list.
   * Space Complexity: O(1)
   */
  search(data) {
    let current = this.head;
    while (current) {
      if (current.data === data) {
        return true;
      }
      current = current.next;
    }
    return false;
  }

  /**
   * Reverse Algorithm
   *
   * Reasoning:
   * Reversing a linked list is useful in many scenarios, such as reversing the order of
   * elements or as part of more complex algorithms. It's done in-place to save space.
   *
   * Assumptions:
   * - The original list can be modified.
   * - No additional data structures are needed (in-place reversal).
   *
   * Algorithm:
   * 1. Initialize three pointers: prev (null), current (head), and next (null).
   * 2. Traverse the list:
   *    a. Store the next node.
   *    b. Reverse the link of the current node.
   *    c. Move prev and current one step forward.
   * 3. Set the last node (prev) as the new head.
   *
   * Time Complexity: O(n), where n is the number of nodes in the list.
   * Space Complexity: O(1)
   */
  reverse() {
    let prev = null;
    let current = this.head;
    let next = null;

    while (current) {
      next = current.next;
      current.next = prev;
      prev = current;
      current = next;
    }

    this.head = prev;
  }

  /**
   * Cycle Detection Algorithm (Floyd's Cycle-Finding Algorithm)
   *
   * Reasoning:
   * Detecting cycles in a linked list is crucial for preventing infinite loops and
   * identifying corrupted data structures. Floyd's algorithm uses two pointers
   * moving at different speeds to detect a cycle efficiently.
   *
   * Assumptions:
   * - The list might contain a cycle.
   * - If a cycle exists, the fast pointer will eventually catch up to the slow pointer.
   *
   * Algorithm:
   * 1. Initialize two pointers, slow and fast, to the head of the list.
   * 2. Move slow pointer by one step and fast pointer by two steps.
   * 3. If the pointers meet, a cycle is detected.
   * 4. If fast pointer reaches the end (or null), no cycle exists.
   *
   * Time Complexity: O(n), where n is the number of nodes in the list.
   * Space Complexity: O(1)
   */
  hasCycle() {
    if (!this.head) return false;

    let slow = this.head;
    let fast = this.head;

    while (fast && fast.next) {
      slow = slow.next;
      fast = fast.next.next;

      if (slow === fast) {
        return true;
      }
    }

    return false;
  }

  /**
   * Find Middle Element Algorithm
   *
   * Reasoning:
   * Finding the middle element is useful in many algorithms, such as efficient sorting
   * or as part of other operations. This method finds the middle without counting the
   * total number of elements.
   *
   * Assumptions:
   * - If the list has an even number of nodes, the second of the two middle nodes is returned.
   * - The list is not empty.
   *
   * Algorithm:
   * 1. Initialize two pointers, slow and fast, to the head of the list.
   * 2. Move slow pointer by one step and fast pointer by two steps.
   * 3. When fast pointer reaches the end, slow pointer will be at the middle.
   *
   * Time Complexity: O(n), where n is the number of nodes in the list.
   * Space Complexity: O(1)
   */
  findMiddle() {
    if (!this.head) return null;

    let slow = this.head;
    let fast = this.head;

    while (fast && fast.next) {
      slow = slow.next;
      fast = fast.next.next;
    }

    return slow.data;
  }

  /**
   * Remove Duplicates Algorithm
   *
   * Reasoning:
   * Removing duplicates is often necessary to clean up data or as part of data processing.
   * This method removes all subsequent occurrences of each value.
   *
   * Assumptions:
   * - The original order of unique elements should be preserved.
   * - The first occurrence of each value should be kept.
   *
   * Algorithm:
   * 1. Start from the head of the list.
   * 2. For each node, check all subsequent nodes for duplicates.
   * 3. If a duplicate is found, skip it by updating the next pointer.
   * 4. Continue this process until the end of the list is reached.
   *
   * Time Complexity: O(n^2), where n is the number of nodes in the list.
   * Space Complexity: O(1)
   */
  removeDuplicates() {
    if (!this.head) return;

    let current = this.head;

    while (current) {
      let runner = current;

      while (runner.next) {
        if (runner.next.data === current.data) {
          runner.next = runner.next.next;
        } else {
          runner = runner.next;
        }
      }
      current = current.next;
    }
  }

  print() {
    let current = this.head;
    let result = [];
    while (current) {
      result.push(current.data);
      current = current.next;
    }
    console.log(result.join(" -> "));
  }
}

// Example usage
let list = new LinkedList();
list.insert(1);
list.insert(2);
list.insert(3);
list.insert(2);
list.insert(4);

console.log("Original List:");
list.print();

console.log("After deleting 2:");
list.delete(2);
list.print();

console.log("Searching for 3:", list.search(3));
console.log("Searching for 5:", list.search(5));

console.log("Reversed List:");
list.reverse();
list.print();

console.log("Has Cycle:", list.hasCycle());

console.log("Middle Element:", list.findMiddle());

console.log("After removing duplicates:");
list.removeDuplicates();
list.print();
