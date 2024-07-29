/**
 * Disjoint Set (Union-Find)
    A Disjoint Set data structure, also known as Union-Find, is used to 
    efficiently keep track of a partition of a set into disjoint subsets. 
    It's particularly useful for problems involving connected components in graphs.
 */
class DisjointSet {
  constructor(size) {
    this.parent = Array.from({ length: size }, (_, i) => i);
    this.rank = new Array(size).fill(0);
  }

  /**
   * Find the representative (root) of a set
   * @param {number} x - The element to find the representative for
   * @returns {number} - The representative of the set
   * @time O(log n) without path compression, nearly O(1) with path compression
   */
  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]); // Path compression
    }
    return this.parent[x];
  }

  /**
   * Union two sets
   * @param {number} x - An element from the first set
   * @param {number} y - An element from the second set
   * @time O(log n) without union by rank, nearly O(1) with union by rank
   */
  union(x, y) {
    let rootX = this.find(x);
    let rootY = this.find(y);

    if (rootX !== rootY) {
      // Union by rank
      if (this.rank[rootX] < this.rank[rootY]) {
        [rootX, rootY] = [rootY, rootX];
      }
      this.parent[rootY] = rootX;
      if (this.rank[rootX] === this.rank[rootY]) {
        this.rank[rootX]++;
      }
    }
  }

  /**
   * Check if two elements are in the same set
   * @param {number} x - The first element
   * @param {number} y - The second element
   * @returns {boolean} - True if x and y are in the same set, false otherwise
   * @time Nearly O(1)
   */
  connected(x, y) {
    return this.find(x) === this.find(y);
  }
}

/**
 * Test function to demonstrate Disjoint Set operations
 */
function testDisjointSet() {
  const ds = new DisjointSet(10);

  console.log("Initial sets:");
  console.log(ds.parent);

  console.log("\nUnioning 0 and 1");
  ds.union(0, 1);
  console.log(ds.parent);

  console.log("\nUnioning 2 and 3");
  ds.union(2, 3);
  console.log(ds.parent);

  console.log("\nUnioning 0 and 3");
  ds.union(0, 3);
  console.log(ds.parent);

  console.log("\nChecking connections:");
  console.log("0 and 1 connected:", ds.connected(0, 1));
  console.log("0 and 2 connected:", ds.connected(0, 2));
  console.log("4 and 5 connected:", ds.connected(4, 5));
}
// The Disjoint Set data structure is particularly efficient for problems involving set operations,
// such as finding connected components in a graph or determining if two elements are in the same set.
//  With optimizations like path compression and union by rank, it achieves nearly constant time operations.
// These data structures demonstrate more advanced concepts:
// The Skip List provides a probabilistic alternative to balanced trees, offering good average-case performance
// for search, insert, and delete operations with a relatively simple implementation.
// The Disjoint Set (Union-Find) structure is highly efficient for managing sets of elements and determining connectivity,
//  which is crucial in various graph algorithms and network-related problems.
// Both of these structures have important applications in algorithm design and problem-solving,
// particularly in areas like graph theory, network analysis, and optimization problems.
// Run the test function
testDisjointSet();
