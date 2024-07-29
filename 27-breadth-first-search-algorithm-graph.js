/**
 * Graph class to represent the structure we'll traverse
 */
class Graph {
  constructor() {
    this.adjacencyList = {};
  }

  /**
   * Add a vertex to the graph
   * @param {string} vertex - The vertex to add
   */
  addVertex(vertex) {
    if (!this.adjacencyList[vertex]) {
      this.adjacencyList[vertex] = [];
    }
  }

  /**
   * Add an edge between two vertices
   * @param {string} vertex1 - The first vertex
   * @param {string} vertex2 - The second vertex
   */
  addEdge(vertex1, vertex2) {
    this.adjacencyList[vertex1].push(vertex2);
    this.adjacencyList[vertex2].push(vertex1);
  }

  /**
   * Perform Breadth-First Search starting from a given vertex
   * @param {string} startVertex - The vertex to start BFS from
   * @returns {string[]} - The order of vertices visited
   */
  bfs(startVertex) {
    const queue = [startVertex];
    const result = [];
    const visited = {};
    visited[startVertex] = true;

    while (queue.length) {
      const currentVertex = queue.shift();
      result.push(currentVertex);

      this.adjacencyList[currentVertex].forEach((neighbor) => {
        if (!visited[neighbor]) {
          visited[neighbor] = true;
          queue.push(neighbor);
        }
      });
    }

    return result;
  }
}

// Create a graph and add vertices and edges
const graph = new Graph();
["A", "B", "C", "D", "E", "F"].forEach((vertex) => graph.addVertex(vertex));
graph.addEdge("A", "B");
graph.addEdge("A", "C");
graph.addEdge("B", "D");
graph.addEdge("C", "E");
graph.addEdge("D", "E");
graph.addEdge("D", "F");
graph.addEdge("E", "F");

// Perform BFS starting from vertex 'A'
console.log("BFS starting from 'A':", graph.bfs("A"));

// Explanation:
// The Graph class represents an undirected graph using an adjacency list.
// The addVertex method adds a new vertex to the graph.
// The addEdge method adds an edge between two vertices.
// The bfs method implements the Breadth-First Search algorithm:
// It uses a queue to keep track of vertices to visit.
// It uses a visited object to keep track of vertices already visited.
// It explores all neighbors of a vertex before moving to the next level.
// Time Complexity:
// O(V + E) where V is the number of vertices and E is the number of edges.
// Space Complexity:
// O(V) for the queue and visited set in the worst case.
// Use Cases:
// Finding the shortest path between two vertices in an unweighted graph.
// Web crawling.
// Social networking features like finding all friends within a certain degree of connection.
// GPS Navigation systems.
