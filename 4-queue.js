// File: Queue.js

class Queue {
  constructor() {
    this.items = [];
  }

  /**
   * Enqueue Operation
   *
   * Reasoning:
   * Enqueue adds an element to the back of the queue, following the First-In-First-Out (FIFO) principle.
   * This operation is essential for adding new elements to be processed in order.
   *
   * Assumptions:
   * - The queue has no fixed size limit (can grow dynamically).
   * - Adding an element is always possible (no overflow check).
   *
   * Algorithm:
   * 1. Add the element to the end of the internal array.
   *
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */
  enqueue(element) {
    this.items.push(element);
  }

  /**
   * Dequeue Operation
   *
   * Reasoning:
   * Dequeue removes and returns the front element of the queue, maintaining the FIFO order.
   * This operation is crucial for processing elements in the order they were added.
   *
   * Assumptions:
   * - The queue may be empty, in which case an error message is returned.
   *
   * Algorithm:
   * 1. If the queue is empty, return an error message.
   * 2. Remove and return the first element of the internal array.
   *
   * Time Complexity: O(n) where n is the number of elements in the queue, due to array shift.
   * Space Complexity: O(1)
   */
  dequeue() {
    if (this.isEmpty()) {
      return "Queue is empty";
    }
    return this.items.shift();
  }

  /**
   * Front Operation
   *
   * Reasoning:
   * Front allows viewing the first element without removing it, useful for inspecting
   * the next element to be processed without modifying the queue.
   *
   * Assumptions:
   * - The queue may be empty, in which case an error message is returned.
   *
   * Algorithm:
   * 1. If the queue is empty, return an error message.
   * 2. Return the first element of the internal array without removing it.
   *
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */
  front() {
    if (this.isEmpty()) {
      return "Queue is empty";
    }
    return this.items[0];
  }

  /**
   * isEmpty Operation
   *
   * Reasoning:
   * Checking if the queue is empty is crucial for preventing errors when attempting
   * to dequeue or access the front element of an empty queue.
   *
   * Assumptions:
   * - An empty queue has no elements.
   *
   * Algorithm:
   * 1. Return true if the internal array's length is 0, false otherwise.
   *
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */
  isEmpty() {
    return this.items.length === 0;
  }

  /**
   * Size Operation
   *
   * Reasoning:
   * Knowing the size of the queue is useful for various applications and can help
   * in decision-making processes, such as load balancing or resource allocation.
   *
   * Assumptions:
   * - The size is always non-negative.
   *
   * Algorithm:
   * 1. Return the length of the internal array.
   *
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */
  size() {
    return this.items.length;
  }

  /**
   * Print Operation
   *
   * Reasoning:
   * Printing the queue contents is useful for debugging and visualization purposes.
   *
   * Assumptions:
   * - The elements in the queue can be converted to strings.
   *
   * Algorithm:
   * 1. Join the elements of the internal array into a string and print it.
   *
   * Time Complexity: O(n), where n is the number of elements in the queue.
   * Space Complexity: O(n) for creating the string representation.
   */
  print() {
    console.log(this.items.toString());
  }
}

/**
 * Breadth-First Search (BFS) using Queue
 *
 * Reasoning:
 * BFS is used to traverse or search tree or graph data structures. It explores all vertices
 * at the present depth before moving to vertices at the next depth level.
 *
 * Assumptions:
 * - The graph is represented as an adjacency list.
 * - The starting vertex is provided.
 * - All vertices are reachable from the starting vertex.
 *
 * Algorithm:
 * 1. Create a queue and enqueue the starting vertex.
 * 2. Create a set to store visited vertices.
 * 3. While the queue is not empty:
 *    a. Dequeue a vertex.
 *    b. If this vertex hasn't been visited:
 *       - Mark it as visited.
 *       - Process the vertex (e.g., print it).
 *       - Enqueue all adjacent vertices that haven't been visited.
 *
 * Time Complexity: O(V + E) where V is the number of vertices and E is the number of edges.
 * Space Complexity: O(V) for the queue and visited set.
 */
function bfs(graph, start) {
  let queue = new Queue();
  let visited = new Set();
  let result = [];

  queue.enqueue(start);

  while (!queue.isEmpty()) {
    let vertex = queue.dequeue();
    if (!visited.has(vertex)) {
      visited.add(vertex);
      result.push(vertex);

      for (let neighbor of graph[vertex]) {
        if (!visited.has(neighbor)) {
          queue.enqueue(neighbor);
        }
      }
    }
  }

  return result;
}

// Example usage
let queue = new Queue();
queue.enqueue(10);
queue.enqueue(20);
queue.enqueue(30);
console.log("Queue:");
queue.print();
console.log("Front element:", queue.front());
console.log("Dequeued element:", queue.dequeue());
console.log("Queue size:", queue.size());

// Example graph for BFS
let graph = {
  A: ["B", "C"],
  B: ["A", "D", "E"],
  C: ["A", "F"],
  D: ["B"],
  E: ["B", "F"],
  F: ["C", "E"],
};

console.log("BFS starting from vertex A:", bfs(graph, "A"));
