// File: AdvancedGraph.js

class Graph {
  constructor() {
    this.adjacencyList = {};
  }

  addVertex(vertex) {
    if (!this.adjacencyList[vertex]) {
      this.adjacencyList[vertex] = [];
    }
  }

  addEdge(vertex1, vertex2, weight = 1) {
    this.adjacencyList[vertex1].push({ node: vertex2, weight });
    this.adjacencyList[vertex2].push({ node: vertex1, weight });
  }

  /**
   * Breadth-First Search (BFS)
   *
   * Reasoning:
   * BFS explores all vertices at the present depth before moving to vertices at the next depth level.
   * It's useful for finding the shortest path in unweighted graphs and in social networking applications.
   *
   * Assumptions:
   * - The graph may not be fully connected.
   * - The starting vertex is provided and exists in the graph.
   *
   * Algorithm:
   * 1. Create a queue and enqueue the starting vertex.
   * 2. Create a set to store visited vertices.
   * 3. While the queue is not empty:
   *    a. Dequeue a vertex.
   *    b. If this vertex hasn't been visited:
   *       - Mark it as visited.
   *       - Process the vertex (e.g., add to result).
   *       - Enqueue all adjacent unvisited vertices.
   *
   * Time Complexity: O(V + E) where V is the number of vertices and E is the number of edges.
   * Space Complexity: O(V) for the queue and visited set.
   */
  bfs(start) {
    const queue = [start];
    const visited = new Set();
    const result = [];

    while (queue.length) {
      const vertex = queue.shift();
      if (!visited.has(vertex)) {
        visited.add(vertex);
        result.push(vertex);
        this.adjacencyList[vertex].forEach((neighbor) => {
          if (!visited.has(neighbor.node)) {
            queue.push(neighbor.node);
          }
        });
      }
    }

    return result;
  }

  /**
   * Depth-First Search (DFS)
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
    const visited = new Set();
    const result = [];

    const dfsRecursive = (vertex) => {
      visited.add(vertex);
      result.push(vertex);

      this.adjacencyList[vertex].forEach((neighbor) => {
        if (!visited.has(neighbor.node)) {
          dfsRecursive(neighbor.node);
        }
      });
    };

    dfsRecursive(start);
    return result;
  }

  /**
   * Dijkstra's Shortest Path Algorithm
   *
   * Reasoning:
   * Dijkstra's algorithm finds the shortest path between a given start vertex and all other vertices in a weighted graph.
   *
   * Assumptions:
   * - The graph has non-negative edge weights.
   * - The graph is connected.
   *
   * Algorithm:
   * 1. Initialize distances to all vertices as infinite and distance to start as 0.
   * 2. Create a priority queue and enqueue the start vertex with its distance.
   * 3. While the priority queue is not empty:
   *    a. Dequeue the vertex with the minimum distance.
   *    b. For each neighbor of this vertex:
   *       - Calculate tentative distance through current vertex.
   *       - If this distance is less than the known distance, update it.
   *
   * Time Complexity: O((V + E) log V) with a binary heap implementation.
   * Space Complexity: O(V)
   */
  dijkstra(start, end) {
    const distances = {};
    const previous = {};
    const pq = new PriorityQueue();

    // Initialize distances
    for (let vertex in this.adjacencyList) {
      if (vertex === start) {
        distances[vertex] = 0;
        pq.enqueue(vertex, 0);
      } else {
        distances[vertex] = Infinity;
        pq.enqueue(vertex, Infinity);
      }
      previous[vertex] = null;
    }

    while (!pq.isEmpty()) {
      let current = pq.dequeue().element;
      if (current === end) {
        // Construct the path
        let path = [];
        while (previous[current]) {
          path.push(current);
          current = previous[current];
        }
        path.push(start);
        return path.reverse();
      }

      if (distances[current] !== Infinity) {
        for (let neighbor of this.adjacencyList[current]) {
          let candidate = distances[current] + neighbor.weight;
          if (candidate < distances[neighbor.node]) {
            distances[neighbor.node] = candidate;
            previous[neighbor.node] = current;
            pq.enqueue(neighbor.node, candidate);
          }
        }
      }
    }

    return null; // Path not found
  }

  /**
   * Detect Cycle in Undirected Graph
   *
   * Reasoning:
   * Detecting cycles is crucial for many graph algorithms and applications.
   *
   * Assumptions:
   * - The graph is undirected.
   *
   * Algorithm:
   * 1. Perform DFS from each unvisited vertex.
   * 2. For each vertex, if we find an adjacent vertex that is already visited and not the parent of current vertex, then there is a cycle.
   *
   * Time Complexity: O(V + E)
   * Space Complexity: O(V)
   */
  hasCycle() {
    const visited = new Set();

    const dfsCheck = (vertex, parent) => {
      visited.add(vertex);

      for (let neighbor of this.adjacencyList[vertex]) {
        if (!visited.has(neighbor.node)) {
          if (dfsCheck(neighbor.node, vertex)) return true;
        } else if (neighbor.node !== parent) {
          return true;
        }
      }

      return false;
    };

    for (let vertex in this.adjacencyList) {
      if (!visited.has(vertex)) {
        if (dfsCheck(vertex, null)) return true;
      }
    }

    return false;
  }

  /**
   * Topological Sorting
   *
   * @description
   * Topological sorting produces a linear ordering of vertices in a directed acyclic graph (DAG)
   * such that for every directed edge (u, v), vertex u comes before v in the ordering.
   *
   * @reasoning
   * Topological sorting is crucial for scheduling tasks with dependencies, such as in build systems,
   * course scheduling, or resolving symbol dependencies in linkers.
   *
   * @assumptions
   * - The graph is a Directed Acyclic Graph (DAG).
   * - There is at least one vertex with no incoming edges to start the algorithm.
   *
   * @complexity
   * Time Complexity: O(V + E), where V is the number of vertices and E is the number of edges.
   * Space Complexity: O(V)
   *
   * @algorithm
   * 1. Use DFS to traverse the graph.
   * 2. After visiting all neighbors of a vertex, add it to the front of the result list.
   *
   * @returns {Array} An array of vertices in topological order
   * @throws {Error} If the graph contains a cycle
   */
  topologicalSort() {
    // Set to keep track of visited vertices
    const visited = new Set();
    // Array to store the result (topologically sorted order)
    const result = [];

    // DFS function to traverse the graph
    const dfs = (vertex) => {
      // Mark the current vertex as visited
      visited.add(vertex);
      // Traverse all neighbors of the current vertex
      this.adjacencyList[vertex].forEach((neighbor) => {
        // If the neighbor hasn't been visited, recursively call DFS on it
        if (!visited.has(neighbor.node)) {
          dfs(neighbor.node);
        }
      });
      // After visiting all neighbors, add the current vertex to the front of the result
      result.unshift(vertex);
    };

    // Perform DFS on each unvisited vertex
    for (let vertex in this.adjacencyList) {
      if (!visited.has(vertex)) {
        dfs(vertex);
      }
    }

    // Return the topologically sorted order
    return result;
  }

  /**
   * Union-Find Algorithm for Connectivity
   *
   * @description
   * Union-Find is a data structure that keeps track of elements which are split into one or more disjoint sets.
   * It provides near-constant-time operations to add new sets, merge existing sets, and determine whether elements are in the same set.
   *
   * @reasoning
   * This algorithm is useful for determining connectivity in graphs, particularly in undirected graphs.
   * It's a key component in Kruskal's algorithm for finding minimum spanning trees.
   *
   * @assumptions
   * - The graph is undirected.
   * - Vertices are numbered from 0 to n-1.
   *
   * @complexity
   * Time Complexity: O(α(n)) per operation, where α(n) is the inverse Ackermann function
   * Space Complexity: O(n)
   *
   * @algorithm
   * 1. Initialize each vertex as a separate set.
   * 2. For each edge (u, v) in the graph:
   *    a. Find the set representatives of u and v.
   *    b. If they are in different sets, union the sets.
   * 3. Two vertices are connected if they are in the same set.
   */
  unionFind() {
    const parent = {};
    const rank = {};

    // Initialize each vertex as a separate set
    for (let vertex in this.adjacencyList) {
      parent[vertex] = vertex;
      rank[vertex] = 0;
    }

    // Find operation with path compression
    const find = (vertex) => {
      if (parent[vertex] !== vertex) {
        parent[vertex] = find(parent[vertex]);
      }
      return parent[vertex];
    };

    // Union operation with rank optimization
    const union = (x, y) => {
      const xRoot = find(x);
      const yRoot = find(y);

      if (xRoot === yRoot) return;

      if (rank[xRoot] < rank[yRoot]) {
        parent[xRoot] = yRoot;
      } else if (rank[xRoot] > rank[yRoot]) {
        parent[yRoot] = xRoot;
      } else {
        parent[yRoot] = xRoot;
        rank[xRoot]++;
      }
    };

    // Perform union for all edges
    for (let vertex in this.adjacencyList) {
      for (let neighbor of this.adjacencyList[vertex]) {
        union(vertex, neighbor.node);
      }
    }

    return { find, union };
  }

  /**
   * Prim's Algorithm for Minimum Spanning Tree
   *
   * Reasoning:
   * Finds a minimum spanning tree for a weighted undirected graph.
   *
   * Assumptions:
   * - The graph is connected and undirected.
   *
   * Algorithm:
   * 1. Start with any vertex as the initial tree.
   * 2. Repeatedly add the minimum weight edge that connects a vertex in the tree to a vertex outside the tree.
   *
   * Time Complexity: O((V + E) log V) with a binary heap
   * Space Complexity: O(V + E)
   */
  primMST() {
    const startVertex = Object.keys(this.adjacencyList)[0];
    const pq = new PriorityQueue();
    const inMST = new Set();
    const mst = [];

    pq.enqueue({ node: startVertex, weight: 0 }, 0);

    while (!pq.isEmpty()) {
      const { node, weight } = pq.dequeue().element;

      if (inMST.has(node)) continue;

      inMST.add(node);
      if (node !== startVertex) {
        mst.push({ from: node, weight });
      }

      this.adjacencyList[node].forEach((neighbor) => {
        if (!inMST.has(neighbor.node)) {
          pq.enqueue(neighbor, neighbor.weight);
        }
      });
    }

    return mst;
  }

  /**
   * Bellman-Ford Algorithm
   *
   * Reasoning:
   * Finds the shortest paths from a source vertex to all other vertices, even with negative edge weights.
   *
   * Assumptions:
   * - The graph may have negative edge weights but no negative-weight cycles.
   *
   * Algorithm:
   * 1. Initialize distances from source to all vertices as infinite and source as 0.
   * 2. Relax all edges |V| - 1 times.
   * 3. Check for negative-weight cycles.
   *
   * Time Complexity: O(VE)
   * Space Complexity: O(V)
   */
  bellmanFord(start) {
    const distances = {};
    const predecessors = {};

    // Step 1: Initialize distances
    for (let vertex in this.adjacencyList) {
      distances[vertex] = vertex === start ? 0 : Infinity;
      predecessors[vertex] = null;
    }

    // Step 2: Relax edges repeatedly
    for (let i = 0; i < Object.keys(this.adjacencyList).length - 1; i++) {
      for (let vertex in this.adjacencyList) {
        this.adjacencyList[vertex].forEach((neighbor) => {
          if (distances[vertex] + neighbor.weight < distances[neighbor.node]) {
            distances[neighbor.node] = distances[vertex] + neighbor.weight;
            predecessors[neighbor.node] = vertex;
          }
        });
      }
    }

    // Step 3: Check for negative-weight cycles
    for (let vertex in this.adjacencyList) {
      this.adjacencyList[vertex].forEach((neighbor) => {
        if (distances[vertex] + neighbor.weight < distances[neighbor.node]) {
          throw new Error("Graph contains a negative-weight cycle");
        }
      });
    }

    return { distances, predecessors };
  }

  /**
   * Floyd-Warshall Algorithm
   *
   * Reasoning:
   * Finds shortest paths between all pairs of vertices in a weighted graph.
   *
   * Assumptions:
   * - The graph does not contain negative cycles.
   *
   * Algorithm:
   * 1. Initialize the distance matrix with direct edge weights.
   * 2. For each vertex k, update the shortest path between every pair (i, j) if path through k is shorter.
   *
   * Time Complexity: O(V^3)
   * Space Complexity: O(V^2)
   */
  floydWarshall() {
    const vertices = Object.keys(this.adjacencyList);
    const n = vertices.length;
    const dist = Array(n)
      .fill()
      .map(() => Array(n).fill(Infinity));

    // Initialize distances
    vertices.forEach((i, idx) => {
      dist[idx][idx] = 0;
      this.adjacencyList[i].forEach((neighbor) => {
        const j = vertices.indexOf(neighbor.node);
        dist[idx][j] = neighbor.weight;
      });
    });

    // Update distances
    for (let k = 0; k < n; k++) {
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          if (dist[i][k] + dist[k][j] < dist[i][j]) {
            dist[i][j] = dist[i][k] + dist[k][j];
          }
        }
      }
    }

    return dist;
  }

  /**
   * Kruskal's Algorithm for Minimum Spanning Tree
   *
   * Reasoning:
   * Finds a minimum spanning tree for a weighted undirected graph.
   *
   * Assumptions:
   * - The graph is connected and undirected.
   *
   * Algorithm:
   * 1. Sort all edges in non-decreasing order of their weight.
   * 2. Pick the smallest edge. Check if it forms a cycle with the spanning tree formed so far. If not, include this edge.
   * 3. Repeat step 2 until there are (V-1) edges in the spanning tree.
   *
   * Time Complexity: O(E log E) or O(E log V)
   * Space Complexity: O(V + E)
   */
  kruskalMST() {
    const edges = [];
    const mst = [];
    const disjointSet = new DisjointSet(Object.keys(this.adjacencyList));

    // Collect all edges
    for (let vertex in this.adjacencyList) {
      this.adjacencyList[vertex].forEach((neighbor) => {
        edges.push({
          from: vertex,
          to: neighbor.node,
          weight: neighbor.weight,
        });
      });
    }

    // Sort edges by weight
    edges.sort((a, b) => a.weight - b.weight);

    for (let edge of edges) {
      if (!disjointSet.connected(edge.from, edge.to)) {
        disjointSet.union(edge.from, edge.to);
        mst.push(edge);
      }
    }

    return mst;
  }

  /**
   * Boruvka's Algorithm for Minimum Spanning Tree
   *
   * @description
   * Boruvka's algorithm finds the Minimum Spanning Tree (MST) of a weighted, undirected graph.
   * It works by repeatedly identifying and adding the cheapest edge that connects two separate components.
   *
   * @reasoning
   * The algorithm is efficient for dense graphs and can be parallelized easily.
   * It builds the MST by merging smaller components, which is useful in distributed computing scenarios.
   *
   * @assumptions
   * - The graph is connected (otherwise it finds a minimum spanning forest).
   * - The graph is undirected.
   * - Edge weights are comparable and unique (for simplicity; can be adapted if not).
   *
   * @complexity
   * Time complexity: O(E log V), where E is the number of edges and V is the number of vertices.
   * Space complexity: O(E + V)
   *
   * @algorithm
   * 1. Initialize each vertex as a separate component.
   * 2. While there is more than one component:
   *    a. For each component, find the cheapest edge that connects it to another component.
   *    b. Add these cheapest edges to the MST.
   *    c. Merge the components connected by the added edges.
   * 3. Return the set of edges in the MST.
   *
   * @returns {Array} An array of edges representing the minimum spanning tree
   */
  boruvkaMST() {
    // Initialize an array to store the MST edges
    const mst = [];
    // Create a UnionFind data structure for tracking connected components
    const uf = new UnionFind(Object.keys(this.adjacencyList).length);
    // Map vertex names to indices for UnionFind
    const vertexToIndex = {};
    Object.keys(this.adjacencyList).forEach((vertex, index) => {
      vertexToIndex[vertex] = index;
    });

    // Continue until we have V-1 edges in the MST
    while (mst.length < Object.keys(this.adjacencyList).length - 1) {
      // Store the cheapest edge for each component
      const cheapest = {};

      // For each vertex in the graph
      for (const [vertex, neighbors] of Object.entries(this.adjacencyList)) {
        const componentId = uf.find(vertexToIndex[vertex]);
        // For each neighbor of the current vertex
        for (const { node: neighbor, weight } of neighbors) {
          const neighborComponentId = uf.find(vertexToIndex[neighbor]);
          // If the neighbor is in a different component
          if (componentId !== neighborComponentId) {
            // Update the cheapest edge for this component if necessary
            if (
              !cheapest[componentId] ||
              weight < cheapest[componentId].weight
            ) {
              cheapest[componentId] = { from: vertex, to: neighbor, weight };
            }
          }
        }
      }

      // Add the cheapest edges to the MST and merge components
      for (const edge of Object.values(cheapest)) {
        const fromComponent = uf.find(vertexToIndex[edge.from]);
        const toComponent = uf.find(vertexToIndex[edge.to]);
        if (fromComponent !== toComponent) {
          mst.push(edge);
          uf.union(fromComponent, toComponent);
        }
      }
    }

    // Return the minimum spanning tree
    return mst;
  }

  /**
   * Articulation Points (Cut Vertices)
   *
   * Reasoning:
   * Identifies vertices whose removal increases the number of connected components in the graph.
   * Useful in network reliability analysis.
   *
   * Assumptions:
   * - The graph is undirected.
   *
   * Algorithm:
   * 1. Perform DFS and keep track of discovery time and lowest reachable ancestor time for each vertex.
   * 2. A vertex is an articulation point if:
   *    - It's the root of DFS tree and has at least two children.
   *    - It's not the root and has a child whose lowest time is greater than or equal to the discovery time of the vertex.
   *
   * Time Complexity: O(V + E)
   * Space Complexity: O(V)
   */
  findArticulationPoints() {
    const articulationPoints = new Set();
    const visited = new Set();
    const discoveryTime = {};
    const lowTime = {};
    const parent = {};
    let time = 0;

    const dfs = (v) => {
      visited.add(v);
      discoveryTime[v] = lowTime[v] = ++time;
      let children = 0;

      for (let neighbor of this.adjacencyList[v]) {
        if (!visited.has(neighbor.node)) {
          children++;
          parent[neighbor.node] = v;
          dfs(neighbor.node);

          lowTime[v] = Math.min(lowTime[v], lowTime[neighbor.node]);

          if (parent[v] === undefined && children > 1) {
            articulationPoints.add(v);
          }
          if (
            parent[v] !== undefined &&
            lowTime[neighbor.node] >= discoveryTime[v]
          ) {
            articulationPoints.add(v);
          }
        } else if (neighbor.node !== parent[v]) {
          lowTime[v] = Math.min(lowTime[v], discoveryTime[neighbor.node]);
        }
      }
    };

    for (let v in this.adjacencyList) {
      if (!visited.has(v)) {
        dfs(v);
      }
    }

    return Array.from(articulationPoints);
  }

  /**
   * Bridges in a Graph
   *
   * Reasoning:
   * Identifies edges whose removal disconnects the graph. Crucial in network design and analysis.
   *
   * Assumptions:
   * - The graph is undirected.
   *
   * Algorithm:
   * Similar to articulation points, but focuses on edges instead of vertices.
   *
   * Time Complexity: O(V + E)
   * Space Complexity: O(V)
   */
  findBridges() {
    const bridges = [];
    const visited = new Set();
    const discoveryTime = {};
    const lowTime = {};
    const parent = {};
    let time = 0;

    const dfs = (v) => {
      visited.add(v);
      discoveryTime[v] = lowTime[v] = ++time;

      for (let neighbor of this.adjacencyList[v]) {
        if (!visited.has(neighbor.node)) {
          parent[neighbor.node] = v;
          dfs(neighbor.node);

          lowTime[v] = Math.min(lowTime[v], lowTime[neighbor.node]);

          if (lowTime[neighbor.node] > discoveryTime[v]) {
            bridges.push([v, neighbor.node]);
          }
        } else if (neighbor.node !== parent[v]) {
          lowTime[v] = Math.min(lowTime[v], discoveryTime[neighbor.node]);
        }
      }
    };

    for (let v in this.adjacencyList) {
      if (!visited.has(v)) {
        dfs(v);
      }
    }

    return bridges;
  }

  /**
   * Strongly Connected Components (Kosaraju's Algorithm)
   *
   * @description
   * Finds all Strongly Connected Components (SCCs) in a directed graph.
   * An SCC is a maximal set of vertices where every vertex is reachable from every other vertex in the set.
   *
   * @reasoning
   * Finding SCCs is important in many graph applications, such as:
   * - Analyzing connectivity in social networks
   * - Solving 2-satisfiability problems
   * - Identifying cycles in directed graphs
   *
   * @assumptions
   * - The graph is directed.
   * - All vertices are reachable from the starting vertex (if not, the algorithm needs to be run from each unvisited vertex).
   *
   * @complexity
   * Time Complexity: O(V + E), where V is the number of vertices and E is the number of edges.
   * Space Complexity: O(V)
   *
   * @algorithm
   * 1. Perform DFS on the original graph and store vertices in order of finish time.
   * 2. Create a reversed graph (all edges reversed).
   * 3. Perform DFS on the reversed graph in the order of vertices from step 1.
   *
   * @returns {Array} An array of arrays, each representing a strongly connected component
   */
  kosarajuStronglyConnectedComponents() {
    // Perform DFS and store vertices in order of finish time
    const stack = [];
    const visited = new Set();

    // First DFS to fill the stack
    for (let vertex in this.adjacencyList) {
      if (!visited.has(vertex)) {
        this.dfsForSCC(vertex, visited, stack);
      }
    }

    // Create a reversed graph
    const reversedGraph = this.getReversedGraph();

    // Reset visited set for second DFS
    visited.clear();
    const scc = [];

    // Second DFS on reversed graph
    while (stack.length > 0) {
      const vertex = stack.pop();
      if (!visited.has(vertex)) {
        const component = [];
        reversedGraph.dfsForSCC(vertex, visited, component);
        scc.push(component);
      }
    }

    return scc;
  }

  /**
   * Helper method for Strongly Connected Components
   * @param {string} vertex - The current vertex
   * @param {Set} visited - Set of visited vertices
   * @param {Array} result - Array to store the result (stack or component)
   */
  dfsForSCC(vertex, visited, result) {
    visited.add(vertex);
    this.adjacencyList[vertex].forEach((neighbor) => {
      if (!visited.has(neighbor.node)) {
        this.dfsForSCC(neighbor.node, visited, result);
      }
    });
    result.push(vertex);
  }

  /**
   * Helper method to get a reversed graph
   * @returns {Graph} A new Graph object with reversed edges
   */
  getReversedGraph() {
    const reversedGraph = new Graph();
    for (let vertex in this.adjacencyList) {
      reversedGraph.addVertex(vertex);
    }
    for (let vertex in this.adjacencyList) {
      this.adjacencyList[vertex].forEach((neighbor) => {
        reversedGraph.addEdge(neighbor.node, vertex, neighbor.weight);
      });
    }
    return reversedGraph;
  }

  /**
   * Tarjan's Algorithm for Strongly Connected Components
   *
   * @description
   * Tarjan's algorithm finds strongly connected components in a directed graph in a single DFS pass.
   *
   * @reasoning
   * This algorithm is more efficient than Kosaraju's algorithm as it requires only one DFS pass.
   * It's useful for analyzing the structure of directed graphs and finding cycles.
   *
   * @assumptions
   * - The graph is directed.
   *
   * @complexity
   * Time Complexity: O(V + E), where V is the number of vertices and E is the number of edges
   * Space Complexity: O(V)
   *
   * @algorithm
   * 1. Perform DFS traversal of the graph.
   * 2. For each vertex:
   *    a. Assign it a unique ID and a low-link value (initially the same as ID).
   *    b. Push it onto a stack.
   * 3. As DFS returns from a vertex:
   *    a. Update its low-link value based on its neighbors.
   *    b. If it's a root node of an SCC, pop the stack until this vertex is reached.
   * 4. The popped vertices form an SCC.
   *
   * @returns {Array} An array of arrays, each representing a strongly connected component
   */
  tarjanStronglyConnectedComponents() {
    let id = 0;
    const ids = {};
    const low = {};
    const onStack = {};
    const stack = [];
    const result = [];

    const strongConnect = (v) => {
      ids[v] = low[v] = id++;
      stack.push(v);
      onStack[v] = true;

      for (let neighbor of this.adjacencyList[v]) {
        if (!(neighbor.node in ids)) {
          strongConnect(neighbor.node);
          low[v] = Math.min(low[v], low[neighbor.node]);
        } else if (onStack[neighbor.node]) {
          low[v] = Math.min(low[v], ids[neighbor.node]);
        }
      }

      if (ids[v] === low[v]) {
        const component = [];
        let w;
        do {
          w = stack.pop();
          onStack[w] = false;
          component.push(w);
        } while (w !== v);
        result.push(component);
      }
    };

    for (let v in this.adjacencyList) {
      if (!(v in ids)) {
        strongConnect(v);
      }
    }

    return result;
  }

  /**
   * Maximum Flow (Ford-Fulkerson Algorithm with Edmonds-Karp)
   *
   * Reasoning:
   * Computes the maximum flow in a flow network. Useful in network flow problems,
   * transportation scheduling, and resource allocation.
   *
   * Assumptions:
   * - The graph is a flow network with a source and sink.
   * - Edge weights represent capacities.
   *
   * Algorithm:
   * 1. While there exists an augmenting path from source to sink:
   *    a. Find an augmenting path (using BFS in Edmonds-Karp).
   *    b. Compute the bottleneck capacity of this path.
   *    c. Update the residual graph.
   *
   * Time Complexity: O(VE^2)
   * Space Complexity: O(V^2)
   */
  maxFlow(source, sink) {
    const residualGraph = new Graph();
    for (let v in this.adjacencyList) {
      residualGraph.addVertex(v);
      for (let neighbor of this.adjacencyList[v]) {
        residualGraph.addEdge(v, neighbor.node, neighbor.weight);
        if (
          !residualGraph.adjacencyList[neighbor.node].some((n) => n.node === v)
        ) {
          residualGraph.addEdge(neighbor.node, v, 0);
        }
      }
    }

    let maxFlow = 0;

    while (true) {
      const path = this.bfs(residualGraph, source, sink);
      if (!path) break;

      let flowOnPath = Infinity;
      for (let i = 0; i < path.length - 1; i++) {
        const edge = residualGraph.adjacencyList[path[i]].find(
          (e) => e.node === path[i + 1]
        );
        flowOnPath = Math.min(flowOnPath, edge.weight);
      }

      for (let i = 0; i < path.length - 1; i++) {
        const forward = residualGraph.adjacencyList[path[i]].find(
          (e) => e.node === path[i + 1]
        );
        const backward = residualGraph.adjacencyList[path[i + 1]].find(
          (e) => e.node === path[i]
        );
        forward.weight -= flowOnPath;
        backward.weight += flowOnPath;
      }

      maxFlow += flowOnPath;
    }

    return maxFlow;
  }

  // Helper method for BFS in max flow
  bfs(graph, source, sink) {
    const queue = [source];
    const visited = new Set([source]);
    const parent = {};

    while (queue.length > 0) {
      const current = queue.shift();
      if (current === sink) {
        const path = [];
        let v = sink;
        while (v !== source) {
          path.unshift(v);
          v = parent[v];
        }
        path.unshift(source);
        return path;
      }

      for (let neighbor of graph.adjacencyList[current]) {
        if (!visited.has(neighbor.node) && neighbor.weight > 0) {
          visited.add(neighbor.node);
          parent[neighbor.node] = current;
          queue.push(neighbor.node);
        }
      }
    }

    return null;
  }
  /**
   * A* Search Algorithm
   *
   * Reasoning:
   * A* is an informed search algorithm that finds the least-cost path from a start node to a goal node.
   * It uses a heuristic function to estimate the cost from any node to the goal, which guides the search
   * more efficiently than algorithms like Dijkstra's.
   *
   * Assumptions:
   * - The graph is weighted and the weights represent distances or costs.
   * - A heuristic function is provided that estimates the distance to the goal.
   * - The heuristic function is admissible (never overestimates the actual cost to the goal).
   *
   * Algorithm:
   * 1. Initialize open list with the start node and closed list as empty.
   * 2. While the open list is not empty:
   *    a. Choose the node with the lowest f_score from the open list.
   *    b. If this node is the goal, reconstruct and return the path.
   *    c. Move the node to the closed list.
   *    d. For each neighbor of the current node:
   *       - If it's in the closed list, skip it.
   *       - Calculate its g_score (cost from start to this neighbor through current path).
   *       - If it's not in the open list or the new g_score is better, update its scores and parent.
   * 3. If the open list is empty and goal not reached, return null (no path found).
   *
   * Time Complexity: O(E log V) in the worst case, but often performs much better in practice.
   * Space Complexity: O(V) where V is the number of vertices.
   *
   * @param {string} start - The starting node
   * @param {string} goal - The goal node
   * @param {function} heuristic - A function that estimates the cost from a node to the goal
   * @returns {Array|null} The least-cost path from start to goal, or null if no path exists
   */
  aStar(start, goal, heuristic) {
    const openList = new PriorityQueue();
    const closedList = new Set();
    const gScore = {};
    const fScore = {};
    const cameFrom = {};

    gScore[start] = 0;
    fScore[start] = heuristic(start, goal);
    openList.enqueue(start, fScore[start]);

    while (!openList.isEmpty()) {
      const current = openList.dequeue().element;

      if (current === goal) {
        return this.reconstructPath(cameFrom, current);
      }

      closedList.add(current);

      for (let neighbor of this.adjacencyList[current]) {
        if (closedList.has(neighbor.node)) continue;

        const tentativeGScore = gScore[current] + neighbor.weight;

        if (!gScore[neighbor.node] || tentativeGScore < gScore[neighbor.node]) {
          cameFrom[neighbor.node] = current;
          gScore[neighbor.node] = tentativeGScore;
          fScore[neighbor.node] =
            gScore[neighbor.node] + heuristic(neighbor.node, goal);

          if (!openList.includes(neighbor.node)) {
            openList.enqueue(neighbor.node, fScore[neighbor.node]);
          } else {
            openList.updatePriority(neighbor.node, fScore[neighbor.node]);
          }
        }
      }
    }

    return null; // No path found
  }

  reconstructPath(cameFrom, current) {
    const totalPath = [current];
    while (cameFrom[current]) {
      current = cameFrom[current];
      totalPath.unshift(current);
    }
    return totalPath;
  }
}

// Priority Queue for Dijkstra's and A* algorithms
// Helper class for Dijkstra's algorithm
class PriorityQueue {
  constructor() {
    this.values = [];
  }

  enqueue(element, priority) {
    this.values.push({ element, priority });
    this.sort();
  }

  dequeue() {
    return this.values.shift();
  }

  sort() {
    this.values.sort((a, b) => a.priority - b.priority);
  }

  isEmpty() {
    return !this.values.length;
  }
  // Required for A* algorithm
  includes(element) {
    return this.values.some((entry) => entry.element === element);
  }
  // Required for A* algorithm
  updatePriority(element, newPriority) {
    const index = this.values.findIndex((entry) => entry.element === element);
    if (index !== -1) {
      this.values[index].priority = newPriority;
      this.sort();
    }
  }

  /**
   * Hopcroft-Karp Algorithm for Maximum Bipartite Matching
   *
   * @description
   * Finds the maximum matching in a bipartite graph.
   *
   * @reasoning
   * Useful in many applications such as job assignment, resource allocation, and network flow problems.
   *
   * @assumptions
   * - The graph is bipartite (can be divided into two disjoint sets of vertices).
   *
   * @complexity
   * Time Complexity: O(E√V), where E is the number of edges and V is the number of vertices
   * Space Complexity: O(V)
   *
   * @algorithm
   * 1. Initialize all vertices as free.
   * 2. While there exists an augmenting path:
   *    a. Use BFS to find shortest augmenting paths.
   *    b. Use DFS to find a set of disjoint augmenting paths.
   *    c. Increase the size of the matching by the number of paths found.
   *
   * @returns {Object} An object representing the maximum matching
   */
  hopcroftKarp() {
    const matching = {};
    const dist = {};
    const queue = [];
    const NIL = Symbol("nil");
    const INF = Symbol("inf");

    const bfs = () => {
      for (let u in this.adjacencyList) {
        if (matching[u] === undefined) {
          dist[u] = 0;
          queue.push(u);
        } else {
          dist[u] = INF;
        }
      }
      dist[NIL] = INF;
      while (queue.length) {
        let u = queue.shift();
        if (dist[u] < dist[NIL]) {
          for (let v of this.adjacencyList[u]) {
            if (dist[matching[v.node]] === INF) {
              dist[matching[v.node]] = dist[u] + 1;
              queue.push(matching[v.node]);
            }
          }
        }
      }
      return dist[NIL] !== INF;
    };

    const dfs = (u) => {
      if (u !== NIL) {
        for (let v of this.adjacencyList[u]) {
          if (dist[matching[v.node]] === dist[u] + 1) {
            if (dfs(matching[v.node])) {
              matching[v.node] = u;
              matching[u] = v.node;
              return true;
            }
          }
        }
        dist[u] = INF;
        return false;
      }
      return true;
    };

    while (bfs()) {
      for (let u in this.adjacencyList) {
        if (matching[u] === undefined && dfs(u)) {
          // Augmenting path found
        }
      }
    }

    return matching;
  }

  /**
   * Traveling Salesman Problem (TSP) - Nearest Neighbor Heuristic
   *
   * @description
   * Finds an approximate solution to the Traveling Salesman Problem using the Nearest Neighbor heuristic.
   *
   * @reasoning
   * While not guaranteed to find the optimal solution, this heuristic provides a reasonable approximation
   * and is much faster than exact algorithms for large instances of TSP.
   *
   * @assumptions
   * - The graph is complete (every vertex is connected to every other vertex).
   * - The graph is weighted.
   *
   * @complexity
   * Time Complexity: O(n^2), where n is the number of vertices
   * Space Complexity: O(n)
   *
   * @algorithm
   * 1. Start with an arbitrary vertex as the current vertex.
   * 2. While there are unvisited vertices:
   *    a. Find the nearest unvisited neighbor of the current vertex.
   *    b. Add this nearest neighbor to the tour.
   *    c. Mark it as visited and make it the current vertex.
   * 3. Return to the starting vertex to complete the tour.
   *
   * @returns {Object} An object containing the tour and its total distance
   */
  tspNearestNeighbor() {
    const vertices = Object.keys(this.adjacencyList);
    const visited = new Set();
    const tour = [vertices[0]];
    let totalDistance = 0;

    visited.add(vertices[0]);

    while (visited.size < vertices.length) {
      let currentVertex = tour[tour.length - 1];
      let nearestNeighbor = null;
      let minDistance = Infinity;

      for (let neighbor of this.adjacencyList[currentVertex]) {
        if (!visited.has(neighbor.node) && neighbor.weight < minDistance) {
          nearestNeighbor = neighbor.node;
          minDistance = neighbor.weight;
        }
      }

      if (nearestNeighbor) {
        tour.push(nearestNeighbor);
        visited.add(nearestNeighbor);
        totalDistance += minDistance;
      }
    }

    // Return to the starting point
    let lastEdge = this.adjacencyList[tour[tour.length - 1]].find(
      (n) => n.node === tour[0]
    );
    if (lastEdge) {
      totalDistance += lastEdge.weight;
    }

    return { tour, totalDistance };
  }

  /**
   * Eulerian Path and Circuit
   *
   * @description
   * Finds an Eulerian path or circuit in the graph if one exists.
   * An Eulerian path visits every edge exactly once.
   * An Eulerian circuit is an Eulerian path that starts and ends at the same vertex.
   *
   * @reasoning
   * Eulerian paths and circuits are important in many applications, such as
   * route planning, DNA fragment assembly, and solving certain types of puzzles.
   *
   * @assumptions
   * - For an Eulerian circuit: All vertices have even degree.
   * - For an Eulerian path: Either all vertices have even degree, or exactly two vertices have odd degree.
   *
   * @complexity
   * Time Complexity: O(E), where E is the number of edges
   * Space Complexity: O(V + E), where V is the number of vertices
   *
   * @algorithm
   * 1. Check if the graph has an Eulerian path or circuit.
   * 2. If it does, use Hierholzer's algorithm:
   *    a. Start from any vertex (or an odd degree vertex for a path).
   *    b. Follow unused edges, deleting them as you go.
   *    c. If stuck, retreat and add the vertex to the result.
   *
   * @returns {Object} An object containing the Eulerian path/circuit and its type
   */
  findEulerianPathOrCircuit() {
    const degrees = {};
    let oddCount = 0;
    let startVertex;

    // Calculate degrees and count odd degree vertices
    for (let vertex in this.adjacencyList) {
      degrees[vertex] = this.adjacencyList[vertex].length;
      if (degrees[vertex] % 2 !== 0) {
        oddCount++;
        startVertex = vertex;
      }
    }

    // Check if Eulerian path or circuit exists
    if (oddCount !== 0 && oddCount !== 2) {
      return { path: null, type: "None" };
    }

    // Hierholzer's algorithm
    const path = [];
    const stack = [startVertex || Object.keys(this.adjacencyList)[0]];
    const tempEdges = JSON.parse(JSON.stringify(this.adjacencyList)); // Deep copy

    while (stack.length > 0) {
      let v = stack[stack.length - 1];
      if (tempEdges[v].length > 0) {
        let neighbor = tempEdges[v].pop().node;
        tempEdges[neighbor] = tempEdges[neighbor].filter((e) => e.node !== v);
        stack.push(neighbor);
      } else {
        path.unshift(stack.pop());
      }
    }

    return {
      path: path,
      type: oddCount === 0 ? "Circuit" : "Path",
    };
  }

  /**
   * Hamiltonian Path and Circuit
   *
   * @description
   * Attempts to find a Hamiltonian path or circuit in the graph.
   * A Hamiltonian path visits every vertex exactly once.
   * A Hamiltonian circuit is a Hamiltonian path that starts and ends at the same vertex.
   *
   * @reasoning
   * Hamiltonian paths and circuits have applications in operations research,
   * genetic algorithms, and certain types of puzzle solving.
   *
   * @assumptions
   * - The graph is connected.
   *
   * @complexity
   * Time Complexity: O(n!), where n is the number of vertices (NP-hard problem)
   * Space Complexity: O(n)
   *
   * @algorithm
   * 1. Start from each vertex.
   * 2. Use backtracking to explore all possible paths:
   *    a. Add a vertex to the path if it's adjacent to the last vertex and not visited.
   *    b. If all vertices are visited, check if it's a circuit (optional).
   *    c. If not all vertices are visited and no more can be added, backtrack.
   *
   * @returns {Object} An object containing the Hamiltonian path/circuit and its type
   */
  findHamiltonianPathOrCircuit() {
    const vertices = Object.keys(this.adjacencyList);
    const n = vertices.length;

    const isAdjacent = (u, v) =>
      this.adjacencyList[u].some((neighbor) => neighbor.node === v);

    const hamiltonianUtil = (path, pos) => {
      if (pos === n) {
        // All vertices are in the path
        if (isAdjacent(path[pos - 1], path[0])) {
          return { path: [...path, path[0]], type: "Circuit" };
        }
        return { path, type: "Path" };
      }

      for (let v of vertices) {
        if (isAdjacent(path[pos - 1], v) && !path.includes(v)) {
          path[pos] = v;
          let result = hamiltonianUtil(path, pos + 1);
          if (result) return result;
          path[pos] = null; // Backtrack
        }
      }

      return null;
    };

    for (let start of vertices) {
      let result = hamiltonianUtil([start], 1);
      if (result) return result;
    }

    return { path: null, type: "None" };
  }
}
// Define the UnionFind class for disjoint set operations
class UnionFind {
  // Constructor initializes the data structure
  constructor(size) {
    // Create an array to store the parent of each element
    this.parent = new Array(size);
    // Create an array to store the rank (tree height) of each set
    this.rank = new Array(size);
    // Initialize each element as a separate set
    for (let i = 0; i < size; i++) {
      // Each element is initially its own parent
      this.parent[i] = i;
      // Initial rank of each set is 0
      this.rank[i] = 0;
    }
  }

  // Find operation with path compression
  find(x) {
    // If x is not the root of its set
    if (this.parent[x] !== x) {
      // Recursively find the root and update x's parent
      this.parent[x] = this.find(this.parent[x]);
    }
    // Return the root of the set
    return this.parent[x];
  }

  // Union operation with rank optimization
  union(x, y) {
    // Find the roots of the sets containing x and y
    let xRoot = this.find(x);
    let yRoot = this.find(y);

    // If x and y are already in the same set, do nothing
    if (xRoot === yRoot) return;

    // Union by rank: attach smaller rank tree under root of higher rank tree
    if (this.rank[xRoot] < this.rank[yRoot]) {
      // Make yRoot the parent of xRoot
      this.parent[xRoot] = yRoot;
    } else if (this.rank[xRoot] > this.rank[yRoot]) {
      // Make xRoot the parent of yRoot
      this.parent[yRoot] = xRoot;
    } else {
      // If ranks are same, make one as root and increment its rank
      this.parent[yRoot] = xRoot;
      this.rank[xRoot]++;
    }
  }

  // Check if two elements are in the same set
  connected(x, y) {
    // Two elements are connected if they have the same root
    return this.find(x) === this.find(y);
  }
}

// Example usage of UnionFind
function testUnionFind() {
  // Create a UnionFind instance with 10 elements
  let uf = new UnionFind(10);

  // Perform some union operations
  uf.union(0, 1);
  uf.union(2, 3);
  uf.union(4, 5);
  uf.union(6, 7);
  uf.union(8, 9);
  uf.union(0, 2);
  uf.union(4, 6);
  uf.union(0, 4);

  // Check connections
  console.log("0 and 3 connected:", uf.connected(0, 3)); // Should be true
  console.log("4 and 9 connected:", uf.connected(4, 9)); // Should be false
}
// Disjoint Set data structure for Kruskal's algorithm
class DisjointSet {
  constructor(elements) {
    this.parent = {};
    this.rank = {};
    elements.forEach((e) => {
      this.parent[e] = e;
      this.rank[e] = 0;
    });
  }

  find(item) {
    if (this.parent[item] !== item) {
      this.parent[item] = this.find(this.parent[item]);
    }
    return this.parent[item];
  }

  union(x, y) {
    const xRoot = this.find(x);
    const yRoot = this.find(y);

    if (xRoot === yRoot) return;

    if (this.rank[xRoot] < this.rank[yRoot]) {
      this.parent[xRoot] = yRoot;
    } else if (this.rank[xRoot] > this.rank[yRoot]) {
      this.parent[yRoot] = xRoot;
    } else {
      this.parent[yRoot] = xRoot;
      this.rank[xRoot]++;
    }
  }

  connected(x, y) {
    return this.find(x) === this.find(y);
  }
}

// Example usage
const graph = new Graph();
graph.addVertex("A");
graph.addVertex("B");
graph.addVertex("C");
graph.addVertex("D");
graph.addEdge("A", "B", 4);
graph.addEdge("A", "C", 2);
graph.addEdge("B", "D", 3);
graph.addEdge("C", "D", 1);
graph.addEdge("C", "E", 5);
graph.addEdge("D", "E", 2);

// Traversals (depth-first search, breadth-first search),
console.log("BFS starting from vertex A:", graph.bfs("A"));
console.log("DFS starting from vertex A:", graph.dfs("A"));

// Shortest path (Dijkstra's algorithm, Bellman-Ford algorithm, A* algorithm)
console.log("Shortest path from A to D:", graph.dijkstra("A", "D"));
console.log("Bellman-Ford from A:", graph.bellmanFord("A"));
// Simple heuristic function (could be more sophisticated in real applications)
function heuristic(node, goal) {
  const coordinates = {
    A: { x: 0, y: 0 },
    B: { x: 2, y: 2 },
    C: { x: 1, y: 1 },
    D: { x: 3, y: 1 },
    E: { x: 4, y: 0 },
  };

  const dx = coordinates[node].x - coordinates[goal].x;
  const dy = coordinates[node].y - coordinates[goal].y;
  return Math.sqrt(dx * dx + dy * dy);
}
console.log("A* path from A to E:", graph.aStar("A", "E", heuristic));

// Topological sort
console.log("Topological Sort:", graph.topologicalSort());

// Union-Find (Disjoint Set) data structure
const unionFind = graph.unionFind();
console.log(
  "Union-Find - Are A and C connected?",
  unionFind.find("A") === unionFind.find("C")
);

// Minimum spanning tree (Prim's algorithm, Kruskal's algorithm, Boruvka's algorithm)
console.log("Prim's MST:", graph.primMST());
console.log("Kruskal's MST:", graph.kruskalMST());
console.log("Boruvka's MST:", graph.boruvkaMST());

// Shortest paths (Floyd-Warshall algorithm)
console.log("Floyd-Warshall All Pairs Shortest Paths:", graph.floydWarshall());

// Graph properties Cycle Detection in Undirected Graph
console.log("Graph has cycle:", graph.hasCycle());

// Connectivity (Union-Find algorithm, Kosaraju's algorithm, Tarjan's algorithm)

// Articulation points and bridges
console.log("Articulation Points:", graph.findArticulationPoints());
console.log("Bridges:", graph.findBridges());

// Strongly connected components (Tarjan's algorithm and Kosaraju's algorithm)
// Tarjan's SCC
console.log(
  "Tarjan's Strongly Connected Components:",
  graph.tarjanStronglyConnectedComponents()
);
// Kosaraju's SCC
console.log(
  "Kosaraju's Strongly Connected Components:",
  graph.kosarajuStronglyConnectedComponents()
);

// Maximum Flow (Ford-Fulkerson Algorithm with Edmonds-Karp)
console.log("Max Flow from A to D:", graph.maxFlow("A", "D"));

// Test Hopcroft-Karp Bipartite Matching
// Note: This graph might not be bipartite, so let's create a bipartite graph for this test
const bipartiteGraph = new Graph();
bipartiteGraph.addVertex("A");
bipartiteGraph.addVertex("B");
bipartiteGraph.addVertex("C");
bipartiteGraph.addVertex("X");
bipartiteGraph.addVertex("Y");
bipartiteGraph.addVertex("Z");
bipartiteGraph.addEdge("A", "X");
bipartiteGraph.addEdge("A", "Y");
bipartiteGraph.addEdge("B", "Y");
bipartiteGraph.addEdge("C", "Y");
bipartiteGraph.addEdge("C", "Z");
console.log(
  "Hopcroft-Karp Maximum Bipartite Matching:",
  bipartiteGraph.hopcroftKarp()
);

// Test TSP Nearest Neighbor
console.log("TSP Nearest Neighbor Solution:", graph.tspNearestNeighbor());

// Test Eulerian Path/Circuit
// Let's create a graph with an Eulerian circuit for this test
const eulerianGraph = new Graph();
eulerianGraph.addVertex("A");
eulerianGraph.addVertex("B");
eulerianGraph.addVertex("C");
eulerianGraph.addVertex("D");
eulerianGraph.addEdge("A", "B");
eulerianGraph.addEdge("B", "C");
eulerianGraph.addEdge("C", "D");
eulerianGraph.addEdge("D", "A");
console.log(
  "Eulerian Path/Circuit:",
  eulerianGraph.findEulerianPathOrCircuit()
);

// Test Hamiltonian Path/Circuit
console.log("Hamiltonian Path/Circuit:", graph.findHamiltonianPathOrCircuit());
