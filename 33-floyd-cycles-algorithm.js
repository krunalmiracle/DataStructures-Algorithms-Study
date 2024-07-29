/**
 * ListNode class for creating linked list nodes
 */
class ListNode {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

/**
 * Floyd's Cycle Detection Algorithm
 * Floyd's Cycle Detection Algorithm, also known as the "tortoise and hare" algorithm,
 * is used to detect cycles in a linked list or sequence.
 * @param {ListNode} head - The head of the linked list
 * @return {ListNode|null} - The node where the cycle begins, or null if there's no cycle
 */
function floydCycleDetection(head) {
  // If the list is empty or has only one node, there can't be a cycle
  if (!head || !head.next) {
    return null;
  }

  let tortoise = head;
  let hare = head;

  // Phase 1: Detect if there's a cycle
  while (hare && hare.next) {
    tortoise = tortoise.next; // Move tortoise one step
    hare = hare.next.next; // Move hare two steps

    // If tortoise and hare meet, there's a cycle
    if (tortoise === hare) {
      // Phase 2: Find the start of the cycle
      tortoise = head;
      while (tortoise !== hare) {
        tortoise = tortoise.next;
        hare = hare.next;
      }
      return tortoise; // This is the start of the cycle
    }
  }

  // If we exit the loop, there's no cycle
  return null;
}

// Helper function to create a linked list with a cycle
function createLinkedListWithCycle(values, cycleIndex) {
  if (values.length === 0) return null;

  const head = new ListNode(values[0]);
  let current = head;
  let cycleNode = null;

  for (let i = 1; i < values.length; i++) {
    current.next = new ListNode(values[i]);
    current = current.next;
    if (i === cycleIndex) {
      cycleNode = current;
    }
  }

  if (cycleNode) {
    current.next = cycleNode;
  }

  return head;
}

// Test Floyd's Cycle Detection Algorithm
const values = [3, 2, 0, -4];
const cycleIndex = 1;
const head = createLinkedListWithCycle(values, cycleIndex);

const cycleStart = floydCycleDetection(head);
if (cycleStart) {
  console.log(
    `Cycle detected. It starts at node with value: ${cycleStart.val}`
  );
} else {
  console.log("No cycle detected.");
}

// This implementation of Floyd's Cycle Detection Algorithm does the following:
// We define a ListNode class to create nodes for our linked list.
// The floydCycleDetection function implements the algorithm:
// We use two pointers: tortoise (slow pointer) and hare (fast pointer).
// In the first phase, we move the tortoise one step and the hare two steps at a time.
// If there's a cycle, the hare will eventually catch up to the tortoise.
// In the second phase, we reset the tortoise to the head and move both pointers one step at a time until they meet again.
// The point where they meet is the start of the cycle.
// We also provide a helper function createLinkedListWithCycle to easily create test cases.
// Test problems for Floyd's Cycle Detection Algorithm:
// Detect a cycle in a linked list where the last node points to the first node
// Detect a cycle in the middle of a linked list
// Test with a linked list that has no cycle
// Detect a cycle in a very long linked list (e.g., 10000 nodes)
