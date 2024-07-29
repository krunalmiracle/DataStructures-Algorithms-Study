import Graph from "./8-graph.js";

/**
 * Depth-First Search (DFS) on a Graph
 *
 * @param {Graph} graph - The graph to perform DFS on
 * @param {string} startVertex - The starting vertex for the DFS
 * @returns {string[]} - The order of vertices visited
 */
function dfs(graph, startVertex) {
  const stack = [startVertex];
  const visited = new Set();
  const result = [];

  while (stack.length > 0) {
    const currentVertex = stack.pop();

    if (!visited.has(currentVertex)) {
      visited.add(currentVertex);
      result.push(currentVertex);

      for (const neighbor of graph.adjacencyList[currentVertex]) {
        stack.push(neighbor);
      }
    }
  }

  return result;
}

// Test DFS
const graph = new Graph();
["A", "B", "C", "D", "E", "F"].forEach((vertex) => graph.addVertex(vertex));
graph.addEdge("A", "B");
graph.addEdge("A", "C");
graph.addEdge("B", "D");
graph.addEdge("C", "E");
graph.addEdge("D", "E");
graph.addEdge("D", "F");
graph.addEdge("E", "F");

console.log("DFS starting from 'A':", dfs(graph, "A"));

// Explanation:
// The dfs function takes a Graph instance and a starting vertex as input.
// It uses a stack to keep track of vertices to visit.
// It uses a visited set to keep track of vertices already visited.
// In each iteration of the loop:
// It pops a vertex from the stack.
// If the vertex has not been visited, it adds it to the visited set and the result array.
// It then pushes all the neighbors of the current vertex onto the stack.
// The function returns the result array, which contains the order of vertices visited.
// Time Complexity:
// O(V + E) where V is the number of vertices and E is the number of edges.
// Space Complexity:
// O(V) for the stack and visited set in the worst case.
// Use Cases:
// Finding connected components in a graph.
// Topological sorting.
// Solving puzzles and games that can be represented as a graph.
// Detecting cycles in a graph.
