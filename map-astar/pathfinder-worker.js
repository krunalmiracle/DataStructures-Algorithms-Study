// pathfinder-worker.js

/**
 * @description Import the A* algorithm and related functions
 */
importScripts("astar.js");

/**
 * @event self.onmessage
 * @description Handles messages from the main thread
 */
self.onmessage = function (e) {
  const { start, goal, preferredModes, graph } = e.data;

  // Reconstruct the MapGraph object from the transferred data
  const reconstructedGraph = new MapGraph();
  for (const [id, node] of Object.entries(graph.nodes)) {
    reconstructedGraph.addNode(new Node(id, node.lat, node.lon));
  }
  for (const [fromId, edges] of Object.entries(graph.edges)) {
    for (const edge of edges) {
      reconstructedGraph.addEdge(
        new Edge(fromId, edge.to, edge.distance, edge.mode)
      );
    }
  }

  // Perform the A* search
  const path = aStar(reconstructedGraph, start, goal, preferredModes);

  // Send the result back to the main thread
  self.postMessage(path);
};
