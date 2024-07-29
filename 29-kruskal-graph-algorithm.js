/**
 * Kruskal's Algorithm for Minimum Spanning Tree
 */

// Define a class to represent an edge in the graph
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

// Define a class to represent a disjoint set for the Union-Find data structure
class DisjointSet {
  /**
   * @param {number} size - The number of elements in the set
   */
  constructor(size) {
    // Initialize parent array where each element is its own parent
    this.parent = Array(size)
      .fill()
      .map((_, i) => i);
    // Initialize rank array for union by rank
    this.rank = Array(size).fill(0);
  }

  /**
   * Find the representative (root) of a set
   * @param {number} item - The item to find the representative for
   * @return {number} The representative of the set
   */
  find(item) {
    // If the item is not its own parent, recursively find its parent
    if (this.parent[item] !== item) {
      // Path compression: Set the parent to the root
      this.parent[item] = this.find(this.parent[item]);
    }
    return this.parent[item];
  }

  /**
   * Union two sets together
   * @param {number} x - An element from the first set
   * @param {number} y - An element from the second set
   */
  union(x, y) {
    // Find the representatives (roots) of the sets
    let xRoot = this.find(x);
    let yRoot = this.find(y);

    // If the roots are different, merge the sets
    if (xRoot !== yRoot) {
      // Union by rank: Attach smaller rank tree under root of higher rank tree
      if (this.rank[xRoot] < this.rank[yRoot]) {
        this.parent[xRoot] = yRoot;
      } else if (this.rank[xRoot] > this.rank[yRoot]) {
        this.parent[yRoot] = xRoot;
      } else {
        // If ranks are same, make one as root and increment its rank
        this.parent[yRoot] = xRoot;
        this.rank[xRoot]++;
      }
    }
  }
}

/**
 * Kruskal's Algorithm implementation
 * @param {number} vertices - The number of vertices in the graph
 * @param {Edge[]} edges - An array of Edge objects representing the graph
 * @return {Edge[]} The minimum spanning tree as an array of Edge objects
 */
function kruskalMST(vertices, edges) {
  // Sort the edges in non-decreasing order of their weight
  edges.sort((a, b) => a.weight - b.weight);

  // Create a new disjoint set
  let disjointSet = new DisjointSet(vertices);

  // Initialize the result array to store the minimum spanning tree
  let result = [];

  // Initialize index for sorted edges
  let i = 0;

  // Loop until we have included V-1 edges in the MST
  while (result.length < vertices - 1 && i < edges.length) {
    // Pick the smallest edge
    let edge = edges[i++];

    // Check if including this edge creates a cycle
    let sourceRoot = disjointSet.find(edge.source);
    let destRoot = disjointSet.find(edge.destination);

    // If including this edge doesn't cause a cycle, include it in result
    if (sourceRoot !== destRoot) {
      result.push(edge);
      // Perform union of the two sets
      disjointSet.union(sourceRoot, destRoot);
    }
  }

  return result;
}

// Test the Kruskal's Algorithm
let vertices = 4;
let edges = [
  new Edge(0, 1, 10),
  new Edge(0, 2, 6),
  new Edge(0, 3, 5),
  new Edge(1, 3, 15),
  new Edge(2, 3, 4),
];

let mst = kruskalMST(vertices, edges);

console.log("Edges in the Minimum Spanning Tree:");
mst.forEach((edge) => {
  console.log(`${edge.source} -- ${edge.destination} == ${edge.weight}`);
});

// This implementation of Kruskal's Algorithm does the following:
// We define an Edge class to represent edges in the graph. Each edge has a source vertex, a destination vertex, and a weight.
// We implement a DisjointSet class for the Union-Find data structure. This is used to detect cycles in the graph efficiently.
// The find method finds the representative (root) of a set.
// The union method merges two sets together.
// The kruskalMST function implements Kruskal's Algorithm:
// We start by sorting all edges in non-decreasing order of their weight.
// We create a DisjointSet object to keep track of connected components.
// We iterate through the sorted edges:
// For each edge, we check if adding it would create a cycle.
// If not, we add it to our result (the minimum spanning tree) and union the sets of its vertices.
// We continue this process until we have V-1 edges (where V is the number of vertices) or we've considered all edges.
// Finally, we test the algorithm with a sample graph and print the resulting minimum spanning tree.
// Kruskal's Algorithm is particularly useful for finding the minimum spanning tree in a graph,
//  which has applications in network design, clustering, and approximation algorithms for NP-hard problems.
