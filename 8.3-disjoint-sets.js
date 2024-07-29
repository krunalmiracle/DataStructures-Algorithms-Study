/**
 * Disjoint Set (Union-Find) Implementation
 *
 * @description
 * A Disjoint Set data structure, also known as Union-Find, keeps track of a set of elements partitioned
 * into a number of disjoint (non-overlapping) subsets. It provides near-constant-time operations to
 * add new sets, merge existing sets, and determine whether elements are in the same set.
 *
 * @reasoning
 * Disjoint Sets are particularly useful in applications involving grouping elements, such as finding
 * connected components in graphs, cycle detection, and Kruskal's algorithm for minimum spanning trees.
 *
 * @assumptions
 * - Elements are represented by integers from 0 to n-1, where n is the number of elements.
 * - The implementation uses both path compression and union by rank for optimal performance.
 *
 * @complexity
 * Time complexity:
 *   - MakeSet: O(1)
 *   - Find: O(α(n)) amortized, where α(n) is the inverse Ackermann function (nearly constant)
 *   - Union: O(α(n)) amortized
 * Space complexity: O(n), where n is the number of elements
 */
class DisjointSet {
  constructor(size) {
    // Initialize parent array: each element is its own parent initially
    this.parent = Array(size)
      .fill()
      .map((_, i) => i);
    // Initialize rank array: each set has rank 0 initially
    this.rank = Array(size).fill(0);
  }

  /**
   * Finds the representative (root) of the set containing element x
   * @param {number} x - The element to find the set for
   * @returns {number} The representative of the set
   */
  find(x) {
    // If x is not the root, set its parent to the root (path compression)
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  /**
   * Unions the sets containing elements x and y
   * @param {number} x - An element from the first set
   * @param {number} y - An element from the second set
   */
  union(x, y) {
    // Find the roots of the sets containing x and y
    let rootX = this.find(x);
    let rootY = this.find(y);

    // If x and y are already in the same set, do nothing
    if (rootX === rootY) return;

    // Union by rank: attach the smaller rank tree under the root of the higher rank tree
    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
    } else {
      // If ranks are the same, choose rootX as the new root and increase its rank
      this.parent[rootY] = rootX;
      this.rank[rootX]++;
    }
  }

  /**
   * Checks if two elements are in the same set
   * @param {number} x - The first element
   * @param {number} y - The second element
   * @returns {boolean} True if x and y are in the same set, false otherwise
   */
  inSameSet(x, y) {
    return this.find(x) === this.find(y);
  }
}

/**
 * Kruskal's Algorithm for Minimum Spanning Tree
 *
 * @description
 * Kruskal's algorithm finds a minimum spanning tree for a connected weighted graph.
 * It uses a Disjoint Set data structure to efficiently detect cycles while building the MST.
 *
 * @reasoning
 * Kruskal's algorithm is an efficient way to find the MST of a graph. It works well with
 * the Disjoint Set data structure, which allows for quick cycle detection.
 *
 * @assumptions
 * - The input graph is connected and undirected.
 * - Edge weights are comparable (e.g., numbers).
 *
 * @complexity
 * Time complexity: O(E log E) or O(E log V), where E is the number of edges and V is the number of vertices
 * Space complexity: O(V), where V is the number of vertices (for the Disjoint Set data structure)
 *
 * @param {number} vertices - The number of vertices in the graph
 * @param {Array} edges - An array of edges, where each edge is [u, v, weight]
 * @returns {Array} The edges of the minimum spanning tree
 */
function kruskalMST(vertices, edges) {
  // Sort edges by weight in ascending order
  edges.sort((a, b) => a[2] - b[2]);

  const disjointSet = new DisjointSet(vertices);
  const mst = [];

  for (let [u, v, weight] of edges) {
    // If including this edge doesn't create a cycle, add it to the MST
    if (!disjointSet.inSameSet(u, v)) {
      disjointSet.union(u, v);
      mst.push([u, v, weight]);

      // If we've added V-1 edges, we've completed the MST
      if (mst.length === vertices - 1) break;
    }
  }

  return mst;
}

/**
 * Problem: Find Connected Components in an Undirected Graph
 *
 * @description
 * Given an undirected graph, find all connected components using a Disjoint Set data structure.
 *
 * @reasoning
 * Disjoint Sets are ideal for this problem because they can efficiently group connected vertices
 * and allow for quick queries to determine if two vertices are in the same component.
 *
 * @assumptions
 * - The graph is represented by an array of edges, where each edge is [u, v].
 * - Vertices are numbered from 0 to n-1, where n is the number of vertices.
 *
 * @complexity
 * Time complexity: O(E * α(V)), where E is the number of edges, V is the number of vertices,
 *                  and α is the inverse Ackermann function (nearly constant)
 * Space complexity: O(V)
 *
 * @param {number} vertices - The number of vertices in the graph
 * @param {Array} edges - An array of edges, where each edge is [u, v]
 * @returns {Array} An array of connected components, where each component is an array of vertex indices
 */
function findConnectedComponents(vertices, edges) {
  const disjointSet = new DisjointSet(vertices);

  // Perform union for each edge
  for (let [u, v] of edges) {
    disjointSet.union(u, v);
  }

  // Group vertices by their root (representative)
  const components = {};
  for (let i = 0; i < vertices; i++) {
    const root = disjointSet.find(i);
    if (!components[root]) {
      components[root] = [];
    }
    components[root].push(i);
  }

  // Convert the components object to an array of arrays
  return Object.values(components);
}

// Example usage

// Kruskal's Algorithm
const vertices = 4;
const edges = [
  [0, 1, 10],
  [0, 2, 6],
  [0, 3, 5],
  [1, 3, 15],
  [2, 3, 4],
];

console.log("Minimum Spanning Tree:");
console.log(kruskalMST(vertices, edges));

// Connected Components
const graphVertices = 5;
const graphEdges = [
  [0, 1],
  [1, 2],
  [3, 4],
];

console.log("Connected Components:");
console.log(findConnectedComponents(graphVertices, graphEdges));
