// astar.js

/**
 * @class Node
 * @description Represents a node in the graph (e.g., an intersection or point of interest)
 */
class Node {
  /**
   * @constructor
   * @param {string} id - Unique identifier for the node
   * @param {number} lat - Latitude of the node
   * @param {number} lon - Longitude of the node
   */
  constructor(id, lat, lon) {
    this.id = id;
    this.lat = lat;
    this.lon = lon;
  }
}

/**
 * @class Edge
 * @description Represents an edge in the graph (e.g., a road segment)
 */
class Edge {
  /**
   * @constructor
   * @param {string} from - ID of the starting node
   * @param {string} to - ID of the ending node
   * @param {number} distance - Length of the edge in kilometers
   * @param {string} mode - Transportation mode (e.g., 'walk', 'bike', 'car')
   */
  constructor(from, to, distance, mode) {
    this.from = from;
    this.to = to;
    this.distance = distance;
    this.mode = mode;
  }
}

/**
 * @class MapGraph
 * @description Represents the entire map as a graph structure
 */
class MapGraph {
  constructor() {
    this.nodes = new Map();
    this.edges = new Map();
    this.bounds = {
      minLat: Infinity,
      maxLat: -Infinity,
      minLon: Infinity,
      maxLon: -Infinity,
    };
  }

  /**
   * @method addNode
   * @description Adds a node to the graph and updates the map bounds
   * @param {Node} node - The node to add
   */
  addNode(node) {
    this.nodes.set(node.id, node);
    this.updateBounds(node);
  }

  /**
   * @method addEdge
   * @description Adds an edge to the graph
   * @param {Edge} edge - The edge to add
   */
  addEdge(edge) {
    if (!this.edges.has(edge.from)) {
      this.edges.set(edge.from, []);
    }
    this.edges.get(edge.from).push(edge);
  }

  /**
   * @method updateBounds
   * @description Updates the map's boundaries based on a new node
   * @param {Node} node - The node to consider for boundary update
   */
  updateBounds(node) {
    this.bounds.minLat = Math.min(this.bounds.minLat, node.lat);
    this.bounds.maxLat = Math.max(this.bounds.maxLat, node.lat);
    this.bounds.minLon = Math.min(this.bounds.minLon, node.lon);
    this.bounds.maxLon = Math.max(this.bounds.maxLon, node.lon);
  }
}

/**
 * @function parseOSMGeoJSON
 * @description Parses an OSM GeoJSON file and constructs a MapGraph
 * @param {string} url - URL of the OSM GeoJSON file
 * @returns {Promise<MapGraph>} A promise that resolves to the constructed MapGraph
 */
async function parseOSMGeoJSON(url) {
  const response = await fetch(url);
  const data = await response.json();
  const graph = new MapGraph();

  // Create a map to store nodes by their coordinates
  const nodeMap = new Map();

  data.features.forEach((feature) => {
    if (feature.geometry.type === "LineString") {
      const coordinates = feature.geometry.coordinates;
      const mode = getTransportationMode(feature.properties);

      for (let i = 0; i < coordinates.length; i++) {
        const [lon, lat] = coordinates[i];
        const nodeId = `${lat},${lon}`;

        // Add node if it doesn't exist
        if (!nodeMap.has(nodeId)) {
          const node = new Node(nodeId, lat, lon);
          graph.addNode(node);
          nodeMap.set(nodeId, node);
        }

        // Add edge to the next node in the LineString
        if (i < coordinates.length - 1) {
          const [nextLon, nextLat] = coordinates[i + 1];
          const nextNodeId = `${nextLat},${nextLon}`;
          const distance = calculateDistance(lat, lon, nextLat, nextLon);

          const edge = new Edge(nodeId, nextNodeId, distance, mode);
          graph.addEdge(edge);

          // Add reverse edge for bidirectional roads
          if (isBidirectional(feature.properties)) {
            const reverseEdge = new Edge(nextNodeId, nodeId, distance, mode);
            graph.addEdge(reverseEdge);
          }
        }
      }
    }
  });

  return graph;
}

/**
 * @function getTransportationMode
 * @description Determines the transportation mode based on OSM tags
 * @param {Object} properties - Properties of the OSM feature
 * @returns {string} The determined transportation mode
 */
function getTransportationMode(properties) {
  if (properties.highway === "footway" || properties.highway === "path") {
    return "walk";
  } else if (
    properties.highway === "cycleway" ||
    properties.bicycle === "designated"
  ) {
    return "bike";
  } else if (properties.highway) {
    return "car";
  }
  return "unknown";
}

/**
 * @function isBidirectional
 * @description Determines if a road is bidirectional based on OSM tags
 * @param {Object} properties - Properties of the OSM feature
 * @returns {boolean} True if the road is bidirectional, false otherwise
 */
function isBidirectional(properties) {
  return properties.oneway !== "yes";
}

/**
 * @function calculateDistance
 * @description Calculates the great-circle distance between two points using the Haversine formula
 * @param {number} lat1 - Latitude of the first point
 * @param {number} lon1 - Longitude of the first point
 * @param {number} lat2 - Latitude of the second point
 * @param {number} lon2 - Longitude of the second point
 * @returns {number} Distance between the points in kilometers
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * @class PriorityQueue
 * @description A priority queue implementation for the A* algorithm
 */
class PriorityQueue {
  constructor() {
    this.elements = [];
  }

  /**
   * @method enqueue
   * @description Adds an element to the queue with a given priority
   * @param {*} element - The element to add
   * @param {number} priority - The priority of the element
   */
  enqueue(element, priority) {
    this.elements.push({ element, priority });
    this.elements.sort((a, b) => a.priority - b.priority);
  }

  /**
   * @method dequeue
   * @description Removes and returns the element with the highest priority
   * @returns {*} The element with the highest priority
   */
  dequeue() {
    return this.elements.shift().element;
  }

  /**
   * @method isEmpty
   * @description Checks if the queue is empty
   * @returns {boolean} True if the queue is empty, false otherwise
   */
  isEmpty() {
    return this.elements.length === 0;
  }
}

/**
 * @function aStar
 * @description Implements the A* pathfinding algorithm
 * @param {MapGraph} graph - The graph to search
 * @param {string} start - ID of the starting node
 * @param {string} goal - ID of the goal node
 * @param {string[]} preferredModes - Array of preferred transportation modes
 * @returns {string[]|null} Array of node IDs representing the path, or null if no path found
 */
function aStar(graph, start, goal, preferredModes) {
  const openSet = new PriorityQueue();
  const closedSet = new Set();
  const cameFrom = new Map();
  const gScore = new Map();
  const fScore = new Map();

  openSet.enqueue(start, 0);
  gScore.set(start, 0);
  fScore.set(start, heuristic(graph.nodes.get(start), graph.nodes.get(goal)));

  while (!openSet.isEmpty()) {
    const current = openSet.dequeue();

    if (current === goal) {
      return reconstructPath(cameFrom, current);
    }

    closedSet.add(current);

    for (const edge of graph.edges.get(current) || []) {
      if (closedSet.has(edge.to)) continue;

      const modeMultiplier = preferredModes.includes(edge.mode) ? 1 : 1.5;
      const tentativeGScore =
        gScore.get(current) + edge.distance * modeMultiplier;

      if (!gScore.has(edge.to) || tentativeGScore < gScore.get(edge.to)) {
        cameFrom.set(edge.to, current);
        gScore.set(edge.to, tentativeGScore);
        fScore.set(
          edge.to,
          gScore.get(edge.to) +
            heuristic(graph.nodes.get(edge.to), graph.nodes.get(goal))
        );

        openSet.enqueue(edge.to, fScore.get(edge.to));
      }
    }
  }

  return null;
}

/**
 * @function heuristic
 * @description Calculates the heuristic distance between two nodes
 * @param {Node} a - The first node
 * @param {Node} b - The second node
 * @returns {number} The estimated distance between the nodes
 */
function heuristic(a, b) {
  return calculateDistance(a.lat, a.lon, b.lat, b.lon);
}

/**
 * @function reconstructPath
 * @description Reconstructs the path from the start to the goal
 * @param {Map} cameFrom - Map of each node to its predecessor
 * @param {string} current - ID of the current (goal) node
 * @returns {string[]} Array of node IDs representing the path
 */
function reconstructPath(cameFrom, current) {
  const path = [current];
  while (cameFrom.has(current)) {
    current = cameFrom.get(current);
    path.unshift(current);
  }
  return path;
}

/**
 * @class MapRenderer
 * @description Handles the rendering of the map and path
 */
class MapRenderer {
  /**
   * @constructor
   * @param {HTMLCanvasElement} canvas - The canvas element to render on
   * @param {MapGraph} graph - The graph representing the map
   */
  constructor(canvas, graph) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.graph = graph;
    this.zoom = 1;
    this.offsetX = 0;
    this.offsetY = 0;

    this.scale = Math.min(
      canvas.width / (graph.bounds.maxLon - graph.bounds.minLon),
      canvas.height / (graph.bounds.maxLat - graph.bounds.minLat)
    );
  }

  /**
   * @method render
   * @description Renders the map and path
   */
  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.save();

    this.ctx.translate(this.offsetX, this.offsetY);
    this.ctx.scale(this.zoom * this.scale, -this.zoom * this.scale);
    this.ctx.translate(-this.graph.bounds.minLon, -this.graph.bounds.maxLat);

    for (const [, edges] of this.graph.edges) {
      for (const edge of edges) {
        const from = this.graph.nodes.get(edge.from);
        const to = this.graph.nodes.get(edge.to);
        this.ctx.beginPath();
        this.ctx.moveTo(from.lon, from.lat);
        this.ctx.lineTo(to.lon, to.lat);
        this.ctx.strokeStyle = this.getColorForMode(edge.mode);
        this.ctx.stroke();
      }
    }

    for (const node of this.graph.nodes.values()) {
      this.ctx.beginPath();
      this.ctx.arc(node.lon, node.lat, 0.0001, 0, 2 * Math.PI);
      this.ctx.fillStyle = "red";
      this.ctx.fill();
    }

    this.ctx.restore();
  }

  /**
   * @method getColorForMode
   * @description Returns a color based on the transportation mode
   * @param {string} mode - The transportation mode
   * @returns {string} The color for the given mode
   */
  getColorForMode(mode) {
    switch (mode) {
      case "walk":
        return "green";
      case "bike":
        return "blue";
      case "car":
        return "red";
      default:
        return "black";
    }
  }

  /**
   * @method zoomIn
   * @description Increases the zoom level
   * @param {number} factor - The zoom factor (default: 1.2)
   */
  zoomIn(factor = 1.2) {
    this.zoom *= factor;
    this.render();
  }

  /**
   * @method zoomOut
   * @description Decreases the zoom level
   * @param {number} factor - The zoom factor (default: 1.2)
   */
  zoomOut(factor = 1.2) {
    this.zoom /= factor;
    this.render();
  }

  /**
   * @method pan
   * @description Pans the map
   * @param {number} dx - The change in x-coordinate
   * @param {number} dy - The change in y-coordinate
   */
  pan(dx, dy) {
    this.offsetX += dx;
    this.offsetY += dy;
    this.render();
  }
}
