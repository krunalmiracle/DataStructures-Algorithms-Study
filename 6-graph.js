// File: Graph.js

class Graph {
  constructor() {
    this.adjacencyList = {};
  }

  /**
   * Add Vertex Operation
   *
   * Reasoning:
   * Adding a vertex is fundamental to building the graph structure.
   *
   * Assumptions:
   * - Vertex labels are unique.
   * - The graph can be modified after creation.
   *
   * Algorithm:
   * 1. If the vertex doesn't exist, add it to the adjacency list with an empty array.
   *
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */
  addVertex(vertex) {
    if (!this.adjacencyList[vertex]) {
      this.adjacencyList[vertex] = [];
    }
  }

  /**
   * Add Edge Operation
   *
   * Reasoning:
   * Adding an edge connects two vertices, defining the graph's structure.
   *
   * Assumptions:
   * - The graph is undirected (edge added both ways).
   * - Both vertices exist in the graph.
   *
   * Algorithm:
   * 1. Add the second vertex to the adjacency list of the first vertex.
   * 2. Add the first vertex to the adjacency list of the second vertex.
   *
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */
  addEdge(vertex1, vertex2) {
    this.adjacencyList[vertex1].push(vertex2);
    this.adjacencyList[vertex2].push(vertex1);
  }

  /**
   * Depth-First Search (DFS) Algorithm
   *
   * Reasoning:
   * DFS explores as far as possible along each branch before backtracking.
   * It's useful for topological sorting, finding connected components, and solving puzzles.
   *
   * Assumptions:
   * - The graph may not be fully connected.
   * - The starting vertex is provided and exists in the graph.
   *
   * Algorithm:
   * 1. Create a set to store visited vertices.
   * 2. Create a function for recursive DFS:
   *    a. Mark the current vertex as visited.
   *    b. Process the vertex (e.g., add to result).
   *    c. For each unvisited neighbor, recursively call DFS.
   * 3. Call the recursive function with the starting vertex.
   *
   * Time Complexity: O(V + E) where V is the number of vertices and E is the number of edges.
   * Space Complexity: O(V) for the visited set and recursive call stack.
   */
  dfs(start) {
    const result = [];
    const visited = new Set();

    const dfsRecursive = (vertex) => {
      visited.add(vertex);
      result.push(vertex);

      this.adjacencyList[vertex].forEach((neighbor) => {
        if (!visited.has(neighbor)) {
          dfsRecursive(neighbor);
        }
      });
    };

    dfsRecursive(start);
    return result;
  }
}

// Example usage
const graph = new Graph();
graph.addVertex("A");
graph.addVertex("B");
graph.addVertex("C");
graph.addVertex("D");
graph.addEdge("A", "B");
graph.addEdge("A", "C");
graph.addEdge("B", "D");
graph.addEdge("C", "D");

console.log("DFS starting from vertex A:", graph.dfs("A"));
