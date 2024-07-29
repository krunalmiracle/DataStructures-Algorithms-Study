/**
 * Dijkstra's Algorithm for Single-Source Shortest Path
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
    this.edges = []; // List of edges connected to this vertex
    this.distance = Infinity; // Distance from source vertex, initially set to infinity
    this.previous = null; // Previous vertex in the shortest path
  }

  /**
   * Add an edge to this vertex
   * @param {Vertex} vertex - The vertex at the other end of the edge
   * @param {number} weight - The weight of the edge
   */
  addEdge(vertex, weight) {
    this.edges.push({ vertex, weight });
  }
}

/**
 * Class to represent a priority queue for efficient vertex selection
 */
class PriorityQueue {
  constructor() {
    this.elements = [];
  }

  /**
   * Enqueue an element with a priority
   * @param {Vertex} element - The element to enqueue
   * @param {number} priority - The priority of the element
   */
  enqueue(element, priority) {
    this.elements.push({ element, priority });
    this.elements.sort((a, b) => a.priority - b.priority);
  }

  /**
   * Dequeue the element with the highest priority (lowest numeric value)
   * @return {Vertex} The dequeued element
   */
  dequeue() {
    return this.elements.shift().element;
  }

  /**
   * Check if the queue is empty
   * @return {boolean} True if the queue is empty, false otherwise
   */
  isEmpty() {
    return this.elements.length === 0;
  }
}

/**
 * Implements Dijkstra's Algorithm
 * @param {Vertex[]} graph - The graph represented as an array of Vertex objects
 * @param {Vertex} source - The source vertex
 * @return {void} - The function updates the distance and previous properties of each vertex
 */
function dijkstra(graph, source) {
  // Initialize distances
  source.distance = 0;

  // Create a priority queue and enqueue the source vertex
  let pq = new PriorityQueue();
  pq.enqueue(source, 0);

  // Main loop of Dijkstra's algorithm
  while (!pq.isEmpty()) {
    // Get the vertex with the minimum distance
    let currentVertex = pq.dequeue();

    // Explore all neighboring vertices
    for (let { vertex: neighbor, weight } of currentVertex.edges) {
      // Calculate the distance to the neighbor through the current vertex
      let distance = currentVertex.distance + weight;

      // If we've found a shorter path, update the neighbor's distance and previous vertex
      if (distance < neighbor.distance) {
        neighbor.distance = distance;
        neighbor.previous = currentVertex;

        // Enqueue the neighbor with its new distance
        pq.enqueue(neighbor, distance);
      }
    }
  }
}

/**
 * Helper function to reconstruct the path from source to a given vertex
 * @param {Vertex} vertex - The destination vertex
 * @return {number[]} - An array of vertex IDs representing the shortest path
 */
function getPath(vertex) {
  let path = [];
  while (vertex !== null) {
    path.unshift(vertex.id);
    vertex = vertex.previous;
  }
  return path;
}

// Test Dijkstra's Algorithm
let vertices = [
  new Vertex(0),
  new Vertex(1),
  new Vertex(2),
  new Vertex(3),
  new Vertex(4),
  new Vertex(5),
];

// Add edges to create a graph
vertices[0].addEdge(vertices[1], 4);
vertices[0].addEdge(vertices[2], 2);
vertices[1].addEdge(vertices[2], 1);
vertices[1].addEdge(vertices[3], 5);
vertices[2].addEdge(vertices[3], 8);
vertices[2].addEdge(vertices[4], 10);
vertices[3].addEdge(vertices[4], 2);
vertices[3].addEdge(vertices[5], 6);
vertices[4].addEdge(vertices[5], 3);

// Run Dijkstra's algorithm with vertex 0 as the source
dijkstra(vertices, vertices[0]);

// Print the shortest distances and paths
for (let i = 1; i < vertices.length; i++) {
  console.log(`Shortest distance to vertex ${i}: ${vertices[i].distance}`);
  console.log(
    `Shortest path to vertex ${i}: ${getPath(vertices[i]).join(" -> ")}`
  );
}

// This implementation of Dijkstra's Algorithm does the following:
// We define a Vertex class to represent vertices in the graph. Each vertex has an ID, a list of edges,
// a distance (initially set to infinity), and a reference to the previous vertex in the shortest path.
// We implement a PriorityQueue class to efficiently select the vertex with the minimum distance in each iteration.
// The dijkstra function implements the main algorithm:
// We start by setting the distance of the source vertex to 0 and enqueueing it in the priority queue.
// In each iteration, we dequeue the vertex with the minimum distance and explore its neighbors.
// For each neighbor, we calculate the distance through the current vertex and update it if it's shorter than the previously known distance.
// We continue this process until the priority queue is empty.
// The getPath helper function reconstructs the shortest path from the source to a given vertex by following the previous references.
// We test the algorithm with a sample graph and print the shortest distances and paths to each vertex from the source.
// Dijkstra's Algorithm is particularly useful for finding the shortest path from a single source
// vertex to all other vertices in a weighted graph with non-negative edge weights.
