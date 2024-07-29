/**
 * Topological Sort Algorithm
 */

/**
 * Class to represent a vertex in the graph
 */
class Vertex {
  /**
   * @param {number} id - The unique identifier for the vertex
   */
  constructor(id) {
    this.id = id; // Unique identifier for the vertex
    this.edges = []; // List of vertices this vertex points to
    this.inDegree = 0; // Number of edges pointing to this vertex
  }

  /**
   * Add an edge from this vertex to another vertex
   * @param {Vertex} vertex - The vertex this edge points to
   */
  addEdge(vertex) {
    this.edges.push(vertex);
    vertex.inDegree++; // Increase the in-degree of the target vertex
  }
}

/**
 * Implements the Topological Sort algorithm using Kahn's algorithm
 * @param {Vertex[]} graph - The graph represented as an array of Vertex objects
 * @return {number[]} - An array of vertex IDs in topologically sorted order, or null if there's a cycle
 */
function topologicalSort(graph) {
  // Create a queue to store vertices with no incoming edges
  let queue = [];

  // Find all vertices with no incoming edges and add them to the queue
  for (let vertex of graph) {
    if (vertex.inDegree === 0) {
      queue.push(vertex);
    }
  }

  let sortedOrder = []; // Array to store the topologically sorted order
  let visitedCount = 0; // Counter to keep track of visited vertices

  // Process vertices in the queue
  while (queue.length > 0) {
    let currentVertex = queue.shift();
    sortedOrder.push(currentVertex.id);
    visitedCount++;

    // For each neighbor of the current vertex
    for (let neighbor of currentVertex.edges) {
      neighbor.inDegree--; // Reduce the in-degree of the neighbor

      // If the neighbor has no more incoming edges, add it to the queue
      if (neighbor.inDegree === 0) {
        queue.push(neighbor);
      }
    }
  }

  // If we couldn't visit all vertices, there's a cycle in the graph
  if (visitedCount !== graph.length) {
    return null; // Graph has at least one cycle
  }

  return sortedOrder;
}

// Test the Topological Sort Algorithm
let vertices = [
  new Vertex(0),
  new Vertex(1),
  new Vertex(2),
  new Vertex(3),
  new Vertex(4),
  new Vertex(5),
];

// Add edges to create a Directed Acyclic Graph (DAG)
vertices[5].addEdge(vertices[2]);
vertices[5].addEdge(vertices[0]);
vertices[4].addEdge(vertices[0]);
vertices[4].addEdge(vertices[1]);
vertices[2].addEdge(vertices[3]);
vertices[3].addEdge(vertices[1]);

let sortedOrder = topologicalSort(vertices);

if (sortedOrder) {
  console.log("Topologically sorted order:", sortedOrder.join(" -> "));
} else {
  console.log("The graph contains a cycle and cannot be topologically sorted.");
}

// This implementation of the Topological Sort algorithm does the following:
// We define a Vertex class to represent vertices in the graph. Each vertex has an ID, a list of edges (vertices it points to),
// and an in-degree (number of edges pointing to it).
// The topologicalSort function implements Kahn's algorithm for topological sorting:
// We start by finding all vertices with no incoming edges (in-degree of 0) and add them to a queue.
// We process vertices from the queue one by one:
// Add the current vertex to the sorted order.
// Decrease the in-degree of all its neighbors.
// If a neighbor's in-degree becomes 0, add it to the queue.
// We continue this process until the queue is empty.
// If we couldn't visit all vertices, it means there's a cycle in the graph.
// We test the algorithm with a sample Directed Acyclic Graph (DAG) and print the topologically sorted order.
// Topological Sort is particularly useful for scheduling tasks with dependencies, build systems, and data serialization.
// It only works on Directed Acyclic Graphs (DAGs).
