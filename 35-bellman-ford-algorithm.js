/**
 * Bellman-Ford Algorithm for Single-Source Shortest Path
 */

/**
 * Class to represent an edge in the graph
 */
class Edge {
  /**
   * @param {number} source - The source vertex of the edge
   * @param {number} destination - The destination vertex of the edge
   * @param {number} weight - The weight of the edge
   */
  constructor(source, destination, weight) {
    this.source = source;
    this.destination = destination;
    this.weight = weight;
  }
}

/**
 * Implements the Bellman-Ford Algorithm
 * @param {number} vertices - The number of vertices in the graph
 * @param {Edge[]} edges - An array of Edge objects representing the graph
 * @param {number} source - The source vertex
 * @return {Object} An object containing distances and predecessors, or false if there's a negative cycle
 */
function bellmanFord(vertices, edges, source) {
  // Initialize distances and predecessors
  let distances = new Array(vertices).fill(Infinity);
  let predecessors = new Array(vertices).fill(null);
  distances[source] = 0;

  // Relax edges repeatedly
  for (let i = 0; i < vertices - 1; i++) {
    for (let edge of edges) {
      if (distances[edge.source] + edge.weight < distances[edge.destination]) {
        distances[edge.destination] = distances[edge.source] + edge.weight;
        predecessors[edge.destination] = edge.source;
      }
    }
  }

  // Check for negative-weight cycles
  for (let edge of edges) {
    if (distances[edge.source] + edge.weight < distances[edge.destination]) {
      // Negative-weight cycle detected
      return false;
    }
  }

  return { distances, predecessors };
}

/**
 * Helper function to reconstruct the path from source to a given vertex
 * @param {number[]} predecessors - The array of predecessor vertices
 * @param {number} destination - The destination vertex
 * @return {number[]} - An array of vertex IDs representing the shortest path
 */
function getPath(predecessors, destination) {
  let path = [];
  let current = destination;
  while (current !== null) {
    path.unshift(current);
    current = predecessors[current];
  }
  return path;
}

// Test the Bellman-Ford Algorithm
let vertices = 5;
let edges = [
  new Edge(0, 1, -1),
  new Edge(0, 2, 4),
  new Edge(1, 2, 3),
  new Edge(1, 3, 2),
  new Edge(1, 4, 2),
  new Edge(3, 2, 5),
  new Edge(3, 1, 1),
  new Edge(4, 3, -3),
];

let source = 0;
let result = bellmanFord(vertices, edges, source);

if (result) {
  console.log("Vertex\tDistance from Source\tPath");
  for (let i = 0; i < vertices; i++) {
    let path = getPath(result.predecessors, i);
    console.log(`${i}\t${result.distances[i]}\t\t\t${path.join(" -> ")}`);
  }
} else {
  console.log("Graph contains a negative-weight cycle");
}

// This implementation of the Bellman-Ford Algorithm does the following:
// We define an Edge class to represent edges in the graph. Each edge has a source vertex, a destination vertex, and a weight.
// The bellmanFord function implements the main algorithm:
// We initialize the distances array with infinity for all vertices except the source, which is set to 0.
// We also initialize a predecessors array to keep track of the shortest path.
// We perform V-1 iterations (where V is the number of vertices), where in each iteration we relax all edges.
// Relaxing an edge means checking if we can improve the shortest path to the destination
//  vertex by going through the source vertex of this edge.
// After V-1 iterations, we check for negative-weight cycles by trying to relax the edges one more time.
// If any distance improves, it means there's a negative-weight cycle.
// The getPath helper function reconstructs the shortest path from the source to a given vertex by following the predecessors array.
// We test the algorithm with a sample graph and print the shortest distances and paths to each vertex from the source.
// The Bellman-Ford Algorithm is particularly useful when the graph may contain negative edge weights.
// Unlike Dijkstra's algorithm, it can detect negative-weight cycles in the graph.
//  However, it has a higher time complexity of O(VE) compared to Dijkstra's O(V^2) or O((V+E)logV) with a binary heap implementation.
