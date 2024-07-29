// main.js

/**
 * @constant {Worker} worker
 * @description Web Worker for handling pathfinding calculations
 */
const worker = new Worker("pathfinder-worker.js");

/**
 * @event worker.onmessage
 * @description Handles messages from the Web Worker
 */
worker.onmessage = function (e) {
  const path = e.data;
  renderPath(path);
};

/**
 * @function findPath
 * @description Initiates pathfinding using the Web Worker
 * @param {string} start - ID of the starting node
 * @param {string} goal - ID of the goal node
 * @param {string[]} preferredModes - Array of preferred transportation modes
 */
function findPath(start, goal, preferredModes) {
  worker.postMessage({ start, goal, preferredModes, graph: mapGraph });
}

/**
 * @function renderPath
 * @description Renders the found path on the map
 * @param {string[]} path - Array of node IDs representing the path
 */
function renderPath(path) {
  if (!path) {
    console.log("No path found");
    return;
  }

  const ctx = renderer.ctx;
  ctx.save();
  ctx.translate(renderer.offsetX, renderer.offsetY);
  ctx.scale(renderer.zoom * renderer.scale, -renderer.zoom * renderer.scale);
  ctx.translate(-renderer.graph.bounds.minLon, -renderer.graph.bounds.maxLat);

  ctx.beginPath();
  ctx.strokeStyle = "purple";
  ctx.lineWidth = 0.0002;

  for (let i = 0; i < path.length - 1; i++) {
    const fromNode = renderer.graph.nodes.get(path[i]);
    const toNode = renderer.graph.nodes.get(path[i + 1]);
    ctx.moveTo(fromNode.lon, fromNode.lat);
    ctx.lineTo(toNode.lon, toNode.lat);
  }

  ctx.stroke();
  ctx.restore();
}

/**
 * @function showLoading
 * @description Shows a loading indicator
 */
function showLoading() {
  const loadingDiv = document.createElement("div");
  loadingDiv.id = "loading";
  loadingDiv.textContent = "Loading...";
  document.body.appendChild(loadingDiv);
}

/**
 * @function hideLoading
 * @description Hides the loading indicator
 */
function hideLoading() {
  const loadingDiv = document.getElementById("loading");
  if (loadingDiv) {
    loadingDiv.remove();
  }
}

/**
 * @function showError
 * @description Shows an error message
 * @param {string} message - The error message to display
 */
function showError(message) {
  const errorDiv = document.createElement("div");
  errorDiv.id = "error";
  errorDiv.textContent = `Error: ${message}`;
  document.body.appendChild(errorDiv);
}

/**
 * @function main
 * @description Main application logic
 */
async function main() {
  try {
    showLoading();
    const canvas = document.getElementById("map-canvas");
    const graph = await parseOSMGeoJSON("./test.osm.geojson");
    const renderer = new MapRenderer(canvas, graph);

    renderer.render();

    canvas.addEventListener("wheel", (e) => {
      e.preventDefault();
      if (e.deltaY < 0) {
        renderer.zoomIn();
      } else {
        renderer.zoomOut();
      }
    });

    let isDragging = false;
    let lastX, lastY;

    canvas.addEventListener("mousedown", (e) => {
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
    });

    canvas.addEventListener("mousemove", (e) => {
      if (isDragging) {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        renderer.pan(dx, dy);
        lastX = e.clientX;
        lastY = e.clientY;
      }
    });

    canvas.addEventListener("mouseup", () => {
      isDragging = false;
    });

    // Example of finding a path (you'll need to replace these with actual node IDs from your data)
    const start = graph.nodes.keys().next().value; // Get the first node as start
    const goal = Array.from(graph.nodes.keys())[graph.nodes.size - 1]; // Get the last node as goal
    const preferredModes = ["walk", "bike", "car"];
    findPath(start, goal, preferredModes);

    hideLoading();
  } catch (error) {
    hideLoading();
    showError(error.message);
    console.error("An error occurred:", error);
  }
}

// Call the main function when the page loads
window.addEventListener("load", main);
