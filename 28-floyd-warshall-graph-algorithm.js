/**
 * Floyd Warshall Algorithm for All-Pairs Shortest Path
 */

/**
 * Implements the Floyd Warshall Algorithm
 * @param {number[][]} graph - The input graph represented as an adjacency matrix
 * @return {number[][]} The shortest distance matrix
 */
function floydWarshall(graph) {
  // Get the number of vertices in the graph
  const V = graph.length;

  // Create a copy of the input graph to store the shortest distances
  let dist = graph.map((row) => [...row]);

  // Initialize the distance matrix
  // If there's no direct edge between i and j, set the distance to Infinity
  for (let i = 0; i < V; i++) {
    for (let j = 0; j < V; j++) {
      if (i !== j && dist[i][j] === 0) {
        dist[i][j] = Infinity;
      }
    }
  }

  // Core of the Floyd Warshall Algorithm
  // Consider every vertex as an intermediate vertex
  for (let k = 0; k < V; k++) {
    // Pick all vertices as source one by one
    for (let i = 0; i < V; i++) {
      // Pick all vertices as destination for the above source
      for (let j = 0; j < V; j++) {
        // If vertex k is on the shortest path from i to j,
        // then update the value of dist[i][j]
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
        }
      }
    }
  }

  // Return the shortest distance matrix
  return dist;
}

// Test the Floyd Warshall Algorithm
let graph = [
  [0, 5, Infinity, 10],
  [Infinity, 0, 3, Infinity],
  [Infinity, Infinity, 0, 1],
  [Infinity, Infinity, Infinity, 0],
];

let shortestDistances = floydWarshall(graph);

console.log("Shortest distances between every pair of vertices:");
for (let i = 0; i < shortestDistances.length; i++) {
  console.log(shortestDistances[i]);
}

// This implementation of the Floyd Warshall Algorithm does the following:
// We represent the graph as an adjacency matrix, where graph[i][j] represents the weight of the edge from vertex i to vertex j.
// We create a copy of the input graph to store the shortest distances.
// This allows us to modify the distances without affecting the original graph.
// We initialize the distance matrix:
// If there's no direct edge between two vertices (i.e., the value is 0 in the input), we set the distance to Infinity.
// The distance from a vertex to itself is always 0.
// The core of the algorithm is three nested loops:
// The outermost loop considers each vertex as an intermediate vertex.
// The inner two loops consider all pairs of vertices as start and end points.
// For each pair (i, j), we check if going through the intermediate vertex k gives a shorter path than the current direct path from i to j.
// If a shorter path is found, we update the distance.
// After considering all possible intermediate vertices for all pairs, we return the final distance matrix.
// We test the algorithm with a sample graph and print the resulting shortest distance matrix.
// The Floyd Warshall Algorithm is particularly useful when we need to find the shortest distances
// between all pairs of vertices in a weighted graph.
// It can handle negative edge weights (but not negative cycles) and is simpler to implement
// than running Dijkstra's algorithm for every vertex.
